angular.module('account.repairbits', [  
   'account.repairbits.index',
   'account.repairbits.detail',
   'account.repairbits.shopcart' 
]);
  function Product (sku, name, description, price) {
      this.sku = sku; // product code (SKU = stock keeping unit)
      this.name = name;
      this.description = description;
      this.price = price;
      // this.cal = cal;
      // this.nutrients = {
      //     "Carotenoid": carot,
      //     "Vitamin C": vitc,
      //     "Folates": folate,
      //     "Potassium": potassium,
      //     "Fiber": fiber
      // };
      //console.log(this.nutrients);
  }
  function Store () {
    this.products = [
    // new Product("APL", "Apple", "Eat one every day to keep the doctor away!", 12),
    // new Product("AVC", "Avocado", "Guacamole anyone?", 16),
    // new Product("BAN", "Banana", "These are rich in Potassium and easy to peel.", 4),
    // new Product("CTP", "Cantaloupe", "Delicious and refreshing.", 3)
    // new Product("FIG", "Fig", "OK, not that nutritious, but sooo good!", 10, 100, 0, 0, 0, 1, 2),
    // new Product("GRF", "Grapefruit", "Pink or red, always healthy and delicious.", 11, 50, 4, 4, 1, 1, 1),
    // new Product("GRP", "Grape", "Wine is great, but grapes are even better.", 8, 100, 0, 3, 0, 1, 1),
    // new Product("GUA", "Guava", "Exotic, fragrant, tasty!", 8, 50, 4, 4, 0, 1, 2),
    // new Product("KIW", "Kiwi", "These come from New Zealand.", 14, 90, 1, 4, 0, 2, 2),
    // new Product("LYC", "Lychee", "Unusual and highly addictive!", 18, 125, 1, 4, 0, 2, 2),
    // new Product("MAN", "Mango", "Messy to eat, but well worth it.", 8, 70, 3, 4, 0, 1, 1),
    // new Product("ORG", "Orange", "Vitamin C anyone? Go ahead, make some juice.", 9, 70, 1, 4, 2, 1, 2),
    // new Product("PAP", "Papaya", "Super-popular for breakfast.", 5, 60, 3, 4, 2, 2, 2),
    // new Product("PCH", "Peach", "Add some cream and enjoy.", 19, 70, 1, 2, 0, 1, 2),
    // new Product("PER", "Pear", "Delicious fresh, or cooked in red wine, or distilled.", 8, 100, 0, 2, 0, 1, 2),
    // new Product("PMG", "Pomegranate", "Delicious, healthy, beautiful, and sophisticated!", 19, 110, 0, 2, 0, 2, 0),
    // new Product("PNP", "Pineapple", "Enjoy it (but don't forget to peel first).", 4, 60, 0, 3, 0, 0, 1),
    // new Product("PSM", "Persimmon", "Believe it or not, they are berries!", 6, 120, 4, 3, 0, 1, 3),
    // new Product("STR", "Strawberry", "Beautiful, healthy, and delicious.", 7, 40, 0, 4, 1, 1, 2),
    // new Product("TNG", "Tangerine", "Easier to peel than oranges!", 8, 50, 3, 4, 1, 1, 2),
    // new Product("WML", "Watermelon", "Nothing comes close on those hot summer days.", 4, 90, 4, 4, 0, 1, 1)
    ];    
    // this.dvaCaption = [
    //   "Negligible",
    //   "Low",
    //   "Average",
    //   "Good",
    //   "Great"
    // ];
    // this.dvaRange = [
    //   "below 5%",
    //   "between 5 and 10%",
    //   "between 10 and 20%",
    //   "between 20 and 40%",
    //   "above 40%"
    // ];
  }
  Store.prototype.getProduct = function (sku) {
    for (var i = 0; i < this.products.length; i++) {
      if (this.products[i].sku === sku)
       { return this.products[i];}
    }
    return null;
  };

function Cart (cartName) {
    this.cartName = cartName;
    this.clearCart = false;
    this.checkoutParameters = {};
    this.items = [];

    // load items from local storage when initializing
    this.loadItems();

    // save items to local storage when unloading
    var self = this;
    $(window).unload(function () {
        if (self.clearCart) {
            self.clearItems();
        }
        self.saveItems();
        self.clearCart = false;
    });    
}

