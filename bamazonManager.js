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
        console.log('connected as id ' + connection.threadId + '\n');
        managerView();
    }
});

function managerView() {
    inquirer
        .prompt({
            name: 'managerOptions',
            type: 'list',
            message: 'What would you like to do?',
            choices: ['View Products for Sale', 'View Low Inventory', 'Add to Inventory', 'Add New Product']
        })
        .then(function(answer) {
            switch(answer.managerOptions) {
                case 'View Products for Sale':
                    showProducts();
                    break;
                case 'View Low Inventory':
                    showLowInventory();
                    break;
                case 'Add to Inventory':
                    addInventory();
                    break;
                case 'Add New Product':
                    console.log('add new product works');
                    break;
            }
        });
}

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
            console.log('\n');
            console.table(itemArray);
            managerView();
        }
    });
}

function showLowInventory() {
    connection.query('SELECT * FROM products WHERE stock_quantity < 5', function(err, results) {
        let lowInvArray = [];
        if (err) {
            console.log(err);
        }
        else {
            for (i=0; i<results.length; i++) {
                let lowItem = {
                    'Item ID#': JSON.stringify(results[i].item_id).replace(/["]+/g, ''),
                    'Product Name': JSON.stringify(results[i].product_name).replace(/["]+/g, ''),
                    'Department': JSON.stringify(results[i].department_name).replace(/["]+/g, ''),
                    'Price': '$' + JSON.stringify(results[i].price).replace(/["]+/g, ''),
                    'Stock': JSON.stringify(results[i].stock_quantity).replace(/["]+/g, '')
                }
                lowInvArray.push(lowItem);
            }
            console.log('\n');
            console.table(lowInvArray);
            managerView();
        }
    });
}

function validate(value) {
    if (isNaN(value) === false && parseInt(value) > 0) {
        return true;
    }
    else {
        return false;
    }
}

function addInventory() {
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
            inquirer
                .prompt([
                    {
                        name: 'itemNumber',
                        type: 'input',
                        message: 'Enter the ID # of item you wish to stock',
                        validate: validate
                    },
                    {
                        name: 'itemQuantity',
                        type: 'input',
                        message: 'How many would you like to stock?',
                        validate: validate
                    }
                ])
                .then(function(answers) {
                    let productFound = false;
                    for (i=0; i<results.length; i++) {
                        if (results[i].item_id == answers.itemNumber) {
                            productFound = true;
                            connection.query(
                                'UPDATE products SET ? WHERE ?',
                                [
                                    {
                                        stock_quantity: parseInt(results[i].stock_quantity) + parseInt(answers.itemQuantity)
                                    },
                                    {
                                        item_id: results[i].item_id
                                    }
                                ],
                                function(error) {
                                    if (error) {
                                        console.log(error);
                                    }
                                    console.log('\nStocking successful. ' + answers.itemQuantity + ' added to inventory.\n');
                                    managerView();
                                }
                            )
                        }
                    }
                    if (!productFound) {
                        console.log('\nSorry, that item could not be found. Try again.\n');
                        managerView();
                    }
                });
        }
    });
}

function addNewProduct() {

}

process.on('SIGINT', function() {
    console.log('\nDisconnecting from database and closing application. . .\n');
    connection.end();
    process.exit( );
});