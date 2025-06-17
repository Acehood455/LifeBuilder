// app/(dashboard)/results/page.tsx

import { getUserRole } from "@/lib/utils";
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import SelectDropdown from "@/components/SelectDropdown";
import Table from "@/components/Table";
import Pagination from "@/components/Pagination";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

const ResultsPage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {
  const { userId, role } = await getUserRole();
  const { termId, classId, page } = searchParams;
  const p = page ? parseInt(page) : 1;

  // Redirect students directly to their result page
  if (role === "student") {
    const student = await prisma.student.findUnique({
      where: { id: userId },
    });
    if (student) {
      return redirect(`/list/results/${student.id}`);
    }
  }

  const classFilter = classId ? { classId: parseInt(classId) } : {};

  let students: any[] = [];
  let count = 0;

  if (role === "admin") {
    [students, count] = await prisma.$transaction([
      prisma.student.findMany({
        where: classFilter,
        include: { class: true },
        take: ITEM_PER_PAGE,
        skip: ITEM_PER_PAGE * (p - 1),
      }),
      prisma.student.count({ where: classFilter }),
    ]);
  } else if (role === "teacher") {
    const subjects = await prisma.subject.findMany({
      where: {
        teachers: { some: { id: userId } },
      },
      select: {
        assessments: {
          select: { classId: true },
        },
      },
    });

    const classIds = [
      ...new Set(subjects.flatMap((s) => s.assessments.map((a) => a.classId))),
    ];

    const teacherFilter = {
      classId: { in: classIds },
      ...classFilter,
    };

    [students, count] = await prisma.$transaction([
      prisma.student.findMany({
        where: teacherFilter,
        include: { class: true },
        take: ITEM_PER_PAGE,
        skip: ITEM_PER_PAGE * (p - 1),
      }),
      prisma.student.count({ where: teacherFilter }),
    ]);
  } else if (role === "parent") {
    [students, count] = await prisma.$transaction([
      prisma.student.findMany({
        where: { parentId: userId },
        include: { class: true },
        take: ITEM_PER_PAGE,
        skip: ITEM_PER_PAGE * (p - 1),
      }),
      prisma.student.count({ where: { parentId: userId } }),
    ]);
  }

  const [terms, classes] = await Promise.all([
    prisma.term.findMany(),
    prisma.class.findMany(),
  ]);

  return (
    <div className="mt-20 bg-white p-4 rounded-md flex-1 m-4">
      {(role === "admin" || role === "teacher") && (
        <div className="flex flex-wrap items-center gap-4 mb-4">
          <SelectDropdown label="Term" param="termId" options={terms} />
          <SelectDropdown label="Class" param="classId" options={classes} />
        </div>
      )}

      <h1 className="text-lg font-semibold mb-4">Student Results</h1>

      <Table
        columns={[
          { header: "Name", accessor: "name" },
          { header: "Class", accessor: "class" },
          { header: "Actions", accessor: "actions" },
        ]}
        data={students}
        render={(student) => (
          <tr
            key={student.id}
            className="border-b text-sm even:bg-slate-50 hover:bg-slate-100"
          >
            <td>{student.name} {student.surnName}</td>
            <td>{student.class?.name}</td>
            <td>
              <Link
                href={`/list/results/${student.id}${termId ? `?termId=${termId}` : ""}`}
                className="flex items-center justify-center rounded-full w-7 h-7 bg-Sky text-white hover:Sky"
                title="View Result"
              >
                <Image src="/view.png" alt="View" width={16} height={16} />
            </Link>
            </td>
          </tr>
        )}
      />

      <Pagination page={p} count={count} />
    </div>
  );
};

export default ResultsPage;
