export interface GuardianType {
  fatherName: string;
  fatherOccupation: string;
  fatherContact: string;
  motherName: string;
  motherOccupation: string;
  motherContact: string;
}
export interface UserName {
  firstName: string;
  middleName: string;
  lastName: string;
}
export interface LocalGuardianType {
  name: string;
  occupation: string;
  contactNo: string;
  address: string;
}
export interface Student {
  id: string;
  name: UserName;
  email: string;
  contact: string;
  emergencyContact: string;
  gender: 'male' | 'female';
  dateOfBirth?: string;
  presentAddress: string;
  permanentAddress: string;
  guardian: GuardianType;
  localGuardian: LocalGuardianType;
  bloodGroup?: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
  profileImage?: string;
  isActive: 'active' | 'blocked';
}
