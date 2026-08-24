#!/usr/bin/env node
/**
 * =========================================================
 * Instagram → サイト 同期スクリプト
 *
 * Instagram の最新投稿を取得して、
 *   ・写真を assets/img/insta/ に保存
 *   ・assets/data/instagram.js を書き直す
 * ところまでを自動でやります。
 *
 * 通常は GitHub Actions が毎日自動で実行します。
 * 手元で試したいときは次のように実行してください。
 *
 *   INSTAGRAM_TOKEN="長期トークン" node scripts/sync-instagram.mjs
 *
 * 追加インストールは不要です（Node.js 18 以降が必要）。
 * =========================================================
 */

import { writeFile, readFile, readdir, unlink, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT     = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const IMG_DIR  = path.join(ROOT, 'assets', 'img', 'insta');
const DATA_FILE = path.join(ROOT, 'assets', 'data', 'instagram.js');

/* ---------- 設定 ---------- */
const TOKEN     = process.env.INSTAGRAM_TOKEN;
const LIMIT     = Number(process.env.INSTAGRAM_LIMIT || 9);  // サイトに載せる枚数
const API       = 'https://graph.instagram.com/v23.0';
const CAP_MAX   = 60;   // タイルに出すキャプションの最大文字数

if (!TOKEN) {
  console.error('✗ 環境変数 INSTAGRAM_TOKEN が設定されていません。');
  console.error('  GitHub の Settings → Secrets and variables → Actions で');
  console.error('  INSTAGRAM_TOKEN を登録してください。');
  process.exit(1);
}

/* ---------- 小さな道具 ---------- */

const log = (...a) => console.log(...a);

async function getJSON(url) {
  const res = await fetch(url);
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg = body?.error?.message || res.statusText;
    throw new Error(`Instagram API エラー (${res.status}): ${msg}`);
  }
  return body;
}

/** キャプションを1行に整えて短くする（ハッシュタグと絵文字だらけの行は落とす） */
function tidyCaption(raw) {
  if (!raw) return '';
  const firstLine = String(raw)
    .split('\n')
    .map(s => s.trim())
    .filter(s => s && !/^[#＃]/.test(s))[0] || '';
  const noTags = firstLine.replace(/[#＃][^\s#＃]+/g, '').replace(/\s+/g, ' ').trim();
  return noTags.length > CAP_MAX ? noTags.slice(0, CAP_MAX - 1) + '…' : noTags;
}

/** 投稿1件から、表示に使う画像URLを決める */
function pickImageUrl(item) {
  if (item.media_type === 'VIDEO') return item.thumbnail_url || item.media_url;
  if (item.media_type === 'CAROUSEL_ALBUM') {
    const first = item.children?.data?.[0];
    if (first) return first.media_type === 'VIDEO' ? (first.thumbnail_url || first.media_url) : first.media_url;
  }
  return item.media_url;
}

/** 拡張子を URL から推測する（取れなければ .jpg） */
function extFromUrl(url) {
  const m = String(url).split('?')[0].match(/\.(jpg|jpeg|png|webp)$/i);
  return m ? '.' + m[1].toLowerCase().replace('jpeg', 'jpg') : '.jpg';
}

async function download(url, dest) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`画像の取得に失敗 (${res.status}): ${url}`);
  await writeFile(dest, Buffer.from(await res.arrayBuffer()));
}

/* ---------- 本体 ---------- */

async function main() {
  await mkdir(IMG_DIR, { recursive: true });

  // 1. アカウント情報
  const me = await getJSON(`${API}/me?fields=username&access_token=${TOKEN}`);
  const username = me.username || 'fratt2370313';
  log(`✓ アカウント: @${username}`);

  // 2. 投稿一覧を取得
  const fields = [
    'id', 'caption', 'media_type', 'media_url', 'thumbnail_url', 'permalink', 'timestamp',
    'children{media_url,media_type,thumbnail_url}'
  ].join(',');

  const feed = await getJSON(
    `${API}/me/media?fields=${encodeURIComponent(fields)}&limit=${LIMIT * 2}&access_token=${TOKEN}`
  );

  const posts = (feed.data || [])
    .filter(p => pickImageUrl(p))     // 画像が取れないものは除く
    .slice(0, LIMIT);

  if (!posts.length) {
    log('！ 表示できる投稿が見つかりませんでした。instagram.js はそのままにします。');
    return;
  }
  log(`✓ 投稿を ${posts.length} 件取得しました`);

  // 3. 画像をダウンロード（すでにあるものは再取得しない）
  const items = [];
  const keep  = new Set();

  for (const p of posts) {
    const url  = pickImageUrl(p);
    const name = `ig-${p.id}${extFromUrl(url)}`;
    const dest = path.join(IMG_DIR, name);
    keep.add(name);

    if (existsSync(dest)) {
      log(`  = ${name}（取得済み）`);
    } else {
      await download(url, dest);
      log(`  ↓ ${name}`);
    }

    items.push({
      image:   `assets/img/insta/${name}`,
      link:    p.permalink || `https://www.instagram.com/${username}/`,
      caption: tidyCaption(p.caption),
      date:    (p.timestamp || '').slice(0, 10)
    });
  }

  // 4. 使わなくなった画像を掃除する
  for (const f of await readdir(IMG_DIR)) {
    if (f.startsWith('ig-') && !keep.has(f)) {
      await unlink(path.join(IMG_DIR, f));
      log(`  × ${f}（古いので削除）`);
    }
  }

  // 5. instagram.js を書き出す
  const esc = s => String(s).replace(/\\/g, '\\\\').replace(/"/g, '\\"');
  const body = items.map(it => (
`    {
      image:   "${it.image}",
      link:    "${esc(it.link)}",
      caption: "${esc(it.caption)}",
      date:    "${it.date}"
    }`)).join(',\n');

  const out =
`/* =========================================================
   Instagram ギャラリーの中身

   このファイルは scripts/sync-instagram.mjs によって
   自動生成されています。手で編集しても次回の同期で
   上書きされるのでご注意ください。

   最終更新: ${new Date().toISOString().replace('T', ' ').slice(0, 16)} UTC
   ========================================================= */

window.INSTAGRAM_FEED = {

  profile:  "https://www.instagram.com/${username}/",
  username: "${username}",

  items: [
${body}
  ]
};
`;

  // 中身が前回と同じなら書き込まない（毎日むだにコミットしないため）
  const stripStamp = s => s.replace(/^\s*最終更新:.*$/m, '');
  let previous = '';
  try { previous = await readFile(DATA_FILE, 'utf8'); } catch { /* 初回は無くてよい */ }

  if (stripStamp(previous) === stripStamp(out)) {
    log(`= ${path.relative(ROOT, DATA_FILE)} は前回と同じ内容でした（更新なし）`);
    return;
  }

  await writeFile(DATA_FILE, out, 'utf8');
  log(`✓ ${path.relative(ROOT, DATA_FILE)} を更新しました（${items.length} 件）`);
}

main().catch(err => {
  console.error('✗ ' + err.message);
  process.exit(1);
});
