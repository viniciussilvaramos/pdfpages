app.factory("LocalStorage",function($q){

    return{
        getWithKeyBegin:function (keyBegin) {
            return $q(function (resolve, reject) {
                var books = [];
                var regex = new RegExp("^"+keyBegin)
                for(var key in localStorage){
                    if(regex.test(key)){
                        books.push(JSON.parse(localStorage[key]));
                    }
                }
                
                resolve(books);
            });
        },
        get:function(key){
            return $q(function(resolve, reject) {
                var res = localStorage.getItem(key)
                if (res)
                    res = JSON.parse(res);
                    
                resolve(res);
            });
        },
        set:function(key, value){
            return $q(function(resolve, reject) {
                localStorage[key] = JSON.stringify(value);
                resolve();
            });
        },
        remove:function (key) {
            return $q(function(resolve, reject) {
                localStorage.removeItem(key);
                resolve();
            });
        }
    }
});