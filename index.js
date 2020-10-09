
const dotenv = require('dotenv');
dotenv.config({path: __dirname + '/.env'})
const ShopServer = require('./src/ShopManagementServer');

const options ={
    secret: process.env.secret,
    port : process.env.PORT,
    mongodb: {
        uri : process.env.MONGO_URL || "mongodb+srv://admin:9rM8vZCxFDoyCX3n@cluster0.3to02.mongodb.net/shop-mgmt?retryWrites=true&w=majority"
    },
}

app = new ShopServer(options);

app.startServer();
