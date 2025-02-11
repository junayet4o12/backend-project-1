import { Schema } from "mongoose";
import { IUserName } from "../interface/userName";

export const userNameSchema = new Schema<IUserName>({
    firstName: {
      type: String,
      required: [true, "First Name is Required"],
      maxlength: [20, "First Name Cannot be more than 20 characters"],
    },
    middleName: {
      type: String,
      required: [true, "Middle Name is Required"],
      maxlength: [20, "Middle Name Cannot be more than 20 characters"],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, "Last Name is Required"],
      maxlength: [20, "Last Name Cannot be more than 20 characters"],
    },
  });