"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const CertificateController_1 = require("../controllers/CertificateController");
const certificateRoutes = (0, express_1.Router)();
certificateRoutes.post("/add/:userId", CertificateController_1.certificateAdding);
certificateRoutes.get("/:userId", CertificateController_1.getcertificates);
certificateRoutes.put("/update/:certificateId", CertificateController_1.certificateUpdate);
certificateRoutes.delete("/delete/:certificateId", CertificateController_1.certificateDelete);
certificateRoutes.get("/get_certificate/:fileName", CertificateController_1.CertificateFileRetrival);
exports.default = certificateRoutes;