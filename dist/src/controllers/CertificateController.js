"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.certificateRetrival = exports.CertificateGeneration = exports.CertificateFileRetrival = exports.certificateDelete = exports.certificateUpdate = exports.getcertificates = exports.certificateAdding = void 0;
const Certificates_1 = __importDefault(require("../models/Certificates"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const CertificateGenerate_1 = require("../middlewares/CertificateGenerate");
const User_1 = __importDefault(require("../models/User"));
/**
 * @swagger
 * tags:
 *   name: Certificates
 *   description: Managing certificates awarded to users
 */
/**
 * @swagger
 * /certificates/add/{userId}:
 *   post:
 *     summary: Add a certificate for a user
 *     tags: [Certificates]
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the user receiving the certificate
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               course_id:
 *                 type: integer
 *                 example: 101
 *               certificate_url:
 *                 type: string
 *                 example: "https://example.com/certificate/12345"
 *     responses:
 *       200:
 *         description: Certificate added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "certificate added successfully"
 *                 certificate:
 *                   $ref: '#/components/schemas/Certificate'
 *       500:
 *         description: Server error
 */
const certificateAdding = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        const { course_id, certificate_url } = req.body;
        const certificate = yield Certificates_1.default.create({
            user_id: Number(userId),
            course_id,
            certificate_url,
        });
        res
            .status(200)
            .json({ message: "certificate added successfully", certificate });
    }
    catch (error) {
        console.log(error);
    }
});
exports.certificateAdding = certificateAdding;
/**
 * @swagger
 * /certificates/{userId}:
 *   get:
 *     summary: Get certificates for a specific user and course
 *     tags: [Certificates]
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the user whose certificates are being fetched
 *       - in: body
 *         name: courseId
 *         description: Course ID to fetch certificates for
 *         schema:
 *           type: object
 *           properties:
 *             courseId:
 *               type: integer
 *               example: 101
 *     responses:
 *       200:
 *         description: Certificates retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "certificates found successfully"
 *                 certificate:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Certificate'
 *       404:
 *         description: No certificates found for the given user and course
 *       500:
 *         description: Server error
 */
const getcertificates = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        const { courseId } = req.body;
        const certificate = yield Certificates_1.default.findAll({
            where: { user_id: userId, course_id: courseId },
        });
        res
            .status(200)
            .json({ message: "certificates found successfully", certificate });
    }
    catch (error) {
        console.log(error);
    }
});
exports.getcertificates = getcertificates;
/**
 * @swagger
 * /certificates/update/{certificateId}:
 *   put:
 *     summary: Update a certificate details
 *     tags: [Certificates]
 *     parameters:
 *       - in: path
 *         name: certificateId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the certificate to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               course_id:
 *                 type: integer
 *                 example: 101
 *               issued_date:
 *                 type: string
 *                 format: date
 *                 example: "2024-10-01"
 *               certificate_url:
 *                 type: string
 *                 example: "https://example.com/updated-certificate/12345"
 *               user_id:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       200:
 *         description: Certificate updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "certificate updated successfully"
 *                 updatedCertificate:
 *                   $ref: '#/components/schemas/Certificate'
 *       400:
 *         description: Invalid input or unauthorized user
 *       500:
 *         description: Server error
 */
const certificateUpdate = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { certificateId } = req.params;
        const { course_id, issued_date, certificate_url, user_id } = req.body;
        const updatedCertificate = yield Certificates_1.default.update({ certificate_url }, { where: { id: certificateId, course_id, user_id, issued_date } });
        res.status(200).json({
            message: "certificate updated successfully",
            updatedCertificate,
        });
    }
    catch (error) {
        console.log(error);
    }
});
exports.certificateUpdate = certificateUpdate;
/**
 * @swagger
 * /certificates/delete/{certificateId}:
 *   delete:
 *     summary: Delete a certificate
 *     tags: [Certificates]
 *     parameters:
 *       - in: path
 *         name: certificateId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the certificate to delete
 *     responses:
 *       200:
 *         description: Certificate deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "certificate deleted successfully"
 *                 deletedCertificate:
 *                   type: integer
 *                   example: 5
 *       404:
 *         description: Certificate not found
 *       500:
 *         description: Server error
 */
