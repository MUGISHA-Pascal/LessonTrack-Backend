import { Request, Response } from "express";
import Certificate from "../models/Certificates";
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

export const certificateUpdate = async (req: Request, res: Response) => {
  try {
    const { certificateId } = req.params;
    const { course_id, issued_date, certificate_url, user_id } = req.body;

    const updatedCertificate = await Certificate.update(
      { certificate_url },
      { where: { id: certificateId, course_id, user_id, issued_date } }
    );
    res
      .status(200)
      .json({
        message: "certificate updated successfully",
        updatedCertificate,
      });
  } catch (error) {
    console.log(error);
  }
};

export const certificateDelete = async (req: Request, res: Response) => {
  try {
    const { certificateId } = req.params;
    const deletedCertificate = await Certificate.destroy({
      where: { id: certificateId },
    });
    res
      .status(200)
      .json({
        message: "certificate deleted successfully",
        deletedCertificate,
      });
  } catch (error) {
    console.log(error);
  }
};
