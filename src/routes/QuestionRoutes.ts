import { Router } from "express";

const questionRoutes = Router();
questionRoutes.post("/add/:userId");
questionRoutes.get("/");
questionRoutes.put("/update/:userId");
questionRoutes.delete("/delete/:questionId");
export default questionRoutes;
