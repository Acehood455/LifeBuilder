export default function ResultLegend() {
  return (
    <div className="text-xs mb-4">
      {/* Grading Legend */}
      <p className="mb-4 mt-4 w-full text-center font-bold">
        <strong>Grading:</strong> A = 70% and above, B = 60%–69%, C = 50%–59%, D = 45%–49%, F = below 45%
      </p>

      {/* Psychomotor & Affective Domain Table */}
      <h2 className="text-sm font-bold uppercase mb-1">Psychomotor & Affective Domain</h2>
      <table className="w-full border-2 border-black border-collapse mb-5">
    <tr>
        <th className="w-[35%] border-2 border-black bg-gray-300 text-center">PSYCHOMOTOR</th>
        <th className="w-[15%] border-2 border-black bg-gray-300 text-center">MARKS(1-3)</th>
        <th className="w-[35%] border-2 border-black bg-gray-300 text-center">AFFECTIVE</th>
        <th className="w-[15%] border-2 border-black bg-gray-300 text-center">MARKS(1-3)</th>
    </tr>
    <tr>
        <td className="border-2 border-black text-center font-bold">Quality Of Hand Writing</td>
        <td className="border-2 border-black text-center leading-[0.2875em] font-bold">2</td>
        <td className="border-2 border-black text-center leading-[0.2875em] font-bold">Punctuality</td>
        <td className="border-2 border-black text-center leading-[0.2875em] font-bold">2</td>
    </tr>
    <tr>
        <td className="border-2 border-black text-center font-bold">Grammatical Skills</td>
        <td className="border-2 border-black text-center leading-[0.2875em] font-bold">2</td>
        <td className="border-2 border-black text-center leading-[0.2875em] font-bold">Behaviour In Class</td>
        <td className="border-2 border-black text-center leading-[0.2875em] font-bold">2</td>
    </tr>
    <tr>
        <td className="border-2 border-black text-center font-bold">Oral Expression</td>
        <td className="border-2 border-black text-center leading-[0.2875em] font-bold">2</td>
        <td className="border-2 border-black text-center leading-[0.2875em] font-bold">Attentiveness In Class</td>
        <td className="border-2 border-black text-center leading-[0.2875em] font-bold">2</td>
    </tr>
    <tr>
        <td className="border-2 border-black text-center font-bold">Imagination/Creativity</td>
        <td className="border-2 border-black text-center leading-[0.2875em] font-bold">2</td>
        <td className="border-2 border-black text-center leading-[0.2875em] font-bold">Class Assignment/Projects</td>
        <td className="border-2 border-black text-center leading-[0.2875em] font-bold">2</td>
    </tr>
    <tr>
        <td className="border-2 border-black text-center font-bold">Vocabulary/Lexical Skills</td>
        <td className="border-2 border-black text-center leading-[0.2875em] font-bold">2</td>
        <td className="border-2 border-black text-center leading-[0.2875em] font-bold">Neatness</td>
        <td className="border-2 border-black text-center leading-[0.2875em] font-bold">2</td>
    </tr>
    <tr>
        <td className="border-2 border-black text-center font-bold">Organisation Of Ideas</td>
        <td className="border-2 border-black text-center leading-[0.2875em] font-bold">2</td>
        <td className="border-2 border-black text-center leading-[0.2875em] font-bold">Self Control</td>
        <td className="border-2 border-black text-center leading-[0.2875em] font-bold">2</td>
    </tr>
    <tr>
        <td className="border-2 border-black text-center font-bold">Team Work/Team Leading</td>
        <td className="border-2 border-black text-center leading-[0.2875em] font-bold">2</td>
        <td className="border-2 border-black text-center leading-[0.2875em] font-bold">Relationship With Others</td>
        <td className="border-2 border-black text-center leading-[0.2875em] font-bold">2</td>
    </tr>
    <tr>
        <td className="border-2 border-black text-center font-bold">Physical Dexterity</td>
        <td className="border-2 border-black text-center leading-[0.2875em] font-bold">2</td>
        <td className="border-2 border-black text-center leading-[0.2875em] font-bold">Relationship With Teaches & Staff</td>
        <td className="border-2 border-black text-center leading-[0.2875em] font-bold">2</td>
    </tr>
    <tr>
        <td className="border-2 border-black text-center font-bold">Club And Society</td>
        <td className="border-2 border-black text-center leading-[0.2875em] font-bold">2</td>
        <td className="border-2 border-black text-center leading-[0.2875em] font-bold">Sense Of Responsibility</td>
        <td className="border-2 border-black text-center leading-[0.2875em] font-bold">2</td>
    </tr>
    <tr>
        <td className="border-2 border-black text-center font-bold">Artistic Or Musical Skills</td>
        <td className="border-2 border-black text-center leading-[0.2875em] font-bold">2</td>
        <td className="border-2 border-black text-center leading-[0.2875em] font-bold">Attendance In Class</td>
        <td className="border-2 border-black text-center leading-[0.2875em] font-bold">2</td>
    </tr>
    <tr>
        <td className="border-2 border-black text-center font-bold">Lab And Workshop Skills</td>
        <td className="border-2 border-black text-center leading-[0.2875em] font-bold">2</td>
        <td className="border-2 border-black text-center leading-[0.2875em] font-bold">Politeness</td>
        <td className="border-2 border-black text-center leading-[0.2875em] font-bold">2</td>
    </tr>
    <tr>
        <td className="border-2 border-black text-center font-bold">Sports</td>
        <td className="border-2 border-black text-center leading-[0.2875em] font-bold">2</td>
        <td className="border-2 border-black text-center leading-[0.2875em] font-bold">Honesty/Reliability</td>
        <td className="border-2 border-black text-center leading-[0.2875em] font-bold">2</td>
    </tr>
</table>
    </div>
  );
}
