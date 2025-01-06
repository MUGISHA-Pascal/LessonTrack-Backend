import { Request, Response } from "express";
import User from "../models/User";
import Quiz from "../models/Quiz";
import Question from "../models/Questions";
import { Sequelize } from "sequelize";
import { Op } from "sequelize";
import Taken from "../models/Taken";
/**
 * @swagger
 * tags:
 *   name: Quiz
 *   description: Quiz management and administration
 */

/**
 * @swagger
 * /quiz/add/{userId}:
 *   post:
 *     summary: Add a new quiz (admin or sub_admin only)
 *     tags: [Quiz]
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the user adding the quiz
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               course_id:
 *                 type: integer
 *                 example: 1
 *               title:
 *                 type: string
 *                 example: "Quiz Title"
 *               max_attempts:
 *                 type: integer
 *                 example: 3
 *     responses:
 *       200:
 *         description: Quiz added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "quiz added successfully"
 *                 quiz:
 *                   $ref: '#/components/schemas/Quiz'
 *       403:
 *         description: Not eligible to add quiz
 *       500:
 *         description: Server error
 */
export const quizAdding = async (req: Request, res: Response) => {
  try {
    const { course_id, title, max_attempts, description, type_of, owners , category} =
      req.body;
    if (type_of === "quiz") {
      const QuizFound = await Quiz.findOne({
        where: { course_id, type_of: "quiz" },
      });
      if (QuizFound) {
        res
          .status(405)
          .json({
            message: "you are allowed to only add one quiz for a course",
          });
        return;
      }
    }
    if (type_of === "exam") {
      const ExamFound = await Quiz.findOne({
        where: { course_id, type_of: "exam" },
      });
      if (ExamFound) {
        res
          .status(405)
          .json({
            message: "you are allowed to only add one exam for a course",
          });
        return;
      }
    }
    const userEligible = await User.findOne({ where: { id: owners } });
    if (userEligible?.role === "sub_admin" || "admin") {
      const quiz = await Quiz.create({
        owners,
        course_id,
        title,
        max_attempts,
        description,
        type_of,
        categoryName: category
      });
      res.status(200).json({ message: "quiz added successfully", quiz });
    } else {
      res.status(404).json({ message: "you are not elligible to add quiz" });
    }
  } catch (error) {
    console.log(error);
  }
};



