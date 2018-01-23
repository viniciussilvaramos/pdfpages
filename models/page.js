'use strict'

module.exports = function(sequelize, DataTypes){
    var Page = sequelize.define("User", {
        username: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        id:{
            type: DataTypes.STRING,
            primaryKey: true
        }
    },{
        classMethods: {
            associate:function(models){
                Page.hasMany(models.Book)
            }
        }
    });

    return Page;
}