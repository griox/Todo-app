# Todo App

A full-stack Todo application built with React (frontend) and Node.js/Express (backend) with MongoDB for data persistence. The app allows users to manage tasks, filter by status and date, and provides a responsive UI with Tailwind CSS.
### Visit at 
https://todo-app-griox.onrender.com
## Features

- **Task Management**: Add, edit, delete, and toggle task status (pending/completed).
- **Filtering**: Filter tasks by status (all, pending, completed) and date (today, week, month, all).
- **Real-time Stats**: Display counts of pending and completed tasks.
- **Responsive Design**: Mobile-first UI with Tailwind CSS and Lucide icons.
- **Notifications**: Toast notifications for actions using Sonner.
- **Pagination**: Paginate through tasks (frontend implementation).
- **Date Filtering**: Select date ranges using a combobox.

## Tech Stack

### Frontend
- **React**: UI library with hooks.
- **Vite**: Build tool for fast development.
- **Tailwind CSS**: Utility-first CSS framework.
- **Axios**: HTTP client for API calls.
- **Sonner**: Toast notifications.
- **Lucide React**: Icon library.
- **React Router DOM**: Client-side routing.

### Backend
- **Node.js**: JavaScript runtime.
- **Express.js**: Web framework.
- **MongoDB**: NoSQL database.
- **Mongoose**: ODM for MongoDB.
- **CORS**: Cross-origin resource sharing.
- **Dotenv**: Environment variable management.

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- MongoDB (local or cloud, e.g., MongoDB Atlas)

## Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/todo-app.git
   cd todo-app
   ```

2. **Install backend dependencies**:
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**:
   ```bash
   cd ../frontend
   npm install
   ```

4. **Set up environment variables**:
   - Create `backend/.env`:
     ```
     PORT=5001
     MONGO_URI=mongodb://localhost:27017/todoapp
     ```
   - For production, use MongoDB Atlas URI.

5. **Start MongoDB** (if local):
   ```bash
   mongod
   ```

## Usage

1. **Start the backend**:
   ```bash
   cd backend
   npm run dev
   ```
   Server runs on http://localhost:5001.

2. **Start the frontend**:
   ```bash
   cd frontend
   npm run dev
   ```
   App runs on http://localhost:5173.

3. **Open the app** in your browser and start managing tasks.

### Key Interactions
- Add tasks via the input field.
- Toggle status by clicking the circle/check icon.
- Edit tasks by clicking the pen icon.
- Delete tasks by clicking the trash icon.
- Filter by status and date using the UI controls.

## API Documentation

### Base URL
`http://localhost:5001/api`

### Endpoints

#### GET /tasks
- **Query Params**: `filter` (string: 'all', 'today', 'week', 'month')
- **Response**: `{ tasks: [], pendingCount: number, completedCount: number }`
- **Description**: Fetch tasks filtered by date.

#### POST /tasks
- **Body**: `{ title: string }`
- **Response**: `{ message: string, task: object }`
- **Description**: Create a new task.

#### PUT /tasks/:id
- **Body**: `{ title?: string, status?: string }`
- **Response**: `{ message: string, task: object }`
- **Description**: Update a task.

#### DELETE /tasks/:id
- **Response**: `{ message: string }`
- **Description**: Delete a task.

## Project Structure

```
todo-app/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js          # Database connection
│   │   ├── controllers/
│   │   │   └── taskController.js  # Task CRUD logic
│   │   ├── models/
│   │   │   └── Tasks.js       # Mongoose schema
│   │   ├── routes/
│   │   │   └── taskRouters.js # API routes
│   │   └── server.js          # Express server setup
│   ├── package.json
│   └── .env                   # Environment variables
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/            # Reusable UI components (shadcn)
│   │   │   ├── AddTask.jsx    # Add task form
│   │   │   ├── Footer.jsx     # Footer with stats
│   │   │   ├── Header.jsx     # App header
│   │   │   ├── StatsandFilter.jsx  # Stats and status filter
│   │   │   ├── TaskCard.jsx   # Individual task item
│   │   │   ├── TaskEmptyTask.jsx  # Empty state
│   │   │   ├── TaskList.jsx   # Task list container
│   │   │   ├── TaskPagination.jsx  # Pagination component
│   │   │   └── DateTimeFilter.jsx  # Date filter combobox
│   │   ├── pages/
│   │   │   ├── Homepage.jsx   # Main page
│   │   │   └── Notfound.jsx   # 404 page
│   │   ├── lib/
│   │   │   ├── data.js        # Static data (filters, options)
│   │   │   └── utils.js       # Utility functions
│   │   ├── App.jsx            # App component
│   │   ├── main.jsx           # Entry point
│   │   └── index.css          # Global styles
│   ├── package.json
│   ├── vite.config.js         # Vite config
│   ├── tailwind.config.js     # Tailwind config
│   └── index.html             # HTML template
└── README.md
```

## Contributing

1. Fork the repository.
2. Create a feature branch: `git checkout -b feature/your-feature`.
3. Commit changes: `git commit -m 'Add your feature'`.
4. Push to branch: `git push origin feature/your-feature`.
5. Open a pull request.

## License

This project is licensed under the MIT License. See the LICENSE file for details.
