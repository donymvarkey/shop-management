
const dotenv = require('dotenv');
dotenv.config({path: __dirname + '/.env'})
const ShopServer = require('./src/ShopManagementServer');

const options ={
    secret: process.env.secret,
    port : process.env.PORT,
    mongodb: {
        uri : process.env.MONGO_URL || "mongodb+srv://admin:cbDFpDGjUcFcw4lO@cluster0.pambb.mongodb.net/shop-inventory?retryWrites=true&w=majority"
    },
}

app = new ShopServer(options);

app.startServer();
