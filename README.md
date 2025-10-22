# Inside Riverside

Inside Riverside is a modern, feature-rich social media application designed to connect communities. It's built with a robust backend using Node.js, Express, and PostgreSQL, and a sleek, responsive frontend powered by React and Vite.

## Features

*   **User Authentication:** Secure user signup and login with JWT-based authentication.
*   **Social Feed:** Create, view, like, and share posts.
*   **Friend System:** Send, accept, and manage friend requests.
*   **Real-time Chat:** Engage in private conversations with friends.
*   **Business Pages:** Create and manage business pages to promote local businesses.
*   **Marketplace:** Buy and sell products within the community.
*   **Blog:** Share long-form content and articles.

## Tech Stack

*   **Backend:** Node.js, Express, PostgreSQL, WebSocket
*   **Frontend:** React, Vite, TypeScript
*   **Testing:** Jest, Supertest
*   **Containerization:** Docker, Docker Compose

## Getting Started

### Prerequisites

*   Node.js (v16 or higher)
*   npm (v8 or higher)
*   Docker
*   Docker Compose

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/inside-riverside.git
    cd inside-riverside
    ```

2.  **Install backend dependencies:**
    ```bash
    npm install
    ```

3.  **Install frontend dependencies:**
    ```bash
    cd frontend
    npm install
    ```

### Running the Application

1.  **Create a `.env` file:**
    In the project root, create a `.env` file and populate it with the necessary environment variables. You can use the `.env.example` file as a template:
    ```bash
    cp .env.example .env
    ```
    Be sure to replace `your_super_secret_jwt_key` with a strong, unique secret.

2.  **Start the application with Docker Compose:**
    ```bash
    docker compose up --build
    ```
    This will build the Docker images and start the API server and the PostgreSQL database. The API will be available at `http://localhost:3000`, and the frontend will be available at `http://localhost:5173`.

### Running the Tests

To run the backend unit tests, use the following command in the project root:

```bash
npm test
```

This will run all the Jest tests and provide a coverage report.
