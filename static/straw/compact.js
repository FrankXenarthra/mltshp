/*

 Straw - a MLTSHP Bookmarklet.
 Source: http://mltshp.com/static/straw/source.js
 Bookmarklet URL: javascript:void((function(){var%20e=document.createElement('script');e.setAttribute('type','text/javascript');e.setAttribute('charset','UTF-8');e.setAttribute('src','https://mltshp.com/static/straw/compact.js?r='+Math.random()*99999999);document.body.appendChild(e)})());
*/
(function (e) {
    if (e.MLTSHPStraw !== void 0) e.MLTSHPStraw.toggle();
    else {
        var i = (function () {
                var a = !!e.document.addEventListener;
                return {
                    bind: function (b, d, c) {
                        var e = function (a) {
                            return c.apply(b, arguments);
                        };
                        a
                            ? b.addEventListener(d, e, !1)
                            : b.attachEvent("on" + d, e);
                    },
                };
            })(),
            j = function (a, b) {
                return function () {
                    a.apply(b, arguments);
                };
            },
            k = {
                style: function (a, b) {
                    var d = null;
                    a.currentStyle
                        ? (d = a.currentStyle[b])
                        : e.getComputedStyle &&
                          (d = e.document.defaultView
                              .getComputedStyle(a, null)
                              .getPropertyValue(b));
                    return d;
                },
            },
            f = function (a, b, d) {
                this.category = a;
                this.asset = b;
                this.el = d;
            };
        f.prototype.append_root = e.document.body;
        f.prototype.position = function () {
            var a = this.el,
                b = 0,
                d = 0;
            do {
                if (k.style(a, "position") == "relative") {
                    this.append_root = a;
                    break;
                }
                b += a.offsetLeft;
                d += a.offsetTop;
            } while ((a = a.offsetParent));
            return [b, d];
        };
        f.prototype.hide = function () {
            if (this.view !== void 0) this.view.style.display = "none";
        };
        f.prototype.show = function () {
            if (this.view !== void 0) this.view.style.display = "block";
        };
        f.prototype.draw_overlay = function () {
            var a = this.position(),
                b = this.width(),
                d = this.height(),
                c = document.createElement("div"),
                e = this.append_root;
            c.className = "mltshp-sf-overlay";
            c.style.left = a[0] + "px";
            c.style.top = a[1] + "px";
            c.style.width = b - 4 + "px";
            c.style.height = d - 4 + "px";
            if (b > 300 && d > 100)
                (html = '<span class="mltshp-sf-overlay-text" style="'),
                    (html = html + "margin-top:" + (d - 45) / 2 + "px;"),
                    (html = html + "margin-left:" + (b - 240) / 2 + "px;"),
                    (html += '">Save on MLTSHP</span>'),
                    (c.innerHTML = html);
            e.appendChild(c);
            this.view = c;
            i.bind(c, "click", j(this.click_overlay, this));
        };
        f.prototype.click_overlay = function (a) {
            a.stopPropagation ? a.stopPropagation() : (a.cancelBubble = !0);
            left_location = screen.width / 2 - 450;
            top_location = screen.height / 2 - 300;
            e.open(
                "https://mltshp.com/tools/p?url=" +
                    encodeURI(this.asset) +
                    "&title=" +
                    encodeURI(e.document.title) +
                    "&source_url=" +
                    encodeURI(e.location.href),
                "save_image",
                "width=850,height=650,menubar=yes,toolbar=yes,scrollbars=yes,resizable=yes,left=" +
                    left_location +
                    ",top=" +
                    top_location +
                    "screenX=" +
                    left_location +
                    ",screenY=" +
                    top_location,
            );
        };
        f.prototype.height = function () {
            if (this._height === void 0) this._height = this.el.offsetHeight;
            return this._height;
        };
        f.prototype.width = function () {
            if (this._width === void 0) this._width = this.el.offsetWidth;
            return this._width;
        };
        var h = {
            _parse_query: function (a) {
                for (
                    var a = a.split("&"), b = a.length, d = {}, c = 0;
                    c < b;
                    c++
                ) {
                    var e = a[c].split("=");
                    d[e[0]] = e[1];
                }
                return d;
            },
            videos: function () {
                for (
                    var a = document.getElementsByTagName("embed"),
                        b = a.length,
                        d = document.getElementsByTagName("object"),
                        c = d.length,
                        e = [],
                        f = 0;
                    f < b;
                    f++
                ) {
                    var h = a[f],
                        g = h.getAttribute("flashvars");
                    g &&
                        ((g = this._parse_query(g)),
                        g.video_id &&
                            e.push({
                                el: h,
                                url:
                                    "http://www.youtube.com/watch?v=" +
                                    g.mJ1CSeNlRA4,
                            }));
                }
                for (f = 0; f < c; f++)
                    if (
                        ((a = d[f]),
                        (b = a.getAttribute("data")) &&
                            b.indexOf("vimeocdn") > 0)
                    )
                        (b = a
                            .getAttribute("id")
                            .replace("player", "")
                            .split("_")[0]),
                            e.push({ el: a, url: "http://vimeo.com/" + b });
                return e;
            },
            images: function () {
                for (
                    var a = document.getElementsByTagName("img"),
                        b = a.length,
                        d = [],
                        c = 0;
                    c < b;
                    c++
                )
                    a[c].offsetWidth < 100 ||
                        a[c].offsetHeight < 100 ||
                        d.push(a[c]);
                return d;
            },
        };
        e.MLTSHPStraw = {
            found: [],
            init: function () {
                this.initiated = !0;
                this.init_styles();
                this.find_assets();
                this.draw_overlays();
            },
            find_assets: function () {
                var a = h.images(),
                    b = a.length;
                h.videos();
                for (var d = [], c = 0; c < b; c++)
                    d.push(new f("image", a[c].src, a[c]));
                this.found = d;
            },
            init_styles: function () {
                var a = document.createElement("style");
                a.setAttribute("type", "text/css");
                a.styleSheet !== void 0
                    ? (a.styleSheet.cssText =
                          "        .mltshp-sf-overlay {font-family: Helvetica,Arial,sans-serif;position: absolute; border: 4px solid #ff0080; text-align: center; cursor: pointer; z-index: 9999999; background-image:url('.'); }        .mltshp-sf-overlay-text {display: block; float: left; background-color: #ff0080; font-size: 24px; color: #fff; padding: 10px 20px; text-shadow: 3px 3px 0px #B5005A;         -webkit-border-radius: 5px; -moz-border-radius: 5px; border-radius: 5px;         -moz-box-shadow: 4px 4px 0px rgba(0, 0, 0, 0.3); -webkit-box-shadow: 4px 4px rgba(0, 0, 0, 0.3); box-shadow: 4px 4px 0px rgba(0, 0, 0, 0.3); }        .mltshp-sf-overlay:hover { border-color: #db008b}         .mltshp-sf-overlay:hover .mltshp-sf-overlay-text { background-color: #db008b; }       ")
                    : (a.innerHTML =
                          "        .mltshp-sf-overlay {font-family: Helvetica,Arial,sans-serif;position: absolute; border: 4px solid #ff0080; text-align: center; cursor: pointer; z-index: 9999999; background-image:url('.'); }        .mltshp-sf-overlay-text {display: block; float: left; background-color: #ff0080; font-size: 24px; color: #fff; padding: 10px 20px; text-shadow: 3px 3px 0px #B5005A;         -webkit-border-radius: 5px; -moz-border-radius: 5px; border-radius: 5px;         -moz-box-shadow: 4px 4px 0px rgba(0, 0, 0, 0.3); -webkit-box-shadow: 4px 4px rgba(0, 0, 0, 0.3); box-shadow: 4px 4px 0px rgba(0, 0, 0, 0.3); }        .mltshp-sf-overlay:hover { border-color: #db008b}         .mltshp-sf-overlay:hover .mltshp-sf-overlay-text { background-color: #db008b; }       ");
                e.document.body.appendChild(a);
            },
            draw_overlays: function () {
                for (var a = 0, b = this.found.length; a < b; a++)
                    this.found[a].draw_overlay();
            },
            toggle: function () {
                if (this.initiated)
                    for (var a = 0, b = this.found.length; a < b; a++)
                        this.found[a].hide();
                else this.find_assets(), this.draw_overlays();
                this.initiated = !this.initiated;
            },
        };
        MLTSHPStraw.init();
    }
})(window);
