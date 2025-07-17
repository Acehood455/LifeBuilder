// components/results/ResultPageClient.tsx
"use client";

import { useRef, useState } from 'react';
import ResultHeader from './ResultHeader';
import StudentInfo from './StudentInfo';
import ResultsTable from './ResultsTable';
import ResultLegend from './ResultLegend';
import SignatureFooter from './SignatureFooter';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export default function ResultPageClient({ resultData }: { resultData: any }) {
  const printRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);

  // const handlePrint = () => {
  //   setIsLoading(true);
  //   setTimeout(() => {
  //     window.print();
  //     setIsLoading(false);
  //   }, 100);
  // };

  // const handleDownloadPDF = async () => {
  //   setIsLoading(true);
  //   try {
  //     const element = printRef.current;
  //     if (!element) return;

  //     const canvas = await html2canvas(element);
  //     const pdf = new jsPDF('p', 'mm', 'a4');
  //     const imgData = canvas.toDataURL('image/png');
  //     const pdfWidth = pdf.internal.pageSize.getWidth();
  //     const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
  //     pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
  //     pdf.save('student-result.pdf');
  //   } catch (error) {
  //     console.error("PDF generation failed:", error);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-75 z-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow rounded mt-20">
      <div className="flex justify-end gap-4 mb-4 print:hidden">
        <button
          onClick={() => window.print()}
          // disabled={isLoading}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          Print / Download
        </button>
        {/* <button
          onClick={handleDownloadPDF}
          disabled={isLoading}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
        >
          Download
        </button> */}
      </div>
      
      <div id="print-area" ref={printRef} className="print:block">
        <ResultHeader 
          school={{
            name: "LIFEBUILDER CHRISTIAN HIGH SCHOOL",
            address: "No.1 Pole street Diye Mbe adjacent PHCN, off Rayfield/Zaramaganda road Jos,Plateau state",
            phone: "07060495341",
            email: "info@lifebuilder.edu.ng",
            logoUrl: "/favicon.png",
          }}
        />
        <StudentInfo
          student={{
            name: resultData.student.name,
            surnName: resultData.student.surnName,
            id: resultData.student.id,
            className: resultData.student.class?.name || "",
            term: resultData.term,
            gender: resultData.student.sex,
            session: resultData.session,
            age: calculateAge(new Date(resultData.student.birthday)),
            noInClass: resultData.classStudentCount,
            classTeacher: resultData.student.class?.supervisor
              ? `${resultData.student.class.supervisor.name} ${resultData.student.class.supervisor.surnName}`
              : "—",
            newTermBegins: resultData.newTermBegins,
            average: resultData.average,
            position: resultData.position,
            admissionNumber: resultData.student.admissionNumber
          }}
        />
        <ResultsTable scores={resultData.scores} isThirdTerm={resultData.term?.toLowerCase().includes("third")} />
        <div className="ml-2">
          <h2 className="text-xs font-semibold uppercase">Total number of subjects offered: {resultData.subjectCount}</h2>
          <h2 className="text-xs font-semibold uppercase">Total Score: {resultData.scores.reduce((sum: number, row: { total?: number }) => sum + (row.total || 0), 0)}</h2>
        </div>
        <ResultLegend />
        <SignatureFooter />
      </div>
    </div>
  );
}

function calculateAge(birthday: Date) {
  const birthDate = new Date(birthday);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}