/**
 * Shopping cart methods
 */
// load items from local storage
Cart.prototype.loadItems = function () {
    var items = localStorage !== null ? localStorage[this.cartName + "_items"] : null;
    if (items !== null && JSON !== null) {
        try {
            var Items = JSON.parse(items);
            for (var i = 0; i < Items.length; i++) {
                var item = Items[i];
                if (item.sku !== null && item.name !== null && item.price !== null && item.quantity !== null) {
                    item = new cartItem(item.sku, item.name, item.price, item.quantity);
                    this.Items.push(item);
                }
            }
        }
        catch (err) {
            // ignore errors while loading...
        }
    }
};
// get the total price for all items currently in the cart
Cart.prototype.getTotalPrice = function (sku) {
    var total = 0;
    for (var i = 0; i < this.items.length; i++) {
        var item = this.items[i];
        if (item.sku) {
            total += this.toNumber(item.quantity * item.price);
        }
    }
    return total;
};
// get the total price for all items currently in the cart
Cart.prototype.getTotalCount = function (sku) {
    var count = 0;
    for (var i = 0; i < this.items.length; i++) {
        var item = this.items[i];
        if (item.sku) {
            count += this.toNumber(item.quantity);
        }
    }
    return count;
};
// save items to local storage
Cart.prototype.saveItems = function () {
    if (localStorage !== null && JSON !== null) {
        localStorage[this.cartName + "_items"] = JSON.stringify(this.items);
    }
};
// adds an item to the cart
Cart.prototype.addItem = function (sku, name, price, quantity) {
    quantity = this.toNumber(quantity);
    if (quantity !== 0) {

        // update quantity for existing item
        var found = false;
        for (var i = 0; i < this.items.length && !found; i++) {
            var item = this.items[i];
            if (item.sku === sku) {
                found = true;
                item.quantity = this.toNumber(item.quantity + quantity);
                if (item.quantity <= 0) {
                    this.items.splice(i, 1);
                }
            }
        }

        // new item, add now
        if (!found) {
            var itemN = new cartItem(sku, name, price, quantity);
            this.items.push(itemN);
        }

        // save changes
        this.saveItems();
    }
};
// clear the cart
Cart.prototype.clearItems = function () {
    this.items = [];
    this.saveItems();
};
// define checkout parameters
Cart.prototype.addCheckoutParameters = function (serviceName, merchantID, options) {

    // check parameters
    if (serviceName !== "PayPal" && serviceName !== "Google") {
        throw "serviceName must be 'PayPal' or 'Google'.";
    }
    if (merchantID === null) {
        throw "A merchantID is required in order to checkout.";
    }

    // save parameters
    this.checkoutParameters[serviceName] = new checkoutParameters(serviceName, merchantID, options);
};
// check out
Cart.prototype.checkout = function (serviceName, clearCart) {
  // alert("check");

    // select serviceName if we have to
    if (serviceName === null) {
        var p = this.checkoutParameters[Object.keys(this.checkoutParameters)[0]];
        serviceName = p.serviceName;
    }

    // sanity
    if (serviceName === null) {
        throw "Use the 'addCheckoutParameters' method to define at least one checkout service.";
    }

    // go to work
    var parms = this.checkoutParameters[serviceName];
    //alert(JSON.stringify(parms));
    if (parms === null) {
        throw "Cannot get checkout parameters for '" + serviceName + "'.";
    }
    //alert(parms.serviceName);
    switch (parms.serviceName) {
        case 'PayPal':            
            this.checkoutPayPal(parms, clearCart);
            break;
        case "Google":
            this.checkoutGoogle(parms, clearCart);
            break;
        default:
            throw "Unknown checkout service: " + parms.serviceName;
    }
};
// check out using PayPal
// for details see:
// www.paypal.com/cgi-bin/webscr?cmd=p/pdn/howto_checkout-outside
Cart.prototype.checkoutPayPal = function (parms, clearCart) {
   // console.log(parms);
    // global data
    var data = {
        cmd: "_cart",
        business: parms.merchantID,
        upload: "1",
        rm: "2",
        charset: "utf-8"
    };
   //console.log(parms);
    // console.log("dataa.........");
    // console.log(this.items);
    // // item data
    for (var i = 0; i < this.items.length; i++) {
        var item = this.items[i];
        var ctr = i + 1;
        data["item_number_" + ctr] = item.sku;
        data["item_name_" + ctr] = item.name;
        data["quantity_" + ctr] = item.quantity;
        data["amount_" + ctr] = item.price.toFixed(2);
    }
     // console.log(data);
    // // build form
    var form = $('<form></form>');
    form.attr("action", "https://www.paypal.com/cgi-bin/webscr");
    form.attr("method", "POST");
    form.attr("style", "display:none;");
    // console.log(form);
    console.log(parms);
    this.addFormFields(form, data);
    // this.addFormFields(form, parms.options);
    $("body").append(form);

    // // submit form
    this.clearCart = clearCart === null || clearCart;
    form.submit();
    form.remove();
};
// check out using Google Wallet
// for details see:
// developers.google.com/checkout/developer/Google_Checkout_Custom_Cart_How_To_HTML
// developers.google.com/checkout/developer/interactive_demo
Cart.prototype.checkoutGoogle = function (parms, clearCart) {

    // global data
    var data = {};

    // item data
    for (var i = 0; i < this.items.length; i++) {
        var item = this.items[i];
        var ctr = i + 1;
        data["item_name_" + ctr] = item.sku;
        data["item_description_" + ctr] = item.name;
        data["item_price_" + ctr] = item.price.toFixed(2);
        data["item_quantity_" + ctr] = item.quantity;
        data["item_merchant_id_" + ctr] = parms.merchantID;
    }

    // build form
    var form = $('<form/></form>');
    // NOTE: in production projects, use the checkout.google url below;
    // for debugging/testing, use the sandbox.google url instead.
    //form.attr("action", "https://checkout.google.com/api/checkout/v2/merchantCheckoutForm/Merchant/" + parms.merchantID);
    form.attr("action", "https://sandbox.google.com/checkout/api/checkout/v2/checkoutForm/Merchant/" + parms.merchantID);
    form.attr("method", "POST");
    form.attr("style", "display:none;");
    this.addFormFields(form, data);
    this.addFormFields(form, parms.options);
    $("body").append(form);

    // submit form
    this.clearCart = clearCart === null || clearCart;
    form.submit();
    form.remove();
};
// utility methods
Cart.prototype.addFormFields = function (form, data) {
    if (data !== null) {
        $.each(data, function (name, value) {
            if (value !== null) {
                var input = $("<input></input>").attr("type", "hidden").attr("name", name).val(value);
                form.append(input);
            }
        });
    }
};

