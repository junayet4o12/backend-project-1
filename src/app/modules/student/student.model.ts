import { Schema, model } from 'mongoose';
import validator from 'validator';
import {
  GuardianType,
  LocalGuardianType,
  Student as StudentType,
  UserName,
} from './student.interface';

const userNameSchema = new Schema<UserName>({
  firstName: {
    type: String,
    required: [true, 'First Name is Required'],
    maxlength: [20, 'First Name Cannot be more than 20 characters'],
    // validate: {
    //   validator: function (value: string) {
    //     const firstNameStr = value.charAt(0).toUpperCase() + value.slice(1);
    //     return firstNameStr === value;
    //   },
    //   message: '{VALUE} is not in capitalize formate',
    // },
  },
  middleName: {
    type: String,
    required: [true, 'Middle Name is Required'],
    maxlength: [20, 'Middle Name Cannot be more than 20 characters'],
    trim: true,
  },
  lastName: {
    type: String,
    required: [true, 'Last Name is Required'],
    maxlength: [20, 'Last Name Cannot be more than 20 characters'],
    // validate: {
    //   validator: (value: string) => validator.isAlpha(value),
    //   message: '{VALUE} is not valid',
    // },
  },
});

const guardianSchema = new Schema<GuardianType>({
  fatherName: { type: String, required: [true, 'Father Name is Required'] },
  fatherOccupation: {
    type: String,
    required: [true, 'Father Occupation is Required'],
  },
  fatherContact: {
    type: String,
    required: [true, 'Father Contact is Required'],
  },
  motherName: { type: String, required: [true, 'Mother Name is Required'] },
  motherOccupation: {
    type: String,
    required: [true, 'Mother Occupation is Required'],
  },
  motherContact: {
    type: String,
    required: [true, 'Mother Contact is Required'],
  },
});

const localGuardianSchema = new Schema<LocalGuardianType>({
  name: { type: String, required: [true, 'Local Guardian Name is Required'] },
  occupation: {
    type: String,
    required: [true, 'Local Guardian Occupation is Required'],
  },
  contactNo: {
    type: String,
    required: [true, 'Local Guardian Contact is Required'],
  },
  address: {
    type: String,
    required: [true, 'Local Guardian Address is Required'],
  },
});

const studentSchema = new Schema<StudentType>({
  id: {
    type: String,
    required: [true, 'Student ID is Required'],
    unique: true,
  },
  name: {
    type: userNameSchema,
    required: [true, 'Student Name is Required'],
  },
  gender: {
    type: String,
    enum: {
      values: ['male', 'female', 'other'],
      message: '{VALUE} is not a valid gender',
    },
    required: [true, 'Gender is Required'],
  },
  dateOfBirth: { type: String },
  email: {
    type: String,
    required: [true, 'Email is Required'],
    unique: true,
    // validate: {
    //   validator: (value: string) => validator.isEmail(value),
    //   message: '{VALUE} is not in valid email formate',
    // },
  },
  presentAddress: {
    type: String,
    required: [true, 'Present Address is Required'],
  },
  permanentAddress: {
    type: String,
    required: [true, 'Permanent Address is Required'],
  },
  contact: { type: String, required: [true, 'Contact Number is Required'] },
  emergencyContact: {
    type: String,
    required: [true, 'Emergency Contact is Required'],
  },
  guardian: {
    type: guardianSchema,
    required: [true, 'Guardian Information is Required'],
  },
  localGuardian: {
    type: localGuardianSchema,
    required: [true, 'Local Guardian Information is Required'],
  },
  bloodGroup: {
    type: String,
    enum: {
      values: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
      message: '{VALUE} is not a valid blood group',
    },
    required: false,
  },
  profileImage: { type: String },
  isActive: {
    type: String,
    enum: {
      values: ['active', 'blocked'],
      message:
        '{VALUE} is not a valid status for isActive. Allowed values are "active" or "blocked".',
    },
    default: 'active',
  },
});

export const StudentModel = model<StudentType>('Student', studentSchema);
