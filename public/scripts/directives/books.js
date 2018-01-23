app.directive("bookList", function($timeout, Tabs, BookStorage){
    return {
        templateUrl:"scripts/templates/books.html",
        link:function(scope, elem, attr){

            function atualizarTela(){
                $timeout(function () {
                var elem = document.querySelector('.row.book-container');
                    var msnry = new Masonry(elem, {
                        itemSelector: '.col',
                        // columnWidth: 50
                        columnWidth: '.col',
                        percentPosition: true
                    });
                },100);
            }

            scope.editForm = function(book){
                scope.$emit("books:showForm",book);
                scope.$emit("books:hideBooks");
            }
            
            scope.remove = function(book){
                BookStorage.remove(book, function (){
                    scope.$emit("books:showBooks");
                });
            }
            
            scope.openBook = function (book) {
                Tabs.create(book);
            }
            
            scope.$watch("books", function (newValue, oldValue) {
                scope.books = newValue;
                scope.showList = true;
                atualizarTela();
            });
        }
    }
});