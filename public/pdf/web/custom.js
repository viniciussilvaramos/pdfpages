(function () {
    
    function extractFromQueryString(param) {
        var re = new RegExp("[?&]" + param + "=([^&#]*)","i");
        var results = re.exec(document.location.search);
        return results.length == 2 ? results[1] : "";
    }
    
    function getUserAndBookTitle(param) {
        return {
            UserId:extractFromQueryString("u"),
            Title:decodeURI(extractFromQueryString("t"))
        };
    }
    
    function Monitor() {
        var currentPage = -1;
        var bookId = -1;
        var pdfApp = null;
        var interval = null;
        
        function Interval(time, callback, shouldStop) {
        
            var cancelInterval = function () {
                clearInterval(interval);
            }
            
            var interval = null;
            
            this.stop = function() {
                cancelInterval();
            }
            
            this.start = function () {
                interval = setInterval(function() {
                    if(shouldStop && shouldStop()){
                        cancelInterval();
                        return;
                    }
                
                    callback();
                }, time);
            }
        }
        
        function TheCall(isPostType, url, success, error, postParams) {
            var xmlhttp = new XMLHttpRequest();
            var requestType = isPostType ? "POST":"GET";
            
            
            xmlhttp.onreadystatechange = function () {
                if(xmlhttp.readyState == 4 && xmlhttp.status == 200){
                    success();
                }else{
                    // error();
                }
            }

            xmlhttp.open(requestType,url,true);
            xmlhttp.setRequestHeader("Accept","application/json, text/plain, */*");
            xmlhttp.setRequestHeader("Accept-Language","pt-BR,pt;q=0.8,en-US;q=0.6,en;q=0.4");
            xmlhttp.setRequestHeader("Content-Type","application/json;charset=UTF-8");
            
            
            if(isPostType){
                xmlhttp.send(JSON.stringify(postParams));
            }else{
                xmlhttp.send();
            }
        }
        
        function executeMonitor() {
            try{
                var pdfApp = window.PDFViewerApplication;
                
                if(!pdfApp || (pdfApp && !pdfApp.isInitialViewSet))
                    return;
                
                if(pdfApp.page != currentPage){
                    currentPage = pdfApp.page;
                    makeTheCall();
                }
            }catch(err){
                interval.stop();
                console.log("An Error occured!");
                console.log(err);
            }
        }
        
        function getUpdateObject() {
            var bookInfo = getUserAndBookTitle();
            bookInfo.CurrentPage = currentPage;
            return bookInfo;
        }
        
        function makeTheCall(){
            if(currentPage < 1)   
                return;
            
            var upObject = getUpdateObject();

            function successCase(){
                console.log("Done update.");
            }
            
            function errorCase() {
                console.log("some error ocurred and the monitor stopped.")
                interval.stop();
            }
            
            new TheCall(true, "/" + upObject.UserId +"/books/update",successCase, errorCase, upObject);
        }
        
        this.start = function () {
            interval = new Interval(500,executeMonitor);
            interval.start();
        }
    }
    
    var monitor = new Monitor();
    monitor.start();
})()