import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Request, Response, Express } from "express";
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "LessonTracker API",
      description:
        "API endpoints for lesson tracking services documented on swagger",
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
const swaggerSpec = swaggerJsdoc(options);
function swaggerDocs(app: Express, port: string | undefined) {
  app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  app.get("/docs.json", (req: Request, res: Response) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerSpec);
  });
}
export default swaggerDocs;
