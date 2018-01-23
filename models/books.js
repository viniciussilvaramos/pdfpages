"use strict"

module.exports = function(sequelize, DataTypes){
    var Book = sequelize.define("Book",{
        Title:{
            type:DataTypes.STRING,
            allowNull: false
        },
        Content:{
            type:DataTypes.TEXT,
            allowNull: false
        },
        CurrentPage:{
            type:DataTypes.INTEGER,
            allowNull: false
        }
    },{
        classMethods:{
            associate:function(models){
                Book.belongsTo(models.User,{
                    onDelete:"CASCADE",
                    foreignKey:{
                        allowNull: false
                    }
                });
            },
            updateIt:function (userId, book) {
                return Book.update({
                    CurrentPage:book.CurrentPage
                },{
                    where:{
                        Title:book.Title,
                        UserId:userId
                    }
                });
            },
            add:function(userId, book){
                return Book.findOrCreate({
                    where:{
                        Title:book.Title,
                        UserId:userId
                    },
                    defaults:{
                        Title:book.Title,
                        Content:book.Content,
                        CurrentPage:book.CurrentPage,
                        UserId:userId
                    }
                }).spread((book, created) => {
                    
                    const res = {};
                    
                    if(!created)
                        return `Already created.`;
                        
                    return `Created successfully!`;
                });
            },
            list:function (userId) {
                return Book.findAll({
                    attributes:["id","Title","CurrentPage"],
                    order:[["updatedAt","DESC"]],
                    where:{UserId:userId}
                });
            },
            getByTitle:function (userId, title) {
                return Book.findOne({
                    where:{
                        Title:title,
                        UserId: userId
                    },
                    attributes:["Title", "Content"]
                })
            }
        }
    });
    
    return Book;
};