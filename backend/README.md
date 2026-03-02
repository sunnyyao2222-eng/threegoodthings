# Three Good Things - Backend API

Backend API for the Three Good Things application.

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

Required environment variables:
- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT tokens
- `GOOGLE_CLIENT_ID`: Google OAuth client ID
- `GOOGLE_CLIENT_SECRET`: Google OAuth client secret
- `OPENAI_API_KEY`: OpenAI API key (optional)

### 3. Start Development Server

```bash
npm run dev
```

Server will run on `http://localhost:3000`

### 4. Build for Production

```bash
npm run build
npm start
```

## 📚 API Documentation

### Authentication

#### Register
```
POST /api/auth/register
Body: { email, password, nickname }
```

#### Login
```
POST /api/auth/login
Body: { email, password }
```

#### Google Login
```
GET /api/auth/google
```

#### Guest Login
```
POST /api/auth/guest
Body: { deviceId }
```

#### Upgrade Guest Account
```
POST /api/auth/upgrade
Headers: { Authorization: Bearer <token> }
Body: { email, password, nickname }
```

### User

#### Get Profile
```
GET /api/user/profile
Headers: { Authorization: Bearer <token> }
```

#### Update Profile
```
PUT /api/user/profile
Headers: { Authorization: Bearer <token> }
Body: { nickname?, avatar? }
```

### Records

#### Create Record
```
POST /api/records
Headers: { Authorization: Bearer <token> }
Body: { content, imageUrl?, voiceUrl?, isPublic? }
```

#### Get Records
```
GET /api/records?page=1&limit=20&startDate=2024-01-01&endDate=2024-12-31
Headers: { Authorization: Bearer <token> }
```

#### Get Today's Records
```
GET /api/records/today
Headers: { Authorization: Bearer <token> }
```

#### Delete Record
```
DELETE /api/records/:id
Headers: { Authorization: Bearer <token> }
```

#### Get Public Feed
```
GET /api/records/public/feed?page=1&limit=20
```

### AI

#### Chat with AI
```
POST /api/ai/chat
Body: { messages: [{ role: 'user', content: 'Hello' }] }
```

## 🗄️ Database Schema

### Users Collection
- email (unique)
- password (hashed)
- googleId (optional)
- nickname
- avatar
- isGuest
- isVIP
- totalPoints
- treeStage
- streakDays

### Records Collection
- userId (ref: User)
- content
- category
- aiFeedback
- points
- date
- isPublic
- resonanceCount

### Achievements Collection
- userId (ref: User)
- badgeId
- badgeName
- unlockedAt

## 🔐 Security

- Passwords hashed with bcrypt
- JWT authentication
- CORS enabled
- Helmet for security headers
- Input validation with express-validator

## 📦 Tech Stack

- Node.js + Express
- TypeScript
- MongoDB + Mongoose
- JWT + Passport
- OpenAI API
- bcryptjs

## 🚢 Deployment

### Railway

1. Create new project on Railway
2. Add MongoDB service
3. Add environment variables
4. Deploy from GitHub

### Render

1. Create new Web Service
2. Connect to MongoDB Atlas
3. Add environment variables
4. Deploy

## 📝 License

MIT
