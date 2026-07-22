# Task Manager

A lightweight browser-based task manager built with vanilla HTML, CSS, and JavaScript. Tasks are stored in the browser's `localStorage`, so no backend or database is required.

## Features

- Create tasks with title, description, status, priority, due date, and tags
- Edit existing tasks through the same form
- Delete tasks with a confirmation prompt
- Filter tasks by status (`todo`, `in-progress`, `done`)
- Search tasks by title or description
- Validate input before saving
- Show validation and storage errors on the page

## Tech Stack

| Layer | Technology |
| --- | --- |
| Markup | HTML5 |
| Styles | CSS3 |
| Logic | Vanilla JavaScript (ES modules) |
| Persistence | Browser `localStorage` |
| Dev server | [http-server](https://www.npmjs.com/package/http-server) |

## Project Structure

```
task-manager-js/
├── index.html              # App entry point and UI markup
├── package.json            # Project metadata and scripts
├── README.md
└── src/
    ├── css/
    │   └── style.css       # Styles
    └── js/
        ├── app.js          # UI logic, events, rendering
        ├── taskService.js  # Business logic (CRUD, filter, search)
        ├── storage.js      # localStorage read/write
        └── validation.js   # Task field validation
```

## Architecture

The app is split into three layers. The UI talks only to the service layer; the service layer uses validation and storage.

```
┌─────────────────────────────────────┐
│              UI Layer               │
│     index.html  +  app.js           │
│  (form, list, filters, error msg)   │
└─────────────────┬───────────────────┘
                  │
                  ▼
┌─────────────────────────────────────┐
│           Service Layer             │
│          taskService.js             │
│   add / update / delete / search    │
└───────────┬─────────────┬───────────┘
            │             │
            ▼             ▼
┌──────────────────┐  ┌──────────────────┐
│  validation.js   │  │   storage.js     │
│  field rules     │  │  localStorage    │
└──────────────────┘  └──────────────────┘
```

| Module | Responsibility |
| --- | --- |
| `app.js` | Handles DOM events, renders the task list, manages edit mode, and displays errors |
| `taskService.js` | Creates, updates, deletes, filters, and searches tasks |
| `validation.js` | Checks title, due date, status, and priority |
| `storage.js` | Loads and saves the task list as JSON in `localStorage` |

## Task Model

Each task is stored as a JSON object:

```json
{
  "id": "uuid",
  "title": "Buy groceries",
  "description": "Milk, eggs, bread",
  "status": "todo",
  "priority": "medium",
  "dueDate": "2026-07-25",
  "tags": ["personal", "errands"]
}
```

| Field | Type | Notes |
| --- | --- | --- |
| `id` | string | Generated with `crypto.randomUUID()` |
| `title` | string | Required |
| `description` | string | Optional |
| `status` | string | `todo`, `in-progress`, or `done` |
| `priority` | string | `low`, `medium`, or `high` |
| `dueDate` | string \| null | Optional ISO date (`YYYY-MM-DD`) |
| `tags` | string[] | Optional, entered as comma-separated text |

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (for the local development server)

### Install

```bash
npm install
```

### Run

```bash
npm start
```

Then open [http://localhost:8080](http://localhost:8080) in your browser.

> ES modules require a local server. Opening `index.html` directly via `file://` will not work in most browsers.

## Usage

1. Fill in the form and click **Add Task** to create a task.
2. Click **Edit** on a task to load it into the form, change fields, then click **Update Task**.
3. Click **Cancel Edit** to leave edit mode without saving.
4. Click **Delete** and confirm to remove a task.
5. Use the search box and status filter to narrow the list.

## License

ISC
