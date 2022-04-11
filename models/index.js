const dbConfig = require("../config/db_config.js");
const user=require("./user.js");
const post=require("./posts.js");

const comment = require("./comments");
const like = require("./likes");

const Sequelize = require("sequelize");




const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorsAliases: false,
  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle,
  },
});
const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.users=user(sequelize,Sequelize)
db.posts=post(sequelize,Sequelize)
db.comments=comment(sequelize,Sequelize)
db.likes = like(sequelize, Sequelize);

db.users.hasMany(db.posts,{as:"posts"});
db.posts.hasMany(db.comments,{as:"comments"});
db.posts.hasMany(db.likes,{as:"likes"});
db.users.hasMany(db.comments,{as:"comments"});
db.users.hasMany(db.likes,{as:"likes"});
db.posts.belongsTo(db.users,{as:"user",foreignKey:"userId"});
db.comments.belongsTo(db.posts,{as:"post",foreignKey:"postId"});
db.likes.belongsTo(db.posts,{as:"post",foreignKey:"postId"});
db.likes.belongsTo(db.users,{as:"user",foreignKey:"userId"});
db.comments.belongsTo(db.users,{as:"user",foreignKey:"userId"});

module.exports = db;
