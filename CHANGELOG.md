# BIG-AGI CHANGE LOG 🧠✨

Welcome to big-AGI upgraded version.
We customized BIG-AGI for AI-Seller project.
It wil help business to save assistant.

### What's New in 1.0.2 · Jan 03, 2024

- **Migration from MongoDB to PostgreSQL**: Built backend with PostgreSQL.
- **ORM**: TypeORM
- **Backend language and framework**: Typescript + Express.js
- **Database**: PostgreSQL

### What's New in 1.0.1 · Dec 28, 2023

- **Cors error fix**: Fixed cors issue in sending request to backend in localhost.
- **CRUD for Persona**: Completed CRUD for persona profile

### What's New in 1.0.0 · Dec 21, 2023

- **New Backend**: Independent backend with CRUD for Persona profiles.
- **Call button status**: Made call button as enable status with default value.
- **Remove text related chat**: Removed chat box for AI chat.
- **Remove unnecessary part**: Remove news autoload, news button, github, discord button
- **Push to talk**: Remove push to talk function
- **Concurrently**: Implemented concurrently functionality for run frontend and backend, database in one command
- **Change log**: Attached change log file to readme.md

## 🧩 How to install

Clone this repo, install the dependencies (all locally), and run the backend first, and frontend:

```bash
Node version: 18.16.0
git clone https://github.com/tsguru721/big-agi.git
cd big-agi
npm install
cd client
npm install
npm run dev
```

The development app will be running on
`http://localhost:3000` for frontend
`http://localhost:3001` for backend.

Made with Ioannis
