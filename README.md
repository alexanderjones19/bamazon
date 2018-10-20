# Bamazon

Bamazon is a Node CLI application with a mercantile theme. Two programs are included, one allowing the user to perform actions in the role of a customer and the other allowing the user to perform actions in the role of a manager.

Two MySQL database files are included with the app. One is a database schema that will set the initial product database up. The other is a seeds file that can populate the database with some sample items for sale.

A database will need to be set up and running for the application to work.

## Bamazon Customer

The Bamazon Customer program will open with a table of the items in the database. Details about the items are displayed in the table for the user to view. The user will then be prompted to choose an item to purchase. The user can then enter the ID # of the item they wish to purchase and will be prompted to enter a quantity to purchase. If the proper quantity is in stock, the purchase will go through and the user will be given the purchase total. If the item is understocked, or an erroneous item entry is made, the user will be informed of such. 

To start the customer program, in the command line type:

* node bamazonCustomer.js

To exit the program simply press:

* control + c 

When the user exits they will be informed that the program is stopping and the database connection is ending.

## Bamazon Manager

The Bamazon Manager program opens with 4 options that the user can choose from. 

1. View Products for Sale
2. View Low Inventory
3. Add to Inventory
4. Add New Product

The user can use the arrows keys and the enter key to select the action they wish to take. Viewing the products for sale presents the user with a table of all of the items that Bamazon offers. Viewing the low inventory items provides a table of all items with a stock quantity of less than 5. Selecting to add to inventory provides the user with prompts to restock an item they choose. The add new product option allows the user to create a new item in the database that Bamazon will be able to sell. Similarly to the customer program, input validation is present in the manager program to handle erroneous inputs.

To start the manager program, in the command line type:

* node bamazonManager.js

To exit the program simply press:

* control + c

When the user exits they will be informed that the program is stopping and the database connection is ending.