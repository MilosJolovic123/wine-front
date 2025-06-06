# 🍷 Wine Frontend

This project is a React-based frontend application for managing and Browse a collection of wines. It serves as the user interface for the [Wine API](https://www.google.com/search?q=link-to-your-api-if-available), allowing users to interact with wine data in a user-friendly way.

This application was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Features

  * **Browse Wines:** View a list of all wines available in the database.
  * **Search and Filter:** Easily search for specific wines and filter them by various criteria.
  * **View Wine Details:** See detailed information about each wine, including its name, vintage, and description.
  * **Add, Edit, and Delete Wines:** A user-friendly interface to manage the wine collection.
  * **Responsive Design:** A clean and responsive layout that works on various screen sizes.

## 🚀 Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

You need to have Node.js and npm (or yarn) installed on your machine. You can download them from [nodejs.org](https://nodejs.org/).

### Installation

1.  **Clone the repository:**

    ```sh
    git clone https://github.com/MilosJolovic123/wine-front.git
    cd wine-front
    ```

2.  **Install NPM packages:**

    ```sh
    npm install
    ```

    or if you use yarn:

    ```sh
    yarn install
    ```

### Running the Application

To run the app in development mode, use the following command. This will open the app in your default browser at [http://localhost:3000](https://www.google.com/search?q=http://localhost:3000).

```sh
npm start
```

or

```sh
yarn start
```

The page will reload if you make edits. You will also see any lint errors in the console.

## 📁 Project Structure

The project follows a standard Create React App structure with some additional directories for better organization:

```
wine-front/
├── public/            # Static files like index.html and assets
├── src/               # Main source code
│   ├── components/    # Reusable React components
│   ├── pages/         # Page components that represent different routes
│   ├── services/      # API service calls using Axios
│   ├── App.tsx        # Root component with routing
│   └── index.tsx      # The entry point of the application
├── .eslintrc.js       # ESLint configuration for code quality
├── .prettierrc        # Prettier configuration for code formatting
├── package.json       # Project metadata and dependencies
├── tsconfig.json      # TypeScript configuration
└── README.md          # This file
```

## 🧩 Technologies Used

  * **[React](https://reactjs.org/):** A JavaScript library for building user interfaces.
  * **[TypeScript](https://www.typescriptlang.org/):** A typed superset of JavaScript that compiles to plain JavaScript.
  * **[React Router](https://reactrouter.com/):** For declarative routing in the React application.
  * **[Axios](https://axios-http.com/):** A promise-based HTTP client for making requests to the Wine API.
  * **[ESLint](https://eslint.org/):** For identifying and reporting on patterns found in ECMAScript/JavaScript code.
  * **[Prettier](https://prettier.io/):** An opinionated code formatter.

## API Integration

The application communicates with a backend API to fetch and manage wine data. All API-related logic is centralized in the `src/services` directory. This makes it easy to manage API endpoints and handle data fetching, creation, and updates.

-----

*This README was generated with the assistance of a large language model.*
