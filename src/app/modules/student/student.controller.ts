import { Request, Response } from "express";
import { StudentServices } from "./student.service";
// import studentValidationSchema from "./student.validation";
import { z } from "zod";
const createStudent = async (req: Request, res: Response) => {
  try {
    const { student: studentData } = req.body;
    // const { error, value } = studentValidationSchema.validate(studentData);
    // console.log({ error }, { value });
    // if (error) {
    //   res.status(500).json({
    //     success: false,
    //     message: "something went wrong",
    //     error: error.details,
    //   });
    // }

    const studentValidationSchema = z.object({
      id: z.string(),
      name: z.object({
        firstName: z.string().max(20, {
          message: "First Name can not be more than 20 characters",
        }),
      }),
    });
    const result = await StudentServices.createStudentIntoDB(studentData);

    res.status(200).json({
      success: true,
      message: "Student created successfully",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error,
    });
  }
};

const getAllStudent = async (req: Request, res: Response) => {
  try {
    const result = await StudentServices.getAllStudentsFromDB();
    res.status(200).json({
      success: true,
      message: "Student created successfully",
      data: result,
    });
  } catch (error) {
    console.log(error);
  }
};
const getSingleStudent = async (req: Request, res: Response) => {
  try {
    const { studentId } = req.params;
    const result = await StudentServices.getSingleStudentsFromDB(studentId);
    res.status(200).json({
      success: true,
      message: "Student created successfully",
      data: result,
    });
  } catch (error) {
    console.log(error);
  }
};
export const StudentControllers = {
  createStudent,
  getAllStudent,
  getSingleStudent,
};
