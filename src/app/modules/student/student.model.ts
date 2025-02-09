import { Schema, model } from "mongoose";

import {
  TGuardian,
  TLocalGuardian,
  TStudentModel,
  TStudent,
  TUserName,
} from "./student.interface";

const userNameSchema = new Schema<TUserName>({
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

const guardianSchema = new Schema<TGuardian>({
  fatherName: { type: String, required: [true, "Father Name is Required"] },
  fatherOccupation: {
    type: String,
    required: [true, "Father Occupation is Required"],
  },
  fatherContact: {
    type: String,
    required: [true, "Father Contact is Required"],
  },
  motherName: { type: String, required: [true, "Mother Name is Required"] },
  motherOccupation: {
    type: String,
    required: [true, "Mother Occupation is Required"],
  },
  motherContact: {
    type: String,
    required: [true, "Mother Contact is Required"],
  },
});

const localGuardianSchema = new Schema<TLocalGuardian>({
  name: { type: String, required: [true, "Local Guardian Name is Required"] },
  occupation: {
    type: String,
    required: [true, "Local Guardian Occupation is Required"],
  },
  contactNo: {
    type: String,
    required: [true, "Local Guardian Contact is Required"],
  },
  address: {
    type: String,
    required: [true, "Local Guardian Address is Required"],
  },
});

const studentSchema = new Schema<TStudent, TStudentModel>(
  {
    id: {
      type: String,
      required: [true, "Student ID is Required"],
      unique: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      required: [true, "User ID is Required"],
      unique: true,
      ref: "User",
    },
    name: {
      type: userNameSchema,
      required: [true, "Student Name is Required"],
    },
    gender: {
      type: String,
      enum: {
        values: ["male", "female", "other"],
        message: "{VALUE} is not a valid gender",
      },
      required: [true, "Gender is Required"],
    },
    dateOfBirth: { type: String },
    email: {
      type: String,
      required: [true, "Email is Required"],
      unique: true,
    },
    presentAddress: {
      type: String,
      required: [true, "Present Address is Required"],
    },
    permanentAddress: {
      type: String,
      required: [true, "Permanent Address is Required"],
    },
    contact: { type: String, required: [true, "Contact Number is Required"] },
    emergencyContact: {
      type: String,
      required: [true, "Emergency Contact is Required"],
    },
    guardian: {
      type: guardianSchema,
      required: [true, "Guardian Information is Required"],
    },
    localGuardian: {
      type: localGuardianSchema,
      required: [true, "Local Guardian Information is Required"],
    },
    bloodGroup: {
      type: String,
      enum: {
        values: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
        message: "{VALUE} is not a valid blood group",
      },
      required: false,
    },
    profileImage: { type: String },
    admissionSemester: { type: Schema.Types.ObjectId, ref: "AcademicSemester" },
    academicDepartment: { type: Schema.Types.ObjectId, ref: "AcademicDepartment" },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: {
      virtuals: true,
    },
  }
);

// virtual
studentSchema.virtual("fullName").get(function () {
  return [this.name.firstName, this.name.middleName, this.name.lastName].join(
    " "
  );
});



// query middleware
studentSchema.pre("find", async function (next) {
  // console.log(this);
  this.find({ isDeleted: { $ne: true } });
  next();
});
studentSchema.pre("findOne", async function (next) {
  // console.log(this);
  this.find({ isDeleted: { $ne: true } });
  next();
});
studentSchema.pre("aggregate", async function (next) {
  // console.log(this);
  this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });

  next();
});
studentSchema.statics.isUserExist = async function (id: string) {
  const existingUser = await Student.findOne({ id });
  return existingUser;
};

export const Student = model<TStudent, TStudentModel>("Student", studentSchema);
