/*
 * REST API : Node Server
 * Author - Rajendra Mudale
 */

 /*
  * Initialise/Import Node modules
  */
var express = require('express'),
	orders = require('./routes/orders'),
	inventory = require('./routes/additems');

var app = express();

app.configure(function () {
    app.use(express.logger('dev'));    /* 'default', 'short', 'tiny', 'dev' */
    app.use(express.bodyParser());
});

/*
 * Add CORS headers
 */
app.use(function (req, res, next) {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    next();
});

app.use(express.bodyParser());

/*
 * Retuns list of menus
 * @JSON Object
 */ 
app.get('/menu', orders.menu);


/*
 * @Json Object
 * Creates an order
 * @returs success
 */ 
app.post('/placeOrder', orders.placeOrder);

/*
 * List All Orders 
 * @return Orders list
 */ 
app.get('/getOrders', orders.findAllOrders);

/*
 * @param : item type (e.g coffee) 
 * @return Orders list
 */ 
app.get('/getOrders/:type', orders.findByType);

/*
 * @param : item size (e.g Tall) 
 * @return Orders list
 */ 
app.get('/getOrders/size/:size', orders.findBySize);

/*
 * TODO : Add inventory 
 */
app.post('/addItem', inventory.addItem);

//Server runing on port
app.listen(3000);

console.log('Listening on port 3000...');