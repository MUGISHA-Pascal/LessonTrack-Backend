"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "LessonTracker API",
            description: "API endpoints for lesson tracking services documented on swagger",
            contact: {
                name: "MUGISHA Pascal",
                email: "mugishapascal2008@gmail.com",
                url: "https://github.com/MUGISHA-Pascal/LessonTrack-API",
            },
            version: "1.0.0",
        },
        servers: [
            {
                url: "http://localhost:4000/",
                description: "Local server",
            },
            {
                url: "<your live url here>",
                description: "Live server",
            },
        ],
    },
    apis: ["./router/*.ts"],
};
const swaggerSpec = (0, swagger_jsdoc_1.default)(options);
function swaggerDocs(app, port) {
    app.use("/docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerSpec));
    app.get("/docs.json", (req, res) => {
        res.setHeader("Content-Type", "application/json");
        res.send(swaggerSpec);
    });
}
exports.default = swaggerDocs;