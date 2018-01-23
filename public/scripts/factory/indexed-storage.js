app.factory("IndexedStorage", function($q) {
   
    window.db = new PouchDB('dbPdfPages');
    
    db.changes().on('change', function() {
        console.log('Ch-Ch-Changes');
    });

    var startkey = "book_";
    
    return {
        all:function(){
            return $q.when(db.allDocs({startkey:startkey}));
        },
        get:function(title){
            var encodedTitle = encodeURIComponent(title);
            return $q.when(db.getAttachment(startkey + encodedTitle,  encodedTitle));
        },
        add:function(book){
            var encodedTitle = encodeURIComponent(book.Title);
            return $q.when(db.putAttachment(
                startkey + encodedTitle,
                encodedTitle,
                book.FileRef,
                book.FileRef.type));
        }
    }
});