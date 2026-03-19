# Interview Management System

Full-stack application for end-to-end interview pipeline management — from application intake through scheduling, live feedback, and final hiring decisions.

Built at Staunchsys IT Services as internal tooling to replace a manual, spreadsheet-driven hiring process.  
The Spring Boot backend is proprietary to Staunchsys and is not publicly available. This repository contains the frontend webapp and notification microservice.

## What it does

- Candidates apply and track their interview status through a self-service portal
- Interviewers submit structured feedback and decisions directly in the application
- Management reviews feedback and issues hiring decisions in real time — both interviewer and candidate receive live updates
- Notification service sends automated reminders before scheduled interviews and pushes feedback updates to all parties via email

## Outcome

Hiring cycle time reduced by ~30% (manager estimate) by eliminating manual status tracking and back-and-forth email chains between HR, interviewers, and candidates.

## Architecture
```
ims-webapp/              # Frontend — React + TypeScript
ims-notification-service/ # Microservice — email reminders + feedback alerts
[Spring Boot backend]    # Internal — not in this repo (proprietary)
```

## Stack

React · TypeScript · Spring Boot (internal) · JWT authentication · REST API · Email notifications

## Note on backend

The backend API was developed as internal tooling at Tatvasoft and remains proprietary. The frontend and notification service in this repo were built and owned by me as the sole developer on this module.
