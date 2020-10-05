
const dotenv = require('dotenv');
dotenv.config({path: __dirname + '/.env'})
const ShopServer = require('./src/ShopManagementServer');

const options ={
    secret: process.env.secret,
    port : process.env.PORT,
    mongodb: {
        uri : process.env.MONGO_URL 
    },
}

app = new ShopServer(options);

app.startServer();
