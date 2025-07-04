"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useFormState } from "react-dom";
import { Dispatch, SetStateAction, useEffect } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import InputField from "../InputField";
import { announcementSchema, AnnouncementSchema } from "@/lib/formValidationSchemas";
import { createAnnouncement, updateAnnouncement } from "@/lib/actions";

type Props = {
  type: "create" | "update";
  data?: any;
  setOpen: Dispatch<SetStateAction<boolean>>;
  relatedData?: {
    classes: { id: number; name: string }[];
  };
};

const AnnouncementForm = ({ type, data, setOpen, relatedData }: Props) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AnnouncementSchema>({
    resolver: zodResolver(announcementSchema),
    defaultValues: {
      ...(data ?? {}),
      date: data?.date ? new Date(data.date).toISOString().slice(0, 16) : "",
    },
  });

  const [state, formAction] = useFormState(
    type === "create" ? createAnnouncement : updateAnnouncement,
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
      toast(`Announcement ${type === "create" ? "created" : "updated"} successfully!`);
      setOpen(false);
      router.refresh();
    }
  }, [state, type, setOpen, router]);

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-8">
      <h1 className="text-xl font-semibold">
        {type === "create" ? "Create a new announcement" : "Update announcement"}
      </h1>

      <div className="flex flex-wrap gap-4 justify-between">
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

        <InputField
          label="Title"
          name="title"
          defaultValue={data?.title}
          register={register}
          error={errors?.title}
        />

        <div className="flex flex-col gap-2 w-full">
          <label className="text-xs text-gray-500">Description</label>
          <textarea
            {...register("description")}
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            rows={4}
            defaultValue={data?.description}
          />
          {errors?.description && (
            <p className="text-xs text-red-500">{errors.description.message}</p>
          )}
        </div>

        <InputField
          label="Date"
          name="date"
          type="datetime-local"
          defaultValue={data?.date}
          register={register}
          error={errors?.date}
        />

        {/* {relatedData?.classes && (
          <div className="flex flex-col gap-2 w-full md:w-[30%]">
            <label className="text-xs text-gray-500">Class (optional)</label>
            <select 
              {...register("classId", { valueAsNumber: true })}
              className="form-select"
              defaultValue={data?.classId}
            >
              <option value="">Select Class</option>
              {relatedData.classes.map((cls) => (
                <option key={cls.id} value={cls.id}>
                  {cls.name}
                </option>
              ))}
            </select>
            {errors?.classId && (
              <p className="text-xs text-red-500">{errors.classId.message}</p>
            )}
          </div>
        )} */}
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

export default AnnouncementForm;