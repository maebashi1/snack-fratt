/* =========================================================
   Instagram ギャラリーの中身

   写真を assets/img/insta/ に置いて、下の items に追加してください。
   並び順はこのファイルの上にあるものほど先に表示されます（新しい順推奨）。

   1件の書き方:
     {
       image:   "assets/img/insta/01.jpg",              ← 写真のファイル
       link:    "https://www.instagram.com/p/XXXXX/",   ← 投稿のURL（無ければプロフィールURLでOK）
       caption: "今夜も元気に営業中です",                  ← ひとこと（空でもOK）
       date:    "2026-07-28"                            ← 投稿日（空でもOK）
     },

   ※ 行末のカンマを消さないように気をつけてください。
     最後の1件だけカンマ不要です（あっても問題ありません）。
   ========================================================= */

window.INSTAGRAM_FEED = {

  /* プロフィールのURLとID */
  profile:  "https://www.instagram.com/fratt2370313/",
  username: "fratt2370313",

  /* 写真の一覧 */
  items: [
    {
      image:   "assets/img/insta/01.jpg",
      link:    "https://www.instagram.com/fratt2370313/",
      caption: "今夜も元気に営業中です",
      date:    "2026-07-28"
    },
    {
      image:   "assets/img/insta/02.jpg",
      link:    "https://www.instagram.com/fratt2370313/",
      caption: "カウンターでゆったり一杯",
      date:    "2026-07-25"
    },
    {
      image:   "assets/img/insta/03.jpg",
      link:    "https://www.instagram.com/fratt2370313/",
      caption: "常連さんとカラオケ大会",
      date:    "2026-07-22"
    },
    {
      image:   "assets/img/insta/04.jpg",
      link:    "https://www.instagram.com/fratt2370313/",
      caption: "新しいボトル入荷しました",
      date:    "2026-07-19"
    },
    {
      image:   "assets/img/insta/05.jpg",
      link:    "https://www.instagram.com/fratt2370313/",
      caption: "スタッフみんなでお出迎え",
      date:    "2026-07-15"
    },
    {
      image:   "assets/img/insta/06.jpg",
      link:    "https://www.instagram.com/fratt2370313/",
      caption: "誕生日のお祝いも承ります",
      date:    "2026-07-11"
    }
  ]
};
