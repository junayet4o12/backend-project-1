import { Schema, model } from "mongoose";
import { IFaculty, IFacultyModel } from "./faculty.interface";
import { userNameSchema } from "../../schema/userName.schema";

const facultySchema = new Schema<IFaculty, IFacultyModel>(
  {
    id: {
      type: String,
      required: [true, "Faculty ID is Required"],
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
      required: [true, "Faculty Name is Required"],
    },
    designation: {
      type: String,
      required: [true, "Designation is Required"]
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
    contact: { type: String, required: [true, "Contact Number is Required"] , unique: true},
    emergencyContact: {
      type: String,
      required: [true, "Emergency Contact is Required"],
    },
    profileImage: { type: String },
    managementDepartment: { type: Schema.Types.ObjectId, ref: "AcademicDepartment" },
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
facultySchema.virtual("fullName").get(function () {
  return [this?.name?.firstName, this?.name?.middleName, this?.name?.lastName]?.join(
    " "
  );
});



// query middleware
facultySchema.pre("find", async function (next) {
  // console.log(this);
  this.find({ isDeleted: { $ne: true } });
  next();
});
facultySchema.pre("findOne", async function (next) {
  // console.log(this);
  this.find({ isDeleted: { $ne: true } });
  next();
});
facultySchema.pre("aggregate", async function (next) {
  // console.log(this);
  this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });

  next();
});
facultySchema.statics.isUserExist = async function (id: string) {
  const existingUser = await Faculty.findOne({ id });
  return existingUser;
};

export const Faculty = model<IFaculty, IFacultyModel>("Faculty", facultySchema);
