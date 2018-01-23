app.factory("Tabs", function ($log, BookStorage, IndexedStorage, User) {

    function createUrl(blob, book){
        var url =  `/pdf/web/viewer.html?file=${URL.createObjectURL(blob)}&t=${book.Title}&u=${User.get()}#page=${book.CurrentPage}&zoom=180`;
        window.open(url, '_blank');
    }

    return {
        create: function (book) {
            IndexedStorage.get(book.Title)
            .then(function(blob){
                    createUrl(blob, book)
                },
                function(err){
                    var bookUrl = `${User.getRouteUrl("books")}/${book.Title}`;
                    BookStorage.cacheFromUrl(bookUrl, book).then(function(blob){
                        createUrl(blob, book);
                    })
                })
        },
    }
})