app.directive("addBookForms", (BookStorage) => {
    return {
        templateUrl: "scripts/templates/form.html",
        link: function (scope, elem, attr) {

            var reset = function () {
                scope.$emit("books:showBooks");
                scope.$emit("books:hideForm");
            }

            scope.save = function () {
                BookStorage.update(scope.book).then(() => {
                    scope.book = {};
                    reset();
                });
            }

            scope.cancel = function () {
                reset();
            }
        }
    }
});