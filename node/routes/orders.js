/*
 * DML methods
 * Author - Rajedra Mudale
 */
var getConnection = require('../dbconfigs/app');
var async      = require('async');

/*
 * Catalog of menu items
 * Return facets - items, sizes, type, pricing
 */
exports.menu = function (req, res) {
	var return_data = {};

	var query1 = 'select * from menu_item';
	var query2 = 'select * from item_size';
	var query3 = 'select * from type';
	var query4 = 'select p.item_id, p.item_size_id, p.price, s.name as size from pricing p left join item_size s on p.item_size_id = s.id';

	getConnection(function (err, con) {
	  if(err) { throw err; /* handle your error here */  }

		async.parallel([
	       function(parallel_done) {
	           con.query(query1, {}, function(err, results) {
	               if (err) return parallel_done(err);
	               return_data.items = results;
	               parallel_done();
	           });
	       },
	       function(parallel_done) {
	           con.query(query2, {}, function(err, results) {
	               if (err) return parallel_done(err);
	               return_data.sizes = results;
	               parallel_done();
	           });
	       },
	       function(parallel_done) {
	           con.query(query3, {}, function(err, results) {
	               if (err) return parallel_done(err);
	               return_data.type = results;
	               parallel_done();
	           });
	       },
	       function(parallel_done) {
	           con.query(query4, {}, function(err, results) {
	               if (err) return parallel_done(err);
	               return_data.pricing = results;
	               parallel_done();
	           });
	       }
	    ], function(err) {
	         if (err) console.log(err);
	         con.release();
	         res.send(return_data);
	    });
	});
};

/*
 * Creates Orders
 */
exports.placeOrder = function(req, res) {
	var item = req.body.item,
		size = req.body.item_size,
		type = req.body.item_type,
		uprice = req.body.unit_price,
		qty = req.body.qty;

	var query = 'INSERT INTO orders (item_id,item_type_id,item_size_id,quantity,unit_price,order_date) VALUES('+item+','+type+','+size+','+qty+','+uprice+',now())';
	getConnection(function (err, con) {
	  if(err) { throw err; /* handle your error here */  }
	  con.query(query,function(err,result){
	  	res.send({status:"success", msg: "Thank you"});
	  	con.release();
	  });
	});
};

/*
 * List all orders
 */
exports.findAllOrders = function(req, res) {
    var query = 'select o.*, item.name, s.name as size, t.name as type from orders o left join menu_item item on o.item_id = item.id left join item_size s on o.item_size_id = s.id inner join type t on t.id = o.item_type_id';
	getConnection(function (err, con) {
	  if(err) { throw err; /* handle your error here */  }
	  con.query(query,function(err,result){
	  	res.send(result);
	  	con.release();
	  });
	});
};

/*
 * List all orders of specific type (e.g coffee)
 */
exports.findByType = function(req, res) {
	var type = req.params.type;
    var query = 'select o.*, item.name, s.name as size, t.name as type from orders o left join menu_item item on o.item_id = item.id left join item_size s on o.item_size_id = s.id inner join type t on t.id = o.item_type_id where t.name = "'+type+'"';
	getConnection(function (err, con) {
	  if(err) { throw err; /* handle your error here */  }
	  con.query(query,function(err,result){
	  	res.send(result);
	  	con.release();
	  });
	});
};

/*
 * List all orders of specific Size (e.g Tall)
 */
exports.findBySize = function(req, res) {
	var size = req.params.size;
    var query = 'select o.*, item.name, s.name as size, t.name as type from orders o left join menu_item item on o.item_id = item.id left join item_size s on o.item_size_id = s.id inner join type t on t.id = o.item_type_id where s.id = "'+size+'"';
	getConnection(function (err, con) {
	  if(err) { throw err; /* handle your error here */  }
	  con.query(query,function(err,result){
	  	res.send(result);
	  	con.release();
	  });
	});
};
