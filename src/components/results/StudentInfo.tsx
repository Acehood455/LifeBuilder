import React from "react";

interface StudentInfoProps {
  student: {
    name: string;
    surnName: string;
    id: string;
    className: string;
    term: string;
    // state: string;
    // lga: string;
    gender: string;
    session: string;
    // feesPaid: number;
    // feesOwed: number;
    age: number;
    noInClass: number;
    classTeacher: string;
    newTermBegins: string;
    average: number;
    position: string;
    admissionNumber: string;
  };
}

const StudentInfo: React.FC<{ student: StudentInfoProps["student"] }> = ({ student }) => {
  return (
    <div className="border-black">
      <h2 className="text-center font-bold text-base py-1 border-black">
        TERMLY REPORT
      </h2>

      <table className="w-full border-collapse text-sm">
        <tbody>
          <tr className="font-semibold border-b border-black">
            <td className="bg-[#d9d9d9] font-semibold border-2 border-black p-1">Student&apos;s Name</td>
            <td className="font-semibold border-2 border-black p-1">{student.name} {student.surnName}</td>
            <td className="bg-[#d9d9d9] font-semibold border-2 border-black p-1">Admin No.</td>
            <td className="font-semibold border-2 border-black p-1">{student.admissionNumber}</td>
          </tr>
          <tr className="border-b border-black">
            <td className="bg-[#d9d9d9] font-semibold border-2 border-black p-1">Class</td>
            <td className="font-semibold border-2 border-black p-1">{student.className}</td>
            <td className="bg-[#d9d9d9] font-semibold border-2 border-black p-1">Term</td>
            <td className="font-semibold border-2 border-black p-1">{student.term}</td>
            {/* <td className="font-semibold border-2 border-black p-1">Third Term</td> */}
          </tr>
          <tr className="border-b border-black">
            {/* <td className="bg-[#d9d9d9] font-semibold border-2 border-black p-1">State</td>
            <td className="bg-[#d9d9d9] font-semibold border-2 border-black p-1">{student.state}</td>
            <td className="bg-[#d9d9d9] font-semibold border-2 border-black p-1">L.G.A</td>
            <td className="bg-[#d9d9d9] font-semibold border-2 border-black p-1">{student.lga}</td> */}
            <td className="bg-[#d9d9d9] font-semibold border-2 border-black p-1">Gender</td>
            {/* <td className="font-semibold border-2 border-black p-1">{student.gender}</td> */}
            <td className="font-semibold border-2 border-black p-1">{student.gender.charAt(0).toUpperCase() + student.gender.slice(1).toLowerCase()}</td>
            <td className="bg-[#d9d9d9] font-semibold border-2 border-black p-1">Session</td>
            <td className="font-semibold border-2 border-black p-1">{student.session}</td>
          </tr>
          <tr className="border-b border-black">
            {/* <td className="bg-[#d9d9d9] font-semibold border-2 border-black p-1">Fees Paid</td>
            <td className="bg-[#d9d9d9] font-semibold border-2 border-black p-1">₦{student.feesPaid}</td>
            <td className="bg-[#d9d9d9] font-semibold border-2 border-black p-1">Fees Owed</td>
            <td className="bg-[#d9d9d9] font-semibold border-2 border-black p-1">₦{student.feesOwed}</td> */}
            <td className="bg-[#d9d9d9] font-semibold border-2 border-black p-1">Age</td>
            <td className="font-semibold border-2 border-black p-1">{student.age}</td>
            <td className="bg-[#d9d9d9] font-semibold border-2 border-black p-1">No. in Class</td>
            <td className="font-semibold border-2 border-black p-1">{student.noInClass}</td>
          </tr>
          <tr>
            <td className="bg-[#d9d9d9] font-semibold border-2 border-black p-1">Form Teacher</td>
            <td className="font-semibold border-2 border-black p-1">{student.classTeacher}</td>
            <td className="bg-[#d9d9d9] font-semibold border-2 border-black p-1">New Term Begins</td>
            <td className="font-semibold border-2 border-black p-1">{student.newTermBegins}</td>
          </tr>
          <tr>
            <td className="bg-[#d9d9d9] font-semibold border-2 border-black p-1">Average</td>
            <td className="font-semibold border-2 border-black p-1">{student.average}%</td>
            <td className="bg-[#d9d9d9] font-semibold border-2 border-black p-1">Aggregate Position</td>
            <td className="font-semibold border-2 border-black p-1"></td>
            {/* <td className="font-semibold border-2 border-black p-1">{student.position}</td> */}
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default StudentInfo;
