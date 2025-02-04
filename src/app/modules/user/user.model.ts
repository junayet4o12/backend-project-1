import { model, Schema } from "mongoose";
import { IUser } from "./user.interface";
import config from "../../config";
import bcrypt from "bcrypt";
const userSchema = new Schema<IUser>({
    id: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true
    },
    needsPasswordChange: {
        type: Boolean,
        default: true
    },
    role: {
        type: String,
        enum: ['admin', 'student', 'faculty'],
        required: true
    },
    status: {
        type: String,
        enum: ['in-progress', 'blocked'],
        default: 'in-progress'
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
}, {
    timestamps: true
});
userSchema.pre("save", async function (next) {
    // console.log(this, "pre hook: we will save the data");
    const user = this;
    // hashing password and save into db
    user.password = await bcrypt.hash(
      user.password,
      Number(config.bcrypt_salt_rounds)
    );
    next();
  });
  
  // post save middleware / hook
  userSchema.post("save", function (doc, next) {
    doc.password = "";
    next();
  });
export const User = model<IUser>("User", userSchema)