var WidgetMobileSelector = (function () {
    function WidgetMobileSelector(opts) {
        this._lang = "en-us";
        this.langList = {
            "en-us": {
                "cancel": "Cancel",
                "ok": "OK"
            },
            "zh-cn": {
                "cancel": "取消",
                "ok": "确定"
            },
            "zh-tw": {
                "cancel": "取消",
                "ok": "確認"
            }
        };
        this._title = "Selector";
        this.onSelect = function () { };
        var dom = $("<div class=\"widgetMobileSelector\">\n            <div class=\"widgetMobileSelectorBody\">\n                <div class=\"widgetMobileSelectorTitle\">\n                    <div class=\"widgetMobileSelectorLeft\">Cancel</div>\n                    <div class=\"widgetMobileSelectorText\">Selector</div>\n                    <div class=\"widgetMobileSelectorRight\">OK</div>\n                </div>\n                <div class=\"widgetMobileSelectorContent\">\n                    <div class=\"widgetMobileSelectorList\">\n                        <div class=\"widgetMobileSelectorBlank\"></div>\n                    </div>\n                    <div class=\"widgetMobileSelectorList\" style=\"display: none;\"></div>\n                    <div class=\"widgetMobileSelectorList\" style=\"display: none;\"></div>\n                    <div class=\"widgetMobileSelectorTop\"></div>\n                    <div class=\"widgetMobileSelectorBottom\"></div>\n                </div>\n            </div>\n        </div>");
        dom.on("touchstart", (function (e) {
            if ($(e.target).hasClass("widgetMobileSelector"))
                this.hide();
        }).bind(this));
        dom.find(".widgetMobileSelectorLeft").on("touchstart", (function () {
            this.hide();
        }).bind(this));
        dom.find(".widgetMobileSelectorRight").on("touchstart", (function () {
            var list = [];
            dom.find(".widgetMobileSelectorSelected").each(function (i, item) {
                var itemDom = $(item);
                list.push({
                    text: itemDom.text(),
                    value: itemDom.attr("value")
                });
            });
            if (this.onSelect(list) !== false)
                this.hide();
        }).bind(this));
        $("body").append(dom);
        var listDom1 = dom.find(".widgetMobileSelectorList:eq(0)");
        var i = 0;
        for (var _i = 0, _a = opts.data; _i < _a.length; _i++) {
            var item = _a[_i];
            if (item.value === undefined)
                item.value = item.text;
            var itemDom = $("<div class=\"widgetMobileSelectorItem\" value=\"" + item.value + "\">" + item.text + "</div>").appendTo(listDom1);
            itemDom.data("data", item.data ? item.data : {});
            if (i === 0) {
                itemDom.addClass("widgetMobileSelectorSelected");
                if (item.data)
                    this.activeItem(itemDom);
            }
            ++i;
        }
        listDom1.append("<div class=\"widgetMobileSelectorBlank\"></div>");
        var listDom = dom.find(".widgetMobileSelectorList");
        listDom.on("touchstart", (function (e) {
            var thisListDom = $(e.currentTarget);
            $("body").on("touchend.widgetMobileSelector", (function () {
                $("body").off("touchend.widgetMobileSelector");
                var onScrollEnd = (function () {
                    thisListDom.off("scroll");
                    var index = Math.round(thisListDom.scrollTop() / 50);
                    thisListDom.animate({
                        "scrollTop": index * 50 + "px"
                    }, 50);
                    thisListDom.children(".widgetMobileSelectorItem:eq(" + index + ")").addClass("widgetMobileSelectorSelected").siblings(".widgetMobileSelectorSelected").removeClass("widgetMobileSelectorSelected");
                    this.activeItem(thisListDom.children(".widgetMobileSelectorSelected"));
                }).bind(this);
                var scrolling = setTimeout(onScrollEnd, 50);
                thisListDom.on("scroll", (function () {
                    clearTimeout(scrolling);
                    scrolling = setTimeout(onScrollEnd, 50);
                }).bind(this));
            }).bind(this));
        }).bind(this));
        this.dom = dom;
        if (opts.lang) {
            this.lang = opts.lang;
        }
        if (opts.title) {
            this.title = opts.title;
        }
    }
    Object.defineProperty(WidgetMobileSelector.prototype, "lang", {
        get: function () {
            return this._lang;
        },
        set: function (val) {
            if (val !== this._lang) {
                if (this.langList[val]) {
                    this._lang = val;
                    this.dom.find(".widgetMobileSelectorLeft").text(this.langList[val]["cancel"]);
                    this.dom.find(".widgetMobileSelectorRight").text(this.langList[val]["ok"]);
                }
                else {
                    alert("Error: langList[" + val + "] not found!");
                }
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WidgetMobileSelector.prototype, "title", {
        get: function () {
            return this._title;
        },
        set: function (val) {
            if (val !== this._title) {
                this._title = val;
                this.dom.find(".widgetMobileSelectorText").text(val);
            }
        },
        enumerable: true,
        configurable: true
    });
    WidgetMobileSelector.prototype.show = function () {
        this.dom.addClass("widgetMobileSelectorShow");
    };
    WidgetMobileSelector.prototype.hide = function () {
        this.dom.removeClass("widgetMobileSelectorShow");
    };
    WidgetMobileSelector.prototype.activeItem = function (dom) {
        var data = dom.data("data");
        var thisListDom = dom.parents(".widgetMobileSelectorList:eq(0)");
        if (data.length > 0) {
            var nextListDom = thisListDom.next();
            if (thisListDom.hasClass("widgetMobileSelectorList")) {
                nextListDom = thisListDom.next();
                nextListDom.html("<div class=\"widgetMobileSelectorBlank\"></div>").removeAttr("style");
                var i = 0;
                for (var _i = 0, data_1 = data; _i < data_1.length; _i++) {
                    var item = data_1[_i];
                    if (item.value === undefined)
                        item.value = item.text;
                    var itemDom = $("<div class=\"widgetMobileSelectorItem\" value=\"" + item.value + "\">" + item.text + "</div>").appendTo(nextListDom);
                    itemDom.data("data", item.data ? item.data : {});
                    if (i === 0) {
                        itemDom.addClass("widgetMobileSelectorSelected");
                        if (item.data)
                            this.activeItem(itemDom);
                    }
                    ++i;
                }
                nextListDom.append("<div class=\"widgetMobileSelectorBlank\"></div>");
                nextListDom.scrollTop(0);
            }
            else {
                alert("Error: max 3!");
            }
        }
    };
    WidgetMobileSelector.verison = "0.1";
    return WidgetMobileSelector;
}());
$("head:eq(0)").prepend("<style>\n.widgetMobileSelector{position: fixed; left: 0; top: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, .1); font-size: 14px; z-index: 1000; display: none;}\n.widgetMobileSelectorShow{display: block;}\n.widgetMobileSelectorBody{height: 300px; background-color: #f9f9f9; position: absolute; width: 100%; left: 0; bottom: 0;}\n.widgetMobileSelectorTitle{box-sizing: border-box; border-top: 1px solid #cacaca; display: -webkit-box;}\n.widgetMobileSelectorTitle > div{height: 50px; line-height: 50px;}\n.widgetMobileSelectorText{text-align: center; -webkit-box-flex: 2; font-size: 18px; width: 0;}\n.widgetMobileSelectorLeft,.widgetMobileSelectorRight{text-align: center; -webkit-box-flex: 1; width: 0;}\n.widgetMobileSelectorContent{box-sizing: border-box; border-top: 1px solid #e1e5e7; position: relative; background-color: #FFF; display: -webkit-box;}\n.widgetMobileSelectorList{overflow: scroll; height: 250px; -webkit-box-flex: 1; width: 0;}\n.widgetMobileSelectorItem{height: 50px; line-height: 50px; text-align: center;}\n.widgetMobileSelectorBlank{height: 100px;}\n.widgetMobileSelectorTop,.widgetMobileSelectorBottom{height: 100px; background-color: rgba(255,255,255,.7); position: absolute; left: 0; width: 100%; pointer-events: none; box-sizing: border-box;}\n.widgetMobileSelectorTop{top: 0; border-bottom: 1px solid #e1e5e7;}\n.widgetMobileSelectorBottom{bottom: 0; border-top: 1px solid #e1e5e7;}\n</style>");
//# sourceMappingURL=selector.js.map