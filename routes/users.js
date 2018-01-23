const express = require("express");
const cuid = require("cuid");
const models = require("../models");
const bookRoute = require('./books')

var router = express.Router({mergeParams:true});

function allUsers(req, res){
    models.User.findAll().then((users) => {
        res.json(users);
    }); 
}

function getPageId(req, res) {
    var userId = req.params.userId;
    
    if(!userId){
        res.redirect(`/${cuid()}`)
    }else{
        models.User.findOrCreate({
            where:{id: userId},
            defaults:{id:userId, username: "Anon"}
        }).spread((user, created) =>{
            res.render("index", {
                user:{
                    userId:user.id,
                    username:user.username
                }
            });
        });
    }
}

// router.get('/all', allUsers);
router.use("/books", bookRoute);
router.get("/", getPageId);


module.exports = router;