// components/ViewScoresModal.tsx
"use client";

import { FC, useEffect, useState } from "react";
import Modal from "@/components/Modal";
import Image from "next/image";

type Props = {
  assessmentId: number;
};

const ViewScoresModal: FC<Props> = ({ assessmentId }) => {
  const [open, setOpen] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;

    const fetchScores = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/assessments/${assessmentId}/results`);
        const data = await res.json();
        setResults(data);
      } catch (error) {
        console.error("Failed to fetch scores:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchScores();
  }, [open, assessmentId]);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center justify-center rounded-full w-7 h-7 bg-blue-500 text-white hover:bg-blue-600"
      >
        <Image src='/update.png' alt='' width={16} height={16} />
      </button>

      <Modal isOpen={open} onClose={() => setOpen(false)} title="Assessment Scores">
        {loading ? (
          <p className="p-4 text-center">Loading...</p>
        ) : (
          <div className="overflow-x-auto mt-4">
            <table className="min-w-full text-sm border">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 border">Student Name</th>
                  <th className="px-4 py-2 border">Score</th>
                  <th className="px-4 py-2 border">Remarks</th>
                  <th className="px-4 py-2 border">Graded By</th>
                </tr>
              </thead>
              <tbody>
                {results.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center py-4">
                      No scores available.
                    </td>
                  </tr>
                ) : (
                  results.map((r) => (
                    <tr key={r.id} className="even:bg-gray-50">
                      <td className="px-4 py-2 border">{r.student.name} {r.student.surnName}</td>
                      <td className="px-4 py-2 border">{r.score}</td>
                      <td className="px-4 py-2 border">{r.remarks ?? "-"}</td>
                      <td className="px-4 py-2 border">
                        {r.gradedBy ? `${r.gradedBy.name} ${r.gradedBy.surnName}` : "-"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </Modal>
    </>
  );
};

export default ViewScoresModal;
