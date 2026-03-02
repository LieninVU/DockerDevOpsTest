import React from "react";
import ReactDOM from "react-dom/client";
import App from './App.js';
import './main.css';

const SERVER = process.env.SERVER;
const page = document.getElementById("app");
const app = ReactDOM.createRoot(page);
app.render(<App SERVER={SERVER}/>)