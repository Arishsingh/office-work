# mern-login-app

A full-stack task management application with authentication, built with MongoDB, Express, React, and Node.js.

---

## Stack

- **Frontend** — React 18, Vite, Axios
- **Backend** — Node.js, Express.js
- **Database** — MongoDB, Mongoose
- **Auth** — JWT, bcryptjs

---

## Project Structure

```
mern-login-app/
├── server/
│   ├── server.js
│   ├── package.json
│   └── .env.example
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── styles/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── vite.config.js
│   └── package.json
└── package.json
```

---

## Setup

**Prerequisites:** Node.js v14+, MongoDB (local or Atlas)

### Install dependencies

```bash
npm run install-all
```

### Configure environment

```bash
cd server && cp .env.example .env
```

Edit `server/.env`:

```
PORT=5001
MONGODB_URI=mongodb://localhost:27017/mern-login
JWT_SECRET=your-secret-key
```

For MongoDB Atlas:

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/mern-login
```

### Run

```bash
npm run dev
```

- Frontend: http://localhost:3000
- Backend: http://localhost:5001

---

## API

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | Register a new user |
| POST | `/api/auth/login` | Login and receive JWT |
| GET | `/api/auth/profile` | Get current user profile |
| PUT | `/api/auth/profile` | Update name or password |
| GET | `/api/tasks` | Get all tasks |
| POST | `/api/tasks` | Create a task |
| PUT | `/api/tasks/:id` | Update a task |
| DELETE | `/api/tasks/:id` | Delete a task |
| GET | `/api/activity` | Get activity log |

---

## Troubleshooting

**MongoDB not connecting**
- Run `mongod` for local MongoDB, or switch to Atlas in `.env`

**Port in use**
- Change `PORT` in `.env` and update the proxy in `vite.config.js`

**CORS error**
- Confirm the backend is running and the Vite proxy target matches the server port

---

## Notes

- Change `JWT_SECRET` before deploying to production
- Never commit `.env` to version control
- Use HTTPS in production

---

## License

ISC
