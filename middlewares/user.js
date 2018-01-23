const models = require("../models");
const uuidV4 = require("uuid/v4");

var defineUser = function (req, res, next) {

    console.log(`${req.method} ${req.url}`);
    next();

    // var currentUserId = req.params.userId || (req.currentUser && req.currentUser.id);

    // if(!currentUserId){
    //     console.log("No user found. Creating one...");
    //     currentUserId = uuidV4();
    // }

    

    //     req.currentUser = {
    //         id: user.id,
    //         username: user.username
    //     };     

    //     console.log(`Current User: ${JSON.stringify(req.currentUser)}`);
    //     console.log(`${req.method} ${req.url}`);


    //     next();   
    // });
}

module.exports = defineUser;