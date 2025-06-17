export default function ResultsRow({ row, isThirdTerm }: { row: any; isThirdTerm: boolean }) {
  return (
    <tr className="text-xs">
      {/* {console.log("ResultsRow Data:", row)} */}
      <td className="border-2 border-black px-2 py-1">
        {typeof row.subject === 'object' ? row.subject.name : row.subject}
      </td>

      {isThirdTerm ? (
        <>
          <td className="border-2 border-black px-2 py-1 text-center">{row.firstTerm || 0}</td>
          <td className="border-2 border-black px-2 py-1 text-center">{row.secondTerm || 0}</td>
          <td className="border-2 border-black px-2 py-1 text-center">{row.thirdTerm || 0}</td>
        </>
      ) : (
        <>
          <td className="border-2 border-black px-2 py-1 text-center">{row.ca1 || 0}</td>
          <td className="border-2 border-black px-2 py-1 text-center">{row.ca2 || 0}</td>
          <td className="border-2 border-black px-2 py-1 text-center">{row.exam || 0}</td>
        </>
      )}

      <td className="border-2 border-black px-2 py-1 text-center">{isThirdTerm ? row.average : row.total}</td>
      {console.log("ResultsRow Data:", row.average, row.total)}
      <td className="border-2 border-black px-2 py-1 text-center">{row.grade}</td>
      <td className="border-2 border-black px-2 py-1 text-center">{row.position}</td>
      <td className="border-2 border-black px-2 py-1 text-center">{row.classAverage}</td>
      <td className="border-2 border-black px-2 py-1">{row.comment}</td>
    </tr>
  );
}
