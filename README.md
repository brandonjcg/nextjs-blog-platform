# Next.js Blog Platform

A full-stack blog platform built with Next.js using the App Router, MongoDB, and JWT-based authentication.  
Features role-based access control and CRUD operations for posts and comments.

## Features

- JWT-based authentication and role-based access control.
- Admin can delete any post/comment, while general users can only delete their own.
- Dynamic routing for post details pages.
- MongoDB integration for storing users, posts, and comments.
- Responsive and user-friendly design.

## Tech Stack

- **Frontend:** React with Next.js (App Router)
- **Backend:** Next.js API routes
- **Database:** MongoDB
- **Authentication:** JSON Web Tokens (JWT)
- **State Management:** React Query (Tanstack Query)
- **Password Hashing:** bcryptjs

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (version 16 or higher)
- [MongoDB](https://www.mongodb.com/) (local or Atlas)

### Clone the Repository

```bash
git clone https://github.com/jatin-3009/nextjs-blog-platform.git
cd nextjs-blog-platform
```

Install Dependencies

```bash
npm install
```

This will install the necessary dependencies, including:

### Dependencies

- `mongoose` for MongoDB integration
- `jsonwebtoken` for JWT authentication
- `bcryptjs` for password hashing
- `@tanstack/react-query` for state management

### Set Up MongoDB

1. If you're using **MongoDB Atlas**, create a new cluster and get your connection string.
2. If you're using a **local MongoDB instance**, make sure it's running on `mongodb://localhost:27017`.

Update the MongoDB URI in the `.env` file with your connection string.

### Run the Application

Run the following command to start the application:

```bash
npm run dev
```

Navigate to http://localhost:3000 in your browser to start using the app.
