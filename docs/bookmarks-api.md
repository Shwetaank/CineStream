# Bookmarks API Documentation

## Base URL
`https://cinestream.shwet-tech.com/api/bookmarks`

## Authentication
All requests require authentication via Clerk.

---

### GET `/api/bookmarks`

- **Description**: Fetch all bookmarks for the authenticated user.
- **Method**: `GET`
- **Headers**: Requires authentication with Clerk.

- **Responses**:
  - `200 OK`: 
    - **Body**: Returns an array of bookmarks.
      ```json
      {
        "message": "Bookmarks fetched successfully",
        "bookmarks": [
          {
            "id": "string",
            "userId": "string",
            "movieId": "string or null",
            "seriesId": "string or null"
          }
        ]
      }
      ```
  - `401 Unauthorized`: If not authenticated.
    ```json
    { "error": "Unauthorized" }
    ```

---

### POST `/api/bookmarks`

- **Description**: Create a new bookmark for a movie or series.
- **Method**: `POST`
- **Headers**: Requires authentication with Clerk.

- **Request Body** (JSON):
  - `movieId` (optional, `string`): ID of the movie to bookmark.
  - `seriesId` (optional, `string`): ID of the series to bookmark.
  
  Either `movieId` or `seriesId` must be provided.

- **Responses**:
  - `201 Created`: Bookmark created successfully.
    ```json
    {
      "message": "Bookmark created successfully",
      "bookmark": {
        "id": "string",
        "userId": "string",
        "movieId": "string or null",
        "seriesId": "string or null"
      }
    }
    ```
  - `400 Bad Request`: If validation fails (e.g., both `movieId` and `seriesId` are missing).
    ```json
    { "error": "Either movieId or seriesId must be provided" }
    ```
  - `401 Unauthorized`: If not authenticated.
    ```json
    { "error": "Unauthorized" }
    ```

---

### DELETE `/api/bookmarks`

- **Description**: Delete a specific bookmark by its ID.
- **Method**: `DELETE`
- **Headers**: Requires authentication with Clerk.

- **Request Body** (JSON):
  - `id` (required, `string`): ID of the bookmark to delete.

- **Responses**:
  - `200 OK`: Bookmark deleted successfully.
    ```json
    { "message": "Bookmark deleted successfully" }
    ```
  - `400 Bad Request`: If the ID is missing or invalid.
    ```json
    { "error": "Missing bookmark ID" }
    ```
    ```json
    { "error": "Invalid bookmark ID format" }
    ```
  - `401 Unauthorized`: If not authenticated.
    ```json
    { "error": "Unauthorized" }
    ```

---
