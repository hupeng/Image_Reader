var imgs = ["jpg", "jpeg", "png"];
var href = window.location.href;
var imgFileSet = [];

function parentHref() {
    var href = window.location.href;
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

function createImgNode(src) {
    var htmlArr = [];
    htmlArr.push("<div id='imgWrap'>");
    htmlArr.push("<img id='Judy' src='" + src + "'/>");
    htmlArr.push("</div>")

    return htmlArr.join("");
}

function createIframe(src) {

}

function parserDomForImg() {
    var files = document.querySelectorAll("a.file");
    files.forEach(function(file, index, arr) {
        var fileName = file.innerHTML;
        var regExp = /^.+\.(.+)/;
        var match = regExp.exec(fileName);

        if (match) {
            if (imgs.indexOf(match[1]) > 0) {
                var fileNodeParent = file.parentNode;
                var fileSizeNode = fileNodeParent.nextElementSubling;
                var fileModifyNode = fileSizeNode.nextElementSubling;

                var imgFile = {
                    "name": fileName,
                    "size": fileSizeNode.innerHTML,
                    "modify": fileModifyNode.innerHTML
                };

                imgFileSet.push(imgFile);
            }
        }
    })
}

function hiddenOriginDom(){
    var header = document.querySelector("#header");
    var table = document.querySelector("#table");

    header.style.display = "none";
    table.style.display = "none";
}

function searchHistory() {
    chrome.history.search({
        "text": "",
        "maxResults": 5
    }, function(arr) {
        if (arr.length > 0) {
            for (var i = 0; i < arr.length; i++) {
                if (arr[i].url.indexOf(href) > 0 && arr[i].url != href) {
                    var imgNode = createImgNode(arr[i].url);
                    document.body.appendChild(imgNode);
                    break;
                }
            }
        }
    })
}

function sendMessage() {
    var hrefSet = href.split(".");
    var len = hrefSet.length;
    if (imgs.indexOf(hrefSet[len - 1]) < 0) {
        chrome.runtime.sendMessage({
            a: "11"
        }, function(response) {
            var originURL = response.originURL;
            if (originURL) {
                hiddenOriginDom();
                var imgNode = createImgNode(originURL);
                document.body.innerHTML += imgNode;
                
            }
        })
    }
}

sendMessage();
