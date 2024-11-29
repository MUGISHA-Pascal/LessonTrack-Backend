import { Router } from "express";
import {
  certificateAdding,
  certificateDelete,
  CertificateFileRetrival,
  certificateUpdate,
  getcertificates,
} from "../controllers/CertificateController";

const certificateRoutes = Router();
certificateRoutes.post("/add/:userId", certificateAdding);
certificateRoutes.get("/:userId", getcertificates);
certificateRoutes.put("/update/:certificateId", certificateUpdate);
certificateRoutes.delete("/delete/:certificateId", certificateDelete);
certificateRoutes.get("/get_certificate/:fileName", CertificateFileRetrival);

export default certificateRoutes;
