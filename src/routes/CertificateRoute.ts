import { Router } from "express";
import {
  certificateAdding,
  certificateDelete,
  CertificateFileRetrival,
  CertificateGeneration,
  certificateRetrival,
  certificateUpdate,
  getcertificates,
} from "../controllers/CertificateController";

const certificateRoutes = Router();
certificateRoutes.post("/add/:userId", certificateAdding);
certificateRoutes.get("/:userId", getcertificates);
certificateRoutes.put("/update/:certificateId", certificateUpdate);
certificateRoutes.delete("/delete/:certificateId", certificateDelete);
certificateRoutes.get("/get_certificate/:fileName", CertificateFileRetrival);
certificateRoutes.post("/generate", CertificateGeneration);
certificateRoutes.get("/certificate/:certificateUrl", certificateRetrival);
export default certificateRoutes;