Cart.prototype.toNumber = function (value) {
    value = value * 1;
    return isNaN(value) ? 0 : value;
};


/**
 * Checkout parameters (one per supported payment service)
 */
function checkoutParameters(serviceName, merchantID, options) { 
    //console.log(options);   
    this.serviceName = serviceName;
    this.merchantID = merchantID;
    this.options = options;
}

/**
 * Item in cart
 */
function cartItem(sku, name, price, quantity) {
  //console.log("cartItem:"+sku+name+price+quantity);
    this.sku = sku;
    this.name = name;
    this.price = price * 1;
    this.quantity = quantity * 1;
    // console.log(this.name+this.quantity);
}
angular.module('account.repairbits').factory("DataService", function () {

    // create store

    var myStore = new Store();

    // create shopping cart
    var myCart = new Cart("AngularStore");
    myCart.addCheckoutParameters("PayPal", "twinklemerchant@jacksolutions.biz");
    // myCart.addCheckoutParameters("Google", "500640663394527",
    //     {
    //         ship_method_name_1: "UPS Next Day Air",
    //         ship_method_price_1: "20.00",
    //         ship_method_currency_1: "USD",
    //         ship_method_name_2: "UPS Ground",
    //         ship_method_price_2: "15.00",
    //         ship_method_currency_2: "USD"
    //     }
    // );
    // return data object with store and cart
    return {
        store: myStore,
        cart: myCart
    };
}); 