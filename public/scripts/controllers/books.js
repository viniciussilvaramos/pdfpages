app.controller("BookController", function ($scope, $window, BookStorage) {

   function loadBooks(){
      BookStorage.all().then(function (response){
         $scope.books = response.data;
      });
   }
   
   function reload() {
      $scope.showList = true; 
      loadBooks(); 
   }
   
   function hideBooks() {
      $scope.showList = false;
   }
   
   function showForm(evt, book) {
      $scope.showForm = true;
      $scope.book = book;
      $scope.$emit("books:hideBooks");
   }

   $window.onfocus = function(){
       $scope.$emit("books:reload");
   }
   
            
   $scope.$on("books:showForm", showForm);
   $scope.$on("books:showBooks", reload);
   $scope.$on("books:reload", loadBooks);
   $scope.$on("books:hideBooks", hideBooks);
   
   $scope.$emit("books:showBooks");
});