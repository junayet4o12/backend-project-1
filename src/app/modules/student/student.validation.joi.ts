import Joi from 'joi';

const nameValidation = Joi.string()
  .regex(/^[A-Z][a-z]*$/) // First letter uppercase, rest lowercase
  .max(20)
  .required()
  .trim()
  .messages({
    'string.pattern.base':
      '{#label} must start with an uppercase letter and contain only letters',
    'string.max': '{#label} cannot be more than 20 characters',
    'any.required': '{#label} is required',
  });
const userNameValidationSchema = Joi.object({
  firstName: nameValidation.label('First Name'),
  middleName: nameValidation.label('Middle Name'),
  lastName: nameValidation.label('Last Name'),
});

const guardianValidationSchema = Joi.object({
  fatherName: Joi.string().required().messages({
    'any.required': 'Father Name is Required',
  }),
  fatherOccupation: Joi.string().required().messages({
    'any.required': 'Father Occupation is Required',
  }),
  fatherContact: Joi.string().required().messages({
    'any.required': 'Father Contact is Required',
  }),
  motherName: Joi.string().required().messages({
    'any.required': 'Mother Name is Required',
  }),
  motherOccupation: Joi.string().required().messages({
    'any.required': 'Mother Occupation is Required',
  }),
  motherContact: Joi.string().required().messages({
    'any.required': 'Mother Contact is Required',
  }),
});

const localGuardianValidationSchema = Joi.object({
  name: Joi.string().required().messages({
    'any.required': 'Local Guardian Name is Required',
  }),
  occupation: Joi.string().required().messages({
    'any.required': 'Local Guardian Occupation is Required',
  }),
  contactNo: Joi.string().required().messages({
    'any.required': 'Local Guardian Contact is Required',
  }),
  address: Joi.string().required().messages({
    'any.required': 'Local Guardian Address is Required',
  }),
});

const studentValidationSchema = Joi.object({
  id: Joi.string().required().messages({
    'any.required': 'Student ID is Required',
  }),
  name: userNameValidationSchema.required().messages({
    'any.required': 'Student Name is Required',
  }),
  gender: Joi.string().valid('male', 'female', 'other').required().messages({
    'any.only': '{#label} must be one of [male, female, other]',
    'any.required': 'Gender is Required',
  }),
  dateOfBirth: Joi.string().optional(),
  email: Joi.string().email().required().messages({
    'string.email': '{#label} is not in valid email format',
    'any.required': 'Email is Required',
  }),
  presentAddress: Joi.string().required().messages({
    'any.required': 'Present Address is Required',
  }),
  permanentAddress: Joi.string().required().messages({
    'any.required': 'Permanent Address is Required',
  }),
  contact: Joi.string().required().messages({
    'any.required': 'Contact Number is Required',
  }),
  emergencyContact: Joi.string().required().messages({
    'any.required': 'Emergency Contact is Required',
  }),
  guardian: guardianValidationSchema.required().messages({
    'any.required': 'Guardian Information is Required',
  }),
  localGuardian: localGuardianValidationSchema.required().messages({
    'any.required': 'Local Guardian Information is Required',
  }),
  bloodGroup: Joi.string()
    .valid('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-')
    .optional()
    .messages({
      'any.only': '{#label} must be one of [A+, A-, B+, B-, AB+, AB-, O+, O-]',
    }),
  profileImage: Joi.string().uri().optional(),
  isActive: Joi.string().valid('active', 'blocked').default('active').messages({
    'any.only': '{#label} must be either "active" or "blocked"',
  }),
});

export default studentValidationSchema;
