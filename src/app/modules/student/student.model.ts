import { Schema, model } from 'mongoose';
import {
  GuardianType,
  LocalGuardianType,
  Student as StudentType,
  UserName,
} from './student.interface';

const required_string = { type: String, required: true };

const userNameSchema = new Schema<UserName>({
  firstName: required_string,
  middleName: required_string,
  lastName: required_string,
});

const guardianSchema = new Schema<GuardianType>({
  fatherName: required_string,
  fatherOccupation: required_string,
  fatherContact: required_string,
  motherName: required_string,
  motherOccupation: required_string,
  motherContact: required_string,
});

const localGuardianSchema = new Schema<LocalGuardianType>({
  name: required_string,
  occupation: required_string,
  contactNo: required_string,
  address: required_string,
});

const studentSchema = new Schema<StudentType>({
  id: { type: String },
  name: userNameSchema,
  gender: ['male', 'female'],
  dateOfBirth: { type: String },
  email: required_string,
  presentAddress: required_string,
  permanentAddress: required_string,
  contact: required_string,
  emergencyContact: required_string,
  guardian: guardianSchema,
  localGuardian: localGuardianSchema,
  bloodGroup: {
    type: String,
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
    required: false,
  },
  profileImage: { type: String },
  isActive: ['active', 'blocked'],
});

export const StudentModel = model<StudentType>('Student', studentSchema);
