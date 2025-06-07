// components/forms/AssessmentForm.tsx
"use client";

import { useFormState } from "react-dom";
import { createAssessment } from "@/lib/actions";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

type Props = {
  type: "create" | "update";
  setOpen: Dispatch<SetStateAction<boolean>>;
  data?: any;
  relatedData?: {
    subjects: { id: number; name: string }[];
    classes: { id: number; name: string }[];
    terms: { id: number; name: string }[];
  };
};

const AssessmentForm = ({ type, setOpen, relatedData }: Props) => {
  const [state, formAction] = useFormState(createAssessment, {
    success: false,
    error: false,
  });

  const router = useRouter();

  useEffect(() => {
    if (state.success) {
      toast("Assessment created successfully");
      setOpen(false);
      router.refresh();
    }
  }, [state, router]);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <label>
        Title:
        <input name="title" required className="form-input" />
      </label>

      <label>
        Type:
        <select name="type" required className="form-select">
          <option value="quiz">Quiz</option>
          <option value="test">Test</option>
          <option value="exam">Exam</option>
        </select>
      </label>

      <label>
        Weight (%):
        <input name="weight" type="number" required min={1} max={100} className="form-input" />
      </label>

      <label>
        Subject:
        <select name="subjectId" required className="form-select">
          {relatedData?.subjects.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
      </label>

      <label>
        Class:
        <select name="classId" required className="form-select">
          {relatedData?.classes.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </label>

      <label>
        Term:
        <select name="termId" required className="form-select">
          {relatedData?.terms.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </select>
      </label>

      <label>
        Start Time:
        <input name="startTime" type="datetime-local" required className="form-input" />
      </label>

      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md">
        Create
      </button>
    </form>
  );
};

export default AssessmentForm;
