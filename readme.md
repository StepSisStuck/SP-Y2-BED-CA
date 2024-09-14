# Gamified Survey System

## Table of Contents
- [Gamified Survey System](#gamified-survey-system)
  - [Table of Contents](#table-of-contents)
  - [Overview](#overview)
  - [Features](#features)
  - [Setup Instructions](#setup-instructions)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
  - [API Endpoints](#api-endpoints)
    - [Section A: Survey System](#section-a-survey-system)
      - [Users](#users)
        - [POST /users](#post-users)
        - [GET /users](#get-users)
        - [GET /users/{user\_id}](#get-usersuser_id)
        - [PUT /users/{user\_id}](#put-usersuser_id)
    - [Survey Questions](#survey-questions)
        - [POST /questions](#post-questions)
        - [GET /questions](#get-questions)
        - [PUT /questions/{question\_id}](#put-questionsquestion_id)
        - [DELETE /questions/{question\_id}](#delete-questionsquestion_id)
    - [Answers](#answers)
        - [POST /questions/{question\_id}/answers](#post-questionsquestion_idanswers)
        - [GET /questions/{question\_id}/answers](#get-questionsquestion_idanswers)
    - [Section B: Infuse Gamification](#section-b-infuse-gamification)
      - [Game Users](#game-users)
        - [POST /gameuser](#post-gameuser)
        - [GET /gameuser](#get-gameuser)
        - [PUT /gameuser/{user\_id}](#put-gameuseruser_id)
      - [Quests](#quests)
        - [POST /quests](#post-quests)
        - [GET /quests](#get-quests)
        - [POST /quests/{quest\_id}/start](#post-questsquest_idstart)
        - [POST /quests/{quest\_id}/complete](#post-questsquest_idcomplete)
      - [Classes](#classes)
        - [POST /classes](#post-classes)
        - [GET /classes](#get-classes)
        - [PUT /classes/{class\_id}](#put-classesclass_id)
        - [DELETE /classes/{class\_id}](#delete-classesclass_id)
        - [POST /classes/{class\_id}/attend](#post-classesclass_idattend)
    - [Spells](#spells)
        - [POST /spells](#post-spells)
        - [GET /spells](#get-spells)
        - [PUT /spells/{spell\_id}](#put-spellsspell_id)
        - [DELETE /spells/{spell\_id}](#delete-spellsspell_id)
    - [Character Customization](#character-customization)
        - [POST /customization](#post-customization)
        - [GET /customization/{user\_id}](#get-customizationuser_id)
        - [PUT /customization/{user\_id}](#put-customizationuser_id)
  - [Testing](#testing)

## Overview
This project is a backend server for a gamified survey system built using Node.js and MySQL. The system encourages users to complete surveys and earn points, which can be used for various gamification experiences.

## Features
- User management
- Survey question management
- Answer management
- Quest and class management
- Spell and character customization

## Setup Instructions

### Prerequisites
- Node.js
- MySQL

### Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/ST0503-BED/bed-ca1-StepSisStuck.git
    ```
2. Navigate to the project directory:
    ```sh
    cd <project-directory>
    ```

3. Install dependencies:
    ```sh
    npm install express
    ```
   ```sh
   npm install mysql2
    ```
    ```sh
    npm install dotenv
    ```
    ```sh
    npm install nodemon
    ```

4. Create a `.env` file in the root directory and add your MySQL database credentials:
    ```env
    DB_HOST="localhost"
    DB_USER="yourusername"
    DB_PASSWORD="yourpassword"
    DB_DATABASE="databasename"
    ```

5. Initialize the database tables:
    ```sh
    npm run init_tables
    ```
**Note**: You do not need to create the database manually in SQL. The script will create the database and tables for you.

6. Start the server:
    ```sh
    npm run run
    ```

**Note**: 
1. The server will start on `http://localhost:3000`, if it doesn't work, use `http://127.0.0.1:3000` instead. 
2. Some of the responses might be different from the documentation due to the dynamic nature of the data.
## API Endpoints

### Section A: Survey System

#### Users

##### POST /users
Create a new user.

- **URL**: `http://localhost:3000/users`
- **Method**: POST
- **Request Body**:
    ```json
    {
      "username": "socuser321"
    }
    ```
- **Response Body**:
    ```json
    {
      "message": "User created successfully",
      "user": {
          "user_id": 3,
          "username": "socuser321",
          "points": 0
      }
    }
    ```
- **Status Code**: 201 Created
- **Error Handling**:
    - If the provided username is already associated with another user, return 409 Conflict.
    - If the request body is missing username, return 400 Bad Request.

##### GET /users
Retrieve a list of all users.

- **URL**: `http://localhost:3000/users`
- **Method**: GET
- **Response Body**:
    ```json
    [
      {
        "user_id": 1,
        "username": "socuser321",
        "points": 0
      },
      {
        "user_id": 2,
        "username": "surveyKing",
        "points": 0
      }
    ]
    ```
- **Status Code**: 200 OK

##### GET /users/{user_id}
Retrieve details of a specific user.

- **URL**: `http://localhost:3000/users/{user_id}`
- **Method**: GET
- **Response Body**:
    ```json
    {
      "user_id": 1,
      "username": "greenUser123",
      "completed_questions": 10,
      "points": 10
    }
    ```
- **Status Code**: 200 OK
- **Error Handling**:
    - If the requested user_id does not exist, return 404 Not Found.

##### PUT /users/{user_id}
Update user details.

- **URL**: `http://localhost:3000/users/{user_id}`
- **Method**: PUT
- **Request Body**:
    ```json
    {
      "username": "superSOC"
    }
    ```
- **Response Body**:
    ```json
    {
    "message": "User updated successfully",
    "user": {
        "user_id": "1",
        "username": "superSOC",
        "points": 0
    }
    } 
    ```
- **Status Code**: 200 OK
- **Error Handling**:
    - If the requested user_id does not exist, return 404 Not Found.
    - If the provided username is already associated with another user, return 409 Conflict.

### Survey Questions

##### POST /questions
Create a new survey question.

- **URL**: `http://localhost:3000/questions`
- **Method**: POST
- **Request Body**:
    ```json
    {
      "question": "Do you buy fruits from FC6?",
      "user_id": 1
    }
    ```
- **Response Body**:
    ```json
    {
      "question_id": 1,
      "question": "Do you buy fruits from FC6?",
      "creator_id": 1
    }
    ```
- **Status Code**: 201 Created
- **Error Handling**:
    - If the request body is missing question or user_id, return 400 Bad Request.

##### GET /questions
Retrieve a list of all questions.

- **URL**: `http://localhost:3000/questions`
- **Method**: GET
- **Response Body**:
    ```json
    [
      {
        "question_id": 1,
        "question": "Do you buy fruits from FC6?",
        "creator_id": 1
      },
      {
        "question_id": 2,
        "question": "Is the fried chicken at FC5 salty?",
        "creator_id": 1
      }
    ]
    ```
- **Status Code**: 200 OK

##### PUT /questions/{question_id}
Update question details.

- **URL**: `http://localhost:3000/questions/{question_id}`
- **Method**: PUT
- **Request Body**:
    ```json
    {
      "user_id": 1,
      "question": "Do you buy fruits from FC4?"
    }
    ```
- **Response Body**:
    ```json
    {
      "question_id": 1,
      "question": "Do you buy fruits from FC4?",
      "creator_id": 1
    }
    ```
- **Status Code**: 200 OK
- **Error Handling**:
    - If the requested question_id does not exist, return 404 Not Found.
    - If the request body is missing question or user_id, return 400 Bad Request.
    - If creator_id is different, return 403 Forbidden due to incorrect owner.

##### DELETE /questions/{question_id}
Delete a question.

- **URL**: `http://localhost:3000/questions/{question_id}`
- **Method**: DELETE
- **Status Code**: 204 No Content
- **Error Handling**:
    - If the requested question_id does not exist, return 404 Not Found.

### Answers

##### POST /questions/{question_id}/answers

Create an answer from a user.

- **URL**: `http://localhost:3000/questions/{question_id}/answers`
- **Method**: POST
- **Request Body**:
    ```json
    {
      "user_id": 1,
      "answer": true,
      "creation_date": "2023-07-30",
      "additional_notes": "I love it"
    }
    ```
- **Response Body**:
    ```json
    {
      "answer_id": 1,
      "answered_question_id": 1,
      "participant_id": 1,
      "answer": true,
      "creation_date": "2023-07-30",
      "additional_notes": "I love it"
    }
    ```
- **Status Code**: 201 Created
- **Error Handling**:
    - If the requested user_id or question_id does not exist, return 404 Not Found.
    - If the request body is missing creation_date, return 400 Bad Request.
- **Additional Requirements**:
    - Upon successfully completing a survey question, the user will receive 5 points.

##### GET /questions/{question_id}/answers
Retrieve answers for a question.

- **URL**: `http://localhost:3000/questions/{question_id}/answers`
- **Method**: GET
- **Response Body**:
    ```json
    [
      {
        "participant_id": 2,
        "answer": true,
        "creation_date": "2023-07-30",
        "additional_notes": "I love it"
      },
      {
        "participant_id": 3,
        "answer": false,
        "creation_date": "2023-07-30",
        "additional_notes": "I don’t like fruits"
      }
    ]
    ```
- **Status Code**: 200 OK
- **Error Handling**:
    - If the requested question_id does not have any answer, return 404 Not Found.

### Section B: Infuse Gamification

#### Game Users

##### POST /gameuser
Create a new game user.

- **URL**: `http://localhost:3000/gameuser`
- **Method**: POST
- **Request Body**:
    ```json
    {
      "username": "gamer123"
    }
    ```
- **Response Body**:
    ```json
    {
      "message": "Game user created successfully",
      "user": {
          "user_id": 1,
          "username": "gamer123",
          "points": 0
      }
    }
    ```
- **Status Code**: 201 Created
- **Error Handling**:
    - If the provided username is already associated with another user, return 409 Conflict.
    - If the request body is missing username, return 400 Bad Request.

##### GET /gameuser
Retrieve a list of all game users.

- **URL**: `http://localhost:3000/gameuser`
- **Method**: GET
- **Response Body**:
    ```json
    [
      {
        "user_id": 1,
        "username": "gamer123",
        "points": 0
      },
      {
        "user_id": 2,
        "username": "player456",
        "points": 0
      }
    ]
    ```
- **Status Code**: 200 OK

##### PUT /gameuser/{user_id}
Update game user details.

- **URL**: `http://localhost:3000/gameuser/{user_id}`
- **Method**: PUT
- **Request Body**:
    ```json
    {
      "username": "newgamer123"
    }
    ```
- **Response Body**:
    ```json
    {
    "message": "Game user updated successfully"
    }
    ```
- **Status Code**: 200 OK
- **Error Handling**:
    - If the requested user_id does not exist, return 404 Not Found.
    - If the provided username is already associated with another user, return 409 Conflict.

#### Quests

##### POST /quests
Create a new quest.

- **URL**: `http://localhost:3000/quests`
- **Method**: POST
- **Request Body**:
    ```json
    {
      "title": "Find the Hidden Treasure",
      "description": "Locate the hidden treasure in the forest.",
      "reward_points": 50,
      "min_points": 10
    }
    ```
- **Response Body**:
    ```json
    {
      "quest_id": 1,
      "title": "Find the Hidden Treasure",
      "description": "Locate the hidden treasure in the forest.",
      "reward_points": 50,
      "min_points": 10
    }
    ```
- **Status Code**: 201 Created

##### GET /quests
Retrieve all quests.

- **URL**: `http://localhost:3000/quests`
- **Method**: GET
- **Response Body**:
    ```json
    [
      {
        "quest_id": 1,
        "title": "Find the Hidden Treasure",
        "description": "Locate the hidden treasure in the forest.",
        "reward_points": 50,
        "min_points": 10
      }
    ]
    ```
- **Status Code**: 200 OK

##### POST /quests/{quest_id}/start
Start a quest.

- **URL**: `http://localhost:3000/quests/{quest_id}/start`
- **Method**: POST
- **Request Body**:
    ```json
    {
      "user_id": 1
    }
    ```
- **Response Body**:
    ```json
   {
    "message": "Quest started successfully",
    "progress": {
        "progress_id": 1,
        "user_id": 1,
        "quest_id": "1",
        "status": "in-progress",
        "updated_status": "2024-06-20T20:43:49.573Z"
    }
  }
    ```

- **Status Code**: 201 Created
- **Error Handling**:
    - If the requested quest_id does not exist, return 404 Not Found.
    - If the request body is missing user_id, return 400 Bad Request.
    - If the user does not have enough points to start the quest, return 400 Bad Request.

##### POST /quests/{quest_id}/complete
Complete a quest.

- **URL**: `http://localhost:3000/quests/{quest_id}/complete`
- **Method**: POST
- **Request Body**:
    ```json
    {
      "user_id": 1
    }
    ```
- **Response Body**:
    ```json
    {
    "message": "Quest completed successfully and points awarded",
    "progress": {
        "progress_id": 0,
        "user_id": 122,
        "quest_id": "1",
        "status": "completed",
        "updated_status": "2024-06-20T20:45:26.093Z"
    }
  }
    ```

- **Status Code**: 200 OK
- **Error Handling**:
    - If the requested quest_id does not exist, return 404 Not Found.
    - If the request body is missing user_id, return 400 Bad Request.


#### Classes

##### POST /classes
Create a new class.

- **URL**: `http://localhost:3000/classes`
- **Method**: POST
- **Request Body**:
    ```json
    {
      "name": "Warrior",
      "description": "Strong and brave.",
      "required_points": 100
    }
    ```
- **Response Body**:
    ```json
    {
      "class_id": 1,
      "name": "Warrior",
      "description": "Strong and brave.",
      "required_points": 100
    }
    ```
- **Status Code**: 201 Created
- **Error Handling**:
    - If the request body is missing name, description, or required_points, return 400 Bad Request.

##### GET /classes
Retrieve all classes.

- **URL**: `http://localhost:3000/classes`
- **Method**: GET
- **Response Body**:
    ```json
    [
      {
        "class_id": 1,
        "name": "Warrior",
        "description": "Strong and brave.",
        "required_points": 100
      }
    ]
    ```
- **Status Code**: 200 OK

##### PUT /classes/{class_id}
Update class details.

- **URL**: `http://localhost:3000/classes/{class_id}`
- **Method**: PUT
- **Request Body**:
    ```json
    {
      "name": "Warrior",
      "description": "Strong and brave.",
      "required_points": 200
    }
    ```
- **Response Body**:
    ```json
    {
      "message": "Class updated successfully"
    }
    ```
- **Status Code**: 200 OK
- **Error Handling**:
    - If the requested class_id does not exist, return 404 Not Found.
    - If the request body is missing name, description, or required_points, return 400 Bad Request.

##### DELETE /classes/{class_id}
Delete a class.

- **URL**: `http://localhost:3000/classes/{class_id}`
- **Method**: DELETE
- **Response Body**:
    ```json
    {
      "message": "Class deleted successfully"
    }
    ```
- **Status Code**: 200 OK
- **Error Handling**:
    - If the requested class_id does not exist, return 404 Not Found.

##### POST /classes/{class_id}/attend
Attend a class.

- **URL**: `http://localhost:3000/classes/{class_id}/attend`
- **Method**: POST
- **Request Body**:
    ```json
    {
      "user_id": 1
    }
    ```
- **Response Body**:
    ```json
    {
      "message": "Class attended successfully"
    }
    ```
- **Status Code**: 201 Created
- **Error Handling**:
    - If the requested class_id does not exist, return 404 Not Found.
    - If the request body is missing user_id, return 400 Bad Request.
    - If the user does not have enough points to attend the class, return 400 Bad Request.

### Spells

##### POST /spells
Create a new spell.

- **URL**: `http://localhost:3000/spells`
- **Method**: POST
- **Request Body**:
    ```json
    {
      "name": "Fireball",
      "description": "A powerful fire spell.",
      "power": 50
    }
    ```
- **Response Body**:
    ```json
    {
      "spell_id": 1,
      "name": "Fireball",
      "description": "A powerful fire spell.",
      "power": 50
    }
    ```
- **Status Code**: 201 Created
- **Error Handling**:
    - If the request body is missing name, description, or power, return 400 Bad Request.

##### GET /spells
Retrieve all spells.

- **URL**: `http://localhost:3000/spells`
- **Method**: GET
- **Response Body**:
    ```json
    [
      {
        "spell_id": 1,
        "name": "Fireball",
        "description": "A powerful fire spell.",
        "power": 50
      }
    ]
    ```
- **Status Code**: 200 OK

##### PUT /spells/{spell_id}
Update spell details.

- **URL**: `http://localhost:3000/spells/{spell_id}`
- **Method**: PUT
- **Request Body**:
    ```json
    {
      "name": "Fireball",
      "description": "A powerful fire spell.",
      "power": 100
    }
    ```
- **Response Body**:
    ```json
    {
      "message": "Spell updated successfully"
    }
    ```
- **Status Code**: 200 OK
- **Error Handling**:
    - If the requested spell_id does not exist, return 404 Not Found.
    - If the request body is missing name, description, or power, return 400 Bad Request.

##### DELETE /spells/{spell_id}
Delete a spell.

- **URL**: `http://localhost:3000/spells/{spell_id}`
- **Method**: DELETE
- **Response Body**:
    ```json
    {
      "message": "Spell deleted successfully"
    }
    ```
- **Status Code**: 200 OK
- **Error Handling**:
    - If the requested spell_id does not exist, return 404 Not Found.

### Character Customization

##### POST /customization
Create or update character customization.

- **URL**: `http://localhost:3000/customization`
- **Method**: POST
- **Request Body**:
    ```json
    {
      "user_id": 1,
      "appearance": "Tall, wearing a red robe",
      "abilities": "Fire magic, healing"
    }
    ```
- **Response Body**:
    ```json
    {
      "customization_id": 1,
      "user_id": 1,
      "appearance": "Tall, wearing a red robe",
      "abilities": "Fire magic, healing"
    }
    ```
- **Status Code**: 201 Created
- **Error Handling**:
    - If the request body is missing user_id, appearance, or abilities, return 400 Bad Request.
    - If the user_id does not exist, return 404 Not Found.

##### GET /customization/{user_id}
Retrieve customization details of a specific user.

- **URL**: `http://localhost:3000/customization/{user_id}`
- **Method**: GET
- **Response Body**:
    ```json
    {
      "customization_id": 1,
      "user_id": 1,
      "appearance": "Tall, wearing a red robe",
      "abilities": "Fire magic, healing"
    }
    ```
- **Status Code**: 200 OK

- **Error Handling**:
    - If the requested user_id does not exist, return 404 Not Found.

##### PUT /customization/{user_id}
Update character customization.

- **URL**: `http://localhost:3000/customization/{user_id}`
- **Method**: PUT
- **Request Body**:
    ```json
    {
      "appearance": "Tall, wearing a red robe",
      "abilities": "Fire magic, healing, invisibility"
    }
    ```
- **Response Body**:
    ```json
    {
    "customization_id": 0,
    "user_id": "1",
    "appearance": "Tall, wearing a red robe",
    "abilities": "Fire magic, healing, invisibility"
    }
    ```
- **Status Code**: 200 OK
- **Error Handling**:
    - If the requested user_id does not exist, return 404 Not Found.
    - If the request body is missing appearance or abilities, return 400 Bad Request.

## Testing
Use Postman to test the endpoints. You can refer to the project documentation to see the screenshots of the Postman tests.
