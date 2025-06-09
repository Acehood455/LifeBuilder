"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useFormState } from "react-dom";
import { Dispatch, SetStateAction, useEffect } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import InputField from "../InputField";

import { assessmentSchema, AssessmentSchema } from "@/lib/formValidationSchemas";
import { createAssessment, updateAssessment } from "@/lib/actions";

type Props = {
  type: "create" | "update";
  data?: any;
  setOpen: Dispatch<SetStateAction<boolean>>;
  relatedData?: {
    subjects: { id: number; name: string }[];
    classes: { id: number; name: string }[];
    terms: { id: number; name: string }[];
  };
};

const AssessmentForm = ({ type, data, setOpen, relatedData }: Props) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AssessmentSchema>({
    resolver: zodResolver(assessmentSchema),
    defaultValues: {
      ...(data ?? {}),
      startTime: data?.startTime
        ? new Date(data.startTime).toISOString().slice(0, 16)
        : undefined,
      endTime: data?.endTime
        ? new Date(data.endTime).toISOString().slice(0, 16)
        : undefined,
    },
  });

  const [state, formAction] = useFormState(
    type === "create" ? createAssessment : updateAssessment,
    {
      success: false,
      error: false,
    }
  );

  const onSubmit = handleSubmit((formData) => {
    formAction(formData);
  });

  const router = useRouter();

  useEffect(() => {
    if (state.success) {
      toast(`Assessment ${type === "create" ? "created" : "updated"} successfully!`);
      setOpen(false);
      router.refresh();
    }
  }, [state, type, setOpen, router]);

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-8">
      <h1 className="text-xl font-semibold">
        {type === "create" ? "Create a new assessment" : "Update assessment"}
      </h1>

      <div className="flex flex-wrap gap-4 justify-between">
        <InputField
          label="Title"
          name="title"
          defaultValue={data?.title}
          register={register}
          error={errors?.title}
        />

        {type === "update" && data?.id && (
          <InputField
            label="Id"
            name="id"
            hidden
            defaultValue={data.id}
            register={register}
            error={errors?.id}
          />
        )}

        <div className="flex flex-col gap-2 w-full md:w-[30%]">
          <label className="text-xs text-gray-500">Type</label>
          <select {...register("type")} className="form-select">
            <option value="FIRST_CA">First CA</option>
            <option value="SECOND_CA">Second CA</option>
            <option value="EXAM">Exam</option>
          </select>
          {errors?.type && (
            <p className="text-xs text-red-500">{errors.type.message}</p>
          )}
        </div>

        <InputField
          label="Weight (%)"
          name="weight"
          type="number"
          defaultValue={data?.weight}
          register={register}
          error={errors?.weight}
        />

        <InputField
          label="Max Score"
          name="maxScore"
          type="number"
          defaultValue={data?.maxScore}
          register={register}
          error={errors?.maxScore}
        />

        <InputField
          label="Start Time"
          name="startTime"
          type="datetime-local"
          defaultValue={data?.startTime}
          register={register}
          error={errors?.startTime}
        />

        <InputField
          label="End Time"
          name="endTime"
          type="datetime-local"
          defaultValue={data?.endTime}
          register={register}
          error={errors?.endTime}
        />

        <div className="flex flex-col gap-2 w-full md:w-[30%]">
          <label className="text-xs text-gray-500">Subject</label>
          <select {...register("subjectId")} className="form-select">
            <option value="">Select Subject</option>
            {relatedData?.subjects.map((subject) => (
              <option key={subject.id} value={subject.id}>
                {subject.name}
              </option>
            ))}
          </select>
          {errors?.subjectId && (
            <p className="text-xs text-red-500">{errors.subjectId.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-2 w-full md:w-[30%]">
          <label className="text-xs text-gray-500">Class</label>
          <select {...register("classId")} className="form-select">
            <option value="">Select Class</option>
            {relatedData?.classes.map((cls) => (
              <option key={cls.id} value={cls.id}>
                {cls.name}
              </option>
            ))}
          </select>
          {errors?.classId && (
            <p className="text-xs text-red-500">{errors.classId.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-2 w-full md:w-[30%]">
          <label className="text-xs text-gray-500">Term</label>
          <select {...register("termId")} className="form-select">
            <option value="">Select Term</option>
            {relatedData?.terms.map((term) => (
              <option key={term.id} value={term.id}>
                {term.name}
              </option>
            ))}
          </select>
          {errors?.termId && (
            <p className="text-xs text-red-500">{errors.termId.message}</p>
          )}
        </div>
      </div>

      {state.error && (
        <span className="text-red-500">Something went wrong!</span>
      )}

      <button type="submit" className="bg-blue-500 text-white py-2 rounded-md">
        {type === "create" ? "Create" : "Update"}
      </button>
    </form>
  );
};

export default AssessmentForm;
