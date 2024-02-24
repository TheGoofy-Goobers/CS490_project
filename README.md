# CS490_project
CS490 Code ChatGPT Translator

### Project Overview

We are creating a code translation tool that will allow users to translate blocks of code from one language to another. The project uses the GPT API to perform the translation. Technologies involved include the following:

- Backend: Python with Flask
- Frontend: React
- Database: MySQL
- Hosting/Deployment: Azure
- Testing: Jest

Responsibilities are broken down as follows:

| Name | Role |
|------|------|
| Hamdi Korreshi | Project Manager and DevOps |
| Jason Cho | Flex, Backend |
| Dzejla Arapovic | Frontend, Database, Backend |
| Matthew DeFranceschi | Backend, Database |
| Naman Raval | Frontend, Backend |

### Repository Structure
```
root/
 - backend/
 - - functions/
 - - db/
 - - api/
 - web/
 - - landing page
 - - about
 - - translation page
 - - admin/
 - .git/
 - .env
 - .gitignore
 - README.md
```

## Serve the app
`cd frontend`
`npm start` starts frontend
`npm run start-backend` starts backend

## PROJECT SETUP:
Follow https://dev.to/nagatodev/how-to-connect-flask-to-reactjs-1k8i for more extensive details

Navigate to frontend directory
`cd frontend`
run `npm start`
This may require some debugging

In a new terminal, navigate to backend
`cd backend`
Create a virtual environment
```
For mac/unix users: python3 -m venv env
For windows users: py -m venv env
```
Activate the virtual environment
```
For mac/unix users: source env/bin/activate
For windows users: .\env\Scripts\activate
```

Install flask 
Run
`pip install flask` and `pip install python-dotenv`

In backend directory, run
`flask run`
or, if that does not work, run
`python -m flask run`

You may need to run `npm install axios`, I'm not sure.

