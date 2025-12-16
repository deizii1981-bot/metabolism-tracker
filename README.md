* #  Metabolism Tracker — Clinic Information System

This project is a simple clinical information system developed to understand how patient data can be collected, processed, stored, and reused within a healthcare context. I chose a metabolism tracking system because it allowed me to work with realistic health-related data such as height, weight, age, and gender, and to apply calculations like BMI and BMR. As a beginner, this project helped me understand how an information system works end-to-end, including frontend interaction, backend logic, data storage, and deployment.

Technologies and Tools Used

HTML, CSS, and JavaScript for the frontend interface

Node.js and Express.js for the backend API

JSON-based file storage for managing patient and record data

Jest for basic automated backend testing

Render for hosting and deployment

Features and Enhancements Implemented

Patient registration with personal details

Automatic age calculation from date of birth

Automatic BMI and BMR calculation based on height, weight, age, and gender

Storage and display of multiple metabolism records per patient

Ability to delete existing records

Persistent storage enabled on the hosted version to prevent data loss

Challenges Faced During Development

Initially faced issues with frontend and backend communication, especially when working with API requests

Encountered problems after deployment due to hardcoded localhost URLs, which were fixed by using relative API paths

Data loss on the hosted environment was resolved by enabling persistent storage on Render

These issues were identified and fixed through manual testing, debugging, and reviewing network requests

Testing Performed

Basic automated tests were implemented using Jest to verify that the backend API endpoints are accessible and functioning correctly. These tests focus on ensuring that the server runs correctly and that core patient-related routes respond as expected. In addition to automated tests, manual testing was carried out to verify frontend functionality such as adding patients, calculating BMI and BMR, displaying records, and deleting records.

To run the automated tests locally:

cd backend
npm install
node server.js
npm test

Project Links

GitHub Repository:
https://github.com/deizii1981-bot/metabolism-tracker

Live Application (Render):
https://metabolism-tracker.onrender.com

chatGPT chat: 
https://chatgpt.com/share/6940892a-e670-8011-bc8e-a203f7fc668b

Running Automated Tests (Jest)
Follow these steps to run the automated test suite used in this project:

Open a terminal inside the backend folder:
cd backend

Install all required backend dependencies:
npm install

Ensure the backend server is running in another window:
node server.js

Run the Jest test suite:
npm test

The following tests will run:
patient.test.js – verifies that the database file loads correctly
api.test.js – integration test that checks the API root endpoint
All tests must pass for the system to be considered fully operational.

AI Assistance Disclosure:

Some initial guidance was assisted by ChatGPT. The final implementation was reviewed, modified, debugged, and extended by me, and all features were tested and understood during development.

Name: Anjali Patil

Student ID: 20079200

Metabolism Tracker — Clinic Information System

