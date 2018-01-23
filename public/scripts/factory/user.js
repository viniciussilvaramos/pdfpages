app.factory("User", function ($http) {
    
    var currentUser = null;
    var userRoute = "";
    
    return {
        get:function () {
            var userId = document.querySelector("#userId").value;
            return userId;
        },
        getRouteUrl:function (action, method) {
            
            var userId = this.get();
            
            var url = userRoute + '/' + userId + '/' + action;    
            
            if(method)
                url += ('/' + method);
        
            return url;
        }
    }
})