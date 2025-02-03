import { Request, Response } from "express";
import { StudentServices } from "./student.service";
import studentValidationSchema from "./student.validation";
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

    const zodParseData = studentValidationSchema.parse(studentData);
    const result = await StudentServices.createStudentIntoDB(zodParseData);

    res.status(200).json({
      success: true,
      message: "Student created successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Something went wrong",
      error: error,
    });
  }
};

const getAllStudent = async (req: Request, res: Response) => {
  try {
    const result = await StudentServices.getAllStudentsFromDB();
    res.status(200).json({
      success: true,
      message: "Student data has found",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Something went wrong",
      error: error,
    });
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
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Something went wrong",
      error: error,
    });
  }
};
const deleteSingleStudent = async (req: Request, res: Response) => {
  try {
    const { studentId } = req.params;
    const result = await StudentServices.deleteStudentFromDB(studentId);
    res.status(200).json({
      success: true,
      message: "Student deleted successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Something went wrong",
      error: error,
    });
  }
};
export const StudentControllers = {
  createStudent,
  getAllStudent,
  getSingleStudent,
  deleteSingleStudent,
};
