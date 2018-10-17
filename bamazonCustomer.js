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
        if (err) {
            console.log(err);
        }
        else {
            for (i=0; i<results.length; i++) {
                console.log('Item ID #: ' + JSON.stringify(results[i].item_id));
            }
            // console.log(results);
        }
    });
}