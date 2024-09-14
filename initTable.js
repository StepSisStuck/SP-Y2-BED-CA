const mysql = require('mysql2');
const dotenv = require('dotenv');

dotenv.config();

// Create a connection pool to the database server (without specifying a database)
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    connectionLimit: 10
});

// Get the database name from environment variables
const database = process.env.DB_NAME;

// Define SQL statements
const DROP_DB_SQL = `DROP DATABASE IF EXISTS ${database}`;
const CREATE_DB_SQL = `CREATE DATABASE ${database}`;

// Function to initialize the database and tables
function initializeDatabase() {
    pool.query(DROP_DB_SQL, (error) => {
        if (error) {
            console.error('Error dropping database:', error);
            pool.end();
            return;
        }
        console.log(`Database "${database}" has been dropped successfully`);

        pool.query(CREATE_DB_SQL, (error) => {
            if (error) {
                console.error('Error creating database:', error);
                pool.end();
                return;
            }
            console.log(`Database "${database}" has been created successfully`);
            initializeTables();
        });
    });
}

function initializeTables() {
    // Create a new connection pool with the database specified
    const dbPool = mysql.createPool({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: database,
        connectionLimit: 10
    });

    // SQL statements to create tables
    const createUserTable = `
        CREATE TABLE IF NOT EXISTS User (
            user_id INT AUTO_INCREMENT PRIMARY KEY,
            username VARCHAR(255) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL,
            points INT DEFAULT 100
        );
    `;

    const createQuestionsTable = `
        CREATE TABLE IF NOT EXISTS Questions (
            id INT AUTO_INCREMENT PRIMARY KEY,
            question TEXT NOT NULL,
            user_id INT NOT NULL,
            FOREIGN KEY (user_id) REFERENCES User(user_id)
        );
    `;

    const createSpellsTable = `
        CREATE TABLE IF NOT EXISTS Spells (
            user_id INT NOT NULL,
            spell_id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            description TEXT NOT NULL,
            power INT NOT NULL
        );
    `;

    const createClassesTable = `
        CREATE TABLE IF NOT EXISTS Classes (
            class_id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            description TEXT NOT NULL,
            required_points INT NOT NULL,
            date DATE NOT NULL,
            time TIME NOT NULL,
            user_id INT NOT NULL,
            FOREIGN KEY (user_id) REFERENCES User(user_id)
        );
    `;

    const createCustomizationTable = `
        CREATE TABLE IF NOT EXISTS Customization (
            customization_id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT NOT NULL UNIQUE,
            appearance VARCHAR(255) NOT NULL,
            abilities TEXT NOT NULL,
            FOREIGN KEY (user_id) REFERENCES User(user_id)
        );
    `;

    const createReviewsTable = `
        CREATE TABLE IF NOT EXISTS Reviews (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
            review TEXT NOT NULL,
            user_id INT NOT NULL,
            FOREIGN KEY (user_id) REFERENCES User(user_id)
        );
    `;

    const createUserClassesTable = `
        CREATE TABLE IF NOT EXISTS UserClasses (
            user_id INT NOT NULL,
            class_id INT NOT NULL,
            PRIMARY KEY (user_id, class_id),
            FOREIGN KEY (user_id) REFERENCES User(user_id) ON DELETE CASCADE,
            FOREIGN KEY (class_id) REFERENCES Classes(class_id) ON DELETE CASCADE
        );
    `;

    // Function to create or verify tables
    const createTable = (sql, tableName) => {
        return new Promise((resolve, reject) => {
            dbPool.query(sql, (err) => {
                if (err) {
                    console.error(`Error creating ${tableName} table: ` + err.stack);
                    reject(err);
                } else {
                    console.log(`${tableName} table created or already exists.`);
                    resolve();
                }
            });
        });
    };

    // Create or verify all tables
    const createAllTables = async () => {
        try {
            await Promise.all([
                createTable(createUserTable, 'User'),
                createTable(createQuestionsTable, 'Questions'),
                createTable(createSpellsTable, 'Spells'),
                createTable(createClassesTable, 'Classes'),
                createTable(createCustomizationTable, 'Customization'),
                createTable(createReviewsTable, 'Reviews'),
                createTable(createUserClassesTable, 'UserClasses')
            ]);
            console.log('All tables are created or verified.');
        } catch (err) {
            console.error('An error occurred while creating tables: ' + err.stack);
        } finally {
            // Close the connection
            dbPool.end((err) => {
                if (err) {
                    console.error('Error closing the database connection: ' + err.stack);
                } else {
                    console.log('Database connection closed.');
                }
            });
        }
    };

    createAllTables();
}

// Initialize the database
initializeDatabase();

