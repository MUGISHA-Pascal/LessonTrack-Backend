"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const postgres_1 = require("./config/postgres");
const AuthRoutes_1 = __importDefault(require("./routes/AuthRoutes"));
const body_parser_1 = __importDefault(require("body-parser"));
const UserRoutes_1 = __importDefault(require("./routes/UserRoutes"));
const CourserRoutes_1 = __importDefault(require("./routes/CourserRoutes"));
const FeedbackRoutes_1 = __importDefault(require("./routes/FeedbackRoutes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(body_parser_1.default.json());
postgres_1.postgresConnectionSequelize
    .authenticate()
    .then(() => {
    console.log("connected to the db");
})
    .catch((error) => {
    console.log(error);
});
app.use("/auth", AuthRoutes_1.default);
app.use("/user", UserRoutes_1.default);
app.use("/course", CourserRoutes_1.default);
app.use("/comments", CourserRoutes_1.default);
app.use("/feedback", FeedbackRoutes_1.default);
const port = process.env.PORT;
app.listen(port, () => {
    console.log(`the server is running on port ${port}`);
});
