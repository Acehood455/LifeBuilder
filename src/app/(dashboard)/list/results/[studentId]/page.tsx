import prisma from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import { getUserRole } from "@/lib/utils";
import ResultPageClient from "@/components/results/ResultPageClient";
import { Metadata } from "next";
import { appConfig } from "@/lib/settings";

interface Props {
  params: { studentId: string };
}

export const metadata: Metadata = { title: "Student Result" };

function getGrade(avg: number) {
  if (avg >= 70) return "A";
  if (avg >= 60) return "B";
  if (avg >= 50) return "C";
  if (avg >= 45) return "D";
  return "F";
}

function getComment(grade: string) {
  switch (grade) {
    case "A": return "Excellent";
    case "B": return "Very Good";
    case "C": return "Good";
    case "D": return "Fair";
    case "F": return "Poor";
    default: return "";
  }
}

const StudentResultPage = async ({ params }: Props) => {
  const { userId, role } = await getUserRole();
  const { studentId } = params;

  if (role === "student" && userId !== studentId) {
    return redirect(`/list/results/${userId}`);
  }

  const student = await prisma.student.findUnique({
    where: { id: studentId },
    include: {
      class: {
        include: {
          supervisor: true,
          students: true,
        },
      },
      assessmentResults: {
        include: {
          assessment: {
            include: {
              subject: true,
              term: { include: { academicYear: true } },
            },
          },
        },
        orderBy: { assessment: { subject: { name: "asc" } } },
      },
    },
  });

  if (!student) return notFound();

  const {
    currentTerm,
    currentTermId,
    currentYear,
    newTermBegins,
    showFullYearResults,
  } = appConfig;

  const filteredResults = showFullYearResults
    ? student.assessmentResults.filter(
        (r) => r.assessment.term.academicYear.year === currentYear
      )
    : student.assessmentResults.filter(
        (r) => r.assessment.termId === currentTermId
      );

  const classmates = await prisma.student.findMany({
    where: { classId: student.classId },
    include: {
      assessmentResults: {
        where: showFullYearResults
          ? { assessment: { term: { academicYear: { year: currentYear } } } }
          : { assessment: { termId: currentTermId } },
        include: { assessment: true },
      },
    },
  });

  const subjectMap = new Map<number, any>();

  for (const res of filteredResults) {
    const { subjectId, type, term } = res.assessment;
    const subjectName = res.assessment.subject.name;

    if (!subjectMap.has(subjectId)) {
      subjectMap.set(subjectId, showFullYearResults
        ? {
            subject: { id: subjectId, name: subjectName },
            firstTerm: 0,
            secondTerm: 0,
            thirdTerm: 0,
            total: 0,
            grade: "",
            comment: "",
            classAverage: 0,
            position: 0,
          }
        : {
            subject: { id: subjectId, name: subjectName },
            ca1: 0,
            ca2: 0,
            exam: 0,
            total: 0,
            grade: "",
            comment: "",
            classAverage: 0,
            position: 0,
          });
    }

    const row = subjectMap.get(subjectId);
    const score = res.score;

    if (showFullYearResults) {
      const termKey = term.name.toLowerCase(); // "first", "second", "third"
      if (termKey.includes("first")) row.firstTerm += score;
      else if (termKey.includes("second")) row.secondTerm += score;
      else if (termKey.includes("third")) row.thirdTerm += score;
    } else {
      if (type === "FIRST_CA") row.ca1 = score;
      else if (type === "SECOND_CA") row.ca2 = score;
      else if (type === "EXAM") row.exam = score;
    }
  }

  // Finalize each row
  for (const [subjectId, row] of subjectMap.entries()) {
    if (showFullYearResults) {
      row.total = row.firstTerm + row.secondTerm + row.thirdTerm;
      const avg = row.total / 3;
      row.average = parseFloat(avg.toFixed());
      row.grade = getGrade(avg);
      row.comment = getComment(row.grade);
    } else {
      row.total = row.ca1 + row.ca2 + row.exam;
      row.grade = getGrade(row.total);
      row.comment = getComment(row.grade);
    }

    // Class average and position
    const subjectScores = classmates.map((student) => {
      const scores = student.assessmentResults.filter(
        (r) => r.assessment.subjectId === subjectId
      );

      if (showFullYearResults) {
        const total = scores.reduce((sum, r) => sum + r.score, 0);
        return { studentId: student.id, total };
      } else {
        const ca1 = scores.find((r) => r.assessment.type === "FIRST_CA")?.score || 0;
        const ca2 = scores.find((r) => r.assessment.type === "SECOND_CA")?.score || 0;
        const exam = scores.find((r) => r.assessment.type === "EXAM")?.score || 0;
        return { studentId: student.id, total: ca1 + ca2 + exam };
      }
    });

    const validScores = subjectScores.filter((s) => s.total > 0);
    const avg = validScores.reduce((acc, s) => acc + s.total, 0) / (validScores.length || 1);
    row.classAverage = parseFloat(avg.toFixed(2));

    subjectScores.sort((a, b) => b.total - a.total);
    const index = subjectScores.findIndex((s) => s.studentId === studentId);
    row.position = index >= 0 ? index + 1 : "-";
  }

  const scores = Array.from(subjectMap.values());

  // Compute overall total/position
  const classStudentCount = student.class?.students.length || 1;

  const subjectCount = scores.length;

  function calculateOverallAverage(scores: any[]) {
    if (scores.length === 0) return 0;
    const total = scores.reduce((sum, score) => sum + score.total, 0);
    return parseFloat((total / scores.length).toFixed(2));
  }

  function calculateOverallPosition(
    studentId: string,
    classmates: any[],
    scores: any[],
    showFullYearResults: boolean,
    currentTermId?: string
  ) {
    // Calculate averages for all classmates
    const studentAverages = classmates.map((student) => {
      const subjectMap: Record<number, number> = {};

      for (const result of student.assessmentResults) {
        const subjectId = result.assessment.subjectId;

        if (showFullYearResults) {
          // For full year results, sum all terms
          subjectMap[subjectId] = (subjectMap[subjectId] || 0) + result.score;
        } else {
          // For single term, only include current term results
          if (result.assessment.termId === currentTermId) {
            subjectMap[subjectId] = (subjectMap[subjectId] || 0) + result.score;
          }
        }
      }

      const subjectTotals = Object.values(subjectMap);
      const average = subjectTotals.length > 0
        ? subjectTotals.reduce((a, b) => a + b, 0) / subjectTotals.length
        : 0;

      return { id: student.id, total: average };
    });

    // Sort by average (descending)
    studentAverages.sort((a, b) => b.total - a.total);

    // Find the current student's position
    const position = studentAverages.findIndex((s) => s.id === studentId) + 1;
    
    return position;
  }

  const overallPosition = calculateOverallPosition(
    student.id,
    classmates,
    scores,
    showFullYearResults,
    currentTermId.toString()
  );


    
  const resultData = {
    session: currentYear,
    term: currentTerm,
    newTermBegins,

    student: {
      id: student.id,
      name: student.name,
      surnName: student.surnName,
      birthday: student.birthday,
      sex: student.sex,
      class: student.class
        ? {
            id: student.class.id,
            name: student.class.name,
            supervisor: student.class.supervisor
              ? {
                  name: student.class.supervisor.name,
                  surnName: student.class.supervisor.surnName,
                }
              : null,
          }
        : null,
      admissionNumber: student.admissionNumber,
    },

    subjectCount,
    classStudentCount,
    average: calculateOverallAverage(scores),
    position: overallPosition,
    scores,
  };

  return <ResultPageClient resultData={resultData} />;
};

export default StudentResultPage;
