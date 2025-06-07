import { PrismaClient, UseSex, Day, AssessmentType } from '../generated/prisma';
const prisma = new PrismaClient();

async function main() {
  // ADMIN
  await prisma.admin.upsert({
    where: { id: "admin1" },
    update: {},
    create: { id: "admin1", username: "admin1" },
  });
  await prisma.admin.upsert({
    where: { id: "admin2" },
    update: {},
    create: { id: "admin2", username: "admin2" },
  });

  // GRADE
  for (const i of Array.from({ length: 6 }, (_, i) => i + 1)) {
    await prisma.grade.upsert({
      where: { id: i },
      update: {},
      create: { level: i.toString() },
    });
  }

  // CLASS
  for (const i of Array.from({ length: 6 }, (_, i) => i + 1)) {
    await prisma.class.upsert({
      where: { id: i },
      update: {},
      create: {
        name: `${i}A`,
        gradeId: i,
        capacity: Math.floor(Math.random() * (20 - 15 + 1)) + 15,
      },
    });
  }

  // SUBJECT
  const subjectData = [
    "Mathematics", "Science", "English", "History", "Geography",
    "Physics", "Chemistry", "Biology", "Computer Science", "Art",
  ];

  for (const [i, subject] of subjectData.entries()) {
    await prisma.subject.upsert({
      where: { id: i + 1 },
      update: {},
      create: { name: subject },
    });
  }

  // TEACHER
  for (const i of Array.from({ length: 15 }, (_, i) => i + 1)) {
    await prisma.teacher.upsert({
      where: { id: `teacher${i}` },
      update: {},
      create: {
        id: `teacher${i}`,
        username: `teacher${i}`,
        name: `TName${i}`,
        surnName: `TSurname${i}`,
        email: `teacher${i}@example.com`,
        phone: `123-456-789${i}`,
        address: `Address${i}`,
        bloodType: "A+",
        sex: i % 2 === 0 ? UseSex.MALE : UseSex.FEMALE,
        subjects: { connect: [{ id: (i % 10) + 1 }] },
        classes: { connect: [{ id: (i % 6) + 1 }] },
        birthday: new Date(new Date().setFullYear(new Date().getFullYear() - 30)),
      },
    });
  }

  // Create Academic Year
  const academicYear = await prisma.academicYear.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      year: "2024/2025"
    }
  });

  // Create Terms
  const term1 = await prisma.term.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      name: "First Term",
      academicYearId: academicYear.id
    }
  });

  const term2 = await prisma.term.upsert({
    where: { id: 2 },
    update: {},
    create: {
      id: 2,
      name: "Second Term",
      academicYearId: academicYear.id
    }
  });

  const term3 = await prisma.term.upsert({
    where: { id: 3 },
    update: {},
    create: {
      id: 3,
      name: "Third Term",
      academicYearId: academicYear.id
    }
  });

  // ASSESSMENT
  const assessmentLabels = ["1st CA", "2nd CA", "Exam"];
  const terms = [term1, term2, term3];
  let assessmentId = 1;

  for (let classId = 1; classId <= 6; classId++) {
    for (let subjectId = 1; subjectId <= 10; subjectId++) {
      for (let term of terms) {
        for (let i = 0; i < assessmentLabels.length; i++) {
          await prisma.assessment.upsert({
            where: { id: assessmentId },
            update: {},
            create: {
              id: assessmentId,
              title: `${assessmentLabels[i]} - Subject ${subjectId} Class ${classId}`,
              type: i === 3 ? AssessmentType.EXAM : i === 0 ? AssessmentType.FIRST_CA : AssessmentType.SECOND_CA,
              weight: 1.0,
              maxScore: 100,
              startTime: new Date(),
              endTime: new Date(new Date().setDate(new Date().getDate() + 7)),
              subjectId,
              classId,
              termId: term.id,
            }
          });
          assessmentId++;
        }
      }
    }
  }

  // PARENT
  for (const i of Array.from({ length: 25 }, (_, i) => i + 1)) {
    await prisma.parent.upsert({
      where: { id: `parentId${i}` },
      update: {},
      create: {
        id: `parentId${i}`,
        username: `parentId${i}`,
        name: `PName ${i}`,
        surnName: `PSurname ${i}`,
        email: `parent${i}@example.com`,
        phone: `123-456-789${i}`,
        address: `Address${i}`,
      },
    });
  }
  
  // STUDENT
  for (const i of Array.from({ length: 50 }, (_, i) => i + 1)) {
    await prisma.student.upsert({
      where: { id: `student${i}` },
      update: {},
      create: {
        id: `student${i}`,
        username: `student${i}`,
        name: `SName${i}`,
        surnName: `SSurname ${i}`,
        email: `student${i}@example.com`,
        phone: `987-654-321${i}`,
        address: `Address${i}`,
        bloodType: "O-",
        sex: i % 2 === 0 ? UseSex.MALE : UseSex.FEMALE,
        parentId: `parentId${Math.ceil(i / 2) % 25 || 25}`,
        gradeId: (i % 6) + 1,
        classId: (i % 6) + 1,
        birthday: new Date(new Date().setFullYear(new Date().getFullYear() - 10)),
      },
    });
  }


  // Generate Assessment Results
  const assessments = await prisma.assessment.findMany();
  const students = await prisma.student.findMany();
  const teachers = await prisma.teacher.findMany();

  for (const assessment of assessments) {
    const relevantStudents = students.filter(s => s.classId === assessment.classId);
    for (const student of relevantStudents) {
      await prisma.assessmentResult.create({
        data: {
          studentId: student.id,
          assessmentId: assessment.id,
          score: Math.floor(Math.random() * 41) + 60, // 60 - 100
          gradedById: teachers[Math.floor(Math.random() * teachers.length)].id,
        }
      });
    }
  }

  console.log("Seeding completed successfully.");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

  // TO RUN MY SEED FILE >>>>>> 
  // node --loader ts-node/esm --experimental-specifier-resolution=node prisma/seed.ts