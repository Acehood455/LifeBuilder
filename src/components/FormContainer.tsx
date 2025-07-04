import prisma from "@/lib/prisma";
import FormModal from "./FormModal";
import { auth } from "@clerk/nextjs/server";

export type FormContainerProps = {
  table:
    | "teacher"
    | "student"
    | "parent"
    | "subject"
    | "class"
    | "lesson"
    // | "exam"
    // | "assignment"
    | "result"
    | "attendance"
    | "event"
    | "announcement"
    | "assessment";
  type: "create" | "update" | "delete";
  data?: any;
  id?: number | string;
};

const FormContainer = async ({ table, type, data, id }: FormContainerProps) => {
  let relatedData = {};

  const { userId, sessionClaims } = await auth();
  const role = (sessionClaims?.metadata as { role?: string })?.role;
  const currentUserId = userId;

  if (type !== "delete") {
    switch (table) {
      case "subject":
        const subjectTeachers = await prisma.teacher.findMany({
          select: { id: true, name: true, surnName: true },
        });
        relatedData = { teachers: subjectTeachers };
        break;

      case "class":
        const classGrades = await prisma.grade.findMany({
          select: { id: true, level: true },
        });
        const classTeachers = await prisma.teacher.findMany({
          select: { id: true, name: true, surnName: true },
        });
        relatedData = { teachers: classTeachers, grades: classGrades };
        break;

      case "teacher":
        const teacherSubjects = await prisma.subject.findMany({
          select: { id: true, name: true },
        });
        relatedData = { subjects: teacherSubjects };
        break;

      case "student":
        const studentGrades = await prisma.grade.findMany({
          select: { id: true, level: true },
        });
        const studentClasses = await prisma.class.findMany({
          include: { _count: { select: { students: true } } },
        });
        relatedData = { classes: studentClasses, grades: studentGrades };
        break;
        
      // case "exam":
      //   const examLessons = await prisma.lesson.findMany({
      //     where: {
      //       ...(role === "teacher" ? { teacherId: currentUserId! } : {}),
      //     },
      //     select: { id: true, name: true },
      //   });

        // relatedData = { lessons: examLessons };
        // break;

      case "parent":
        const parentsChildren = await prisma.student.findMany({
          select: { id: true, name: true, surnName:true },
        });
          
        relatedData = { students: parentsChildren };
        break;

      case "assessment":
        const assessmentSubjects = await prisma.subject.findMany({
          select: { id: true, name: true },
        });

        const assessmentClasses = await prisma.class.findMany({
          select: { id: true, name: true },
        });

        const assessmentTerms = await prisma.term.findMany({
          select: {
            id: true,
            name: true,
            academicYear: {
              select: { year: true },
            },
          },
        });

        relatedData = {
          subjects: assessmentSubjects,
          classes: assessmentClasses,
          terms: assessmentTerms,
        };
        break;

      case "event":
      case "announcement":
        const eventClasses = await prisma.class.findMany({
          select: { id: true, name: true },
          orderBy: { name: 'asc' }  // Optional: sort classes by name
        });
        relatedData = { classes: eventClasses };
        break;
      

      default:
        break;
    }
  }

  return (
    <div className="">
      <FormModal
        table={table}
        type={type}
        data={data}
        id={id}
        relatedData={relatedData}
      />
    </div>
  );
};

export default FormContainer;
