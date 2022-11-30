var qsProxy = {};
function FrameBuilder(
  formId,
  appendTo,
  initialHeight,
  iframeCode,
  title,
  embedStyleJSON
) {
  this.formId = formId;
  this.initialHeight = initialHeight;
  this.iframeCode = iframeCode;
  this.frame = null;
  this.timeInterval = 200;
  this.appendTo = appendTo || false;
  this.formSubmitted = 0;
  this.frameMinWidth = "100%";
  this.defaultHeight = "";
  this.init = function () {
    this.embedURLHash = this.getMD5(window.location.href);
    if (
      embedStyleJSON &&
      embedStyleJSON[this.embedURLHash] &&
      embedStyleJSON[this.embedURLHash]["inlineStyle"]["embedWidth"]
    ) {
      this.frameMinWidth =
        embedStyleJSON[this.embedURLHash]["inlineStyle"]["embedWidth"] + "px";
    }
    if (embedStyleJSON && embedStyleJSON[this.embedURLHash]) {
      if (
        embedStyleJSON[this.embedURLHash]["inlineStyle"] &&
        embedStyleJSON[this.embedURLHash]["inlineStyle"]["embedHeight"]
      ) {
        this.defaultHeight =
          'data-frameHeight="' +
          embedStyleJSON[this.embedURLHash]["inlineStyle"]["embedHeight"] +
          '"';
      }
    }
    this.createFrame();
    this.addFrameContent(this.iframeCode);
  };
  this.createFrame = function () {
    var tmp_is_ie = !!window.ActiveXObject;
    this.iframeDomId = document.getElementById(this.formId)
      ? this.formId + "_" + new Date().getTime()
      : this.formId;
    if (typeof $jot !== "undefined") {
      var iframe = document.getElementById("223253903343046");
      var parent = $jot(iframe).closest(".jt-feedback.u-responsive-lightbox");
      if (parent) {
        this.iframeDomId = "lightbox-" + this.iframeDomId;
      }
    }
    var htmlCode =
      "<" +
      'iframe title="' +
      title.replace(/[\\"']/g, "\\$&").replace(/&amp;/g, "&") +
      '" src="" allowtransparency="true" allow="geolocation; microphone; camera" allowfullscreen="true" name="' +
      this.formId +
      '" id="' +
      this.iframeDomId +
      '" style="width: 10px; min-width:' +
      this.frameMinWidth +
      "; display: block; overflow: hidden; height:" +
      this.initialHeight +
      'px; border: none;" scrolling="no"' +
      this.defaultHeight +
      "></if" +
      "rame>";
    if (this.appendTo === false) {
      document.write(htmlCode);
    } else {
      var tmp = document.createElement("div");
      tmp.innerHTML = htmlCode;
      var a = this.appendTo;
      document.getElementById(a).appendChild(tmp.firstChild);
    }
    this.frame = document.getElementById(this.iframeDomId);
    if (tmp_is_ie === true) {
      try {
        var iframe = this.frame;
        var doc = iframe.contentDocument
          ? iframe.contentDocument
          : iframe.contentWindow.document || iframe.document;
        doc.open();
        doc.write("");
      } catch (err) {
        this.frame.src =
          "javascript:void((function(){document.open();document.domain='" +
          this.getBaseDomain() +
          "';document.close();})())";
      }
    }
    this.addEvent(this.frame, "load", this.bindMethod(this.setTimer, this));
    var self = this;
    if (window.chrome !== undefined) {
      this.frame.onload = function () {
        try {
          var doc = this.contentWindow.document;
          var _jotform = this.contentWindow.JotForm;
          if (doc !== undefined) {
            var form = doc.getElementById("" + self.iframeDomId);
            self.addEvent(form, "submit", function () {
              if (_jotform.validateAll()) {
                self.formSubmitted = 1;
              }
            });
          }
        } catch (e) {}
      };
    }
  };
  this.addEvent = function (obj, type, fn) {
    if (obj.attachEvent) {
      obj["e" + type + fn] = fn;
      obj[type + fn] = function () {
        obj["e" + type + fn](window.event);
      };
      obj.attachEvent("on" + type, obj[type + fn]);
    } else {
      obj.addEventListener(type, fn, false);
    }
  };
  this.addFrameContent = function (string) {
    if (
      window.location.search &&
      window.location.search.indexOf("disableSmartEmbed") > -1
    ) {
      string = string.replace(new RegExp("smartEmbed=1(?:&amp;|&)"), "");
      string = string.replace(new RegExp("isSmartEmbed"), "");
    } else {
      var cssLink = "stylebuilder/" + this.formId + ".css";
      var cssPlace = string.indexOf(cssLink);
      var prepend = string[cssPlace + cssLink.length] === "?" ? "&amp;" : "?";
      var embedUrl = prepend + "embedUrl=" + window.location.href;
      if (cssPlace > -1) {
        var positionLastRequestElement = string.indexOf('"/>', cssPlace);
        if (positionLastRequestElement > -1) {
          string =
            string.substr(0, positionLastRequestElement) +
            embedUrl +
            string.substr(positionLastRequestElement);
          string = string.replace(
            cssLink,
            "stylebuilder/" + this.formId + "/" + this.embedURLHash + ".css"
          );
        }
      }
    }
    string = string.replace(
      new RegExp('src\\=\\"[^"]*captcha.php"></scr' + "ipt>", "gim"),
      'src="http://api.recaptcha.net/js/recaptcha_ajax.js"></scr' +
        "ipt><" +
        'div id="recaptcha_div"><' +
        "/div>" +
        "<" +
        "style>#recaptcha_logo{ display:none;} #recaptcha_tagline{display:none;} #recaptcha_table{border:none !important;} .recaptchatable .recaptcha_image_cell, #recaptcha_table{ background-color:transparent !important; } <" +
        "/style>" +
        "<" +
        'script defer="defer"> window.onload = function(){ Recaptcha.create("6Ld9UAgAAAAAAMon8zjt30tEZiGQZ4IIuWXLt1ky", "recaptcha_div", {theme: "clean",tabindex: 0,callback: function (){' +
        'if (document.getElementById("uword")) { document.getElementById("uword").parentNode.removeChild(document.getElementById("uword")); } if (window["validate"] !== undefined) { if (document.getElementById("recaptcha_response_field")){ document.getElementById("recaptcha_response_field").onblur = function(){ validate(document.getElementById("recaptcha_response_field"), "Required"); } } } if (document.getElementById("recaptcha_response_field")){ document.getElementsByName("recaptcha_challenge_field")[0].setAttribute("name", "anum"); } if (document.getElementById("recaptcha_response_field")){ document.getElementsByName("recaptcha_response_field")[0].setAttribute("name", "qCap"); }}})' +
        " }<" +
        "/script>"
    );
    string = string.replace(
      /(type="text\/javascript">)\s+(validate\(\"[^"]*"\);)/,
      '$1 jTime = setInterval(function(){if("validate" in window){$2clearTimeout(jTime);}}, 1000);'
    );
    if (string.match("#sublabel_litemode")) {
      string = string.replace(
        'class="form-all"',
        'class="form-all" style="margin-top:0;"'
      );
    }
    var iframe = this.frame;
    var doc = iframe.contentDocument
      ? iframe.contentDocument
      : iframe.contentWindow.document || iframe.document;
    doc.open();
    doc.write(string);
    setTimeout(function () {
      doc.close();
      try {
        if ("JotFormFrameLoaded" in window) {
          JotFormFrameLoaded();
        }
      } catch (e) {}
    }, 200);
  };
  this.setTimer = function () {
    var self = this;
    this.interval = setTimeout(this.changeHeight.bind(this), this.timeInterval);
  };
  this.getBaseDomain = function () {
    var thn = window.location.hostname;
    var cc = 0;
    var buff = "";
    for (var i = 0; i < thn.length; i++) {
      var chr = thn.charAt(i);
      if (chr == ".") {
        cc++;
      }
      if (cc == 0) {
        buff += chr;
      }
    }
    if (cc == 2) {
      thn = thn.replace(buff + ".", "");
    }
    return thn;
  };
  this.changeHeight = function () {
    var actualHeight = this.getBodyHeight();
    var currentHeight = this.getViewPortHeight();
    var skipAutoHeight = this.frame.contentWindow
      ? this.frame.contentWindow.document.querySelector(
          '[data-welcome-view="true"]'
        )
      : null;
    if (actualHeight === undefined) {
      this.frame.style.height = this.frameHeight;
      if (!this.frame.style.minHeight) {
        this.frame.style.minHeight = "100vh";
        if (!("nojump" in this.frame.contentWindow.document.get)) {
          window.parent.scrollTo(0, 0);
        }
      } else if (!this.frame.dataset.parentScrolled) {
        this.frame.dataset.parentScrolled = true;
        var container =
          window.parent.document &&
          window.parent.document.querySelector(".jt-content");
        if (container && !("nojump" in window.parent.document.get)) {
          container.scrollTo(0, 0);
        }
      }
    } else if (Math.abs(actualHeight - currentHeight) > 18 && !skipAutoHeight) {
      this.frame.style.height = actualHeight + "px";
    }
    this.setTimer();
  };
  this.bindMethod = function (method, scope) {
    return function () {
      method.apply(scope, arguments);
    };
  };
  this.frameHeight = 0;
  this.getBodyHeight = function () {
    if (this.formSubmitted === 1) {
      return;
    }
    var height;
    var scrollHeight;
    var offsetHeight;
    try {
      if (this.frame.contentWindow.document.height) {
        height = this.frame.contentWindow.document.height;
        if (this.frame.contentWindow.document.body.scrollHeight) {
          height = scrollHeight =
            this.frame.contentWindow.document.body.scrollHeight;
        }
        if (this.frame.contentWindow.document.body.offsetHeight) {
          height = offsetHeight =
            this.frame.contentWindow.document.body.offsetHeight;
        }
      } else if (this.frame.contentWindow.document.body) {
        if (this.frame.contentWindow.document.body.offsetHeight) {
          height = offsetHeight =
            this.frame.contentWindow.document.body.offsetHeight;
        }
        var formWrapper =
          this.frame.contentWindow.document.querySelector(".form-all");
        var margin = parseInt(getComputedStyle(formWrapper).marginTop, 10);
        if (!isNaN(margin)) {
          height += margin;
        }
      }
    } catch (e) {}
    this.frameHeight = height;
    return height;
  };
  this.getViewPortHeight = function () {
    if (this.formSubmitted === 1) {
      return;
    }
    var height = 0;
    try {
      if (this.frame.contentWindow.window.innerHeight) {
        height = this.frame.contentWindow.window.innerHeight - 18;
      } else if (
        this.frame.contentWindow.document.documentElement &&
        this.frame.contentWindow.document.documentElement.clientHeight
      ) {
        height = this.frame.contentWindow.document.documentElement.clientHeight;
      } else if (
        this.frame.contentWindow.document.body &&
        this.frame.contentWindow.document.body.clientHeight
      ) {
        height = this.frame.contentWindow.document.body.clientHeight;
      }
    } catch (e) {}
    return height;
  };
  this.getMD5 = function (s) {
    function L(k, d) {
      return (k << d) | (k >>> (32 - d));
    }
    function K(G, k) {
      var I, d, F, H, x;
      F = G & 2147483648;
      H = k & 2147483648;
      I = G & 1073741824;
      d = k & 1073741824;
      x = (G & 1073741823) + (k & 1073741823);
      if (I & d) {
        return x ^ 2147483648 ^ F ^ H;
      }
      if (I | d) {
        if (x & 1073741824) {
          return x ^ 3221225472 ^ F ^ H;
        } else {
          return x ^ 1073741824 ^ F ^ H;
        }
      } else {
        return x ^ F ^ H;
      }
    }
    function r(d, F, k) {
      return (d & F) | (~d & k);
    }
    function q(d, F, k) {
      return (d & k) | (F & ~k);
    }
    function p(d, F, k) {
      return d ^ F ^ k;
    }
    function n(d, F, k) {
      return F ^ (d | ~k);
    }
    function u(G, F, aa, Z, k, H, I) {
      G = K(G, K(K(r(F, aa, Z), k), I));
      return K(L(G, H), F);
    }
    function f(G, F, aa, Z, k, H, I) {
      G = K(G, K(K(q(F, aa, Z), k), I));
      return K(L(G, H), F);
    }
    function D(G, F, aa, Z, k, H, I) {
      G = K(G, K(K(p(F, aa, Z), k), I));
      return K(L(G, H), F);
    }
    function t(G, F, aa, Z, k, H, I) {
      G = K(G, K(K(n(F, aa, Z), k), I));
      return K(L(G, H), F);
    }
    function e(G) {
      var Z;
      var F = G.length;
      var x = F + 8;
      var k = (x - (x % 64)) / 64;
      var I = (k + 1) * 16;
      var aa = Array(I - 1);
      var d = 0;
      var H = 0;
      while (H < F) {
        Z = (H - (H % 4)) / 4;
        d = (H % 4) * 8;
        aa[Z] = aa[Z] | (G.charCodeAt(H) << d);
        H++;
      }
      Z = (H - (H % 4)) / 4;
      d = (H % 4) * 8;
      aa[Z] = aa[Z] | (128 << d);
      aa[I - 2] = F << 3;
      aa[I - 1] = F >>> 29;
      return aa;
    }
    function B(x) {
      var k = "",
        F = "",
        G,
        d;
      for (d = 0; d <= 3; d++) {
        G = (x >>> (d * 8)) & 255;
        F = "0" + G.toString(16);
        k = k + F.substr(F.length - 2, 2);
      }
      return k;
    }
    function J(k) {
      k = k.replace(/rn/g, "n");
      var d = "";
      for (var F = 0; F < k.length; F++) {
        var x = k.charCodeAt(F);
        if (x < 128) {
          d += String.fromCharCode(x);
        } else {
          if (x > 127 && x < 2048) {
            d += String.fromCharCode((x >> 6) | 192);
            d += String.fromCharCode((x & 63) | 128);
          } else {
            d += String.fromCharCode((x >> 12) | 224);
            d += String.fromCharCode(((x >> 6) & 63) | 128);
            d += String.fromCharCode((x & 63) | 128);
          }
        }
      }
      return d;
    }
    var C = Array();
    var P, h, E, v, g, Y, X, W, V;
    var S = 7,
      Q = 12,
      N = 17,
      M = 22;
    var A = 5,
      z = 9,
      y = 14,
      w = 20;
    var o = 4,
      m = 11,
      l = 16,
      j = 23;
    var U = 6,
      T = 10,
      R = 15,
      O = 21;
    s = J(s);
    C = e(s);
    Y = 1732584193;
    X = 4023233417;
    W = 2562383102;
    V = 271733878;
    for (P = 0; P < C.length; P += 16) {
      h = Y;
      E = X;
      v = W;
      g = V;
      Y = u(Y, X, W, V, C[P + 0], S, 3614090360);
      V = u(V, Y, X, W, C[P + 1], Q, 3905402710);
      W = u(W, V, Y, X, C[P + 2], N, 606105819);
      X = u(X, W, V, Y, C[P + 3], M, 3250441966);
      Y = u(Y, X, W, V, C[P + 4], S, 4118548399);
      V = u(V, Y, X, W, C[P + 5], Q, 1200080426);
      W = u(W, V, Y, X, C[P + 6], N, 2821735955);
      X = u(X, W, V, Y, C[P + 7], M, 4249261313);
      Y = u(Y, X, W, V, C[P + 8], S, 1770035416);
      V = u(V, Y, X, W, C[P + 9], Q, 2336552879);
      W = u(W, V, Y, X, C[P + 10], N, 4294925233);
      X = u(X, W, V, Y, C[P + 11], M, 2304563134);
      Y = u(Y, X, W, V, C[P + 12], S, 1804603682);
      V = u(V, Y, X, W, C[P + 13], Q, 4254626195);
      W = u(W, V, Y, X, C[P + 14], N, 2792965006);
      X = u(X, W, V, Y, C[P + 15], M, 1236535329);
      Y = f(Y, X, W, V, C[P + 1], A, 4129170786);
      V = f(V, Y, X, W, C[P + 6], z, 3225465664);
      W = f(W, V, Y, X, C[P + 11], y, 643717713);
      X = f(X, W, V, Y, C[P + 0], w, 3921069994);
      Y = f(Y, X, W, V, C[P + 5], A, 3593408605);
      V = f(V, Y, X, W, C[P + 10], z, 38016083);
      W = f(W, V, Y, X, C[P + 15], y, 3634488961);
      X = f(X, W, V, Y, C[P + 4], w, 3889429448);
      Y = f(Y, X, W, V, C[P + 9], A, 568446438);
      V = f(V, Y, X, W, C[P + 14], z, 3275163606);
      W = f(W, V, Y, X, C[P + 3], y, 4107603335);
      X = f(X, W, V, Y, C[P + 8], w, 1163531501);
      Y = f(Y, X, W, V, C[P + 13], A, 2850285829);
      V = f(V, Y, X, W, C[P + 2], z, 4243563512);
      W = f(W, V, Y, X, C[P + 7], y, 1735328473);
      X = f(X, W, V, Y, C[P + 12], w, 2368359562);
      Y = D(Y, X, W, V, C[P + 5], o, 4294588738);
      V = D(V, Y, X, W, C[P + 8], m, 2272392833);
      W = D(W, V, Y, X, C[P + 11], l, 1839030562);
      X = D(X, W, V, Y, C[P + 14], j, 4259657740);
      Y = D(Y, X, W, V, C[P + 1], o, 2763975236);
      V = D(V, Y, X, W, C[P + 4], m, 1272893353);
      W = D(W, V, Y, X, C[P + 7], l, 4139469664);
      X = D(X, W, V, Y, C[P + 10], j, 3200236656);
      Y = D(Y, X, W, V, C[P + 13], o, 681279174);
      V = D(V, Y, X, W, C[P + 0], m, 3936430074);
      W = D(W, V, Y, X, C[P + 3], l, 3572445317);
      X = D(X, W, V, Y, C[P + 6], j, 76029189);
      Y = D(Y, X, W, V, C[P + 9], o, 3654602809);
      V = D(V, Y, X, W, C[P + 12], m, 3873151461);
      W = D(W, V, Y, X, C[P + 15], l, 530742520);
      X = D(X, W, V, Y, C[P + 2], j, 3299628645);
      Y = t(Y, X, W, V, C[P + 0], U, 4096336452);
      V = t(V, Y, X, W, C[P + 7], T, 1126891415);
      W = t(W, V, Y, X, C[P + 14], R, 2878612391);
      X = t(X, W, V, Y, C[P + 5], O, 4237533241);
      Y = t(Y, X, W, V, C[P + 12], U, 1700485571);
      V = t(V, Y, X, W, C[P + 3], T, 2399980690);
      W = t(W, V, Y, X, C[P + 10], R, 4293915773);
      X = t(X, W, V, Y, C[P + 1], O, 2240044497);
      Y = t(Y, X, W, V, C[P + 8], U, 1873313359);
      V = t(V, Y, X, W, C[P + 15], T, 4264355552);
      W = t(W, V, Y, X, C[P + 6], R, 2734768916);
      X = t(X, W, V, Y, C[P + 13], O, 1309151649);
      Y = t(Y, X, W, V, C[P + 4], U, 4149444226);
      V = t(V, Y, X, W, C[P + 11], T, 3174756917);
      W = t(W, V, Y, X, C[P + 2], R, 718787259);
      X = t(X, W, V, Y, C[P + 9], O, 3951481745);
      Y = K(Y, h);
      X = K(X, E);
      W = K(W, v);
      V = K(V, g);
    }
    var i = B(Y) + B(X) + B(W) + B(V);
    return i.toLowerCase();
  };
  this.init();
}
FrameBuilder.get = qsProxy || [];
var i223253903343046 = new FrameBuilder(
  "223253903343046",
  false,
  "",
  '<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">\n<html lang="en-US"  class="supernova"><head>\n<script>console.warn("Server Side Rendering => render-from ==> \\n frontend");</script>\n\n<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />\n<link rel="alternate" type="application/json+oembed" href="https://www.jotform.com/oembed/?format=json&amp;url=https%3A%2F%2Fform.jotform.com%2F223253903343046" title="oEmbed Form">\n<link rel="alternate" type="text/xml+oembed" href="https://www.jotform.com/oembed/?format=xml&amp;url=https%3A%2F%2Fform.jotform.com%2F223253903343046" title="oEmbed Form">\n<meta property="og:title" content="Review and place your order" >\n<meta property="og:url" content="https://form.jotform.com/223253903343046" >\n<meta property="og:description" content="Please click the link to complete this form." >\n<meta name="slack-app-id" content="AHNMASS8M">\n<link rel="shortcut icon" href="https://cdn.jotfor.ms/assets/img/favicons/favicon-2021.svg">\n<meta property="og:image" content="https://cdn.jotfor.ms/assets/img/favicons/favicon-2021.svg" />\n<link rel="canonical" href="https://form.jotform.com/223253903343046" />\n<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=2.0, user-scalable=1" />\n<meta name="HandheldFriendly" content="true" />\n<title>Review and place your order</title>\n<style type="text/css">@media print{.form-section{display:inline!important}.form-pagebreak{display:none!important}.form-section-closed{height:auto!important}.page-section{position:initial!important}}</style>\n<link type="text/css" rel="stylesheet" href="https://cdn01.jotfor.ms/themes/CSS/5e6b428acc8c4e222d1beb91.css?"/>\n<link type="text/css" rel="stylesheet" href="https://cdn02.jotfor.ms/css/styles/payment/payment_styles.css?3.3.37350" />\n<link type="text/css" rel="stylesheet" href="https://cdn03.jotfor.ms/css/styles/payment/payment_feature.css?3.3.37350" />\n<style type="text/css" id="form-designer-style">\n    /* Injected CSS Code */\n/*PREFERENCES STYLE*/\n    .form-all {\n      font-family: Inter, sans-serif;\n    }\n    .form-all .qq-upload-button,\n    .form-all .form-submit-button,\n    .form-all .form-submit-reset,\n    .form-all .form-submit-print {\n      font-family: Inter, sans-serif;\n    }\n    .form-all .form-pagebreak-back-container,\n    .form-all .form-pagebreak-next-container {\n      font-family: Inter, sans-serif;\n    }\n    .form-header-group {\n      font-family: Inter, sans-serif;\n    }\n    .form-label {\n      font-family: Inter, sans-serif;\n    }\n  \n    .form-label.form-label-auto {\n      \n    display: block;\n    float: none;\n    text-align: left;\n    width: 100%;\n  \n    }\n  \n    .form-line {\n      margin-top: 12px;\n      margin-bottom: 12px;\n    }\n  \n    .form-all {\n      max-width: 752px;\n      width: 100%;\n    }\n  \n    .form-label.form-label-left,\n    .form-label.form-label-right,\n    .form-label.form-label-left.form-label-auto,\n    .form-label.form-label-right.form-label-auto {\n      width: 230px;\n    }\n  \n    .form-all {\n      font-size: 16px\n    }\n    .form-all .qq-upload-button,\n    .form-all .qq-upload-button,\n    .form-all .form-submit-button,\n    .form-all .form-submit-reset,\n    .form-all .form-submit-print {\n      font-size: 16px\n    }\n    .form-all .form-pagebreak-back-container,\n    .form-all .form-pagebreak-next-container {\n      font-size: 16px\n    }\n  \n    .supernova .form-all, .form-all {\n      background-color: #fff;\n    }\n  \n    .form-all {\n      color: #2C3345;\n    }\n    .form-header-group .form-header {\n      color: #2C3345;\n    }\n    .form-header-group .form-subHeader {\n      color: #2C3345;\n    }\n    .form-label-top,\n    .form-label-left,\n    .form-label-right,\n    .form-html,\n    .form-checkbox-item label,\n    .form-radio-item label,\n    span.FITB .qb-checkbox-label,\n    span.FITB .qb-radiobox-label,\n    span.FITB .form-radio label,\n    span.FITB .form-checkbox label,\n    [data-blotid][data-type=checkbox] [data-labelid],\n    [data-blotid][data-type=radiobox] [data-labelid],\n    span.FITB-inptCont[data-type=checkbox] label,\n    span.FITB-inptCont[data-type=radiobox] label {\n      color: #2C3345;\n    }\n    .form-sub-label {\n      color: #464d5f;\n    }\n  \n    .supernova {\n      background-color: #f3f3fe;\n    }\n    .supernova body {\n      background: transparent;\n    }\n  \n    .form-textbox,\n    .form-textarea,\n    .form-dropdown,\n    .form-radio-other-input,\n    .form-checkbox-other-input,\n    .form-captcha input,\n    .form-spinner input {\n      background-color: #fff;\n    }\n  \n    .supernova {\n      background-image: none;\n    }\n    #stage {\n      background-image: none;\n    }\n  \n    .form-all {\n      background-image: none;\n    }\n  \n    .form-all {\n      position: relative;\n    }\n    .form-all:before {\n      content: "";\n      background-image: url("https://www.jotform.com/uploads/crazyfangirl898/form_files/noun_Tent_2517.637ced7cd60094.79118406.svg");\n      display: inline-block;\n      height: 100px;\n      position: absolute;\n      background-size: 100px 100px;\n      background-repeat: no-repeat;\n      width: 100%;\n    }\n    .form-all {\n      margin-top: 120px !important;\n    }\n    .form-all:before {\n      top: -110px;\n      background-position: top center;\n      left: 0;\n    }\n           \n  .ie-8 .form-all:before { display: none; }\n  .ie-8 {\n    margin-top: auto;\n    margin-top: initial;\n  }\n  \n  /*PREFERENCES STYLE*//*__INSPECT_SEPERATOR__*/\n    /* Injected CSS Code */\n</style>\n\n<script src="https://cdn01.jotfor.ms/static/prototype.forms.js?3.3.37350" type="text/javascript"></script>\n<script src="https://cdn02.jotfor.ms/static/jotform.forms.js?3.3.37350" type="text/javascript"></script>\n<script src="https://cdn03.jotfor.ms/js/vendor/jquery-1.8.0.min.js?v=3.3.37350" type="text/javascript"></script>\n<script defer src="https://cdn01.jotfor.ms/js/vendor/maskedinput.min.js?v=3.3.37350" type="text/javascript"></script>\n<script defer src="https://cdn02.jotfor.ms/js/vendor/jquery.maskedinput.min.js?v=3.3.37350" type="text/javascript"></script>\n<script type="text/javascript">\tJotForm.newDefaultTheme = true;\n\tJotForm.extendsNewTheme = false;\n\tJotForm.singleProduct = true;\n\tJotForm.newPaymentUIForNewCreatedForms = true;\n\tJotForm.newPaymentUI = true;\n\n var jsTime = setInterval(function(){try{\n   JotForm.jsForm = true;\n\tJotForm.clearFieldOnHide="disable";\n\tJotForm.submitError="jumpToFirstError";\n\n\tJotForm.init(function(){\n\t/*INIT-START*/\nif (window.JotForm && JotForm.accessible) $(\'input_9\').setAttribute(\'tabindex\',0);\n      setTimeout(function() {\n          $(\'input_12\').hint(\'16 digits \');\n       }, 20);\n\n JotForm.calendarMonths = ["January","February","March","April","May","June","July","August","September","October","November","December"];\n JotForm.calendarDays = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];\n JotForm.calendarOther = {"today":"Today"};\n var languageOptions = document.querySelectorAll(\'#langList li\'); \n for(var langIndex = 0; langIndex < languageOptions.length; langIndex++) { \n   languageOptions[langIndex].on(\'click\', function(e) { setTimeout(function(){ JotForm.setCalendar("14", false, {"days":{"monday":true,"tuesday":true,"wednesday":true,"thursday":true,"friday":true,"saturday":true,"sunday":true},"future":true,"past":true,"custom":false,"ranges":false,"start":"","end":""}); }, 0); });\n } \n JotForm.onTranslationsFetch(function() { JotForm.setCalendar("14", false, {"days":{"monday":true,"tuesday":true,"wednesday":true,"thursday":true,"friday":true,"saturday":true,"sunday":true},"future":true,"past":true,"custom":false,"ranges":false,"start":"","end":""}); });\nif (window.JotForm && JotForm.accessible) $(\'input_15\').setAttribute(\'tabindex\',0);\n      JotForm.alterTexts(undefined);\n      JotForm.alterTexts({"couponApply":"Apply","couponBlank":"Please enter a coupon.","couponChange":"","couponEnter":"Enter coupon","couponExpired":"Coupon is expired. Please try another one.","couponInvalid":"Coupon is invalid.","couponValid":"Coupon is valid.","shippingShipping":"Shipping","taxTax":"Tax","totalSubtotal":"Subtotal","totalTotal":"Total"}, true);\n\t/*INIT-END*/\n\t});\n\n   clearInterval(jsTime);\n }catch(e){}}, 1000);\n\n   JotForm.prepareCalculationsOnTheFly([null,{"name":"heading","qid":"1","text":"Sleep Outside","type":"control_head"},{"name":"submit2","qid":"2","text":"Checkout","type":"control_button"},{"description":"","name":"name","qid":"3","text":"Name","type":"control_fullname"},{"description":"","name":"address","qid":"4","text":"Address","type":"control_address"},null,null,null,null,{"description":"","name":"nameOn","qid":"9","subLabel":"e.g John Doe","text":"Name on Card ","type":"control_textbox"},null,null,{"description":"","name":"cardNumber","qid":"12","subLabel":"","text":"Card Number","type":"control_number"},null,{"description":"","name":"expiration","qid":"14","text":"Expiration","type":"control_datetime"},{"description":"","name":"cvc","qid":"15","subLabel":"3 digit number on the back of your card","text":"CVC","type":"control_textbox"},null,{"name":"divider","qid":"17","text":"Divider","type":"control_divider"}]);\n   setTimeout(function() {\nJotForm.paymentExtrasOnTheFly([null,{"name":"heading","qid":"1","text":"Sleep Outside","type":"control_head"},{"name":"submit2","qid":"2","text":"Checkout","type":"control_button"},{"description":"","name":"name","qid":"3","text":"Name","type":"control_fullname"},{"description":"","name":"address","qid":"4","text":"Address","type":"control_address"},null,null,null,null,{"description":"","name":"nameOn","qid":"9","subLabel":"e.g John Doe","text":"Name on Card ","type":"control_textbox"},null,null,{"description":"","name":"cardNumber","qid":"12","subLabel":"","text":"Card Number","type":"control_number"},null,{"description":"","name":"expiration","qid":"14","text":"Expiration","type":"control_datetime"},{"description":"","name":"cvc","qid":"15","subLabel":"3 digit number on the back of your card","text":"CVC","type":"control_textbox"},null,{"name":"divider","qid":"17","text":"Divider","type":"control_divider"}]);}, 20); \n</script>\n</head>\n<body>\n<form class="jotform-form" action="https://submit.jotform.com/submit/223253903343046/" method="post" name="form_223253903343046" id="223253903343046" accept-charset="utf-8" autocomplete="on">\n  <input type="hidden" name="formID" value="223253903343046" />\n  <input type="hidden" id="JWTContainer" value="" />\n  <input type="hidden" id="cardinalOrderNumber" value="" />\n  <div role="main" class="form-all">\n    <div class="formLogoWrapper Center">\n      <img loading="lazy" class="formLogoImg" src="https://www.jotform.com/uploads/crazyfangirl898/form_files/noun_Tent_2517.637ced7cd60094.79118406.svg" height="100" width="100">\n    </div>\n    <style>\n      .formLogoWrapper { display:inline-block; position: absolute; width: 100%;} .form-all:before { background: none !important;} .formLogoWrapper.Center { top: -110px; text-align: center;}\n    </style>\n    <ul class="form-section page-section">\n      <li id="cid_1" class="form-input-wide" data-type="control_head">\n        <div class="form-header-group  header-large">\n          <div class="header-text httal htvam">\n            <h1 id="header_1" class="form-header" data-component="header">\n              Sleep Outside\n            </h1>\n          </div>\n        </div>\n      </li>\n      <li class="form-line jf-required" data-type="control_fullname" id="id_3">\n        <label class="form-label form-label-top form-label-auto" id="label_3" for="first_3">\n          Name\n          <span class="form-required">\n            *\n          </span>\n        </label>\n        <div id="cid_3" class="form-input-wide jf-required" data-layout="full">\n          <div data-wrapper-react="true">\n            <span class="form-sub-label-container" style="vertical-align:top" data-input-type="first">\n              <input type="text" id="first_3" name="q3_name[first]" class="form-textbox validate[required]" data-defaultvalue="" autoComplete="section-input_3 given-name" size="10" value="" data-component="first" aria-labelledby="label_3 sublabel_3_first" required="" />\n              <label class="form-sub-label" for="first_3" id="sublabel_3_first" style="min-height:13px" aria-hidden="false"> First Name </label>\n            </span>\n            <span class="form-sub-label-container" style="vertical-align:top" data-input-type="last">\n              <input type="text" id="last_3" name="q3_name[last]" class="form-textbox validate[required]" data-defaultvalue="" autoComplete="section-input_3 family-name" size="15" value="" data-component="last" aria-labelledby="label_3 sublabel_3_last" required="" />\n              <label class="form-sub-label" for="last_3" id="sublabel_3_last" style="min-height:13px" aria-hidden="false"> Last Name </label>\n            </span>\n          </div>\n        </div>\n      </li>\n      <li class="form-line jf-required" data-type="control_address" id="id_4">\n        <label class="form-label form-label-top form-label-auto" id="label_4" for="input_4_addr_line1">\n          Address\n          <span class="form-required">\n            *\n          </span>\n        </label>\n        <div id="cid_4" class="form-input-wide jf-required" data-layout="full">\n          <div summary="" class="form-address-table jsTest-addressField">\n            <div class="form-address-line-wrapper jsTest-address-line-wrapperField">\n              <span class="form-address-line form-address-street-line jsTest-address-lineField">\n                <span class="form-sub-label-container" style="vertical-align:top">\n                  <input type="text" id="input_4_addr_line1" name="q4_address[addr_line1]" class="form-textbox validate[required] form-address-line" data-defaultvalue="" autoComplete="section-input_4 address-line1" value="" data-component="address_line_1" aria-labelledby="label_4 sublabel_4_addr_line1" required="" />\n                  <label class="form-sub-label" for="input_4_addr_line1" id="sublabel_4_addr_line1" style="min-height:13px" aria-hidden="false"> Street Address </label>\n                </span>\n              </span>\n            </div>\n            <div class="form-address-line-wrapper jsTest-address-line-wrapperField">\n              <span class="form-address-line form-address-street-line jsTest-address-lineField">\n                <span class="form-sub-label-container" style="vertical-align:top">\n                  <input type="text" id="input_4_addr_line2" name="q4_address[addr_line2]" class="form-textbox form-address-line" data-defaultvalue="" autoComplete="section-input_4 address-line2" value="" data-component="address_line_2" aria-labelledby="label_4 sublabel_4_addr_line2" />\n                  <label class="form-sub-label" for="input_4_addr_line2" id="sublabel_4_addr_line2" style="min-height:13px" aria-hidden="false"> Street Address Line 2 </label>\n                </span>\n              </span>\n            </div>\n            <div class="form-address-line-wrapper jsTest-address-line-wrapperField">\n              <span class="form-address-line form-address-city-line jsTest-address-lineField ">\n                <span class="form-sub-label-container" style="vertical-align:top">\n                  <input type="text" id="input_4_city" name="q4_address[city]" class="form-textbox validate[required] form-address-city" data-defaultvalue="" autoComplete="section-input_4 address-level2" value="" data-component="city" aria-labelledby="label_4 sublabel_4_city" required="" />\n                  <label class="form-sub-label" for="input_4_city" id="sublabel_4_city" style="min-height:13px" aria-hidden="false"> City </label>\n                </span>\n              </span>\n              <span class="form-address-line form-address-state-line jsTest-address-lineField ">\n                <span class="form-sub-label-container" style="vertical-align:top">\n                  <input type="text" id="input_4_state" name="q4_address[state]" class="form-textbox validate[required] form-address-state" data-defaultvalue="" autoComplete="section-input_4 address-level1" value="" data-component="state" aria-labelledby="label_4 sublabel_4_state" required="" />\n                  <label class="form-sub-label" for="input_4_state" id="sublabel_4_state" style="min-height:13px" aria-hidden="false"> State / Province </label>\n                </span>\n              </span>\n            </div>\n            <div class="form-address-line-wrapper jsTest-address-line-wrapperField">\n              <span class="form-address-line form-address-zip-line jsTest-address-lineField ">\n                <span class="form-sub-label-container" style="vertical-align:top">\n                  <input type="text" id="input_4_postal" name="q4_address[postal]" class="form-textbox validate[required] form-address-postal" data-defaultvalue="" autoComplete="section-input_4 postal-code" value="" data-component="zip" aria-labelledby="label_4 sublabel_4_postal" required="" />\n                  <label class="form-sub-label" for="input_4_postal" id="sublabel_4_postal" style="min-height:13px" aria-hidden="false"> Postal / Zip Code </label>\n                </span>\n              </span>\n            </div>\n          </div>\n        </div>\n      </li>\n      <li class="form-line jf-required" data-type="control_textbox" id="id_9">\n        <label class="form-label form-label-top form-label-auto" id="label_9" for="input_9">\n          Name on Card\n          <span class="form-required">\n            *\n          </span>\n        </label>\n        <div id="cid_9" class="form-input-wide jf-required" data-layout="half">\n          <span class="form-sub-label-container" style="vertical-align:top">\n            <input type="text" id="input_9" name="q9_nameOn" data-type="input-textbox" class="form-textbox validate[required, Alphabetic]" data-defaultvalue="" style="width:310px" size="310" value="" data-component="textbox" aria-labelledby="label_9 sublabel_input_9" required="" />\n            <label class="form-sub-label" for="input_9" id="sublabel_input_9" style="min-height:13px" aria-hidden="false"> e.g John Doe </label>\n          </span>\n        </div>\n      </li>\n      <li class="form-line jf-required" data-type="control_number" id="id_12">\n        <label class="form-label form-label-top form-label-auto" id="label_12" for="input_12">\n          Card Number\n          <span class="form-required">\n            *\n          </span>\n        </label>\n        <div id="cid_12" class="form-input-wide jf-required" data-layout="half">\n          <input type="number" id="input_12" name="q12_cardNumber" data-type="input-number" class=" form-number-input form-textbox validate[required]" data-defaultvalue="" style="width:310px" size="310" value="" placeholder="16 digits " data-component="number" aria-labelledby="label_12" required="" step="any" />\n        </div>\n      </li>\n      <li class="form-line jf-required" data-type="control_datetime" id="id_14">\n        <label class="form-label form-label-top form-label-auto" id="label_14" for="lite_mode_14">\n          Expiration\n          <span class="form-required">\n            *\n          </span>\n        </label>\n        <div id="cid_14" class="form-input-wide jf-required" data-layout="half">\n          <div data-wrapper-react="true">\n            <div style="display:none">\n              <span class="form-sub-label-container" style="vertical-align:top">\n                <input type="tel" class="form-textbox validate[required, limitDate]" id="month_14" name="q14_expiration[month]" size="2" data-maxlength="2" data-age="" maxLength="2" value="" required="" autoComplete="section-input_14 off" aria-labelledby="label_14 sublabel_14_month" />\n                <span class="date-separate" aria-hidden="true">\n                  \u00a0-\n                </span>\n                <label class="form-sub-label" for="month_14" id="sublabel_14_month" style="min-height:13px" aria-hidden="false"> Month </label>\n              </span>\n              <span class="form-sub-label-container" style="vertical-align:top">\n                <input type="tel" class="form-textbox validate[required, limitDate]" id="day_14" name="q14_expiration[day]" size="2" data-maxlength="2" data-age="" maxLength="2" value="" required="" autoComplete="section-input_14 off" aria-labelledby="label_14 sublabel_14_day" />\n                <span class="date-separate" aria-hidden="true">\n                  \u00a0-\n                </span>\n                <label class="form-sub-label" for="day_14" id="sublabel_14_day" style="min-height:13px" aria-hidden="false"> Day </label>\n              </span>\n              <span class="form-sub-label-container" style="vertical-align:top">\n                <input type="tel" class="form-textbox validate[required, limitDate]" id="year_14" name="q14_expiration[year]" size="4" data-maxlength="4" data-age="" maxLength="4" value="" required="" autoComplete="section-input_14 off" aria-labelledby="label_14 sublabel_14_year" />\n                <label class="form-sub-label" for="year_14" id="sublabel_14_year" style="min-height:13px" aria-hidden="false"> Year </label>\n              </span>\n            </div>\n            <span class="form-sub-label-container" style="vertical-align:top">\n              <input type="text" class="form-textbox validate[required, limitDate, validateLiteDate]" id="lite_mode_14" size="12" data-maxlength="12" maxLength="12" data-age="" value="" required="" data-format="mmddyyyy" data-seperator="-" placeholder="MM-DD-YYYY" autoComplete="section-input_14 off" aria-labelledby="label_14 sublabel_14_litemode" />\n              <img class=" newDefaultTheme-dateIcon icon-liteMode" alt="Pick a Date" id="input_14_pick" src="https://cdn.jotfor.ms/images/calendar.png" data-component="datetime" aria-hidden="true" data-allow-time="No" data-version="v2" />\n              <label class="form-sub-label" for="lite_mode_14" id="sublabel_14_litemode" style="min-height:13px" aria-hidden="false"> Date </label>\n            </span>\n          </div>\n        </div>\n      </li>\n      <li class="form-line" data-type="control_textbox" id="id_15">\n        <label class="form-label form-label-top form-label-auto" id="label_15" for="input_15"> CVC </label>\n        <div id="cid_15" class="form-input-wide" data-layout="half">\n          <span class="form-sub-label-container" style="vertical-align:top">\n            <input type="text" id="input_15" name="q15_cvc" data-type="input-textbox" class="form-textbox" data-defaultvalue="" style="width:310px" size="310" value="" data-component="textbox" aria-labelledby="label_15 sublabel_input_15" />\n            <label class="form-sub-label" for="input_15" id="sublabel_input_15" style="min-height:13px" aria-hidden="false"> 3 digit number on the back of your card </label>\n          </span>\n        </div>\n      </li>\n      <li class="form-line" data-type="control_divider" id="id_17">\n        <div id="cid_17" class="form-input-wide" data-layout="full">\n          <div class="divider" aria-label="Divider" data-component="divider" style="border-bottom-width:1px;border-bottom-style:solid;border-color:#f3f3fe;height:1px;margin-left:0px;margin-right:0px;margin-top:5px;margin-bottom:5px">\n          </div>\n        </div>\n      </li>\n      <li class="form-line" data-type="control_button" id="id_2">\n        <div id="cid_2" class="form-input-wide" data-layout="full">\n          <div data-align="auto" class="form-buttons-wrapper form-buttons-auto   jsTest-button-wrapperField">\n            <button id="input_2" type="submit" class="form-submit-button submit-button jf-form-buttons jsTest-submitField" data-component="button" data-content="">\n              Checkout\n            </button>\n          </div>\n        </div>\n      </li>\n      <li style="display:none">\n        Should be Empty:\n        <input type="text" name="website" value="" />\n      </li>\n    </ul>\n  </div>\n  <script>\n  JotForm.showJotFormPowered = "old_footer";\n  </script>\n  <script>\n  JotForm.poweredByText = "Powered by Jotform";\n  </script>\n  <input type="hidden" class="simple_spc" id="simple_spc" name="simple_spc" value="223253903343046" />\n  <script type="text/javascript">\n  var all_spc = document.querySelectorAll("form[id=\'223253903343046\'] .si" + "mple" + "_spc");\nfor (var i = 0; i < all_spc.length; i++)\n{\n  all_spc[i].value = "223253903343046-223253903343046";\n}\n  </script>\n</form></body>\n</html>\n<script src="https://cdn.jotfor.ms//js/vendor/smoothscroll.min.js?v=3.3.37350"></script>\n<script src="https://cdn.jotfor.ms//js/errorNavigation.js?v=3.3.37350"></script>\n',
  "Review and place your order",
  Array
);
(function () {
  window.handleIFrameMessage = function (e) {
    if (!e.data || !e.data.split) return;
    var args = e.data.split(":");
    if (args[2] != "223253903343046") {
      return;
    }
    var iframe = document.getElementById("223253903343046");
    if (!iframe) {
      return;
    }
    switch (args[0]) {
      case "scrollIntoView":
        if (!("nojump" in FrameBuilder.get)) {
          iframe.scrollIntoView();
        }
        break;
      case "setHeight":
        var height = args[1] + "px";
        if (window.jfDeviceType === "mobile" && typeof $jot !== "undefined") {
          var parent = $jot(iframe).closest(
            ".jt-feedback.u-responsive-lightbox"
          );
          if (parent) {
            height = "100%";
          }
        }
        iframe.style.height = height;
        break;
      case "setMinHeight":
        iframe.style.minHeight = args[1] + "px";
        break;
      case "collapseErrorPage":
        if (iframe.clientHeight > window.innerHeight) {
          iframe.style.height = window.innerHeight + "px";
        }
        break;
      case "reloadPage":
        if (iframe) {
          location.reload();
        }
        break;
      case "removeIframeOnloadAttr":
        iframe.removeAttribute("onload");
        break;
      case "loadScript":
        if (!window.isPermitted(e.origin, ["jotform.com", "jotform.pro"])) {
          break;
        }
        var src = args[1];
        if (args.length > 3) {
          src = args[1] + ":" + args[2];
        }
        var script = document.createElement("script");
        script.src = src;
        script.type = "text/javascript";
        document.body.appendChild(script);
        break;
      case "exitFullscreen":
        if (window.document.exitFullscreen) window.document.exitFullscreen();
        else if (window.document.mozCancelFullScreen)
          window.document.mozCancelFullScreen();
        else if (window.document.mozCancelFullscreen)
          window.document.mozCancelFullScreen();
        else if (window.document.webkitExitFullscreen)
          window.document.webkitExitFullscreen();
        else if (window.document.msExitFullscreen)
          window.document.msExitFullscreen();
        break;
      case "setDeviceType":
        window.jfDeviceType = args[1];
        break;
    }
  };
  window.isPermitted = function (originUrl, whitelisted_domains) {
    var url = document.createElement("a");
    url.href = originUrl;
    var hostname = url.hostname;
    var result = false;
    if (typeof hostname !== "undefined") {
      whitelisted_domains.forEach(function (element) {
        if (
          hostname.slice(-1 * element.length - 1) === ".".concat(element) ||
          hostname === element
        ) {
          result = true;
        }
      });
      return result;
    }
  };
  if (window.addEventListener) {
    window.addEventListener("message", handleIFrameMessage, false);
  } else if (window.attachEvent) {
    window.attachEvent("onmessage", handleIFrameMessage);
  }
})();
