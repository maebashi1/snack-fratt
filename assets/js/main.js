/* =========================================================
   Snack ふらっと — main.js
   ライブラリ不要（Vanilla JS）

   ・ヒーローのスライダー
   ・スマホのメニュー開閉
   ・ページトップボタン
   ・スクロールで要素をふわっと表示
   ・Instagram グリッドの生成
   ・写真のライトボックス（拡大表示）

   全ページ共通で読み込んでいます。
   該当する要素が無いページでは、その処理は自動的にスキップされます。
   ========================================================= */
(function () {
  "use strict";

  var $  = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* -------------------------------------------------------
     1. ヒーローのスライダー
     ------------------------------------------------------- */
  (function heroSlider() {
    var root = $(".hero-slides");
    if (!root) return;

    var slides = $$(".hero-slide", root);
    if (slides.length === 0) return;

    var dotsWrap = $(".hero-dots");
    var index = 0;
    var timer = null;
    var INTERVAL = 6000;

    var dots = slides.map(function (_, i) {
      if (!dotsWrap) return null;
      var b = document.createElement("button");
      b.type = "button";
      b.setAttribute("aria-label", (i + 1) + "枚目を表示");
      b.addEventListener("click", function () { show(i); restart(); });
      dotsWrap.appendChild(b);
      return b;
    });

    function show(i) {
      index = (i + slides.length) % slides.length;
      slides.forEach(function (s, n) { s.classList.toggle("is-active", n === index); });
      dots.forEach(function (d, n) { if (d) d.classList.toggle("is-active", n === index); });
    }
    function next()    { show(index + 1); }
    function restart() { clearInterval(timer); if (slides.length > 1) timer = setInterval(next, INTERVAL); }

    show(0);
    restart();

    document.addEventListener("visibilitychange", function () {
      if (document.hidden) clearInterval(timer); else restart();
    });
  })();

  /* -------------------------------------------------------
     2. スマホのメニュー開閉
     ------------------------------------------------------- */
  (function mobileNav() {
    var burger = $("#burger");
    var nav    = $("#gnav");
    if (!burger || !nav) return;

    function setOpen(open) {
      burger.setAttribute("aria-expanded", String(open));
      nav.classList.toggle("is-open", open);
      document.body.style.overflow = open ? "hidden" : "";
    }

    burger.addEventListener("click", function () {
      setOpen(burger.getAttribute("aria-expanded") !== "true");
    });

    $$("a", nav).forEach(function (a) {
      a.addEventListener("click", function () { setOpen(false); });
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") setOpen(false);
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth > 900) setOpen(false);
    });
  })();

  /* -------------------------------------------------------
     3. ページトップボタン
     ------------------------------------------------------- */
  (function pageTop() {
    var btn = $(".pagetop");
    if (!btn) return;
    function update() { btn.classList.toggle("is-visible", window.scrollY > 400); }
    window.addEventListener("scroll", update, { passive: true });
    update();
  })();

  /* -------------------------------------------------------
     4. スクロールでふわっと表示
     ------------------------------------------------------- */
  (function reveal() {
    var targets = $$(".reveal");
    if (targets.length === 0) return;

    if (!("IntersectionObserver" in window)) {
      targets.forEach(function (el) { el.classList.add("is-in"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.06 });

    targets.forEach(function (el) { io.observe(el); });
  })();

  /* -------------------------------------------------------
     5. 現在地をナビに反映
     ------------------------------------------------------- */
  (function currentNav() {
    var nav = $("#gnav");
    if (!nav) return;
    var here = location.pathname.split("/").pop() || "index.html";
    $$("li", nav).forEach(function (li) {
      var a = $("a", li);
      if (!a) return;
      var href = (a.getAttribute("href") || "").split("/").pop();
      if (href && href === here) li.classList.add("is-current");
    });
  })();

  /* -------------------------------------------------------
     6. ライトボックス（写真の拡大表示）
     ------------------------------------------------------- */
  var lightbox = (function () {
    var box = $("#lightbox");
    if (!box) return null;

    var imgEl  = $("#lbImage", box);
    var capEl  = $("#lbCaption", box);
    var list   = [];
    var cursor = 0;

    function render() {
      var item = list[cursor];
      if (!item) return;
      imgEl.src = item.src;
      imgEl.alt = item.caption || "";
      if (capEl) capEl.textContent = item.caption || "";
    }
    function open(items, start) {
      list = items; cursor = start || 0;
      render();
      box.hidden = false;
      document.body.style.overflow = "hidden";
    }
    function close() {
      box.hidden = true;
      document.body.style.overflow = "";
      imgEl.src = "";
    }
    function move(step) { cursor = (cursor + step + list.length) % list.length; render(); }

    var close_ = $("#lbClose", box);
    var prev_  = $("#lbPrev", box);
    var next_  = $("#lbNext", box);
    if (close_) close_.addEventListener("click", close);
    if (prev_)  prev_.addEventListener("click", function () { move(-1); });
    if (next_)  next_.addEventListener("click", function () { move(1); });

    box.addEventListener("click", function (e) { if (e.target === box) close(); });
    document.addEventListener("keydown", function (e) {
      if (box.hidden) return;
      if (e.key === "Escape")     close();
      if (e.key === "ArrowLeft")  move(-1);
      if (e.key === "ArrowRight") move(1);
    });

    return { open: open };
  })();

  /* 写真グリッドをライトボックスにつなぐ */
  (function bindPhotoGrids() {
    if (!lightbox) return;
    $$(".photo-grid").forEach(function (grid) {
      var buttons = $$("button", grid);
      var items = buttons.map(function (b) {
        var img = $("img", b);
        return { src: b.dataset.full || (img && img.src) || "", caption: b.dataset.caption || "" };
      });
      buttons.forEach(function (b, i) {
        b.addEventListener("click", function () { lightbox.open(items, i); });
      });
    });
  })();

  /* -------------------------------------------------------
     7. Instagram グリッドの生成
        中身は assets/data/instagram.js で管理しています
     ------------------------------------------------------- */
  (function instagram() {
    var grid = $("#instaGrid");
    if (!grid) return;

    var feed  = window.INSTAGRAM_FEED || {};
    var items = feed.items || [];
    var limit = parseInt(grid.dataset.limit || "9", 10);

    if (items.length === 0) {
      grid.innerHTML = '<p class="sec-lead">投稿を準備中です。</p>';
      return;
    }

    items.slice(0, limit).forEach(function (item) {
      var link = document.createElement("a");
      link.className = "insta-item";
      link.href = item.link || feed.profile || "#";
      link.target = "_blank";
      link.rel = "noopener";

      var fig = document.createElement("figure");

      var img = document.createElement("img");
      img.src = item.image;
      img.alt = item.caption || "Instagram の投稿";
      img.loading = "lazy";
      img.addEventListener("error", function () {
        // 写真がまだ置かれていない場合は COMING SOON タイルにする
        link.innerHTML = '<div class="insta-empty">COMING SOON</div>';
      });
      fig.appendChild(img);

      if (item.caption) {
        var cap = document.createElement("figcaption");
        cap.textContent = item.caption;
        fig.appendChild(cap);
      }

      link.appendChild(fig);
      grid.appendChild(link);
    });
  })();

  /* -------------------------------------------------------
     8. コピーライトの年を自動更新
     ------------------------------------------------------- */
  (function year() {
    $$("[data-year]").forEach(function (el) {
      el.textContent = String(new Date().getFullYear());
    });
  })();

})();