export const getCategory= async (req: Request, res: Response) => {
  try {
    // Fetch grouped courses by category
    const groupedCourses = await Quiz.findAll({
      attributes: ['categoryName']  // Fixed typo here
    });

    if (!groupedCourses || groupedCourses.length === 0) {
       res.status(404).json({ message: "No courses found" });
       return
    }

     res.status(200).json({
      message: "Courses grouped by category",
      groupedCourses,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred while fetching courses." });
  }
};

/**
 * @swagger
 * /quiz/:
 *   get:
 *     summary: Get quizzes by course ID
 *     tags: [Quiz]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               course_id:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       200:
 *         description: Quizzes found successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "quiz found successfully"
 *                 quiz:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Quiz'
 *       500:
 *         description: Server error
 */
export const getQuiz = async (req: Request, res: Response) => {
  try {
    const { course_id } = req.params;
    const quizzes = await Quiz.findAll({
      where: { owners: course_id },
    });
    res.status(200).json({ message: "quiz found successfully", quizzes });
  } catch (error) {
    console.log(error);
  }
};

export const getQuizFetch = async (req: Request, res: Response) => {
  try {
    const { course_id } = req.params;
    const quizzes = await Quiz.findAll({
      where: { owners: course_id },
    });
    res.status(200).json({ message: "quiz found successfully", quizzes });
  } catch (error) {
    console.log(error);
  }
};
/**
 * @swagger
 * /quiz/update/{userId}:
 *   put:
 *     summary: Update an existing quiz (admin or sub_admin only)
 *     tags: [Quiz]
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the user updating the quiz
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               course_id:
 *                 type: integer
 *                 example: 1
 *               title:
 *                 type: string
 *                 example: "Updated Quiz Title"
 *               max_attempts:
 *                 type: integer
 *                 example: 5
 *               quizId:
 *                 type: integer
 *                 example: 10
 *     responses:
 *       200:
 *         description: Quiz updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "quiz updated successfully"
 *                 updatedQuiz:
 *                   type: integer
 *                   example: 1
 *       403:
 *         description: Not eligible to update quiz
 *       500:
 *         description: Server error
 */

export const getQuizes = async (req: Request, res: Response) => {
  try {
    const quizzes = await Quiz.findAll({
        include: [
          {
            model: Question,
            attributes: ['question', 'options'],  // Optional attributes
          },
        ],
    });

    res.status(200).json({ message: "Quizzes found successfully", quizzes });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error fetching quizzes" });
  }
};

export const getQuizesExam = async (req: Request, res: Response) => {

  try {
    const quizzes = await Quiz.findAll({
        include: [
          {
            model: Question,
            attributes: ['question', 'options'],  // Optional attributes
          },
        ],
        where: {
          type_of: {[Op.iLike]: "exam"}
        }
    });

    res.status(200).json({ message: "Quizzes found successfullys", quizzes });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error fetching quizzes" });
  }
};


export const getYourDoneQuiz = async (req: Request, res: Response) => {
  const { userid } = req.params; // Assuming userid is passed as a parameter

  try {
    // Fetch all entries from the Taken table for the given userid
    const takenEntries = await Taken.findAll({
      where: { userid },
      attributes: ['id', 'quiz', 'marks', 'status', 'userid'], // Select all attributes
      raw: true, // Fetch raw data for easier processing
    });

    // Extract quiz IDs from the Taken table
    const quizIds = takenEntries.map((entry) => entry.quiz);

    if (quizIds.length === 0) {
       res.status(404).json({ message: 'No quizzes found for the given user', data: [] });
       return
    }

   
    const quizzes = await Quiz.findAll({
      include: [
        {
          model: Question,
          attributes: ['id', 'question', 'options'], 
        },
      ],
      where: {
        id: {
          [Op.in]: quizIds, 
        },
      
      },
      raw: false, 
    });

    const result = takenEntries.map((entry) => {
      const quizDetails = quizzes.find((quiz) => quiz.id === entry.quiz);
      return {
        ...entry, 
        quizDetails: quizDetails || null, 
      };
    });

    res.status(200).json({ message: 'Quizzes found successfully', data: result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching quizzes', error: error });
  }
};  
export const getQuizesCat = async (req: Request, res: Response) => {

  const {cat} = req.params
  try {
    const quizzes = await Quiz.findAll({
      include: [
        {
          model: Question,
          attributes: ['question', 'options'],  // Optional attributes
        },
      ],
     where: {
      categoryName: cat
     }
    });
    
    res.status(200).json({ message: "quiz found successfully", quizzes });
  } catch (error) {
    console.log(error);
  }
};

export const getQuizesLast = async (req: Request, res: Response) => {

  const {id} = req.params
  try {
    const quizzes = await Quiz.findAll({
      include: [
        {
          model: Question,
          attributes: ['question', 'options', "id" as "questionid"], 
        },
      ],
     where: {
      course_id: id
     },
     limit:1,
     order: [Sequelize.literal('RANDOM()')], 

    });
    
    res.status(200).json({ message: "quiz found successfully", quizzes });
  } catch (error) {
    console.log(error);
  }
};



export const getQuizesStart= async (req: Request, res: Response) => {

  const {id} = req.params
  try {
    const quizzes = await Quiz.findAll({
      include: [
        {
          model: Question,
          attributes: ['question', 'options', "id" as "questionid"], 
        },
      ],
     where: {
      id: id
     },
     limit:1,


    });
    
    res.status(200).json({ message: "quiz found successfully", quizzes });
  } catch (error) {
    console.log(error);
  }
};
export const quizUpdate = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { title, description, max_attempts, quizId } = req.body;
    console.log(title, description, max_attempts, quizId);
    const userEligible = await User.findOne({ where: { id: userId } });
    if (userEligible?.role === "sub_admin" || "admin") {
      const updatedQuiz = await Quiz.update(
        { title, max_attempts, description },
        { where: { id: quizId } }
      );
      // console.log("working");
      res
        .status(200)
        .json({ message: "quiz updated successfully", updatedQuiz });
      return;
    } else {
      res.json({ message: "you are not elligible to update quiz" });
      return;
    }
  } catch (error) {
    console.log(error);
  }
};

export const saveQuiz = async (req: Request, res: Response) => {
  const { userid, quiz, marks, status } = req.body;
  try {
    const save = await Taken.create({ userid, quiz, marks, status });
    res.status(200).json({ message: "Quiz saved", save });
    console.log("quiz was saved successfully");
  } catch (error) {
    console.error("Error saving quiz:", error);
    res.status(500).json({ message: "An error occurred", error });
  }
};

export const update = async (req: Request, res: Response) => {
  const { userid, quiz, marks, status } = req.body;
  try {
    const save = await Taken.update({
      marks,
      status,
    },
    {
      where: {
        userid,
        quiz
      }
    }
  
  )
    res.status(200).json({ message: "Quiz saved", save });
    console.log("quiz was saved successfully");
  } catch (error) {
    console.error("Error saving quiz:", error);
    res.status(500).json({ message: "An error occurred", error });
  }
};
/**
 * @swagger
 * /quiz/delete/{quizId}:
 *   delete:
 *     summary: Delete a quiz (admin or sub_admin only)
 *     tags: [Quiz]
 *     parameters:
 *       - in: path
 *         name: quizId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the quiz to be deleted
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       200:
 *         description: Quiz deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "quiz deleted successfully"
 *                 deletedQuiz:
 *                   type: integer
 *                   example: 1
 *       403:
 *         description: Not eligible to delete quiz
 *       500:
 *         description: Server error
 */
export const quizDelete = async (req: Request, res: Response) => {
  try {
    const { quizId, userId } = req.params;

    const userEligible = await User.findOne({ where: { id: userId } });
    if (userEligible?.role === "sub_admin" || "admin") {
      const deletedQuiz = await Quiz.destroy({
        where: { id: quizId },
      });
      res
        .status(200)
        .json({ message: "quiz deleted successfully", deletedQuiz });
    } else {
      res.json({ message: "you are not elligible to delete quiz" });
    }
  } catch (error) {
    console.log(error);
  }
};

/**
 * @swagger
 * components:
 *   schemas:
 *     Quiz:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         course_id:
 *           type: integer
 *           example: 1
 *         title:
 *           type: string
 *           example: "Quiz Title"
 *         max_attempts:
 *           type: integer
 *           example: 3
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2024-11-09T00:00:00Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: "2024-11-09T00:00:00Z"
 */
// export const questionAnswersHandling = async (req: Request, res: Response) => {
//   const { answers, quizId } = req.body;
//   const quiz = await Quiz.findOne({ where: { id: quizId } });
//   let correctAnswers: string[] = [];
//   if (quiz) {
//     correctAnswers = quiz.answers;
//   }
//   if (!quiz) {
//     res.status(400).json({ error: "the quiz is not found" });
//   }
//   if (!Array.isArray(answers)) {
//     res.status(400).json({ error: "Answers must be an array." });
//   }

//   if (answers.length !== correctAnswers.length) {
//     res.status(400).json({
//       error: "Number of submitted answers does not match the expected length.",
//     });
//   }

//   let correctCount = 0;
//   answers.forEach((answer: string, index: number) => {
//     if (answer === correctAnswers[index]) {
//       correctCount++;
//     }
//   });

//   const averageScore = (correctCount / correctAnswers.length) * 100;

//   res.json({
//     message: "Answers processed successfully.",
//     totalQuestions: correctAnswers.length,
//     correctAnswers: correctCount,
//     averageScore: averageScore.toFixed(2),
//   });
// };
