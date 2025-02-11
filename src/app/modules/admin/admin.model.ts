import { Schema, model } from "mongoose";
import { userNameSchema } from "../../schema/userName.schema";
import { IAdmin, IAdminModel } from "./admin.interface";

const adminSchema = new Schema<IAdmin, IAdminModel>(
  {
    id: {
      type: String,
      required: [true, "Admin ID is Required"],
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
      required: [true, "Admin Name is Required"],
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
    contact: { type: String, required: [true, "Contact Number is Required"], unique: true },
    emergencyContact: {
      type: String,
      required: [true, "Emergency Contact is Required"],
    },
    profileImage: { type: String },
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
adminSchema.virtual("fullName").get(function () {
  return [this?.name?.firstName, this?.name?.middleName, this?.name?.lastName]?.join(
    " "
  );
});



// query middleware
adminSchema.pre("find", async function (next) {
  // console.log(this);
  this.find({ isDeleted: { $ne: true } });
  next();
});
adminSchema.pre("findOne", async function (next) {
  // console.log(this);
  this.find({ isDeleted: { $ne: true } });
  next();
});
adminSchema.pre("aggregate", async function (next) {
  // console.log(this);
  this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });

  next();
});
adminSchema.statics.isUserExist = async function (id: string) {
  const existingUser = await Admin.findOne({ id });
  return existingUser;
};

export const Admin = model<IAdmin, IAdminModel>("Admin", adminSchema);
