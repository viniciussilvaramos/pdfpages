app.factory("BookStorage", function($http, $log, IndexedStorage, User){
    
    var routeUrl = function (method) {
        return User.getRouteUrl("books", method);
    }
    
    return {
        cacheFromUpload:function(book){
            return IndexedStorage.add(book)
        },
        cacheFromUrl:function(bookUrl, book){
            $log.log("Caching: " + bookUrl);
            return $http.get(bookUrl,{responseType:'arraybuffer'}).then(function(response){
                return IndexedStorage.add({
                    Title:book.Title,
                    FileRef: new Blob ([response.data],{type : 'application/pdf'})
                }).then(
                    function(){
                        return IndexedStorage.get(book.Title);
                    }, function(err){
                        $log.log(err);
                        return {res:"Error", message:"Could not cache this book. See console to details."};
                    });
            });            
        },
        all:function(){
            return $http.get(routeUrl());
        },
        add:function (book) {
            return $http.post(routeUrl("add"), book);
        },
        update:function(book){
            return $http.post(routeUrl("update"), book);
        },
        remove:function (book, callback) {
            // LocalStorage.remove(book.Id,()=>{
            //     if(callback)
            //         callback();
            // });
        } 
    }
})