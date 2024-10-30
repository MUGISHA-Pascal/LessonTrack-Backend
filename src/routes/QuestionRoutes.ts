import { Router } from "express";

const questionRoutes = Router();
questionRoutes.post("/add_question/:userId");
questionRoutes.get("/get_questions");
questionRoutes.put("/update_question/:userId");
questionRoutes.delete("/delete_question/:questionId");
export default questionRoutes;
