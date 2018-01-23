

var BookmarkApi = function (statusFunction) {
    var setStatus = function (status) {
        if (statusFunction)
            statusFunction(status);
    };

    this.AddOrUpdateBookmark = function (currentTitle, currentUrl) {

        setStatus("Creating Bookmark...");

        function getUpdatedTitle() {
            
        }

        function getUpdatedUrl() {

            var regexCurrentPage = /[0-9]+$/;
            var page = regexCurrentPage.exec(currentUrl);
            if (!page)
                page = '';

            currentUrl = currentUrl.replace(/#.*/, '');

            var currentPage = prompt("Insert current page: (Leave empty for none...)", page);
            
            if (!currentPage)
                return currentUrl

            return `${currentUrl}#page=${currentPage}`;
        }

        function search(found, notFount) {
            chrome.bookmarks.search({ title: currentTitle },(results) => {
                setStatus(`Total items found: '${results.length}'`);

                if (results.length == 0) {
                    setStatus("No items found");
                    notFount();
                    return;
                }

                if (results.length > 1) {
                    setStatus("More than one item found. Selecting First...");
                }

                var res = results[0]
                found(res.id);
            });
        }

        function create() {
            setStatus("Creating Bookmark..");
            chrome.bookmarks.create({
                'parentId': "1",
                'title': currentTitle,
                'url': getUpdatedUrl()
            });
            setStatus("Bookmark createad!");
        }

        function update(itemId) {
            setStatus("Updating Bookmark..");
            chrome.bookmarks.update(itemId, {
                url: getUpdatedUrl()
            })
            setStatus("Bookmark Updated!");
        }

        function createOrUpdate() {
            search(
                (itemId) => {
                    update(itemId)
                }, () => {
                    create();
                })
        };

        createOrUpdate();
    }
};

var TabsApi = function (statusFunction) {
    var setStatus = function (status) {
        if (statusFunction)
            statusFunction(status);
    };

    this.GetCurrentTab = function (callback) {
        var query = {
            active: true,
            currentWindow: true
        }

        setStatus("Getting current tab...")

        chrome.tabs.query(query, (tabs) => {
            var tab = tabs[0];
            var currentUrl = tab.url
            var title = tab.title;

            setStatus(`Got Current Tab! '${title}'`)

            if (callback)
                callback({ title: title, url: currentUrl });
        });
    }
}

var App = function () {

    function setStatus(status) {
        var statusList = document.getElementById("status");

        var li = document.createElement("li");
        li.textContent = status;

        statusList.appendChild(li);
    }

    var bookmarkApi = new BookmarkApi(setStatus);
    var tabsApi = new TabsApi(setStatus);

    return {
        Init: function () {
            tabsApi.GetCurrentTab((res) => {
                bookmarkApi.AddOrUpdateBookmark(decodeURIComponent(res.title), res.url);
            });
        }
    }
}();

// document.addEventListener("DOMContentLoaded", function () {
//     App.Init();
// });