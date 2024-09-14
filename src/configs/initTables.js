const pool = require('../services/db');

const SQLSTATEMENT = `
-- Section A Tables
DROP TABLE IF EXISTS User;
DROP TABLE IF EXISTS UserAnswer;
DROP TABLE IF EXISTS SurveyQuestion;

CREATE TABLE User (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    username TEXT,
    points INT
);

CREATE TABLE UserAnswer (
    answer_id INT PRIMARY KEY AUTO_INCREMENT,
    answered_question_id INT NOT NULL,
    participant_id INT NOT NULL,
    answer BOOL NOT NULL,
    creation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    additional_notes TEXT
);

CREATE TABLE SurveyQuestion (
    question_id INT PRIMARY KEY AUTO_INCREMENT,
    creator_id INT NOT NULL,
    question TEXT NOT NULL
);

INSERT INTO SurveyQuestion (question_id, creator_id, question) 
VALUES
(1, 1, 'Do you buy fruits from FC6?'),
(2, 1, 'Is the fried chicken at FC5 salty?'),
(3, 2, 'Did you recycle any e-waste?'),
(4, 2, 'Do you turn off lights and appliances when not in use?'),
(5, 2, 'Have you visited the cafe at Moberly?');

-- Section B Tables
DROP TABLE IF EXISTS GameUser;
DROP TABLE IF EXISTS Quest;
DROP TABLE IF EXISTS Classes;
DROP TABLE IF EXISTS Spell;
DROP TABLE IF EXISTS CharacterCustomization;
DROP TABLE IF EXISTS CharacterProgression;
DROP TABLE IF EXISTS CompletedClasses;

CREATE TABLE GameUser (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    username TEXT,
    points INT
);

CREATE TABLE Quest (
    quest_id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255),
    description TEXT,
    reward_points INT,
    min_points INT
);

CREATE TABLE Classes (
    class_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255),
    description TEXT,
    required_points INT
);

CREATE TABLE Spell (
    spell_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255),
    description TEXT,
    power INT
);

CREATE TABLE CharacterCustomization (
    customization_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    appearance TEXT,
    abilities TEXT,
    FOREIGN KEY (user_id) REFERENCES GameUser(user_id)
);

CREATE TABLE CharacterProgression (
    progress_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    quest_id INT,
    status VARCHAR(50),
    updated_status TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES GameUser(user_id),
    FOREIGN KEY (quest_id) REFERENCES Quest(quest_id)
);

CREATE TABLE CompletedClasses (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    class_id INT,
    status VARCHAR(50),
    updated_status TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES GameUser(user_id),
    FOREIGN KEY (class_id) REFERENCES Classes(class_id)
);

INSERT INTO GameUser (username, points) 
VALUES
('player1', 50),
('player2', 100),
('player3', 150);

INSERT INTO Quest (title, description, reward_points, min_points) 
VALUES
("Find the Hidden Treasure", "Locate the hidden treasure in the forest.", 50, 10),
("Defeat the Dragon", "Slay the dragon in the mountain cave.", 100, 20),
("Rescue the Villagers", "Save the villagers from the bandits.", 70, 15);

INSERT INTO Classes (name, description, required_points)
VALUES
("Warrior", "Strong and brave.", 100),
("Mage", "Master of magical arts.", 150),
("Archer", "Skilled with the bow.", 120);
`;

pool.query(SQLSTATEMENT, (error, results, fields) => {
    if (error) {
        console.error("Error creating tables", error);
    } else {
        console.log("Success.", results);
    }
    process.exit();
});
