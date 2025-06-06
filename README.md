```markdown
# 🍷 Wine Front

A React-based frontend application for managing wine data, serving as the user interface for the Wine API.

## 🚀 Technologies Used

- [React](https://reactjs.org/) – A JavaScript library for building user interfaces
- [TypeScript](https://www.typescriptlang.org/) – A statically typed superset of JavaScript
- [Create React App](https://create-react-app.dev/) – A tool to set up a modern web app by running one command
- [Axios](https://axios-http.com/) – Promise-based HTTP client for the browser and Node.js
- [React Router](https://reactrouter.com/) – Declarative routing for React
- [ESLint](https://eslint.org/) & [Prettier](https://prettier.io/) – Code analysis and formatting tools

## 📁 Project Structure
```

wine-front/
├── public/ # Static files
├── src/ # Main source code
│ ├── components/ # Reusable components
│ ├── pages/ # Page components
│ ├── services/ # API service calls
│ ├── App.tsx # Root component
│ └── index.tsx # Entry point
├── .eslintrc.js # ESLint configuration
├── .prettierrc # Prettier configuration
├── package.json # Project metadata and dependencies
├── tsconfig.json # TypeScript configuration
└── README.md # Project documentation

````

## 🛠️ Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/MilosJolovic123/wine-front.git
   cd wine-front
````

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm start
   ```

   The application will run at `http://localhost:3000`.

## ✅ Available Scripts

In the project directory, you can run:

- `npm start` – Runs the app in development mode.
- `npm run build` – Builds the app for production to the `build` folder.
- `npm test` – Launches the test runner in interactive watch mode.
- `npm run lint` – Runs ESLint for code analysis.
- `npm run format` – Formats code using Prettier.

## 🔍 Testing

> Tests are not yet implemented. Adding unit and integration tests is planned for future versions.
