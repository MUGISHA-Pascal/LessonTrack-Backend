import { Router } from "express";

const certificateRoutes = Router();
certificateRoutes.post("/add/:userId");
certificateRoutes.get("/:userId");
certificateRoutes.put("/update/:certificateId");
certificateRoutes.delete("/delete/:certificateId");
export default certificateRoutes;
