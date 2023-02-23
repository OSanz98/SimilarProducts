const mongoose = require('mongoose');
const env = require('dotenv').config();

mongoose.Promise = global.Promise;

const mongoUri = `mongodb://${process.env.DBNAME}:${process.env.DBKEY}@${process.env.DBNAME}.mongo.cosmos.azure.com:${process.env.DBPORT}/${process.env.DBNAME}?ssl=true&replicaSet=globaldb&retrywrites=false&maxIdleTimeMS=120000&appName=@${process.env.DBNAME}@`;

function connect(){
    return mongoose.connect(mongoUri, { auth:{ username: process.env.DBNAME, password: process.env.DBKEY }, useNewUrlParser: true });
}

module.exports = {
    connect,
    mongoose
}