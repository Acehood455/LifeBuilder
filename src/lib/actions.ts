"use server";

import {
  ClassSchema,
  // ExamSchema,
  ParentSchema,
  StudentSchema,
  SubjectSchema,
  TeacherSchema,
  AssessmentSchema,
  AnnouncementSchema,
  announcementSchema,
  EventSchema,
  eventSchema,
} from "./formValidationSchemas";
import prisma from "./prisma";
import { auth, clerkClient } from "@clerk/nextjs/server";


type CurrentState = { success: boolean; error: boolean };

// SUBJECTS CRUD OPERATIONS
export const createSubject = async (
  currentState: CurrentState,
  data: SubjectSchema
) => {
  try {
    await prisma.subject.create({
      data: {
        name: data.name,
        teachers: {
          connect: data.teachers.map((teacherId) => ({ id: teacherId })),
        },
      },
    });

    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const updateSubject = async (
  currentState: CurrentState,
  data: SubjectSchema
) => {
  try {
    await prisma.subject.update({
      where: {
        id: data.id,
      },
      data: {
        name: data.name,
        teachers: {
          set: data.teachers.map((teacherId) => ({ id: teacherId })),
        },
      },
    });

    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const deleteSubject = async (
  currentState: CurrentState,
  data: FormData
) => {
  const id = data.get("id") as string;
  try {
    await prisma.subject.delete({
      where: {
        id: parseInt(id),
      },
    });

    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};


// CLASS CRUD OPERATIONS
export const createClass = async (
  currentState: CurrentState,
  data: ClassSchema
) => {
  try {
    // Clean the data before creation
    const createData = {
      ...data,
      supervisorId: data.supervisorId || undefined // Converts ""/null to undefined
    };

    await prisma.class.create({
      data: createData,
    });

    return { success: true, error: false };
  } catch (err) {
    console.error("Create class error:", err);
    return { 
      success: false, 
      error: true,
      message: err instanceof Error ? err.message : "Failed to create class"
    };
  }
};

export const updateClass = async (
  currentState: CurrentState,
  data: ClassSchema
) => {
  try {
    // Clean the data before update
    const updateData = {
      ...data,
      supervisorId: data.supervisorId || undefined // Converts ""/null to undefined
    };

    await prisma.class.update({
      where: { id: data.id },
      data: updateData,
    });

    return { success: true, error: false };
  } catch (err) {
    console.error("Update class error:", err);
    return { 
      success: false, 
      error: true,
      message: err instanceof Error ? err.message : "Failed to update class"
    };
  }
};

export const deleteClass = async (
  currentState: CurrentState,
  data: FormData
) => {
  const id = data.get("id") as string;
  try {
    await prisma.class.delete({
      where: {
        id: parseInt(id),
      },
    });

    // revalidatePath("/list/class");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};


// TEACHER CRUD OPERATIONS
export const createTeacher = async (
  currentState: CurrentState,
  data: TeacherSchema
) => {
  try {
    const user = await (await clerkClient()).users.createUser({
      username: data.username,
      password: data.password,
      firstName: data.name,
      lastName: data.surname,
      publicMetadata:{role:"teacher"}
    });

    await prisma.teacher.create({
      data: {
        id: user.id,
        username: data.username,
        name: data.name,
        surnName: data.surname,
        email: data.email || null,
        phone: data.phone || null,
        address: data.address,
        img: data.img || null,
        bloodType: data.bloodType,
        sex: data.sex,
        birthday: data.birthday,
        subjects: {
          connect: data.subjects?.map((subjectId: string) => ({
            id: parseInt(subjectId),
          })),
        },
      },
    });

    // revalidatePath("/list/teachers");
    return { success: true, error: false, };
  } catch (err: any) {
    if (err && typeof err === "object" && "errors" in err && Array.isArray(err.errors)) {
      console.error("Clerk validation error:", err.errors);
      return { success: false, error: true, clerkErrors: err.errors };
    }
  
    console.error("Unexpected error:", err);
    return { success: false, error: true };
  }
};


export const updateTeacher = async (
  currentState: CurrentState,
  data: TeacherSchema
) => {
  if (!data.id) {
    return { success: false, error: true };
  }
  try {
    const user = await (await clerkClient()).users.updateUser(data.id, {
      username: data.username,
      ...(data.password !== "" && { password: data.password }),
      firstName: data.name,
      lastName: data.surname,
    });

    await prisma.teacher.update({
      where: {
        id: data.id,
      },
      data: {
        username: data.username,
        name: data.name,
        surnName: data.surname,
        email: data.email || null,
        phone: data.phone || null,
        address: data.address,
        img: data.img || null,
        bloodType: data.bloodType,
        sex: data.sex,
        birthday: data.birthday,
        subjects: {
          set: data.subjects?.map((subjectId: string) => ({
            id: parseInt(subjectId),
          })),
        },
      },
    });
    // revalidatePath("/list/teachers");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const deleteTeacher = async (
  currentState: CurrentState,
  data: FormData
) => {
  const id = data.get("id") as string;
  try {
    await (await clerkClient()).users.deleteUser(id);

    await prisma.teacher.delete({
      where: {
        id: id,
      },
    });

    // revalidatePath("/list/teachers");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};


// STUDENTS CRUD OPERATIONS
export const createStudent = async (
  currentState: CurrentState,
  data: StudentSchema
) => {
  console.log(data);
  try {
    // const classItem = await prisma.class.findUnique({
    //   where: { id: data.classId },
    //   include: { _count: { select: { students: true } } },
    // });

    // if (classItem && classItem.capacity === classItem._count.students) {
    //   return { success: false, error: true };
    // }

    const user = await (await clerkClient()).users.createUser({
      username: data.username,
      password: data.password,
      firstName: data.name,
      lastName: data.surname,
      publicMetadata:{role:"student"}
    });

    await prisma.student.create({
      data: {
        id: user.id,
        username: data.username,
        name: data.name,
        surnName: data.surname,
        email: data.email || null,
        phone: data.phone || null,
        address: data.address,
        img: data.img || null,
        bloodType: data.bloodType,
        sex: data.sex,
        birthday: data.birthday,
        gradeId: data.gradeId,
        classId: data.classId,
        parentId: data.parentId,
        admissionNumber: data.admissionNumber,
      },
    });

    // revalidatePath("/list/students");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const updateStudent = async (
  currentState: CurrentState,
  data: StudentSchema
) => {
  if (!data.id) {
    return { success: false, error: true };
  }
  try {
    const user = await (await clerkClient()).users.updateUser(data.id, {
      username: data.username,
      ...(data.password !== "" && { password: data.password }),
      firstName: data.name,
      lastName: data.surname,
    });

    await prisma.student.update({
      where: {
        id: data.id,
      },
      data: {
        username: data.username,
        name: data.name,
        surnName: data.surname,
        email: data.email || null,
        phone: data.phone || null,
        address: data.address,
        img: data.img || null,
        bloodType: data.bloodType,
        admissionNumber: data.admissionNumber || null,
        sex: data.sex,
        birthday: data.birthday,
        gradeId: data.gradeId,
        classId: data.classId,
        parentId: data.parentId,
      },
    });
    // revalidatePath("/list/students");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const deleteStudent = async (
  currentState: CurrentState,
  data: FormData
) => {
  const id = data.get("id") as string;
  try {
    await (await clerkClient()).users.deleteUser(id);

    await prisma.student.delete({
      where: {
        id: id,
      },
    });

    // revalidatePath("/list/students");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};



// // EXAMS CRUD OPERATIONS
// export const createExam = async (
//   currentState: CurrentState,
//   data: ExamSchema
// ) => {
//   const { userId, sessionClaims } = await auth();
//   const role = (sessionClaims?.metadata as { role?: string })?.role;

//   try {
//     if (role === "teacher") {
//       const teacherLesson = await prisma.lesson.findFirst({
//         where: {
//           teacherId: userId!,
//           id: data.lessonId,
//         },
//       });

//       if (!teacherLesson) {
//         return { success: false, error: true };
//       }
//     }

//     await prisma.exam.create({
//       data: {
//         title: data.title,
//         startTime: data.startTime,
//         endTime: data.endTime,
//         lessonId: data.lessonId,
//       },
//     });

//     // revalidatePath("/list/subjects");
//     return { success: true, error: false };
//   } catch (err) {
//     console.log(err);
//     return { success: false, error: true };
//   }
// };

// export const updateExam = async (
//   currentState: CurrentState,
//   data: ExamSchema
// ) => {
//   const { userId, sessionClaims } = await auth();
//   const role = (sessionClaims?.metadata as { role?: string })?.role;

//   try {
//     if (role === "teacher") {
//       const teacherLesson = await prisma.lesson.findFirst({
//         where: {
//           teacherId: userId!,
//           id: data.lessonId,
//         },
//       });

//       if (!teacherLesson) {
//         return { success: false, error: true };
//       }
//     }

//     await prisma.exam.update({
//       where: {
//         id: data.id,
//       },
//       data: {
//         title: data.title,
//         startTime: data.startTime,
//         endTime: data.endTime,
//         lessonId: data.lessonId,
//       },
//     });

//     // revalidatePath("/list/subjects");
//     return { success: true, error: false };
//   } catch (err) {
//     console.log(err);
//     return { success: false, error: true };
//   }
// };

// export const deleteExam = async (
//   currentState: CurrentState,
//   data: FormData
// ) => {
//   const id = data.get("id") as string;

//   const { userId, sessionClaims } = await auth();
//   const role = (sessionClaims?.metadata as { role?: string })?.role;

//   try {
//     await prisma.exam.delete({
//       where: {
//         id: parseInt(id),
//         ...(role === "teacher" ? { lesson: { teacherId: userId! } } : {}),
//       },
//     });

//     // revalidatePath("/list/subjects");
//     return { success: true, error: false };
//   } catch (err) {
//     console.log(err);
//     return { success: false, error: true };
//   }
// };




// PARENTS CRUD OPERATIONS
export const createParent = async (
  currentState: CurrentState,
  data: ParentSchema
) => {
  console.log(data);
  try {
    // const classItem = await prisma.class.findUnique({
    //   where: { id: data.classId },
    //   include: { _count: { select: { parents: true } } },
    // });

    // if (classItem && classItem.capacity === classItem._count.students) {
    //   return { success: false, error: true };
    // }

    const user = await (await clerkClient()).users.createUser({
      username: data.username,
      password: data.password,
      firstName: data.name,
      lastName: data.surname,
      publicMetadata:{role:"parent"}
    });

    await prisma.parent.create({
      data: {
        id: user.id,
        username: data.username,
        name: data.name,
        surnName: data.surname,
        email: data.email || null,
        phone: data.phone,
        address: data.address,
      },
    });

    // revalidatePath("/list/parents");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const updateParent = async (
  currentState: CurrentState,
  data: ParentSchema
) => {
  if (!data.id) {
    return { success: false, error: true };
  }
  try {
    const user = await (await clerkClient()).users.updateUser(data.id, {
      username: data.username,
      ...(data.password !== "" && { password: data.password }),
      firstName: data.name,
      lastName: data.surname,
    });

    await prisma.parent.update({
      where: {
        id: data.id,
      },
      data: {
        username: data.username,
        name: data.name,
        surnName: data.surname,
        email: data.email || null,
        phone: data.phone,
        address: data.address,
      },
    });
    // revalidatePath("/list/parents");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const deleteParent = async (
  currentState: CurrentState,
  data: FormData
) => {
  const id = data.get("id") as string;
  try {
    await (await clerkClient()).users.deleteUser(id);

    await prisma.parent.delete({
      where: {
        id: id,
      },
    });

    // revalidatePath("/list/parents");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};




// ASSESSMENTS CRUD OPERATIONS
export const createAssessment = async (
  _: CurrentState,
  data: AssessmentSchema
) => {
  try {
    const { id, ...rest } = data;

    console.log("Creating assessment with:", rest);

    // Step 1: Create the assessment
    const assessment = await prisma.assessment.create({
      data: {
        title: rest.title,
        type: rest.type,
        weight: rest.weight,
        subjectId: rest.subjectId,
        classId: rest.classId,
        termId: rest.termId,
        startTime: rest.startTime,
        endTime: rest.endTime,
        maxScore: rest.maxScore,
      },
    });

    // Step 2: Get students in the class
    const students = await prisma.student.findMany({
      where: { classId: rest.classId },
      select: { id: true },
    });

    // Step 3: Create AssessmentResult entries for each student
    if (students.length > 0) {
      await prisma.assessmentResult.createMany({
        data: students.map((student) => ({
          studentId: student.id,
          assessmentId: assessment.id,
          score: 0, // default
        })),
      });
    }

    return { success: true, error: false };
  } catch (err) {
    console.error(err);
    return { success: false, error: true };
  }
};

export const updateAssessment = async (
  _: CurrentState,
  data: AssessmentSchema
) => {
  try {
    await prisma.assessment.update({
      where: { id: data.id },
      data: {
        title: data.title,
        type: data.type,
        weight: data.weight,
        subjectId: data.subjectId,
        classId: data.classId,
        termId: data.termId,
        startTime: data.startTime,
        endTime: data.endTime,
        maxScore: data.maxScore,
      },
    });

    return { success: true, error: false };
  } catch (err) {
    console.error(err);
    return { success: false, error: true };
  }
};

export const deleteAssessment = async (_: CurrentState, data: FormData) => {
  const idStr = data.get("id");
  const id = Number(idStr);

  if (!idStr || isNaN(id)) {
    console.error("Invalid ID:", idStr);
    return { success: false, error: true };
  }

  try {
    // Delete related assessmentResults first to avoid foreign key constraint violations
    await prisma.assessmentResult.deleteMany({
      where: { assessmentId: id },
    });

    // Now delete the assessment itself
    await prisma.assessment.delete({
      where: { id },
    });

    return { success: true, error: false };
  } catch (err) {
    console.error("Error deleting assessment:", err);
    return { success: false, error: true };
  }
};




export const createAnnouncement = async (
  _: CurrentState,
  data: AnnouncementSchema
) => {
  try {
    const { id, ...rest } = data;

    console.log("Creating announcement with:", rest);

    await prisma.announcement.create({
      data: {
        title: rest.title,
        description: rest.description || null,
        date: new Date(rest.date), // Convert string to Date
        classId: rest.classId || null,
      },
    });

    return { success: true, error: false };
  } catch (err) {
    console.error("Error creating announcement:", err);
    return { success: false, error: true };
  }
};

export const updateAnnouncement = async (
  _: CurrentState,
  data: AnnouncementSchema
) => {
  try {
    await prisma.announcement.update({
      where: { id: data.id },
      data: {
        title: data.title,
        description: data.description || null,
        date: new Date(data.date), // Convert string to Date
        classId: data.classId || null,
      },
    });

    return { success: true, error: false };
  } catch (err) {
    console.error("Error updating announcement:", err);
    return { success: false, error: true };
  }
};

export const deleteAnnouncement = async (_: CurrentState, data: FormData) => {
  const idStr = data.get("id");
  const id = Number(idStr);

  if (!idStr || isNaN(id)) {
    console.error("Invalid ID:", idStr);
    return { success: false, error: true };
  }

  try {
    await prisma.announcement.delete({
      where: { id },
    });

    return { success: true, error: false };
  } catch (err) {
    console.error("Error deleting announcement:", err);
    return { success: false, error: true };
  }
};



export const createEvent = async (
  _: CurrentState,
  data: EventSchema
) => {
  try {
    const { id, ...rest } = data;

    console.log("Creating event with:", rest);

    await prisma.event.create({
      data: {
        title: rest.title,
        description: rest.description || null,
        startTime: new Date(rest.startTime), // Convert string to Date
        endTime: new Date(rest.endTime),     // Convert string to Date
        classId: rest.classId || null,
      },
    });

    return { success: true, error: false };
  } catch (err) {
    console.error("Error creating event:", err);
    return { success: false, error: true };
  }
};

export const updateEvent = async (
  _: CurrentState,
  data: EventSchema
) => {
  try {
    await prisma.event.update({
      where: { id: data.id },
      data: {
        title: data.title,
        description: data.description || null,
        startTime: new Date(data.startTime), // Convert string to Date
        endTime: new Date(data.endTime),     // Convert string to Date
        classId: data.classId || null,
      },
    });

    return { success: true, error: false };
  } catch (err) {
    console.error("Error updating event:", err);
    return { success: false, error: true };
  }
};

export const deleteEvent = async (_: CurrentState, data: FormData) => {
  const idStr = data.get("id");
  const id = Number(idStr);

  if (!idStr || isNaN(id)) {
    console.error("Invalid ID:", idStr);
    return { success: false, error: true };
  }

  try {
    await prisma.event.delete({
      where: { id },
    });

    return { success: true, error: false };
  } catch (err) {
    console.error("Error deleting event:", err);
    return { success: false, error: true };
  }
};