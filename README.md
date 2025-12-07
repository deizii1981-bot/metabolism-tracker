* #  Metabolism Tracker — Clinic Information System



A full-stack JavaScript-based information system built for a clinic to track:



 	Patient demographic details



 	Metabolism records (Weight, BMI, BMR, Notes, Date)



 	CRUD operations through a custom backend API



 	Frontend interface for clinic staff



 	lightweight database based on a JSON File



 	Automated testing



* This project is built as part of a university module focusing on:



 	API design



 	CRUD implementation



 	Folder architecture



 	Testing



 	Version control (Git \& GitHub)



 	Real-world applied information systems



*  Technologies Used



1. Backend:



 	Node.js



 	Express.js



 	CORS



 	JSON File Database (db.json)



 	Custom-built CRUD API

* &nbsp;API Endpoints (Backend Overview)



&nbsp;   The backend is a simple REST-style API built with Node.js and Express.  

&nbsp;   Key endpoints:



&nbsp;   - `GET /`  

&nbsp;   Returns a basic “API running” message. Used for quick health checks.



&nbsp;   - `GET /patients`  

&nbsp;   Returns the list of all patients stored in the JSON database.



&nbsp;   - `POST /patients`  

&nbsp;   Creates a new patient with metabolism-related details (e.g. age, weight, activity        level).



&nbsp;   - `PUT /patients/:id`  

&nbsp;   Updates an existing patient record.



&nbsp;   - `DELETE /patients/:id`  

&nbsp;   Deletes a patient record by ID.



&nbsp;   All responses are returned in JSON format, and the data is stored in              `backend/db.json` for this prototype.





2.Frontend:



 	HTML5



 	Vanilla JavaScript



 	Fetch API



3.Version Control:



 	Git



 	GitHub



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



*  Key Features



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

