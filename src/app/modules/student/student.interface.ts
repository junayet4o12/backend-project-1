import { Schema, model, connect } from 'mongoose';

export interface GuardianType {
  fatherName: string;
  fatherOccupation: string;
  fatherContact: string;
  motherName: string;
  motherOccupation: string;
  motherContact: string;
}

export interface User {
  id: string;
  name: {
    firstName: string;
    middleName: string;
    lastName: string;
  };
  email: string;
  contact: string;
  emergencyContact: string;
  gender: 'male' | 'female';
  dateOfBirth: string;
  presentAddress: string;
  permanentAddress: string;
  guardian: GuardianType;
  bloodGroup?: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
  avatar?: string;
}
