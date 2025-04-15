# SGA Website Migration: Internal Custom CMS Application

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
- setting up shared mongodb:
    1. Make sure to have latest .env file pulled https://github.com/SGAOperationalAffairs/website-development/blob/main/backend/.env 
    2. Download MongoDB Compass https://www.mongodb.com/products/tools/compass
    3. Add a new connection using the database URI: mongodb+srv://SGA:Password1!@sgacluster.6dveb.mongodb.net/
    4. npm run backend folder
    5. npm run frontend folder
    6. navigate to localhost:/5000/ edit-mode
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

### Authentication:

First, install all dependencies:

```sh
npm install express mongoose dotenv jsonwebtoken bcryptjs cors
```
Create a .env file in the root directory and add the following:
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
PORT=5001


Generate a secure JWT secret key (if you don’t have one, generate it using Node.js):
`node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`


Auth Endpoint Example: 
Endpoint: POST /auth/register   (register a new user)
Body Example:
```
{
  "name": "Admin User",
  "email": "admin@example.com",
  "password": "securepassword",
  "divisionName": "Senate",
  "role": "leader",
  "isAdmin": true
}
```

Response being successful:
```
{
  "message": "User registered successfully"
}
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
