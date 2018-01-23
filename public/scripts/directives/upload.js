app.directive('handleUpload', ($templateRequest, $compile, $timeout, Tabs, BookStorage) => {
    return{
        restrict:'A',
        link:function (scope, elem, attrs) {
            
            var url = "scripts/templates/upload.html";
            var el = elem[0];
            
            scope.uploadBooks = {};
            scope.updloadActive = false;
            
            scope.$watch("uploadBooks", function (newVal, oldVal) {
                scope.updloadActive = Object.keys(scope.uploadBooks).length != 0;
            }, true);
            
            $templateRequest(url).then(function (html) {
                var template = html;
                 // Convert the html to an actual DOM node
                var template = angular.element(html);
                // Append it to the directive element
                elem.append(template);
                // And let Angular $compile it
                $compile(template)(scope);
            });
            
            var Upload = function (file) {
                scope.updloadActive = true;
                
                var resultFn = function (message) {
                    var obj = scope.uploadBooks[file.name];
                    obj["Message"] = message;
                    obj["Loading"] = false;
                    
                    $timeout(function(){
                        delete scope.uploadBooks[file.name];
                    },3000);
                    scope.$emit("books:reload"); 
                }

                var fileReader = new FileReader();
                fileReader.onload = function (evt) {
                    var content = evt.target.result;
                    
                    var book = {
                        Title:file.name,
                        Content: content,
                        FileRef: file,
                        CurrentPage:1
                    };

                    BookStorage.cacheFromUpload(book).then(function(){
                        Tabs.create(book);
                    });

                    BookStorage.add(book).then(function (res) {
                        resultFn(res.data);
                    },function (err) {
                        resultFn("An Error occured. Please, try againd later");
                    });
                };
                
                fileReader.readAsDataURL(file);
                
                scope.uploadBooks[file.name] = {
                    "Message":"Uploading file...",
                    "Loading":true
                };
            }
            
            el.addEventListener("dragover", (e) => {
                e.stopPropagation();
                e.preventDefault();
                e.dataTransfer.dropEffect = 'copy';
            });

            el.addEventListener("drop", (e) => {
                e.preventDefault();
                
                for (var i = 0; i < e.dataTransfer.files.length; i++) {
                    var file = e.dataTransfer.files[i];
                    var upload = new Upload(file);
                }
                
            });
        }
    }
});