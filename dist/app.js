"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const postgres_1 = require("./config/postgres");
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
postgres_1.postgresConnectionSequelize
    .authenticate()
    .then(() => {
    console.log("connected to the db");
})
    .catch((error) => {
    console.log(error);
});
const port = process.env.PORT;
app.listen(port, () => {
    console.log(`the server is running on port ${port}`);
});
