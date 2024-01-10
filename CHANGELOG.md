# BIG-AGI CHANGE LOG 🧠✨

Welcome to big-AGI upgraded version.
We customized BIG-AGI for AI-Seller project.
It wil help business to save assistant.

### What's New in 1.0.6 · Jan 10, 2024

- **Category preview**: Implemented preview for create category page and edit category page
- **Dashboard page**: Show the categories boxes in the home page, replacing tree the current persona's
- **Dropdown in Persona**: Add the category drop down field into the Create Persona form
- **Category link**: Link avaliable categories
- **Add new category button**: In the persona webform, add a link to "Add new category"
- **Persona width**: Set a maximum width to the images
- **Persona by category**:  Be sure that only the linked personas are shown when clicking a category
  
### What's New in 1.0.5 · Jan 06, 2024

- **Category CRUD**: CRUD in backend and build create and edit category pages
- **env file setup**: Setup env for endpoint modification simply
- **Cors issue**: Fixed Cors issue for https backend
- **Call UI**: Implemented dynamic persona load in Call UI
- **Rename brand**: Renamed brand for app configuration
- **Textarea prompt field**: Changed input tag to textarea in create persona and edit persona pages
- **Edit persona by id**: Implemented edit persona by id from title
- **Unnecessary console.log**: Removed unnecessary console.log

### What's New in 1.0.4 · Jan 05, 2024

- **Concurrently**: Concurrently for production environment to run both backend and frontend in one terminal
- **Typescript React hook**: fixed typescript issues in variable declare to build successfully in next js frontend
- **env for next.js**: Introduced env file for next.js

### What's New in 1.0.3 · Jan 04, 2024

- **Concurrently**: Concurrently for development environment to run both backend and frontend in one terminal
- **PersonaSelector**: Persona selector's function position fix
- **Label modification**: Modified label of avatar upload form
- **Constant**: Setup constants for server url and port
- **Mongodb ignore**: Moved backend-mongodb to one folder
- **Place holder uppercase**: Place holder text 's first letter to uppercase

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
Node version: 20.10.0
git clone https://github.com/webmaster223/big-agi.git
cd big-agi/client
yarn install
cd big-agi/backend-postgresql
yarn install
npm run dev
```

The development app will be running on
`http://localhost:3000` for frontend
`http://localhost:3001` for backend

Made with Ioannis
