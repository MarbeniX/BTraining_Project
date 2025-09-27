# BTraining

This repository contains **two versions** of the BTraining application:  
- **Version 1:** Initial prototype with basic features and design.  
- **Version 2:** Official version with improved design, complete functionality, and a more robust architecture.  

**BTraining** is a full-stack fitness assistant for calisthenics and gym workouts, designed to help users plan, track, and manage workout routines efficiently following the **MVC architecture**.

## Features

- **Complete login system** with user authentication  
- **Gmail service integration** for emails, change password, reset password, change email, delete account, etc.
- **Design of your own routine** - create, personalized and design the the routines you want. Search through a search bar the exercises you want to add
- **CRUD for workout routines** – create, update, view, and delete custom routines  
- **CRUD for training sessions** – track session progress and history  
- **Role-based access** – different views and permissions for admins and regular users  
- **Validation** – input validation to ensure data integrity  
- **JWT** – persistent sessions and secure authentication  
- **File uploads** – upload files related to workouts or exercises  
- **CRUD for exercises** – manage exercise database directly from the app. JUST FOR ADMINS
- **PDF reports** – generate reports of completed workouts  

## Technologies Used

### Frontend
- React, TypeScript, Tailwind CSS, Zustand, Zod, Axios  

### Backend
- **Version 1 (prototype):** Java, Spring Boot, Maven  
- **Version 2 (official):** Node.js, TypeScript, JavaScript, Express

### Database
- MongoDB, Mongoose  
