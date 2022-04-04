const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;
let dbName = "authentication";
let dbUrl = `mongodb+srv://sindhu:Gpy6tX9ypFAYi7d4@cluster0.sxgpu.mongodb.net/test/${dbName}`;
module.exports ={mongodb, MongoClient, dbUrl}
