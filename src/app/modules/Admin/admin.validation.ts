import { z } from 'zod';
import { BloodGroup, Gender } from './admin.constant';



export const createAdminValidationSchema = z.object({
  body: z.object({
    password: z.string().max(20).optional(),
    admin: z.object({
      designation: z.string(),
      name:  z.string(),
      gender: z.enum([...Gender] as [string, ...string[]]),
      email: z.string().email(),
    
    }),
  }),
});



export const updateAdminValidationSchema = z.object({
  body: z.object({
    admin: z.object({
      name:  z.string().optional(),
      designation: z.string().max(30).optional(),
      gender: z.enum([...Gender] as [string, ...string[]]).optional(),
      dateOfBirth: z.string().optional(),
      email: z.string().email().optional(),
      contactNo: z.string().optional(),
      emergencyContactNo: z.string().optional(),
      bloogGroup: z.enum([...BloodGroup] as [string, ...string[]]).optional(),
      presentAddress: z.string().optional(),
      permanentAddress: z.string().optional(),
     profileImg: z.string().optional(),
    }),
  }),
});

export const AdminValidations = {
  createAdminValidationSchema,
  updateAdminValidationSchema,
};
