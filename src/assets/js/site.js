/* הפונדק: small helpers. Back button, the tea animation on the forms, print, comments. */
(function () {
  var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Back: go to the previous page on this site, or to the home page.
  document.querySelectorAll(".back").forEach(function (a) {
    a.addEventListener("click", function (e) {
      if (document.referrer && document.referrer.indexOf(location.origin) === 0 && history.length > 1) {
        e.preventDefault();
        history.back();
      }
    });
  });

  // Print one piece
  document.querySelectorAll(".js-print").forEach(function (b) {
    b.addEventListener("click", function () { window.print(); });
  });

  // Forms: tea animation, then send to the magazine's email (FormSubmit)
  var thanks = document.getElementById("thanks-link");
  document.querySelectorAll(".fly-form").forEach(function (f) {
    f.addEventListener("submit", function (e) {
      e.preventDefault();
      var b = f.querySelector(".send"), w = b.parentNode, err = f.querySelector(".err");
      if (b.classList.contains("busy")) return;
      if (f.dataset.kind === "send") {
        var file = f.querySelector('input[type="file"]'), txt = f.querySelector('textarea[name="היצירה (מודבקת)"]');
        var ok = (file && file.files.length) || (txt && txt.value.trim());
        if (err) err.hidden = !!ok;
        if (!ok) return;
        if (file && file.files.length && file.files[0].size > 5 * 1024 * 1024) {
          err.textContent = "הקובץ גדול מדי (עד 5MB). אפשר לשמור אותו מחדש או להדביק את הטקסט 🙂";
          err.hidden = false;
          return;
        }
        var t = f.querySelector('[name="שם היצירה"]').value.trim(), n = f.querySelector('[name="שם לפרסום"]').value.trim();
        f.querySelector('[name="_subject"]').value = "יצירה חדשה לפונדק: " + t + " / " + n;
      } else if (f.dataset.kind === "comment") {
        var cn = f.querySelector('[name="שם"]').value.trim();
        f.querySelector('[name="כתובת העמוד"]').value = location.href;
        f.querySelector('[name="_subject"]').value = "תגובה חדשה על: " + f.dataset.page + " / מאת " + cn;
      } else {
        var s = f.querySelector('[name="נושא"]').value, nm = f.querySelector('[name="שם"]').value.trim();
        f.querySelector('[name="_subject"]').value = "הודעה מהאתר (" + s + ") מאת " + nm;
      }
      f.querySelector('[name="_next"]').value = thanks.href + "?t=" + f.dataset.kind;
      var go = function () { HTMLFormElement.prototype.submit.call(f); };
      if (reduce) { b.classList.add("sent"); go(); return; }
      b.classList.add("busy", "a-tea");
      w.insertAdjacentHTML("beforeend", document.getElementById("fx-tea").innerHTML);
      var x = w.querySelector(".fx");
      x.style.left = (b.offsetLeft + b.offsetWidth / 2) + "px";
      setTimeout(function () { b.classList.remove("busy", "a-tea"); b.classList.add("sent"); go(); }, 2300);
    });
  });

  // Thank-you page text
  var tk = location.search.indexOf("t=comment") > -1 ? "comment" : (location.search.indexOf("t=contact") > -1 ? "contact" : "");
  if (tk) {
    document.querySelectorAll(".ty-send").forEach(function (el) { el.hidden = true; });
    document.querySelectorAll(".ty-" + tk).forEach(function (el) { el.hidden = false; });
  }
})();
