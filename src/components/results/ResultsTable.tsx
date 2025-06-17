import ResultsRow from './ResultsRow';

interface ResultsTableProps {
  scores: any[];
  isThirdTerm: boolean;
}

export default function ResultsTable({ scores, isThirdTerm }: ResultsTableProps) {
  const totalSubjects = scores.length;

  // Compute subject-wise totals for final row
  const total = scores.reduce(
    (acc, row) => {
      if (isThirdTerm) {
        acc.ca1 += row.firstTerm || 0;
        acc.ca2 += row.secondTerm || 0;
        acc.exam += row.thirdTerm || 0;
        acc.total += row.average || 0; // use pre-divided average
      } else {
        acc.ca1 += row.ca1 || 0;
        acc.ca2 += row.ca2 || 0;
        acc.exam += row.exam || 0;
        acc.total += row.total || 0;
      }
      return acc;
    },
    { ca1: 0, ca2: 0, exam: 0, total: 0 }
  );

  const average = totalSubjects > 0 ? total.total / totalSubjects : 0;

  const getGrade = (score: number) => {
    if (score >= 70) return "A";
    if (score >= 60) return "B";
    if (score >= 50) return "C";
    if (score >= 45) return "D";
    return "F";
  };

  const getComment = (grade: string) => {
    switch (grade) {
      case "A": return "Excellent";
      case "B": return "Very Good";
      case "C": return "Good";
      case "D": return "Fair";
      default: return "Poor";
    }
  };

  const averageGrade = getGrade(average);
  const averageComment = getComment(averageGrade);

  return (
    <div className="mb-2">
      <h2 className="text-sm font-semibold uppercase m-2">Cognitive Content</h2>
      <table className="w-full text-sm border-2 border-black border-collapse">
        <thead className="bg-[#404040] text-white text-xs uppercase">
          <tr>
            <th className="border-2 border-black px-2 py-1 text-left">Subject</th>
            <th className="border-2 border-black px-2 py-1 text-center">
              {isThirdTerm ? "1st Term" : "CA1 (20%)"}
            </th>
            <th className="border-2 border-black px-2 py-1 text-center">
              {isThirdTerm ? "2nd Term" : "CA2 (20%)"}
            </th>
            <th className="border-2 border-black px-2 py-1 text-center">
              {isThirdTerm ? "3rd Term" : "Exam (60%)"}
            </th>
            <th className="border-2 border-black px-2 py-1 text-center">Total</th>
            <th className="border-2 border-black px-2 py-1 text-center">Grade</th>
            <th className="border-2 border-black px-2 py-1 text-center">Position</th>
            <th className="border-2 border-black px-2 py-1 text-center">Class Avg</th>
            <th className="border-2 border-black px-2 py-1 text-left">Comment</th>
          </tr>
        </thead>
        <tbody>
          {scores.map((row, i) => (
            <ResultsRow key={i} row={row} isThirdTerm={isThirdTerm} />
          ))}

        </tbody>
      </table>
    </div>
  );
}
