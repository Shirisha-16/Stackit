# Q&A Platform - Hackathon Project

A modern question and answer platform built with React and Node.js, featuring user authentication, rich text editing, and voting system.

## 🚀 Features

- **User Authentication** - Register, login, and secure JWT-based sessions
- **Question Management** - Ask, view, edit, and delete questions
- **Rich Text Editor** - Create formatted questions and answers with React Quill
- **Voting System** - Upvote/downvote questions and answers
- **Tagging System** - Organize questions with tags
- **Responsive Design** - Works on desktop and mobile devices
- **Real-time Updates** - Dynamic content updates without page refresh

## 🛠️ Tech Stack

### Frontend
- **React** 19.x - UI framework
- **React Router** - Navigation and routing
- **React Quill** - Rich text editor
- **Lucide React** - Icons
- **React Hot Toast** - Notifications
- **Axios** - HTTP client

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication tokens
- **bcrypt** - Password hashing

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **MongoDB** (local installation or MongoDB Atlas)

## 🔧 Installation

### 1. Clone the Repository
```bash
git clone https://github.com/Shirisha-16/Stackit.git
cd Stackit
```

### 2. Backend Setup

```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env with your configuration
nano .env
```

#### Environment Variables (.env)
```env
JWT_SECRET=your-super-secret-jwt-key-here
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/qa_platform
```

#### Generate JWT Secret
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 3. Frontend Setup

```bash
# Navigate to client directory
cd ../client

# Install dependencies
npm install --legacy-peer-deps

# Create environment file (optional)
cp .env.example .env
```

#### Client Environment Variables (.env)
```env
REACT_APP_API_URL=http://localhost:5000/api
```

### 4. Database Setup

#### Option A: Local MongoDB
```bash
# Start MongoDB service
mongod

# Create database (optional - will be created automatically)
mongo
> use qa_platform
```

#### Option B: MongoDB Atlas
1. Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create cluster and get connection string
3. Update `MONGO_URI` in server `.env` file

## 🚀 Running the Application

### Development Mode

#### Terminal 1 - Backend
```bash
cd server
npm run dev
```
Server will run on `http://localhost:5000`

#### Terminal 2 - Frontend
```bash
cd client
npm start
```
Frontend will run on `http://localhost:3000`

### Production Mode

#### Backend
```bash
cd server
npm run build
npm start
```

#### Frontend
```bash
cd client
npm run build
# Deploy the build folder to your hosting service
```

## 📁 Project Structure

```
qa-platform/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   │   ├── Answers/    # Answer related components
│   │   │   ├── Questions/  # Question related components
│   │   │   └── Common/     # Shared components
│   │   ├── contexts/       # React contexts
│   │   ├── pages/          # Page components
│   │   ├── api/           # API integration
│   │   ├── styles/        # CSS files
│   │   └── utils/         # Utility functions
│   ├── package.json
│   └── .env
├── server/                 # Node.js backend
│   ├── controllers/        # Route handlers
│   ├── middleware/         # Custom middleware
│   ├── models/            # Database models
│   ├── routes/            # API routes
│   ├── utils/             # Utility functions
│   ├── server.js          # Entry point
│   ├── package.json
│   └── .env
├── README.md
└── .gitignore
```

## 🔐 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Questions
- `GET /api/questions` - Get all questions
- `GET /api/questions/:id` - Get specific question
- `POST /api/questions` - Create new question
- `PUT /api/questions/:id` - Update question
- `DELETE /api/questions/:id` - Delete question
- `POST /api/questions/:id/vote` - Vote on question

### Answers
- `GET /api/answers/:questionId` - Get answers for question
- `POST /api/answers` - Create new answer
- `PUT /api/answers/:id` - Update answer
- `DELETE /api/answers/:id` - Delete answer
- `POST /api/answers/:id/vote` - Vote on answer




## 🚀 Deployment

### Backend Deployment (Heroku)
```bash
# Install Heroku CLI
npm install -g heroku

# Login to Heroku
heroku login

# Create app
heroku create your-app-name

# Set environment variables
heroku config:set JWT_SECRET=your-secret
heroku config:set MONGO_URI=your-mongodb-uri
heroku config:set NODE_ENV=production

# Deploy
git push heroku main
```

### Frontend Deployment (Netlify)
```bash
# Build the app
cd client
npm run build

# Deploy build folder to Netlify
# Or connect GitHub repo for automatic deployment
```

## 🐛 Troubleshooting

### Common Issues

#### Module Resolution Error
```bash
# If you get module resolution errors
cd client
npm install --legacy-peer-deps
```

#### Database Connection Error
```bash
# Check MongoDB is running
mongod

# Verify connection string in .env
MONGO_URI=mongodb://localhost:27017/qa_platform
```

#### React Quill Compatibility
```bash
# If React Quill has peer dependency issues
npm install react-quill --legacy-peer-deps
```

#### Port Already in Use
```bash
# Find process using port
lsof -i :5000

# Kill process
kill -9 PID
```

## 📝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request



- **Frontend Developer** - React, UI/UX
- **Backend Developer** - Node.js, Database
- **Full Stack Developer** - Integration, Deployment

## Acknowledgments

- React community for amazing tools
- MongoDB for flexible database
- All contributors who helped with this project

## Support

If you have any questions or need help:
- Create an issue on GitHub
- Contact the development team
- Check the documentation

---

**Happy Coding!**