const certificateDelete = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { certificateId } = req.params;
        const deletedCertificate = yield Certificates_1.default.destroy({
            where: { id: certificateId },
        });
        res.status(200).json({
            message: "certificate deleted successfully",
            deletedCertificate,
        });
    }
    catch (error) {
        console.log(error);
    }
});
exports.certificateDelete = certificateDelete;
/**
 * @swagger
 * components:
 *   schemas:
 *     Certificate:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         user_id:
 *           type: integer
 *           example: 1
 *         course_id:
 *           type: integer
 *           example: 101
 *         certificate_url:
 *           type: string
 *           example: "https://example.com/certificate/12345"
 *         issued_date:
 *           type: string
 *           format: date
 *           example: "2024-10-01"
 *         created_at:
 *           type: string
 *           format: date-time
 *           example: "2024-10-01T12:00:00Z"
 *         updated_at:
 *           type: string
 *           format: date-time
 *           example: "2024-10-02T12:00:00Z"
 */
/**
 * @swagger
 * /certificates/{fileName}:
 *   get:
 *     summary: Retrieve a certificate file
 *     description: Allows the user to retrieve a certificate by its file name.
 *     parameters:
 *       - name: fileName
 *         in: path
 *         required: true
 *         description: The name of the certificate file to retrieve.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Certificate file retrieved successfully.
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 *       404:
 *         description: File not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "file not found"
 */
const CertificateFileRetrival = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { fileName } = req.params;
    const filePath = path_1.default.join(__dirname, "../../uploads/certificate", fileName);
    fs_1.default.access(filePath, fs_1.default.constants.F_OK, (err) => {
        if (err) {
            res.status(404).json({ error: "file not found" });
        }
        res.sendFile(filePath);
    });
});
exports.CertificateFileRetrival = CertificateFileRetrival;
/**
 * @swagger
 * /certificates/generate:
 *   post:
 *     summary: Generate a certificate for a user
 *     description: Creates a certificate for the given user by username and userId, and stores it in the database.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: "john_doe"
 *               userId:
 *                 type: integer
 *                 example: 123
 *     responses:
 *       201:
 *         description: Certificate successfully created.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "certificate created"
 *                 certificateUrl:
 *                   type: string
 *                   example: "john_doe_certificate.pdf"
 *       400:
 *         description: Invalid input.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "username must not contain space"
 *       404:
 *         description: User not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "user not found"
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "certificate not created"
 */
const CertificateGeneration = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        function containsSpace(str) {
            const spaceRegex = /\s/;
            return spaceRegex.test(str);
        }
        let { username, userId } = req.body;
        if (containsSpace(username))
            throw new Error("username must not contain space");
        function removeSpaces(inputString) {
            return inputString.replace(/\s+/g, "");
        }
        // Call function to generate the certificate (assuming this is implemented elsewhere)
        (0, CertificateGenerate_1.createCertificateWithImage)(username);
        username = removeSpaces(username);
        const userIssued = yield User_1.default.findOne({ where: { id: userId } });
        if (userIssued) {
            const certificate = yield Certificates_1.default.update({ certificate_url: `${username}_certificate.pdf` }, { where: { id: userId } });
            if (certificate) {
                res.status(201).json({
                    message: "certificate created",
                    certificateUrl: `${username}_certificate.pdf`,
                });
            }
            else {
                res.status(500).json({ message: "certificate not created" });
            }
        }
        else {
            res.status(404).json({ message: "user not found" });
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: error });
    }
});
exports.CertificateGeneration = CertificateGeneration;
/**
 * @swagger
 * /certificates/{certificateUrl}:
 *   get:
 *     summary: Retrieve a certificate by URL
 *     description: Retrieve a certificate using the provided certificate URL.
 *     parameters:
 *       - name: certificateUrl
 *         in: path
 *         required: true
 *         description: The URL of the certificate to retrieve.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Certificate file retrieved successfully.
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 *       404:
 *         description: Certificate not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "certificate not found"
 */
const certificateRetrival = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { certificateUrl } = req.params;
    const filePath = path_1.default.join(__dirname, "../../uploads/certificate", certificateUrl);
    fs_1.default.access(filePath, fs_1.default.constants.F_OK, (err) => {
        if (err) {
            res.status(404).json({ error: "certificate not found" });
        }
        res.sendFile(filePath);
    });
});
exports.certificateRetrival = certificateRetrival;
