## ** EduCode - Learning Platform
A Modern Web App for Interactive Coding, Courses, and Admin Management

## ** Table of Contents
        Project Overview

        Tech Stack

        Features

        Why Spring Boot → Node.js Transition

        Setup & Installation

        Database Schema

        API Documentation

        Testing

        Future Enhancements

        Contributing

## ** Project Overview
        EduCode is a full-stack learning platform with:

        Role-based dashboards (Admin, Instructor, Learner)

        Interactive coding lab with real-time execution (JavaScript/Python)

        Course management with progress tracking

        User management (CRUD operations for admins)

        Goal: Bridge the gap between theoretical learning and hands-on coding practice.

Tech Stack
    Frontend
        React.js (TypeScript)

        Tailwind CSS + Framer Motion (UI/Animations)

        Monaco Editor (VS Code-like code editor)

    Backend
        Node.js (Express) → Initially Spring Boot

        MySQL (Relational database)

        JWT Authentication

Tools
Git, Postman, Figma

## ** Features Description
Admin Dashboard	Real-time analytics (users, courses, revenue) with visual charts.
User Management	Admins can filter, edit, and delete users with role-based access control.
Coding Lab	Write/execute code in JavaScript/Python with test case validation.
Course System	Enroll in courses, track progress (%), and earn certificates.
Secure Auth	JWT-based login/registration with password strength enforcement.

## ** Setup & Installation
Prerequisites
Node.js ≥ 16, MySQL ≥ 8.0

** Steps **
- Clone the repo:
bash
git clone https://github.com/your-repo/educode.git

- Backend Setup:
bash
cd backend
npm install
cp .env.example .env  # Configure MySQL credentials
npm run migrate       # Run database migrations
npm run dev           # Start Node server

- Frontend Setup:
bash
cd frontend
npm install
npm run dev
Access: http://localhost:5173

## ** Database Schema
Key tables:
- users: id, email, role (Learner/Instructor/Admin)
- courses: title, level (Beginner/Intermediate/Advanced)
- challenges: starter_code, test_cases
- user_progress: Tracks course/challenge completion.

https://docs/er_diagram.png (Link to diagram in your repo)


## ** Testing
- Frontend: Jest + React Testing Library (npm test)
- Backend: Mocha/Chai (API tests in backend/tests/)
- Test Coverage: 85% (units + integration)

## ** Future Enhancements
- AI Code Assistant: Suggest fixes for coding challenges.
- Gamification: Badges, leaderboards.
- Mobile App: React Native support.

## ** Contributing
- Fork the repo.
- Create a branch: git checkout -b feature/your-feature.
- Submit a PR with tests.


## ** Contact: your-email@example.com
