const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const UserRouter = require('./routers/UserRoute');
const InventoryRouter = require('./routers/InventoryRoute');

const cors = require('cors');

class SwapiServer{
    /**
     * @constructor
     * @param options  thsocket of the app
     */
    constructor(options){

        this.options = options;

        //for general http server
        this.api = null;
    }

    /**
     * @configServer
     * used to initialise the api attribute with an object of express
     */
    async configServer(){

        var api = express();

        api.use(bodyParser.urlencoded({limit: '10mb', extended: true}));
        api.use(bodyParser.json({limit: '10mb', extended: true}));
        api.use(cors()); //allow cross domain requesting of urls

        //url to check health of server
        api.use('/health',function(req,res){

            res.json({
                health : true
            });

        });
        //ignore this route
        api.use('/s',express.static('./src/public'))
        api.set('x-powered-by',false);
        api.set('secret',this.options.secret);

        this.api     = api;

        return true;
    }

    async mountRoutes(){

        this.api.use(UserRouter);
        this.api.use(InventoryRouter)
        return true;
    }
    /**
     * @startServer
     * start the server on the specifed port in the options
     */
    async startServer(){
        //set server congiurations and database
        await mongoose.connect(this.options.mongodb.uri,{
            useCreateIndex: true,
            useNewUrlParser: true,
            useFindAndModify: false,
            useUnifiedTopology: true
        });

        mongoose.Promise = global.Promise;
        var serverConfigStatus = await this.configServer();

        if(serverConfigStatus !== true){
            console.log("FATAL: Failed to configure server")
            return false;
        }

        await this.mountRoutes();

        // start the server
        this.api.listen( this.options.port,() =>{
            console.log("INFO: Server Started.");
            console.log("INFO: Listening on "+this.options.port);
        });
    }

}

module.exports = SwapiServer;
