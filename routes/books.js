const models = require("../models");
const express = require("express");
var router = express.Router({mergeParams:true});


function listBooksFromUser(req, res) {
    models.Book.list(req.params.userId).then((books)=>{
        res.json(books);
    });
}

function updateBook(req, res) {
    var book = {
        // id:req.body.id,
        Title:req.body.Title,
        CurrentPage:req.body.CurrentPage
    }
    
    console.log(`Update the following book: ${JSON.stringify(book)}`);

    models.Book.updateIt(req.params.userId,book).then((msg)=>{
        res.send(msg);
    })
}

function addBook(req, res) {
    var re = new RegExp("^data.*?,")

    var book = {
        Title:req.body.Title,
        Content: req.body.Content.replace(re, ''),
        CurrentPage:req.body.CurrentPage
    }
    
    models.Book.add(req.params.userId, book).then((msg)=>{
        res.send(msg);
    })
}

function getBookByTitle(req, res) {
    models.Book.getByTitle(req.params.userId, req.params.title)
    .then((item)=>{
        var book = new Buffer(item.Content, 'base64');

        res.writeHead(200,{
            'Content-Type':'application/pdf',
            'Content-Length': book.length,
            
            //inline: Will open in brownser
            //attachment: Will force download
            'Content-Disposition': `inline; filename="${item.Title}"`
        });
        
        res.end(book);
    })
}

router.get("/", listBooksFromUser);
router.get("/:title", getBookByTitle);
router.post("/update", updateBook);
router.post("/add", addBook);

module.exports = router;