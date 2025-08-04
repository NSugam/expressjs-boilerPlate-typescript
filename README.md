# Express.js Boilerplate with TypeScript

A clean and structured Express.js boilerplate written in TypeScript. Designed for scalable backend applications with support for modular routing, JWT authentication, file uploads, environment-based config, and more.

## 🚀 Features

- ✅ TypeScript support
- ✅ Express.js setup
- ✅ Modular route structure
- ✅ Environment-based config via `.env`
- ✅ JWT Authentication middleware
- ✅ Centralized error handler
- ✅ MongoDB with Mongoose
- ✅ File uploads using Multer
- ✅ CORS & cookie-parser integrated
- ✅ Nodemon for development
- ✅ Production-ready build setup

## 📁 File Upload (Multer)
Multer is used to handle file uploads. Uploaded files are stored in the /uploads directory. You can configure file size limits, field names, and destination as needed in the file upload middleware.

## 🔐 Authentication
JWT-based auth is handled by the checkAuth middleware. Public routes are defined in the PUBLIC_ROUTES array inside the auth middleware file.

## 🛠️ Setup Instructions

### 1. Clone the Repo

```bash
git clone https://github.com/NSugam/expressjs-boilerPlate-typescript.git
cd expressjs-boilerPlate-typescript
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment
Create a .env file in the Backend folder. A sample .env.sample is included for the reference.

### 4. Run the App
Development: 
```bash
npm run start:dev
```
Production: 
```bash
npm run build
npm start
```

MIT License © 2025 NSugam
