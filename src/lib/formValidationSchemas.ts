import { z } from "zod";

export const subjectSchema = z.object({
  id: z.coerce.number().optional(),
  name: z.string().min(1, { message: "Subject name is required!" }),
  teachers: z.array(z.string()), //teacher ids
});

export type SubjectSchema = z.infer<typeof subjectSchema>;

export const classSchema = z.object({
  id: z.coerce.number().optional(),
  name: z.string().min(1, { message: "Subject name is required!" }),
  capacity: z.coerce.number().min(1, { message: "Capacity name is required!" }),
  gradeId: z.coerce.number().min(1, { message: "Grade name is required!" }),
  supervisorId: z.union([
    z.string().length(0).transform(() => null), // Convert empty string to null
    z.string().min(1).optional()
  ]).optional(),
});

export type ClassSchema = z.infer<typeof classSchema>;

export const teacherSchema = z.object({
  id: z.string().optional(),
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters long!" })
    .max(20, { message: "Username must be at most 20 characters long!" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long!" })
    .optional()
    .or(z.literal("")),
  name: z.string().min(1, { message: "First name is required!" }),
  surname: z.string().min(1, { message: "Last name is required!" }),
  email: z
    .string()
    .email({ message: "Invalid email address!" })
    .optional()
    .or(z.literal("")),
  phone: z.string().optional(),
  address: z.string(),
  img: z.string().optional(),
  bloodType: z.string().min(1, { message: "Blood Type is required!" }),
  birthday: z.coerce.date({ message: "Birthday is required!" }),
  sex: z.enum(["MALE", "FEMALE"], { message: "Sex is required!" }),
  subjects: z.array(z.string()).optional(), // subject ids
});

export type TeacherSchema = z.infer<typeof teacherSchema>;

export const studentSchema = z.object({
  id: z.string().optional(),
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters long!" })
    .max(20, { message: "Username must be at most 20 characters long!" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long!" })
    .optional()
    .or(z.literal("")),
  name: z.string().min(1, { message: "First name is required!" }),
  surname: z.string().min(1, { message: "Last name is required!" }),
  email: z
    .string()
    .email({ message: "Invalid email address!" })
    .optional()
    .or(z.literal("")),
  phone: z.string().optional(),
  address: z.string(),
  img: z.string().optional(),
  bloodType: z.string().min(1, { message: "Blood Type is required!" }),
  birthday: z.coerce.date({ message: "Birthday is required!" }),
  sex: z.enum(["MALE", "FEMALE"], { message: "Sex is required!" }),
  gradeId: z.coerce.number().min(1, { message: "Grade is required!" }),
  classId: z.coerce.number().min(1, { message: "Class is required!" }),
  parentId: z.string().min(1, { message: "Parent Id is required!" }),
  admissionNumber: z
  .string()
  .min(1, { message: "Admission number is required!" })
  .optional()
  .or(z.literal("")),
});

export type StudentSchema = z.infer<typeof studentSchema>;

export const examSchema = z.object({
  id: z.coerce.number().optional(),
  title: z.string().min(1, { message: "Title name is required!" }),
  startTime: z.coerce.date({ message: "Start time is required!" }),
  endTime: z.coerce.date({ message: "End time is required!" }),
  lessonId: z.coerce.number({ message: "Lesson is required!" }),
});

export type ExamSchema = z.infer<typeof examSchema>;


export const parentSchema = z.object({
  id: z.string().optional(),
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters long!" })
    .max(20, { message: "Username must be at most 20 characters long!" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long!" })
    .optional()
    .or(z.literal("")),
  name: z.string().min(1, { message: "First name is required!" }),
  surname: z.string().min(1, { message: "Last name is required!" }),
  email: z
    .string()
    .email({ message: "Invalid email address!" })
    .optional()
    .or(z.literal("")),
  phone: z.string(),
  address: z.string(),
  });

export type ParentSchema = z.infer<typeof parentSchema>;


export const assessmentSchema = z.object({
  id: z.coerce.number().optional(),
  title: z.string().min(1, { message: "Title is required!" }),
  type: z.enum(["FIRST_CA", "SECOND_CA", "EXAM"], {
    message: "Assessment type is required!",
  }),
  weight: z.coerce.number().min(0, { message: "Weight is required!" }),
  maxScore: z.coerce.number().min(1, { message: "Max score must be at least 1!" }),
  startTime: z.coerce.date({ message: "Start time is required!" }),
  endTime: z.coerce.date({ message: "End time is required!" }),
  subjectId: z.coerce.number().min(1, { message: "Subject is required!" }),
  classId: z.coerce.number().min(1, { message: "Class is required!" }),
  termId: z.coerce.number().min(1, { message: "Term is required!" }),
});

export type AssessmentSchema = z.infer<typeof assessmentSchema>;


export const announcementSchema = z.object({
  id: z.coerce.number().optional(),
  title: z.string().min(1, { message: "Title is required!" }),
  description: z.string().optional(),
  date: z.coerce.date({ 
    required_error: "Date is required!",
    invalid_type_error: "Invalid date format!" 
  }),
  classId: z.coerce.number()
    .min(1, { message: "Class is required!" })
    .optional()
    .nullable()
    .transform(val => val === null ? undefined : val),
});

export type AnnouncementSchema = z.infer<typeof announcementSchema>;



export const eventSchema = z.object({
  id: z.coerce.number().optional(),
  title: z.string()
    .min(3, { message: "Title must be at least 3 characters" })
    .max(100, { message: "Title can't exceed 100 characters" }),
  description: z.string()
    .max(500, { message: "Description can't exceed 500 characters" })
    .optional(),
  startTime: z.coerce.date({
    required_error: "Start time is required",
    invalid_type_error: "Invalid date format",
  }),
  endTime: z.coerce.date({
    required_error: "End time is required",
    invalid_type_error: "Invalid date format",
  }),
  classId: z.union([
    z.number().int().positive(),
    z.string().transform(val => val === "" ? null : Number(val))
  ]).nullable().optional(),
});

export type EventSchema = z.infer<typeof eventSchema>;