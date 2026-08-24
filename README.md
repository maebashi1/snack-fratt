# Snack ふらっと 公式サイト

群馬県前橋市千代田町のスナック「ふらっと」の公式サイトです。ビルドツールを使わない素の HTML / CSS / JavaScript のみで作られているので、VS Code で開いてそのまま編集でき、GitHub Pages に置くだけで公開できます。

デザインは Club Original（https://original.value-box.com/）のレイアウトを下敷きにしています。画面上部に固定されたセル型のグローバルナビ、斜めに切り取ったフォトバンド、金額を大きな数字で右寄せする料金表といった構成をそのまま踏襲し、配色を「ふらっと」のイメージカラーであるオレンジ（`#ff7a1a`）と黒に置き換えています。

## ファイル構成

```
snack-fratt/
├─ index.html                  ← トップページ
├─ system.html                 ← 料金システム
├─ gallery.html                ← 店内・写真
├─ recruit.html                ← 女子求人
├─ link.html                   ← 姉妹店のご紹介
├─ access.html                 ← アクセス
├─ contact.html                ← お問い合わせ
├─ sitemap.html                ← サイトマップ
├─ assets/
│  ├─ css/style.css            ← 見た目。色は先頭の :root でまとめて管理
│  ├─ js/main.js               ← スライダー、メニュー開閉、写真の拡大表示など
│  ├─ data/instagram.js        ← Instagram に出す写真の一覧
│  └─ img/
│     ├─ （店内写真・ロゴなど）
│     └─ insta/                ← Instagram から取り込んだ写真
├─ scripts/
│  ├─ fetch-assets.sh          ← 旧サイトから画像を一括ダウンロード
│  ├─ sync-instagram.mjs       ← Instagram から投稿を取得してサイトを更新
│  └─ refresh-token.mjs        ← Instagram のトークンを延長
├─ .github/workflows/
│  └─ instagram.yml            ← 毎朝6時に自動同期する設定
├─ .nojekyll                   ← GitHub Pages 用のおまじない
└─ README.md
```

ヘッダー・フッター・ナビは全ページに同じ内容が書かれています。メニューの項目名を変える、フッターに1行足すといった変更をするときは、8つの HTML すべてで同じ箇所を直してください。

## ローカルで見る

`index.html` をダブルクリックするだけでも表示できます。VS Code を使う場合は拡張機能「Live Server」を入れて、`index.html` を右クリック → 「Open with Live Server」が便利です。

コマンドで起動したい場合は、フォルダの中で次を実行して <http://localhost:8000> を開いてください。

```bash
python3 -m http.server 8000
```

## 写真の差し替え

現在は `assets/img/` に写真が無い状態でも表示できるよう、画像が見つからないときは自動で旧サイト（snack-fratt.com）の画像を読み込むようにしてあります。ただし旧サイトを閉じると画像が消えてしまうので、早めにローカルへ移してください。

同梱のスクリプトを実行すると、旧サイトから必要な画像を一括でダウンロードできます。

```bash
bash scripts/fetch-assets.sh
```

自前の写真に差し替える場合は、以下のファイル名で `assets/img/` に置けばそのまま反映されます。

| ファイル名 | 用途 | 推奨サイズ |
| --- | --- | --- |
| `logo.png` | ヘッダー／フッターのロゴ | 高さ 80px 前後・背景透過 PNG |
| `hero.jpg` | トップのスライダー1枚目 | 横 1920px 以上・横長 |
| `shop-01.jpg` 〜 `shop-04.jpg` | 店内風景ギャラリー | 縦長（3:4）・横 1000px 程度 |
| `recruit.jpg` | 求人セクションの写真 | 横 1600px 程度・横長 |
| `rinon.jpg` | 姉妹店 Lounge Rinon のサムネイル | 16:9 |
| `flower-01.jpg` 〜 `flower-04.jpg` | 姉妹店 NaturalBox の店内 | 正方形に近いもの |

