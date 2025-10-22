# Inside Riverside API Documentation

This document provides a comprehensive overview of the API for the Inside Riverside social media application.

## 1. Authentication

All endpoints that require authentication must include an `Authorization` header with a Bearer token.

`Authorization: Bearer <YOUR_JWT_TOKEN>`

Tokens can be obtained by using the `/auth/login` endpoint.

---

## 2. Auth API (`/auth`)

### 2.1 `POST /auth/signup`

- **Description**: Creates a new user account.
- **Request Body**:
  - `username` (string, required): The user's desired username.
  - `email` (string, required): The user's email address.
  - `password` (string, required): The user's password.
- **Responses**:
  - `201 Created`: User created successfully.
  - `400 Bad Request`: Missing required fields.
  - `500 Internal Server Error`: Error creating the user.

### 2.2 `POST /auth/login`

- **Description**: Logs in a user and returns a JWT token.
- **Request Body**:
  - `email` (string, required): The user's email address.
  - `password` (string, required): The user's password.
- **Responses**:
  - `200 OK`: Returns a JWT token.
  - `401 Unauthorized`: Invalid email or password.
  - `500 Internal Server Error`: Error logging in.

---

## 3. Posts API (`/posts`)

### 3.1 `GET /posts`

- **Description**: Retrieves all posts, ordered by creation date.
- **Responses**:
  - `200 OK`: Returns an array of post objects.
  - `500 Internal Server Error`: Error retrieving posts.

### 3.2 `POST /posts`

- **Description**: Creates a new post. (Authentication required)
- **Request Body**:
  - `content` (string, required): The content of the post.
- **Responses**:
  - `201 Created`: Post created successfully.
  - `400 Bad Request`: Post content is empty or exceeds the maximum length.
  - `401 Unauthorized`: User is not authenticated.
  - `500 Internal Server Error`: Error creating the post.

### 3.3 `POST /posts/:id/like`

- **Description**: Likes a post. (Authentication required)
- **Responses**:
  - `201 Created`: Post liked successfully.
  - `401 Unauthorized`: User is not authenticated.
  - `500 Internal Server Error`: Error liking the post.

### 3.4 `POST /posts/:id/share`

- **Description**: Shares a post. (Authentication required)
- **Responses**:
  - `201 Created`: Post shared successfully.
  - `401 Unauthorized`: User is not authenticated.
  - `500 Internal Server Error`: Error sharing the post.

---

## 4. Friends API (`/friends`)

### 4.1 `GET /friends`

- **Description**: Retrieves the current user's friends. (Authentication required)
- **Responses**:
  - `200 OK`: Returns an array of friend objects.
  - `401 Unauthorized`: User is not authenticated.
  - `500 Internal Server Error`: Error retrieving friends.

### 4.2 `GET /friends/requests`

- **Description**: Retrieves the current user's pending friend requests. (Authentication required)
- **Responses**:
  - `200 OK`: Returns an array of user objects who have sent requests.
  - `401 Unauthorized`: User is not authenticated.
  - `500 Internal Server Error`: Error retrieving requests.

### 4.3 `POST /friends/request/:id`

- **Description**: Sends a friend request to another user. (Authentication required)
- **Responses**:
  - `201 Created`: Request sent successfully.
  - `400 Bad Request`: Cannot friend yourself or request already sent.
  - `401 Unauthorized`: User is not authenticated.
  - `500 Internal Server Error`: Error sending the request.

### 4.4 `POST /friends/accept/:id`

- **Description**: Accepts a friend request. (Authentication required)
- **Responses**:
  - `200 OK`: Request accepted successfully.
  - `401 Unauthorized`: User is not authenticated.
  - `404 Not Found`: Request not found.
  - `500 Internal Server Error`: Error accepting the request.

### 4.5 `DELETE /friends/:id`

- **Description**: Removes a friend. (Authentication required)
- **Responses**:
  - `200 OK`: Friend removed successfully.
  - `401 Unauthorized`: User is not authenticated.
  - `404 Not Found`: Friend not found.
  - `500 Internal Server Error`: Error removing the friend.

---

## 5. Users API (`/users`)

### 5.1 `GET /users`

- **Description**: Retrieves all users, excluding the current user. (Authentication required)
- **Responses**:
  - `200 OK`: Returns an array of user objects.
  - `401 Unauthorized`: User is not authenticated.
  - `500 Internal Server Error`: Error retrieving users.

---

## 6. Business API (`/business`)

### 6.1 `GET /business`

- **Description**: Retrieves all business pages.
- **Responses**:
  - `200 OK`: Returns an array of business page objects.
  - `500 Internal Server Error`: Error retrieving pages.

### 6.2 `POST /business`

- **Description**: Creates a new business page. (Authentication required)
- **Request Body**:
  - `name` (string, required): The name of the business.
  - `description` (string): A description of the business.
  - `address` (string): The address of the business.
- **Responses**:
  - `201 Created`: Page created successfully.
  - `400 Bad Request`: Business name is missing.
  - `401 Unauthorized`: User is not authenticated.
  - `500 Internal Server Error`: Error creating the page.

---

## 7. Flea Market API (`/market`)

### 7.1 `GET /market`

- **Description**: Retrieves all product listings.
- **Responses**:
  - `200 OK`: Returns an array of product objects.
  - `500 Internal Server Error`: Error retrieving products.

### 7.2 `POST /market`

- **Description**: Lists a new product for sale. (Authentication required)
- **Request Body**:
  - `name` (string, required): The name of the product.
  - `price` (number, required): The price of the product.
  - `description` (string): A description of the product.
  - `imageUrl` (string): A URL for an image of the product.
- **Responses**:
  - `201 Created`: Product listed successfully.
  - `400 Bad Request`: Name or price is missing.
  - `401 Unauthorized`: User is not authenticated.
  - `500 Internal Server Error`: Error listing the product.

---

## 8. Community Blog API (`/blog`)

### 8.1 `GET /blog`

- **Description**: Retrieves all blog posts.
- **Responses**:
  - `200 OK`: Returns an array of blog post objects.
  - `500 Internal Server Error`: Error retrieving posts.

### 8.2 `POST /blog`

- **Description**: Creates a new blog post. (Authentication required)
- **Request Body**:
  - `title` (string, required): The title of the post.
  - `content` (string, required): The content of the post.
  - `tags` (string): Comma-separated tags.
- **Responses**:
  - `201 Created`: Post created successfully.
  - `400 Bad Request`: Title or content is missing.
  - `401 Unauthorized`: User is not authenticated.
  - `500 Internal Server Error`: Error creating the post.

---

## 9. Chat (WebSocket)

The chat feature uses WebSockets for real-time, user-to-user communication.

- **Connection**: Establish a WebSocket connection to `ws://<your_server_address>/ws?token=<YOUR_JWT_TOKEN>`.
- **Messages**:
  - **Sending**: To send a message, send a JSON string with the following format:
    ```json
    {
      "recipientId": <USER_ID>,
      "content": "<YOUR_MESSAGE>"
    }
    ```
  - **Receiving**: You will receive messages as a JSON string with the following format:
    ```json
    {
      "senderId": <USER_ID>,
      "content": "<THE_MESSAGE>"
    }
    ```
- **Authentication**: The WebSocket connection is authenticated by passing the JWT token as a query parameter in the connection URL.
