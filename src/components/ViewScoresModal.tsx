"use client";

import { FC, useEffect, useState } from "react";
import Modal from "@/components/Modal";
import Image from "next/image";

type Teacher = {
  id: string;
  name: string;
  surnName: string;
};

type Result = {
  id: number;
  score: number;
  remarks?: string;
  student: {
    name: string;
    surnName: string;
  } | null;
  gradedBy: Teacher | null;
  gradedById?: string | null;
};

type Props = {
  assessmentId: number;
  teacherId: string;
};

const ViewScoresModal: FC<Props> = ({ assessmentId, teacherId }) => {
  const [open, setOpen] = useState(false);
  const [results, setResults] = useState<Result[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const [resResults, resTeachers] = await Promise.all([
          fetch(`/api/assessments/${assessmentId}/results`),
          fetch(`/api/teachers`),
        ]);

        const [dataResults, dataTeachers] = await Promise.all([
          resResults.json(),
          resTeachers.json(),
        ]);

        setResults(dataResults);
        setTeachers(dataTeachers);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [open, assessmentId]);

  const handleChange = <K extends keyof Result>(index: number, field: K, value: Result[K]) => {
    const updated = [...results];
    updated[index] = {
      ...updated[index],
      [field]: value,
    };
    setResults(updated);
  };


  const handleSaveAll = async () => {
    setSaving(true);
    try {
      const updatedResults = await Promise.all(
        results.map(async (result) => {
          const res = await fetch(`/api/results/${result.id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({
              score: result.score,
              remarks: result.remarks,
              gradedById: result.gradedById ?? teacherId,
            }),
          });

          if (!res.ok) throw new Error("Failed to update result with id " + result.id);
          return res.json();
        })
      );

      setResults(updatedResults);
    } catch (error) {
      console.error("Update error:", error);
      alert("Failed to save all results. Check console for details.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center justify-center rounded-full w-7 h-7 bg-blue-500 text-white hover:bg-blue-600"
      >
        <Image src="/update.png" alt="Update" width={16} height={16} />
      </button>

      <Modal isOpen={open} onClose={() => setOpen(false)} title="Assessment Scores">
        {loading ? (
          <p className="p-4 text-center">Loading...</p>
        ) : (
          <div className="flex flex-col max-h-[60vh]">
            <div className="overflow-auto flex-1 mt-4">
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
                    results.map((r, idx) => (
                      <tr key={r.id} className="even:bg-gray-50">
                        <td className="px-4 py-2 border">
                          {r.student ? `${r.student.name} ${r.student.surnName}` : "Unknown Student"}
                        </td>

                        <td className="px-4 py-2 border">
                          <input
                            type="number"
                            value={r.score ?? ""}
                            onChange={(e) => handleChange(idx, "score", Number(e.target.value))}
                            className="w-16 border rounded px-1"
                          />
                        </td>

                        <td className="px-4 py-2 border">
                          <textarea
                            value={r.remarks ?? ""}
                            onChange={(e) => handleChange(idx, "remarks", e.target.value)}
                            className="w-full border rounded px-1"
                          />
                        </td>

                        <td className="px-4 py-2 border">
                          <select
                            value={r.gradedById ?? ""}
                            onChange={(e) => handleChange(idx, "gradedById", e.target.value)}
                            className="border rounded px-2 py-1 w-full"
                          >
                            <option value="">Select</option>
                            {teachers.map((t) => (
                              <option key={t.id} value={t.id}>
                                {t.name} {t.surnName}
                              </option>
                            ))}
                          </select>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="mt-4 border-t pt-4">
              <button
                onClick={handleSaveAll}
                disabled={saving}
                className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save All"}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
};

export default ViewScoresModal;
