/* Static-site helpers that replace features WordPress used to provide on the server. */
(function () {
  "use strict";

  /* Relative dates ("3 months ago") were baked in when the page was saved; recompute them. */
  function ago(iso) {
    var s = (Date.now() - new Date(iso).getTime()) / 1000;
    var units = [["year", 31536000], ["month", 2592000], ["week", 604800], ["day", 86400], ["hour", 3600], ["min", 60]];
    for (var i = 0; i < units.length; i++) {
      var n = Math.floor(s / units[i][1]);
      if (n >= 1) return n + " " + units[i][0] + (n > 1 ? "s" : "") + " ago";
    }
    return "just now";
  }
  document.querySelectorAll("time[datetime]").forEach(function (t) {
    if (/\bago\b/.test(t.textContent)) t.textContent = ago(t.getAttribute("datetime"));
  });

  /* Highlight the menu item for the section being viewed (WordPress did this on the server). */
  var path = location.pathname.replace(/page\/\d+\/$/, "");
  document.querySelectorAll("#site-navigation a[href]").forEach(function (a) {
    if (a.getAttribute("href") === path) {
      a.setAttribute("aria-current", "page");
      if (a.parentElement) a.parentElement.classList.add("current-menu-item");
    }
  });

  /* Search: all search boxes submit to /search/?s=..., which is rendered here from a JSON index. */
  var results = document.getElementById("search-results");
  if (!results) return;

  var q = (new URLSearchParams(location.search).get("s") || "").trim();
  var title = document.getElementById("search-title");
  document.querySelectorAll('input[name="s"]').forEach(function (i) { i.value = q; });

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  if (!q) {
    title.textContent = "Search";
    results.innerHTML = "<p>Type something in the search box to find articles.</p>";
    return;
  }
  document.title = "Search results for “" + q + "” – Agoura High Charger Post";
  title.innerHTML = "Search Results for: <span>" + esc(q) + "</span>";

  fetch("/assets/search-index.json")
    .then(function (r) { return r.json(); })
    .then(function (posts) {
      var terms = q.toLowerCase().split(/\s+/).filter(Boolean);
      var scored = posts.map(function (p) {
        var t = p.title.toLowerCase(), c = (p.content + " " + p.author + " " + p.categories.join(" ")).toLowerCase();
        var score = 0;
        for (var i = 0; i < terms.length; i++) {
          if (t.indexOf(terms[i]) >= 0) score += 10;
          else if (c.indexOf(terms[i]) >= 0) score += 1;
          else return null;
        }
        return { p: p, score: score };
      }).filter(Boolean).sort(function (a, b) { return b.score - a.score; });

      if (!scored.length) {
        results.innerHTML = "<p>Sorry, but nothing matched your search terms. Please try again with some different keywords.</p>";
        return;
      }
      results.innerHTML = scored.map(function (x) {
        var p = x.p;
        var cats = p.categories.map(function (c) {
          var slug = c.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
          return '<li class="cat-item"><a href="/category/' + slug + '/" rel="category tag">' + esc(c) + "</a></li>";
        }).join("");
        return '<article class="post hentry"><div class="blaze_box_wrap">' +
          (p.image ? '<figure class="post-thumb-wrap"><a href="' + p.url + '" title="' + esc(p.title) + '"><img src="' + esc(p.image) + '" alt="" loading="lazy"></a><ul class="post-categories">' + cats + "</ul></figure>" : "") +
          '<div class="post-element"><h2 class="post-title"><a href="' + p.url + '">' + esc(p.title) + "</a></h2>" +
          '<div class="post-meta"><span class="byline"><span class="author vcard">' + esc(p.author) + '</span></span>' +
          '<span class="post-date posted-on published"><time datetime="' + esc(p.date) + '">' + (p.date ? ago(p.date) : "") + "</time></span></div>" +
          '<div class="post-excerpt"><p>' + esc(p.excerpt) + "</p></div>" +
          '<a class="post-link-button" href="' + p.url + '">Read More<i class="fas fa-caret-right"></i></a></div></div></article>';
      }).join("");
    })
    .catch(function () {
      results.innerHTML = "<p>Search is unavailable right now.</p>";
    });
})();
