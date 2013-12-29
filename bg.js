var imgs = ["jpg", "jpeg", "png"];
var cache = [];

function parentHref(href) {
    var urlSets = href.split("/");
    var len = urlSets.length;
    var fileName = urlSets[len - 1].split(".");
    if (imgs.indexOf(fileName[1]) > 0) {
        urlSets.pop();
        urlSets.forEach(function(value, index, arr) {
            arr[index] = value + "/";
        });
        return urlSets.join("");
    }

    return false;
}

function searchHistory() {
    chrome.history.search({
        "text": "",
        "maxResults": 5
    }, function(arr) {
        console.log(arr);
    })
}


function responseMsg() {
    chrome.runtime.onMessage.addListener(function(request, sender, response) {
        var url = sender.tab && sender.tab.url;
        var origin = "bbb";
        if (url && cache.length > 0) {
            for (var i = 0; i < cache.length; i++) {
                item = cache[i];
                if (item.to === url) {
                    origin = item.origin;
                    cache.splice(i, 1);
                    break;
                }
            }
        }
        searchHistory();
        response({
            "origin": origin
        });
    })
}

chrome.runtime.onMessage.addListener(function(request, sender, response) {
    var url = sender.tab && sender.tab.url;
    var origin = "bbb";
    if (url && cache.length > 0) {
        for (var i = 0; i < cache.length; i++) {
            item = cache[i];
            if (item.to === url) {
                origin = item.origin;
                cache.splice(i, 1);
                break;
            }
        }
    }

    response({
        originURL: origin
    });
})

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    if (changeInfo.status === "loading") {
        var regExp = /^file:\/\/\/./;
        var href = tab.url;
        var hrefSet = href.split(".");
        var suffix = hrefSet[hrefSet.length - 1];

        if (regExp.test(tab.url) && imgs.indexOf(suffix) > 0) {
            var pHref = parentHref(href);
            cache.push({
                "origin": href,
                "to": pHref
            });

            chrome.tabs.update(tabId, {
                "url": pHref
            })

        } else if (regExp.test(tab.url)) {
            chrome.tabs.executeScript(tabId, {
                file: "content.js",
                runAt: "document_start"
            });
        }

        //responseMsg();
    }
})