写真は 1 枚あたり 300KB 以下を目安に圧縮しておくと、スマホでの表示が軽くなります。[Squoosh](https://squoosh.app/) などのブラウザツールで簡単に圧縮できます。

### ロゴについて

いま使っている `logo.png` は白背景用に作られた黒っぽいロゴなので、そのまま黒いヘッダーに置くと読めなくなります。そのため CSS でロゴの裏に明るいプレートを敷いています。

背景透過の白いロゴを用意できた場合は、`assets/css/style.css` の `.brand img` と `.footer-mark img` から `background` と `padding` の行を消してください。プレートが外れて、黒地に直接ロゴが乗るすっきりした見た目になります。

## 色を変える

`assets/css/style.css` の先頭にある `:root` の値を書き換えるだけで、サイト全体の色が一括で変わります。

```css
:root{
  --orange:       #ff7a1a;  /* メインのオレンジ */
  --orange-light: #ffa04d;  /* 明るいオレンジ（ホバーなど） */
  --orange-deep:  #d95d05;  /* 濃いオレンジ */
  --bg:           #0b0908;  /* 背景の黒 */
  ...
}
```

斜めのフォトバンドの傾き具合も、同じ `:root` の `--slant` で調整できます。数字を大きくすると傾きが強くなります。

## 文章・料金を直す

各ページの HTML を直接書き換えてください。目印になるコメント（`<!-- ========== SYSTEM ========== -->` など）や `<span class="tab-label">` のラベルで区切ってあるので、直したいところを探してテキストを書き換えます。

料金表は `system.html` の `<dl class="price-list">`、求人条件は `recruit.html` の `<dl class="spec">` の中です。料金表は1行がこの形になっています。

```html
<div><dt>60min</dt><dd>4,000<small>円</small><span class="sub">2名様以上 3,000円</span></dd></div>
```

`<dt>` が左のメニュー名、`<dd>` が右の大きな金額、`<span class="sub">` が金額の下に小さく出る補足です。補足が不要な行は `<span class="sub">` ごと消してください。

## お問い合わせフォームを使えるようにする

`contact.html` にメールフォームがありますが、このサイトは HTML だけで動いているため、そのままでは送信できません。送信先を用意する必要があります。無料で使える [Formspree](https://formspree.io/) を例に説明します。

1. Formspree に登録し、受信用のメールアドレス（`fratt2370313@gmail.com` など）でフォームを1つ作る
2. 発行される送信先 URL（`https://formspree.io/f/xxxxxxxx` の形）をコピーする
3. `contact.html` の `<form class="form" ... action="">` の `action=""` の中に貼り付ける

設定が済むまでは、フォームの上にある電話・メール・LINE のボタンが問い合わせ窓口として機能しますので、急ぎでなければ後回しでも構いません。

## Instagram の写真を追加・入れ替える

Instagram セクションの写真は `assets/data/instagram.js` で管理しています。Instagram の API は 2024年12月に個人アカウント向けの提供が終了したため、自動連携ではなく「投稿した写真をこのフォルダにも置く」方式にしてあります。外部サービスに依存せず、表示も速く、広告も入りません。

手順は2つだけです。

1. Instagram に上げた写真を `assets/img/insta/` に保存する（ファイル名は `01.jpg`、`02.jpg` のように連番が分かりやすいです）
2. `assets/data/instagram.js` を開いて、`items` の中に写真を1件ずつ書く

書き方は次のとおりです。上にあるものほど先に表示されるので、新しい投稿を上に足していってください。

```js
{
  image:   "assets/img/insta/07.jpg",              // 写真のファイル
  link:    "https://www.instagram.com/p/XXXXX/",   // 投稿のURL（無ければプロフィールURLでOK）
  caption: "夏の限定ボトル入荷しました",              // ひとこと（空でもOK）
  date:    "2026-08-03"                            // 投稿日（空でもOK）
},
```

投稿の URL は、Instagram で投稿を開いて「…」→「リンクをコピー」で取得できます。行末のカンマを消さないよう気をつけてください（最後の1件だけはカンマ不要です）。

写真がまだ置かれていない項目は「COMING SOON」のタイルとして表示されるので、途中の状態でも見た目は崩れません。トップページは6件、`gallery.html` は9件を表示します。表示件数を変えたい場合は、それぞれの HTML の `data-limit="6"` の数字を書き換えてください。

下の「Instagram を自動連携する」を設定すれば、この手作業は不要になります。

## Instagram を自動連携する

設定すると、毎朝6時に自動で Instagram の最新9件を取り込み、写真をリポジトリに保存してサイトを更新します。投稿するだけでサイトにも載るようになり、手作業はゼロになります。

仕組みは `.github/workflows/instagram.yml`（毎日動かす設定）と `scripts/sync-instagram.mjs`（取得して `instagram.js` を書き出す処理）の2つです。写真は Instagram から落としてリポジトリに保存するので、表示は自前のサーバーから配信され、外部サービスにも Instagram の画像URLの有効期限にも左右されません。

準備は最初の一度だけ、15分ほどです。

### 1. Instagram をプロアカウントにする

Instagram アプリ → 設定 → アカウントの種類とツール → プロアカウントに切り替える、で「ビジネス」または「クリエイター」を選びます。無料で、見た目や使い勝手はほぼ変わりません。Facebook ページとの連携は不要です。

これが必要なのは、2024年12月に個人アカウント向けの API（Basic Display API）が終了し、現在はプロアカウントしかデータを取得できないためです。

### 2. Meta で開発者アプリを作る

<https://developers.facebook.com/> にログインし、マイアプリ → アプリを作成、と進みます。ユースケースは「Instagram」、アプリタイプは「ビジネス」を選んでください。

作成後、左メニューの Instagram → 「API setup with Instagram business login」を開きます。

### 3. アクセストークンを発行する

同じ画面の「**2. Generate access tokens**」で「Add account」を押し、お店の Instagram アカウントでログインして権限を許可します。`instagram_business_basic` にチェックが入っていれば十分です。

戻ってきたら「Generate token」を押すと、長いトークン文字列が表示されます。**この画面を離れると二度と表示されない**ので、必ずコピーしておいてください。

自分のアカウントを読むだけなので、アプリは開発モードのままで構いません。Meta のアプリ審査も不要です。

### 4. GitHub に登録する

GitHub のリポジトリで **Settings → Secrets and variables → Actions → New repository secret** を開き、次の内容で登録します。

| 項目 | 値 |
| --- | --- |
| Name | `INSTAGRAM_TOKEN` |
| Secret | 手順3でコピーしたトークン |

Secret は暗号化されて保存され、公開リポジトリでも他人からは見えません。

### 5. 動かしてみる

**Actions** タブ →「Instagram を同期」→ **Run workflow** を押します。1分ほどで完了し、うまくいけば `assets/img/insta/` に写真が保存され、`instagram.js` が自動生成されてサイトに反映されます。

以降は毎朝6時に自動で動きます。手元で試したい場合は次のコマンドでも実行できます。

```bash
INSTAGRAM_TOKEN="トークン" node scripts/sync-instagram.mjs
```

### ずっと放置できるようにする（推奨）

Instagram のトークンは60日で期限が切れます。ワークフローは毎日トークンを延長していますが、延長した新しいトークンを Secret に保存し直すには、GitHub 側の書き込み権限がもうひとつ必要です。

これを登録しておくと、あとは何もしなくてもずっと動き続けます。

1. GitHub の **Settings（アカウント設定）→ Developer settings → Personal access tokens → Fine-grained tokens** で新しいトークンを作る
2. Repository access でこのリポジトリだけを選ぶ
3. Permissions → Repository permissions → **Secrets** を **Read and write** にする
4. 発行されたトークンを、リポジトリの Secret に `GH_PAT` という名前で登録する

登録しない場合も動きますが、60日ごとに手順3〜4をやり直す必要があります。期限が15日を切ると GitHub の Issue でお知らせが届くようにしてあるので、放置して切れてしまう心配はありません。

### うまくいかないときは

Actions タブで失敗したジョブを開くと、日本語のメッセージが出ています。

「トークンの延長に失敗しました」と出る場合は期限切れです。手順3でトークンを取り直し、`INSTAGRAM_TOKEN` を更新してください。「表示できる投稿が見つかりませんでした」の場合は、アカウントがプロアカウントになっているか、トークンを発行したアカウントが合っているかを確認してください。

なお自動連携が失敗しても、サイトは前回取り込んだ写真をそのまま表示し続けます。表示が消えることはありません。

### 表示件数を変えたい

`.github/workflows/instagram.yml` の `INSTAGRAM_LIMIT: '9'` の数字を変えてください。3の倍数（6・9・12）にすると並びが整います。

## GitHub で公開する（GitHub Pages）

### 1. リポジトリを作る

GitHub にログインして「New repository」からリポジトリを作成します。名前は `snack-fratt` などで構いません。Public を選んでください（Private だと無料プランでは Pages が使えません）。

### 2. このフォルダを push する

VS Code のターミナル（`Ctrl` + `` ` ``）でこのフォルダを開き、次を順に実行します。`YOUR-NAME` と `snack-fratt` は自分のものに置き換えてください。

```bash
git init
git add .
git commit -m "サイト公開"
git branch -M main
git remote add origin https://github.com/YOUR-NAME/snack-fratt.git
git push -u origin main
```

### 3. Pages を有効にする

GitHub のリポジトリページで **Settings → Pages** を開き、Source を「Deploy from a branch」、Branch を `main` / `/ (root)` にして Save します。1〜2分待つと `https://YOUR-NAME.github.io/snack-fratt/` で公開されます。

### 4.（任意）独自ドメインをつなぐ

`snack-fratt.com` をそのまま使いたい場合は、リポジトリ直下に `CNAME` という名前のファイルを作り、中身に `snack-fratt.com` とだけ書いて push します。あわせてドメインの DNS 設定で、`snack-fratt.com` の A レコードを以下の 4 つに向けてください。

```
185.199.108.153
185.199.109.153
185.199.110.153
185.199.111.153
```

`www` を使う場合は CNAME レコードを `YOUR-NAME.github.io` に向けます。DNS の反映には数時間かかることがあります。設定後、Settings → Pages の「Enforce HTTPS」にチェックを入れてください。

## 更新のしかた

ファイルを編集したら、次の 3 行を実行すれば公開サイトに反映されます（1〜2分かかります）。

```bash
git add .
git commit -m "料金を更新"
git push
```

## 公開後にやっておくとよいこと

Google ビジネスプロフィールに店舗を登録し、ウェブサイト欄に新しい URL を設定しておくと、Google マップからの来店につながります。Facebook ページのプロフィールにも新 URL を貼っておいてください。旧サイト（WordPress）は、新サイトへのリンクを残したうえで少し様子を見てから閉じると安全です。
