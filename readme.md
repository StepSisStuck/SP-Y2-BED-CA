
# Name, Class and Admin Number
- Name: Stanly Lau Wei Bin
- Class: DISM/FT/2B/24
- Admin Number: P2349080


# About This Project
This project is a continuation of the CA1. 
For more information on CA1: https://github.com/StepSisStuck/SP-Y2-BED-CA2/tree/CA1

# Before you start
In the case that the node_modules folder does not exist, you can run the following command to install the required modules:
```
npm install
```
or
```
npm install bcrypt dotenv express jsonwebtoken mysql2 nodemon supertest readline-sync
```
To reset and create schema, run
```
npm run init_tables
```
This will delete all progress you have made.


Make sure you start the server by running

```
npm run run
```
Upon loading the server, you will be greeted with the main menu of the website. You can navigate your way through the website by playing around with it's features. But first, you have to create an .env file with the following details:
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=Pa$$w0rd
DB_NAME=ca2
JWT_SECRET=322434
```







# UPDATES FROM CA1 FOR CA2
- Added a frontend interface
- New endpoint (/battleRoutes and /reviewRoutes) has been added.
- Remove endpoint (/gameUserRoutes.js and /questRoutes.js) has been removed.



# FEATURES
This section will go through the features in detail.
The features:
- Home Page
- Login Page
- Register Page
- Question / Feedback Page
- Battle Page
- User / Scoreboard Page
- Spell Page
- Class Page
- Customization Page
- Review Page



