#!/usr/bin/env node
/**
 * =========================================================
 * Instagram の長期トークンを延長するスクリプト
 *
 * 長期トークンの有効期限は60日です。
 * 24時間以上経過していれば延長でき、延長するたびに
 * そこから60日間有効になります。
 *
 * GitHub Actions が毎日これを実行するので、
 * サイトを放置していてもトークンは切れません。
 *
 * 出力:
 *   ・新しいトークンを標準出力に1行で出す
 *   ・GITHUB_OUTPUT があれば token / expires_days も書き出す
 * =========================================================
 */

const TOKEN = process.env.INSTAGRAM_TOKEN;

if (!TOKEN) {
  console.error('✗ 環境変数 INSTAGRAM_TOKEN が設定されていません。');
  process.exit(1);
}

const res  = await fetch(
  `https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&access_token=${TOKEN}`
);
const data = await res.json().catch(() => ({}));

if (!res.ok || !data.access_token) {
  const msg = data?.error?.message || res.statusText;
  console.error(`✗ トークンの延長に失敗しました (${res.status}): ${msg}`);
  console.error('  期限切れの可能性があります。README の手順でトークンを取り直し、');
  console.error('  GitHub の Secret「INSTAGRAM_TOKEN」を更新してください。');
  process.exit(1);
}

const days = Math.floor((data.expires_in || 0) / 86400);
console.error(`✓ トークンを延長しました（残り約 ${days} 日）`);

// GitHub Actions から拾えるように出力
if (process.env.GITHUB_OUTPUT) {
  const { appendFileSync } = await import('node:fs');
  appendFileSync(process.env.GITHUB_OUTPUT, `token=${data.access_token}\n`);
  appendFileSync(process.env.GITHUB_OUTPUT, `expires_days=${days}\n`);
}

// 標準出力には新しいトークンだけを出す
process.stdout.write(data.access_token);
