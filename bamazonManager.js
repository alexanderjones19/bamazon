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
    if (err) throw err;
    console.log('Connected as ID ' + connection.threadId + '\n');
    managerView();
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
                    addNewProduct();
                    break;
            }
        });
}

function showProducts() {
    connection.query('SELECT * FROM products', function(err, results) {
        if (err) throw err;
        let itemArray = [];
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
    });
}

function showLowInventory() {
    connection.query('SELECT * FROM products WHERE stock_quantity < 5', function(err, results) {
        if (err) throw err;
        let lowInvArray = [];
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
    });
}

function validate(value) {
    if (isNaN(value) === false && parseInt(value) > 0) {
        return true;
    }
    return false;
}

function addInventory() {
    connection.query('SELECT * FROM products', function(err, results) {
        if (err) throw err;
        let itemArray = [];
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
                            function(err) {
                                if (err) throw err;
                                console.log('\nRestocking successful. ' + answers.itemQuantity + ' added to inventory.\n');
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
    });
}

function addNewProduct() {
    inquirer
        .prompt([
            {
                name: 'itemName',
                type: 'input',
                message: 'Name of product',
                validate: function stringValidate(value) {
                    if (value.length > 0) {
                        return true;
                    }
                    return false;
                }
            },
            {
                name: 'departmentName',
                type: 'input',
                message: 'Department of product',
                validate: function stringValidate(value) {
                    if (value.length > 0) {
                        return true;
                    }
                    return false;
                }
            },
            {
                name: 'itemPrice',
                type: 'input',
                message: 'Price of product',
                validate: validate
            },
            {
                name: 'itemStock',
                type: 'input',
                message: 'Stock quantity of product',
                validate: validate
            }
        ])
        .then(function(answers) {
            connection.query(
                'INSERT INTO products SET ?',
                {
                    product_name: answers.itemName.trim(),
                    department_name: answers.departmentName.trim(),
                    price: answers.itemPrice,
                    stock_quantity: answers.itemStock
                },
                function(err) {
                    if (err) throw err;
                    console.log('\n' + answers.itemName.trim() + ' added to Bamazon.\n');
                    managerView();
                }
            )
        });
}

process.on('SIGINT', function() {
    console.log('\nDisconnecting from database and closing application. . .\n');
    connection.end();
    process.exit( );
});