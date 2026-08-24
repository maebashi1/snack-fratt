#!/usr/bin/env bash
#
# 旧サイト（snack-fratt.com）から画像を assets/img/ に一括ダウンロードします。
#
#   使い方:  bash scripts/fetch-assets.sh
#
# ダウンロード後は index.html が自動でローカルの画像を読みに行きます。
# （ローカルに無い間だけ、旧サイトの画像を読み込む仕組みになっています）

set -u

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
DEST="$ROOT/assets/img"
BASE="https://snack-fratt.com/wp-content"

mkdir -p "$DEST"

download() {
  local url="$1" out="$2"
  if curl -fsSL --max-time 60 -o "$DEST/$out" "$url"; then
    printf '  ✓ %s\n' "$out"
  else
    printf '  ✗ %s  (取得できませんでした: %s)\n' "$out" "$url"
    rm -f "$DEST/$out"
  fi
}

echo "旧サイトから画像を取得します → $DEST"

download "$BASE/uploads/2016/06/logo.png"                              logo.png
download "$BASE/uploads/2016/06/image1-2.jpg"                          shop-01.jpg
download "$BASE/uploads/2016/06/image2-2.jpg"                          shop-02.jpg
download "$BASE/uploads/2016/06/image3-2.jpg"                          shop-03.jpg
download "$BASE/uploads/2016/06/image4-2.jpg"                          shop-04.jpg
download "$BASE/uploads/2026/04/image20260424-4-1.jpg"                 recruit.jpg
download "$BASE/uploads/2026/04/image20260424-2-3.jpg"                 rinon.jpg
download "$BASE/uploads/2016/06/image1-1.jpg"                          flower-01.jpg
download "$BASE/uploads/2016/06/image2-1.jpg"                          flower-02.jpg
download "$BASE/uploads/2016/06/image3-1.jpg"                          flower-03.jpg
download "$BASE/uploads/2016/06/image4-1.jpg"                          flower-04.jpg

echo
echo "完了しました。index.html をブラウザで開いて確認してください。"
echo "取得できなかったものは、お店の写真を同じファイル名で assets/img/ に置いてください。"
