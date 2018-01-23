"use strict"

var fs = require("fs");
var path = require("path");
var Sequelize = require("sequelize");
var env = process.env.NODE_ENV || "development";

const connString = process.env.DATABASE_URL || require(path.join(__dirname,'..','config','config.json'))[env];

var sequelize = new Sequelize(connString);

var db = {};

fs.readdirSync(__dirname)
.filter((file) => {
    return (file.indexOf('.') !== 0) && (file !== "index.js");
})
.forEach((file) =>{
    var model = sequelize.import(path.join(__dirname, file));
    db[model.name] = model;
});

Object.keys(db).forEach((modelName) =>{
    if("associate" in db[modelName]){
        db[modelName].associate(db);
    }
});


db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;