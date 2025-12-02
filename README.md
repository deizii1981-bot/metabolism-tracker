* # &nbsp;Metabolism Tracker — Clinic Information System



A full-stack JavaScript-based information system built for a clinic to track:



&nbsp;	Patient demographic details



&nbsp;	Metabolism records (Weight, BMI, BMR, Notes, Date)



&nbsp;	CRUD operations through a custom backend API



&nbsp;	Frontend interface for clinic staff



&nbsp;	lightweight database based on a JSON File 



&nbsp;	Automated testing



* This project is built as part of a university module focusing on:



&nbsp;	API design



&nbsp;	CRUD implementation



&nbsp;	Folder architecture



&nbsp;	Testing



&nbsp;	Version control (Git \& GitHub)



&nbsp;	Real-world applied information systems



* &nbsp;Technologies Used



1. Backend:



&nbsp;	Node.js



&nbsp;	Express.js



&nbsp;	CORS



&nbsp;	JSON File Database (db.json)



&nbsp;	Custom-built CRUD API



2.Frontend:



&nbsp;	HTML5



&nbsp;	Vanilla JavaScript



&nbsp;	Fetch API



3.Version Control:



&nbsp;	Git



&nbsp;	GitHub



* Project Folder Structure



metabolism-tracker/

│

├── backend/

│   ├── server.js  - Main API server

│   ├── db.json    - JSON database

│   ├── package.json  -Backend dependencies

│   └── node\_modules/  -Auto-installed dependencies

│

├── frontend/

│   ├── index.html  - Main UI

│   └── app.js      - API calls + UI logic

│

└── README.md       - Documentation





The endpoints are tested using the frontend UI.



* &nbsp;Key Features



1\. Add patients

2\. View patients

3\. Add metabolism records

4\. CRUD for records

5\. JSON local DB

6\. Full working UI

7\. Full working backend API

8\. GitHub version control

9\. Real-world architecture







Name: Anjali Patil

Student ID: 20079200

College: Dublin Business School

Metabolism Tracker — Clinic Information System





📦 Running Automated Tests (Jest)



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

