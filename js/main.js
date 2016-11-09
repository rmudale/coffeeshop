/* 
 * Coffee Shop Order Mgmt 
 * Author Rajendra Mudale 
 */
function Coffee() {
	this.init();
    this.bind();
    this.priceObj = {};
    $('#fltr-type').material_select();
	$('#fltr-size').material_select();
}

Coffee.prototype = {

    constructor: Coffee,

    init : function() {
    	self = this;   	
    	this.getMenuItems();
    },

    //List menu items for placing an orders
	getMenuItems : function() {
		$.ajax({
            type: "GET",
            url: "http://127.0.0.1:3000/menu",
            dataType: "json",
            success: function (res, status, jqXHR) {
            	self.buildMenuHtml(res);
            },
            error: function (res) {
            	console.log('Failed '+res)
            }
        });
	},

	/*
	 * Accepts @params json object
	 * Creates an order
	 */ 
	placeOrder : function(params) {
		$.ajax({
            type: "POST",
            url: "http://127.0.0.1:3000/placeOrder",
            data: JSON.stringify(params),
            dataType: 'json',
        	contentType: "application/json",
            success: function (res, status, jqXHR) {
            	if(res.status == 'success') {
            		alert("Thank you!! Order has been placed successfully!!!");
            	} else {
            		alert("OOPs!! Something went wrong, pls try again!!!");
            	}
            	
            },
            error: function (res) {
            	console.log('Failed '+res)
            }
        });
	},

    /* 
     * Default list all ordrs
     * optional, accpet input filter (size / type of item)
     * Returns list of orders
     */ 
    getOrders : function(filter) {
		var params = '';
		if(filter && filter.type) {
			params = "/"+filter.type;
		} else if (filter && filter.size) {
			params = "/size/"+filter.size;
		}
		$.ajax({
            type: "GET",
            url: "http://127.0.0.1:3000/getOrders"+params,
            dataType: "json",
            success: function (res, status, jqXHR) {
            	self.buildOrdersHtml(res);
            },
            error: function (res) {
            	console.log('Failed '+res)
            }
        });
	},

	/*
	 * Create HTML for order form
	 */ 
	 buildMenuHtml : function(res) {
		var formTmp = $('.addOrderFormTemplate').html();
		$('#orderForm').append(formTmp)
		var formObj = $('#orderForm');
		
		//Populate item names
		$.each(res.items, function(i, item) {
			formObj.find('#item').append($('<option>', {value:item.id, text:item.name}));
		});

		//Populate Types
		$.each(res.type, function(key, type) {
			formObj.find('#item-type').append($('<option>', {value:type.id, text:type.name}));
		});

		//Populate Sizes
		$.each(res.sizes, function(key, item) {
			formObj.find('#item-size').append($('<option>', {value:item.id, text:item.name}));
		});

		//Populate Prices
		priceObj = res.pricing;
		$.each(res.pricing, function(key, unit) {
			formObj.find('#unit-price').append($('<option>', {value:unit.price, text:'$'+unit.price}));
		});

		formObj.find('select').material_select();
		//$('select').material_select();
	 },

	/*
	 * Create HTMl for orders List
	 */
	buildOrdersHtml : function(res) {
		var html = "<tr><th> Order Id</th><th> Item </th><th> Item Type</th><th> Size</th><th> Qty </th><th> Unit Price</th><th> Tax 15% </th><th> Total </th></tr>";
		if(res.length > 0) {
		$.each(res, function(i,val) {
			var totPrice = (val.unit_price * val.quantity) + (val.unit_price * 0.15);
			html+= '<tr>'
		 		+ '<td>#'+val.order_id+'</td>'
		 		+ '<td>'+val.name+'</td>'
		 		+ '<td>'+val.type+'</td>'
		 		+ '<td>'+val.size+'</td>'
		 		+ '<td>'+val.quantity+'</td>'
		 		+ '<td>'+val.unit_price+'</td>'
		 		+ '<td>'+val.unit_price * 0.15 +'</td>'
		 		+ '<td>'+totPrice +'</td>'
				+ '</tr>';
			});
		} else {
			html += "<tr><td colspan='8'><h6 class='txt-center'> No Matching orders found</h5></td></tr>";
		}
		$('.list .order-details').html(html);
	},

	/*
	 * Attach all the events
	 */
    bind : function() {

	    $('.viewOrders').on("click", function(e) {
			$('.newOrderForm').hide();
			$('.viewOrderList').show();
			self.getOrders();
		});

		$('.placeOrder').on("click", function(e) {
			$('.newOrderForm').show();
			$('.viewOrderList').hide();
		});

		$('#fltr-type').on('change', function(e) {
			var type = $('#fltr-type').val();
			var filter = { 'type' : type };
			$('#fltr-size').val("");
			$('#fltr-size').material_select();
			self.getOrders(filter);
		});

		$('#fltr-size').on('change', function(e) {
			var size = $('#fltr-size').val();
			var filter = { 'size' : size };
			$('#fltr-type').val("");
			$('#fltr-type').material_select();
			self.getOrders(filter);
		});

		$('#orderForm').on('change', '#item, #item-size', function(e) {
			var item = $('#item').val();
			var size = $('#item-size').val();
			
			if(size !='' && item == null) {
				alert("Please select item first!!");
				$('#item-size').val("");
				$('#item-size').material_select();
				return;
			}

			$.each(priceObj, function(key, obj) {
				if(obj.item_id == item && obj.item_size_id == size) {
					$('#unit-price').val(obj.price);
					$('#unit-price').material_select();
				}
			});
		});

		$('#orderForm').on('click', '.btn', function(e) {
			var params = {};
			params = {
				"item" : $('#item').val(),
			 	"item_size" : $('#item-size').val(),
			 	"item_type" : $('#item-type').val(),
			 	"unit_price" : $('#unit-price').val(),
			 	"qty" : $('#quantiry').val()
			}
			if(params.item && params.item_size && params.qty) {
				self.placeOrder(params);
			} else {
				alert("Some Mandatory fields are missing");
			}
			e.preventDefault();
			return;
		});
    }


}

/*
 * Initialize Coffee constructor
 */
var coffee = new Coffee();
