# YourHR - Job Search and Profile Management Web Application

## Overview

**YourHR** is a job search and profile management web application designed to help users find ideal job roles based on their qualifications and preferences. Users can sign up, manage their profiles, and receive tailored job recommendations. The application provides a seamless and user-friendly experience with a modern and responsive UI.

## Features

- **User Authentication**: Sign up and login functionality with JWT-based authentication.
- **Profile Management**: Users can update their profile details, including personal information and resume.
- **Resume Upload**: Users can upload their resumes, stored securely using MongoDB's GridFS.
- **Responsive UI**: A clean and intuitive interface that works across all devices.
- **User Testimonials**: Display feedback and testimonials from satisfied users.

## Architecture

### 1. **Frontend**

- **React.js**: The application is built using React, with React Router for client-side routing.
- **Tailwind CSS**: Tailwind is used for styling the application, ensuring a responsive and modern UI.
- **State Management**: Local state is managed using React's useState and useEffect hooks. Authentication data is stored in `localStorage`.

### 2. **Backend**

- **Node.js & Express.js**: The backend API is built with Express.js, handling user authentication, profile management, and file uploads.
- **JWT Authentication**: Secure authentication using JSON Web Tokens (JWT).
- **MongoDB & Mongoose**: MongoDB is used as the database, with Mongoose as the ORM. User data and resumes are stored in MongoDB, with resumes managed via GridFS.

### 3. **Database**

- **MongoDB**: 
  - **Users Collection**: Stores user details such as name, email, hashed password, and reference to the resume file.
  - **GridFS**: Used to store and retrieve large files (e.g., user resumes) in the MongoDB database. The default GridFS collections `fs.files` and `fs.chunks` are used.

### 4. **File Uploads**

- **GridFS**: 
  - Resumes uploaded by users are stored in MongoDB using GridFS. This allows for efficient storage and retrieval of large files.
  - The `User` model references the `resume` ObjectId in GridFS, allowing the application to associate resumes with user profiles.

## Project Structure

```plaintext
/yourhr
|-- /backend              # Backend API code
|   |-- /src
|       |-- /controllers  # Express route controllers
|       |-- /models       # Mongoose models
|       |-- /routes       # API routes
|       |-- /utils        # Utility functions
|       |-- /middlewares  # Custom middlewares
|-- /frontend             # Frontend React code
|   |-- /src
|       |-- /components   # React components
|       |-- /pages        # React pages (e.g., HomePage, ProfilePage)
|       |-- /assets       # Static assets (e.g., images, fonts)
|       |-- /styles       # Global and component-specific styles
|-- /uploads              # Directory for file uploads (if not using GridFS/ using Multer)
|-- README.md             # Project documentation


## Functionality

### 1. **Home Page**

- The home page is designed to be the first point of contact for users.
- It displays a welcoming message, provides navigation links, and highlights key features.
- The background image adds visual appeal, with a semi-transparent overlay ensuring text readability.

### 2. **Authentication**

- Users can sign up or log in to the application.
- Upon successful login, a JWT token is generated and stored in `localStorage` for subsequent authenticated requests.

### 3. **Profile Management**

- After logging in, users are redirected to their profile page.
- Users can view and update their personal information, upload a resume, and manage other profile details.

### 4. **Resume Upload**

- Users can upload their resumes directly from the profile page.
- The resumes are stored in MongoDB using GridFS and linked to the user profile.

### 5. **Job Recommendations**

- The application provides tailored job recommendations based on user data.
- Recommendations are displayed on the profile page, with easy access to job application links.

## Installation & Setup

### Prerequisites

- Node.js and npm installed
- MongoDB installed and running

### Backend Setup

1. Navigate to the `backend` directory:
   ```bash
   cd backend
2. Install dependencies:
    ```bash
    npm install
3. Set up environment variables in a .env file:
    ```bash
    MONGO_URI=<your-mongodb-connection-string>
    JWT_SECRET=<your-jwt-secret>
4. Start the backend server:
    ```bash
    npm start
### Frontend Setup
1. Navigate to the `frontend` directory:
    ```bash
   cd Frontend
2. Install dependencies:
     ```bash
    npm install

3. Start the React development server:
    ```bash
    npm start

## Running the Application

- Open your browser and navigate to http://localhost:3000 to access the frontend.

- The backend API is accessible at http://localhost:5000.
