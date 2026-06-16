# MERN Stack Login Application

A modern, responsive login/signup application built with the MERN stack (MongoDB, Express, React, Node.js).

## Features

✨ **Modern UI Design**
- Clean, professional login and signup forms
- Dark theme with gradient accents
- Fully responsive design (mobile, tablet, desktop)
- Smooth animations and transitions

🔐 **Authentication**
- User registration with email and password
- Secure password hashing with bcryptjs
- JWT token-based authentication
- Password confirmation validation

🎨 **Technology Stack**
- **Frontend**: React 18 + Vite
- **Backend**: Express.js + Node.js
- **Database**: MongoDB
- **Authentication**: JWT + bcryptjs
- **HTTP Client**: Axios

## Project Structure

```
mern-login-app/
├── server/
│   ├── server.js           # Express server setup
│   ├── package.json        # Server dependencies
│   └── .env.example        # Environment variables example
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── LoginForm.jsx
│   │   │   └── SignupForm.jsx
│   │   ├── styles/
│   │   │   └── AuthForm.css
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
├── package.json            # Root package.json
└── README.md
```

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### 1. Clone or Extract the Project

```bash
cd mern-login-app
```

### 2. Install Dependencies

```bash
npm run install-all
```

Or manually:

```bash
# Install root dependencies
npm install

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 3. Set Up Environment Variables

#### Server (.env)
```bash
cd server
cp .env.example .env
```

Edit `server/.env`:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/mern-login
JWT_SECRET=your-secret-key-change-in-production
```

**For MongoDB Atlas:**
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/mern-login?retryWrites=true&w=majority
```

### 4. Start MongoDB

**Local MongoDB:**
```bash
mongod
```

**Or use MongoDB Atlas** - Update the connection string in `.env`

### 5. Run the Application

From the root directory:

```bash
npm run dev
```

This will start:
- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:5000

### Individual Startup

```bash
# Terminal 1 - Server
npm run server

# Terminal 2 - Client
npm run client
```

## API Endpoints

### Authentication

**POST `/api/auth/signup`**
- Register a new user
- Body: `{ email: string, password: string }`
- Returns: `{ token, user: { id, email } }`

**POST `/api/auth/login`**
- Login an existing user
- Body: `{ email: string, password: string }`
- Returns: `{ token, user: { id, email } }`

## Usage

1. **Create Account**: Click "Create one" on the login page
2. **Fill Form**: Enter email and password
3. **Confirm Password**: Re-enter password to confirm
4. **Sign Up**: Click "Start Creating"
5. **Login**: Use your credentials to sign in
6. **Token Storage**: JWT token is stored in localStorage

## Features in Detail

### Frontend
- Login form with email and password validation
- Signup form with password confirmation
- Error and success messages
- Loading states
- Responsive design
- Form state management with React hooks
- API calls with Axios

### Backend
- Express.js REST API
- MongoDB integration with Mongoose
- Bcryptjs for password hashing
- JWT for token generation
- CORS enabled for frontend communication
- Error handling and validation

## Testing

### Test Signup
1. Go to http://localhost:3000
2. Click "Create one"
3. Enter a test email and password
4. Click "Start Creating"

### Test Login
1. Use the credentials from signup
2. Enter email and password
3. Click "Sign In"

### Successful Login
- Token saved to localStorage
- Redirects to /dashboard (you can modify this)

## Troubleshooting

### MongoDB Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
- Start MongoDB service: `mongod`
- Or update MONGODB_URI to use MongoDB Atlas

### Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::5000
```
- Change PORT in `.env` to another port (e.g., 5001)
- Update proxy in `vite.config.js` accordingly

### CORS Error
- Check that backend is running on http://localhost:5000
- Ensure vite.config.js proxy is correctly configured

## Security Notes

⚠️ **Development Only**
- Change `JWT_SECRET` in production
- Use HTTPS in production
- Never commit `.env` file
- Add rate limiting
- Implement refresh tokens
- Add email verification

## Next Steps

- Add email verification
- Implement password reset
- Add profile management
- Implement refresh tokens
- Add 2FA authentication
- Add OAuth (Google, GitHub)
- Add user dashboard
- Add session management

## License

ISC

## Support

For issues or questions, check:
- MongoDB connection settings
- Backend server logs
- Browser console for frontend errors
- Network tab in browser DevTools
# office-work
