const mysql = require('mysql');
const inquirer = require('inquirer');
const cTable = require('console.table');

const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '',
    database: 'bamazonDB'
});

connection.connect(function(err) {
    if (err) {
        console.log(err);
    }
    else {
        console.log('connected as id ' + connection.threadId);
        showProducts();
    }
});

function showProducts() {
    connection.query('SELECT * FROM products', function(err, results) {
        let itemArray = [];
        if (err) {
            console.log(err);
        }
        else {
            for (i=0; i<results.length; i++) {
                let item = {
                    'Item ID#': JSON.stringify(results[i].item_id).replace(/["]+/g, ''),
                    'Product Name': JSON.stringify(results[i].product_name).replace(/["]+/g, ''),
                    'Department': JSON.stringify(results[i].department_name).replace(/["]+/g, ''),
                    'Price': '$' + JSON.stringify(results[i].price).replace(/["]+/g, ''),
                    'Stock': JSON.stringify(results[i].stock_quantity).replace(/["]+/g, '')
                };
                itemArray.push(item);
            }
            console.table(itemArray);
            userInquire(results);
        }
    });
}

function userInquire(results) {
    inquirer
        .prompt([
            {
                name: 'itemNumber',
                type: 'input',
                message: 'Enter the ID # of the item you wish to buy',
                validate: function(value) {
                    if (isNaN(value) === false) {
                        return true;
                    }
                    else {
                        return false;
                    }
                }
            },
            {
                type: 'input',
                message: 'How many do you wish to purchase?',
                name: 'itemQuantity',
                validate: function(value) {
                    if (isNaN(value) === false) {
                        return true;
                    }
                    else {
                        return false;
                    }
                }
            }
        ])
        .then(answers => {
            console.log('item number', answers.itemNumber);
            console.log('item quantity', answers.itemQuantity);
            for (i=0; i<results.length; i++) {
                if (results[i].item_id == answers.itemNumber) {
                    if (results[i].stock_quantity >= answers.itemQuantity) {
                        let purchaseTotal = results[i].price * answers.itemQuantity;
                        connection.query(
                            'UPDATE products SET ? WHERE ?',
                            [
                                {
                                    stock_quantity: results[i].stock_quantity - answers.itemQuantity
                                },
                                {
                                    item_id: results[i].item_id
                                }
                            ],
                            function(error) {
                                if (error) {
                                    console.log(error);
                                }
                                console.log('\nPurchase successful! Total cost: $' + purchaseTotal);
                                showProducts();
                            }
                        )
                    }
                    else {
                        console.log('\nSorry, that item is understocked. Only ' + JSON.stringify(results[i].stock_quantity).replace(/["]+/g, '')
                        + ' available.');
                        showProducts();
                    }
                }
            }
        });
}

process.on('SIGINT', function() {
    console.log('\nDisconnecting from database and closing application. . .');
    connection.end();
    process.exit( );
});