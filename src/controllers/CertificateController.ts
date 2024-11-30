import { Request, Response } from "express";
import Certificate from "../models/Certificates";
import fs from "fs";
import path from "path";
import { createCertificateWithImage } from "../middlewares/CertificateGenerate";
import User from "../models/User";
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
export const certificateAdding = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { course_id, certificate_url } = req.body;

    const certificate = await Certificate.create({
      user_id: Number(userId),
      course_id,
      certificate_url,
    });
    res
      .status(200)
      .json({ message: "certificate added successfully", certificate });
  } catch (error) {
    console.log(error);
  }
};
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
export const getcertificates = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { courseId } = req.body;
    const certificate = await Certificate.findAll({
      where: { user_id: userId, course_id: courseId },
    });
    res
      .status(200)
      .json({ message: "certificates found successfully", certificate });
  } catch (error) {
    console.log(error);
  }
};

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
export const certificateUpdate = async (req: Request, res: Response) => {
  try {
    const { certificateId } = req.params;
    const { course_id, issued_date, certificate_url, user_id } = req.body;

    const updatedCertificate = await Certificate.update(
      { certificate_url },
      { where: { id: certificateId, course_id, user_id, issued_date } }
    );
    res.status(200).json({
      message: "certificate updated successfully",
      updatedCertificate,
    });
  } catch (error) {
    console.log(error);
  }
};

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
export const certificateDelete = async (req: Request, res: Response) => {
  try {
    const { certificateId } = req.params;
    const deletedCertificate = await Certificate.destroy({
      where: { id: certificateId },
    });
    res.status(200).json({
      message: "certificate deleted successfully",
      deletedCertificate,
    });
  } catch (error) {
    console.log(error);
  }
};
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
export const CertificateFileRetrival = async (req: Request, res: Response) => {
  const { fileName } = req.params;
  const filePath = path.join(__dirname, "../../uploads/certificate", fileName);
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      res.status(404).json({ error: "file not found" });
    }
    res.sendFile(filePath);
  });
};

export const CertificateGeneration = async (req: Request, res: Response) => {
  try {
    function containsSpace(str: string) {
      const spaceRegex = /\s/;
      return spaceRegex.test(str);
    }
    let { username, userId } = req.body;
    if (containsSpace(username))
      throw new Error("username must not contain space");
    function removeSpaces(inputString: string) {
      return inputString.replace(/\s+/g, "");
    }

    createCertificateWithImage(username);
    username = removeSpaces(username);
    const userIssued = await User.findOne({ where: { id: userId } });
    if (userIssued) {
      const certificate = await Certificate.update(
        { certificate_url: `${username}_certificate.pdf` },
        { where: { id: userId } }
      );
      if (certificate) {
        res.status(201).json({
          message: "certificate created",
          certificateUrl: `${username}_certificate.pdf`,
        });
      } else {
        res.status(500).json({ message: "certificate not created" });
      }
    } else {
      res.status(404).json({ message: "user not found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error });
  }
};

export const certificateRetrival = async (req: Request, res: Response) => {
  const { certificateUrl } = req.params;
  const filePath = path.join(
    __dirname,
    "../../uploads/certificate",
    certificateUrl
  );
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      res.status(404).json({ error: "certificate not found" });
    }
    res.sendFile(filePath);
  });
};
