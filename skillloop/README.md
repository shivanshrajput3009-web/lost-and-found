# 🔄 SkillLoop – Campus Skill Exchange

> **A modern, full-stack, peer-to-peer skill-sharing platform built for college students to exchange knowledge, skills, and academic services without spending money.**

[![Node.js](https://img.shields.io/badge/Node.js-18.x%20%7C%2020.x-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-4.18.2-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas%20%2F%20Local-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Vanilla JS](https://img.shields.io/badge/Frontend-HTML5%20%7C%20CSS3%20%7C%20Vanilla%20JS-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

---

## 📖 Table of Contents
- [Project Overview](#-project-overview)
- [Strict Technology Stack](#-strict-technology-stack)
- [Features & User Experience](#-features--user-experience)
- [Project Directory Structure](#-project-directory-structure)
- [Database Models & Schemas](#-database-models--schemas)
- [REST API Endpoints Specification](#-rest-api-endpoints-specification)
- [Step-by-Step Installation & Setup](#-step-by-step-installation--setup)
- [MongoDB Atlas Setup Guide (Cloud)](#-mongodb-atlas-setup-guide-cloud)
- [Testing REST APIs with Postman](#-testing-rest-apis-with-postman)
- [College Viva / Assignment Evaluation Demonstration Guide](#-college-viva--assignment-evaluation-demonstration-guide)

---

## 💡 Project Overview
In many colleges, students excel at specific subjects or personal crafts:
- A Computer Science student excels in **Java Programming and Data Structures**, but struggles with designing project pitch decks.
- A Design student creates stunning **Figma UI/UX mockups**, but needs assistance with their Java lab.
- An Electronics student plays **Acoustic Guitar**, while a classmate is a wizard at **Calculus & Differential Equations**.

**SkillLoop** solves this through a cashless exchange ecosystem where students offer their knowledge in exchange for credits. They spend credits to request tutoring or exchange directly with peers.

---

## 🛠️ Strict Technology Stack
SkillLoop is purposefully crafted to be clean, elegant, and maintainable without frontend frameworks:

- **Frontend:**
  - **HTML5** – Semantic document layout
  - **CSS3** – Custom responsive startup design system with custom properties, soft shadows, transitions, and flexbox/grid layout (No Tailwind, No Bootstrap)
  - **Vanilla JavaScript (ES6+)** – Asynchronous `fetch()` API calls, modal controllers, filtering engine, animated counters, and toast notifications (No React, No Angular)
- **Backend:**
  - **Node.js** – JavaScript runtime environment
  - **Express.js** – Lightweight MVC-style REST API architecture and static file server
- **Database:**
  - **MongoDB** – Document database (Supports both Local MongoDB and MongoDB Atlas Cloud)
  - **Mongoose** – Strict Object Data Modeling (ODM) schemas and validations

---

## ✨ Features & User Experience

### 1. Home Page (`index.html`)
- Modern **Startup Landing Page** with purple/indigo gradient accents.
- **Hero Section** with search input that deep-links directly into the Explore catalog with search terms.
- **Live Statistics Badges** dynamically animated from database counts (`/api/stats`).
- **Featured Skills Carousel** loading top available skills directly from MongoDB.
- **Interactive "How It Works" 3-step guide**.
- **Domain Category Tiles** allowing one-click filtering.

### 2. Explore Skills (`explore.html`)
- Displays all offered campus skills with badge tags, level indicators, owner avatar, duration, and credit cost.
- **Real-Time Client & Server Search**: Filter by keyword in title, description, or student mentor name.
- **Category Filter Dropdown** (Programming, Design, Music, Academics, Languages, Fitness, Photography, Writing, Other).
- **Skill Level Filter** (Beginner, Intermediate, Advanced).
- **Sorting Options**: Newest First, Credits: High-to-Low, Credits: Low-to-High.
- **Request Modal Dialog**: Submit an exchange request with a custom proposal message directly to the skill owner.

### 3. Share a Skill (`add-skill.html`)
- Clean, intuitive posting form with mandatory validation (`*`).
- Input fields for Student Name, Skill Title, Category, Level, Availability Days/Times, Duration, and Credit valuation (1–100).
- Instant redirect to Explore page with a floating toast notification upon creation.

### 4. Interactive Student Dashboard (`dashboard.html`)
- **Student Switcher Dropdown**: Allows instant simulation of different students (e.g. Rahul Sharma, Priya Patel, Amit Kumar) to test incoming vs outgoing workflows during an evaluation.
- **Dynamic Metric Cards**:
  - Skills I Offer
  - Incoming Requests Received
  - Outgoing Requests Sent
  - Completed Exchanges
- **Full CRUD Actions for Skills**:
  - Edit skill details in an in-place modal.
  - Delete a skill with confirmation.
- **Exchange Request Management**:
  - **Accept** incoming proposal (automatically flags skill as `Taken`).
  - **Decline / Reject** incoming proposal.
  - **Mark as Completed** (finalizes the exchange and makes the skill available again).

---

## 📂 Project Directory Structure

```
skillloop/
├── config/
│   └── db.js                 # Mongoose connection logic with error handling
├── controllers/
│   ├── skillController.js     # CRUD business logic for skills
│   ├── requestController.js   # Logic for exchange proposals and statuses
│   └── userController.js      # Student account queries
├── models/
│   ├── User.js                # Student schema (name, email, dept, credits)
│   ├── Skill.js               # Skill schema (title, category, level, credits, status)
│   └── ExchangeRequest.js     # Exchange request schema (skillId, requester, owner, message, status)
├── public/                    # Frontend assets served by Express
│   ├── index.html             # Homepage
│   ├── explore.html           # Explore & Filter skills
│   ├── dashboard.html         # Personal dashboard & exchange workflow
│   ├── add-skill.html         # Skill creation form
│   ├── css/
│   │   └── style.css          # Unified modern CSS design system
│   └── js/
│       ├── main.js            # Shared fetch wrapper, toasts, mobile menu
│       ├── explore.js         # Search, category filters, request modal
│       ├── dashboard.js       # CRUD edit/delete, accept/complete exchange
│       └── add-skill.js       # Form validation and POST submission
├── routes/
│   ├── skillRoutes.js         # /api/skills routes
│   ├── requestRoutes.js       # /api/requests routes
│   └── userRoutes.js          # /api/users routes
├── .env                       # Environment variables (PORT, MONGODB_URI)
├── .env.example               # Template environment configuration
├── .gitignore                 # Files excluded from git
├── package.json               # Project manifest & scripts
├── seed.js                    # Database seeder with realistic initial campus records
├── server.js                  # Main Express entry point
└── README.md                  # Complete documentation
```

---

## 🗄️ Database Models & Schemas

### 1. User (`models/User.js`)
| Field | Type | Required | Description |
|---|---|---|---|
| `name` | String | Yes | Student's full name |
| `email` | String | Yes | Unique college email address |
| `department` | String | Yes | Major (e.g. Computer Science, Design) |
| `credits` | Number | No | Starting balance (Default: 50 credits) |
| `createdAt` | Date | No | Timestamp of registration |

### 2. Skill (`models/Skill.js`)
| Field | Type | Validation / Enum | Description |
|---|---|---|---|
| `title` | String | Required, max 100 chars | Skill name |
| `description` | String | Required, max 1000 chars | What the mentor will teach |
| `category` | String | Enum: Programming, Design, Music, Languages, Academics, Fitness, Photography, Writing, Other | Domain classification |
| `level` | String | Enum: Beginner, Intermediate, Advanced | Skill proficiency |
| `ownerName` | String | Required | Name of the student offering the skill |
| `availability` | String | Required | Days / times available |
| `duration` | String | Required | Duration (e.g. "1 hour per session") |
| `credits` | Number | Min: 1, Max: 100 | Credit value for exchange |
| `status` | String | Enum: `Available`, `Taken` (Default: `Available`) | Current booking availability |
| `createdAt` | Date | Default: `Date.now` | Date posted |

### 3. ExchangeRequest (`models/ExchangeRequest.js`)
| Field | Type | Description |
|---|---|---|
| `skillId` | ObjectId (ref: 'Skill') | ID of the skill being requested |
| `skillTitle` | String | Cached title of the requested skill |
| `requesterName` | String | Name of the student seeking tutoring |
| `ownerName` | String | Mentor offering the skill |
| `message` | String | Proposal message detailing what they offer in return |
| `status` | Enum: `Pending`, `Accepted`, `Rejected`, `Completed` | Status of the exchange |
| `createdAt` | Date | Date proposal was submitted |

---

## 🌐 REST API Endpoints Specification

### Skills (`/api/skills`)
| HTTP Method | Endpoint | Description | Request Body |
|---|---|---|---|
| `GET` | `/api/skills` | Get all skills (supports query params: `?category=`, `?level=`, `?search=`, `?sort=`) | None |
| `GET` | `/api/skills/:id` | Get single skill details | None |
| `POST` | `/api/skills` | Create a new skill | JSON with `title`, `description`, `category`, `level`, `ownerName`, `availability`, `duration`, `credits` |
| `PUT` | `/api/skills/:id` | Update an existing skill | JSON with fields to modify |
| `DELETE` | `/api/skills/:id` | Delete a skill | None |

### Exchange Requests (`/api/requests`)
| HTTP Method | Endpoint | Description | Request Body |
|---|---|---|---|
| `GET` | `/api/requests` | Get all requests (supports `?ownerName=`, `?requesterName=`) | None |
| `POST` | `/api/requests` | Propose an exchange | JSON with `skillId`, `requesterName`, `message` |
| `PUT` | `/api/requests/:id` | Update status | JSON with `{ "status": "Accepted" \| "Rejected" \| "Completed" }` |
| `DELETE` | `/api/requests/:id` | Delete a request | None |

### Students / Users (`/api/users`)
| HTTP Method | Endpoint | Description | Request Body |
|---|---|---|---|
| `GET` | `/api/users` | List all registered students | None |
| `POST` | `/api/users` | Register a new student | JSON with `name`, `email`, `department` |
| `GET` | `/api/users/:id` | Get student details | None |

### Platform Statistics (`/api/stats`)
| HTTP Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/stats` | Aggregated count of total skills, total students, and completed exchanges |

---

## 🚀 Step-by-Step Installation & Setup

### Prerequisites
1. **Node.js** installed (v16.x or newer). Verify via:
   ```bash
   node -v
   npm -v
   ```
2. **MongoDB**:
   - Either a local MongoDB instance running on port 27017 (`mongod`), OR
   - A free **MongoDB Atlas cloud connection string** (see guide below).

### Step 1: Open Terminal in the Project Directory
```bash
cd skillloop
```

### Step 2: Install Project Dependencies
```bash
npm install
```

### Step 3: Configure Environment Variables
A default `.env` file is included. Check its contents:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/skillloop
```
*(If using MongoDB Atlas, replace `MONGODB_URI` with your Atlas connection string as shown in the next section).*

### Step 4: Seed the Database with Realistic Initial Records
Run the built-in seed script to populate realistic campus data:
```bash
npm run seed
```
Output:
```
Connected to MongoDB...
✅ Created 5 demo students.
✅ Created 8 demo skills.
✅ Created demo exchange requests.
🎉 Seed completed successfully!
```

### Step 5: Start the Application Server
For continuous auto-reloading development:
```bash
npm run dev
```
Or for production start:
```bash
npm start
```

### Step 6: Open the Website in Your Browser
Visit: **[http://localhost:3000](http://localhost:3000)**
*(Port 3000 avoids port collisions on Windows systems).*

---

## ☁️ MongoDB Atlas Setup Guide (Cloud)

If you do not have MongoDB installed locally on your laptop:

1. Visit **[https://www.mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)** and sign up for a free account.
2. Click **Create a Deployment** and choose the **M0 Free Tier** cluster.
3. Under **Security Quickstart**:
   - Set a **Username** (e.g. `student`) and **Password** (e.g. `Campus12345`). Click **Create User**.
   - Under **Where would you like to connect from?**, select **IP Access List** and click **Add My Current IP Address** or enter `0.0.0.0/0` (Allow access from anywhere for evaluation).
4. Go to **Database** → click **Connect** on your cluster → choose **Drivers (Node.js)**.
5. Copy the connection string. It will look like:
   ```text
   mongodb+srv://student:<password>@cluster0.abcde.mongodb.net/?retryWrites=true&w=majority
   ```
6. Open your `.env` file in the project folder and paste it (add `/skillloop` right before `?retryWrites`):
   ```env
   PORT=5000
   MONGODB_URI=mongodb+srv://student:Campus12345@cluster0.abcde.mongodb.net/skillloop?retryWrites=true&w=majority
   ```
7. Run `npm run seed` followed by `npm run dev`.

---

## 🧪 Testing REST APIs with Postman

1. Open Postman or your preferred API client.
2. Test the following core endpoints:

### Test 1: Get All Skills
- **Method**: `GET`
- **URL**: `http://localhost:5000/api/skills`
- **Response**: `200 OK` with JSON array of skills.

### Test 2: Post a New Skill
- **Method**: `POST`
- **URL**: `http://localhost:5000/api/skills`
- **Headers**: `Content-Type: application/json`
- **Body** (Raw JSON):
  ```json
  {
    "title": "Data Structures in C++",
    "description": "Master linked lists, stacks, queues, and binary trees with live problem solving.",
    "category": "Programming",
    "level": "Intermediate",
    "ownerName": "Rahul Sharma",
    "availability": "Saturday 4 PM",
    "duration": "1.5 hours per session",
    "credits": 20
  }
  ```
- **Response**: `201 Created` with the newly created skill document.

### Test 3: Send an Exchange Request
- **Method**: `POST`
- **URL**: `http://localhost:5000/api/requests`
- **Headers**: `Content-Type: application/json`
- **Body** (Raw JSON):
  ```json
  {
    "skillId": "<PASTE_A_SKILL_ID_FROM_GET_RESPONSE>",
    "requesterName": "Priya Patel",
    "message": "Hi, I need help with trees before my exams. Can teach Figma in exchange!"
  }
  ```
- **Response**: `201 Created` with request object and `status: "Pending"`.

### Test 4: Accept an Exchange Request
- **Method**: `PUT`
- **URL**: `http://localhost:5000/api/requests/<PASTE_REQUEST_ID>`
- **Headers**: `Content-Type: application/json`
- **Body** (Raw JSON):
  ```json
  {
    "status": "Accepted"
  }
  ```
- **Response**: `200 OK` (The skill's status in MongoDB automatically transitions to `Taken`).

---

## 🎓 College Viva / Assignment Evaluation Demonstration Guide

When presenting this project to your professor or examiner, follow this recommended walkthrough:

| Step | Action to Perform | What to Explain to the Examiner |
|---|---|---|
| **1. Architecture** | Open project folder in VS Code | *"SkillLoop is structured around the MVC (Model-View-Controller) architecture. Backend routes in Express talk to controllers, which interact with MongoDB via Mongoose schemas."* |
| **2. Home Page** | Open `http://localhost:5000` | Point out the modern, responsive UI design without any heavy frameworks. Show the dynamic live statistics fetched from MongoDB via `/api/stats`. |
| **3. Explore & Filter** | Click **Explore Skills** | Show real-time search and filter dropdowns (by Category, Level, and Sort by Credits). Explain how Vanilla JS handles client-side filtering smoothly. |
| **4. Post a New Skill** | Click **+ Share a Skill** | Fill out the form with a new skill (e.g. *Robotics with Arduino*). Show form validation and submit. Point out the instant toast notification and redirection to Explore. |
| **5. Exchange Workflow** | On the Explore page, find a skill | Click **Request Exchange**. Enter requester name and a proposal message. Click submit. |
| **6. Dashboard & Multi-User** | Open **My Dashboard** | Use the **Switch User** dropdown to switch between *Rahul Sharma* and *Priya Patel*. Point out how incoming vs outgoing requests update dynamically based on the active student. |
| **7. Accept & Complete** | On incoming request card | Click **✅ Accept Exchange**. Show how the status badge changes to `Accepted` and the skill status becomes `Taken`. Then click **🎉 Mark as Completed**. |
| **8. Edit & Delete CRUD** | Under "Skills Offered by Me" | Click **✏️ Edit** to modify credit valuation or availability days. Show how it persists. Test **🗑️ Delete** to prove complete CRUD operations. |
| **9. Database Verification** | Open MongoDB Compass or Atlas | Show the 3 collections: `users`, `skills`, and `exchangerequests` to prove real database persistence. |

---

## 📜 License
This project is open-source and intended for academic learning, college demonstrations, and portfolio showcases.
```
