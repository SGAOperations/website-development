# SGA Website Migration: Internal Custom CMS Form

This project aims to develop an internal application that enables administrators to efficiently update and manage the Student Government Association's website. It ensures a smooth content management process while maintaining a consistent visual template across all division board pages.

## Technologies
frontend：
- React.js: Allows for the use of reusable components so that big chunks of code don't have to be written again in different files.
- Tailwind CSS: Instead of writing an extensive list of styles in CSS files, Tailwind CSS allows styling through classes.
  
backend:
- MongoDB: Good for storing data, uses a JSON like schema to keep track of objects and information, easy to setup and to add/delete/update objects in the databse
- Node.js: Allows you to use JavaScript for both the frontend (in the browser) and the backend (on the server). Also scalability features + can run npm
- Express.js: Minimal and lightweight. Express has a powerful and flexible routing system that lets us define RESTful Api's too with lots of ease and is very flexible
## Deployment

## Setting up the development environment

### BACKEND

1. Before running the project, ensure you have the following installed:

Node.js (Download from nodejs.org)
MongoDB 
Express.js

2. Install Dependencies: `npm install` This will install all required Node.js dependencies from package.json.

3. Set Up Environment Variables:
   
Inside the backend folder, create a .env file: `touch .env`

Open .env and add the following:
```
MONGO_URI=mongodb://localhost:27017/usersdb
PORT=3000
```

4. Start MongoDB

`brew services start mongodb-community`

5. Run the Server

`npm start` or if using nodemon use `npm run dev`

You should see:
```
Server running on http://localhost:3000
MongoDB connected successfully
```

## Running the app

## To Do List:

## Contributors

Yurika
Arshia
Molly
Kevin
Audrey
Aditya
