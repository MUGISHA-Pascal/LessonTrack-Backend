import { Router } from "express";

const certificateRoutes = Router();
certificateRoutes.post("/add_certificate/:userId");
certificateRoutes.get("/get_certificate");
certificateRoutes.put("/update_certificate/:certificateId");
certificateRoutes.delete("/delete_certificate/:certificateId");
export default certificateRoutes;
