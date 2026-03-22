# DevTrack

A project tracker for developers to manage their portfolio projects, featuring user authentication and data persistence.

## Features

- **User Authentication**: Securely sign in using Google.
- **Project Management**: Add, update the status of (Planned, In-Progress, Completed), and delete your projects.
- **Data Persistence**: Your projects are saved securely in Firestore.

## Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS
- **Backend/Database**: Firebase Authentication, Firestore

## Setup Instructions

1.  **Clone the repository.**
2.  **Install dependencies**:
    ```bash
    npm install
    ```
3.  **Firebase Configuration**:
    -   Create a Firebase project in the [Firebase Console](https://console.firebase.google.com/).
    -   Enable **Google Authentication** in the Authentication section.
    -   Enable **Cloud Firestore** in the Firestore Database section.
    -   Create a `firebase-applet-config.json` file in the root directory with your Firebase project configuration:
        ```json
        {
          "apiKey": "YOUR_API_KEY",
          "authDomain": "YOUR_AUTH_DOMAIN",
          "projectId": "YOUR_PROJECT_ID",
          "appId": "YOUR_APP_ID",
          "firestoreDatabaseId": "YOUR_DATABASE_ID"
        }
        ```
4.  **Run the development server**:
    ```bash
    npm run dev
    ```

## License

This project is licensed under the Apache License 2.0.
