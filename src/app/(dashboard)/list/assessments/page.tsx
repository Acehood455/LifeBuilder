// AssessmentListPage.tsx
import { getUserRole } from "@/lib/utils";
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { Prisma } from "../../../../../generated/prisma";
import SelectDropdown from "@/components/SelectDropdown";
import FormContainer from "@/components/FormContainer";
import ViewScoresModal from "@/components/ViewScoresModal";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";

const AssessmentListPage = async ({ searchParams }: { searchParams: { [key: string]: string | undefined } }) => {
  const { userId, role } = await getUserRole();
  const { page, subjectId, termId, classId } = searchParams;
  const p = page ? parseInt(page) : 1;

  const query: Prisma.AssessmentWhereInput = {};
  if (subjectId) query.subjectId = parseInt(subjectId);
  if (termId) query.termId = parseInt(termId);
  if (classId) query.classId = parseInt(classId);

  if (role === "teacher") {
    query.subject = { teachers: { some: { id: userId } } };
  } else if (role === "parent") {
    query.class = { students: { some: { parentId: userId } } };
  } else if (role === "student") {
    query.class = { students: { some: { id: userId } } };
  }

  const [assessments, count, subjects, terms, classes] = await prisma.$transaction([
    prisma.assessment.findMany({
      where: query,
      include: {
        subject: true,
        class: true,
        term: true,
      },
      orderBy: { startTime: "asc" },
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1),
    }),
    prisma.assessment.count({ where: query }),
    prisma.subject.findMany(),
    prisma.term.findMany(),
    prisma.class.findMany(),
  ]);

  const columns = [
    { header: "Title", accessor: "title", className: 'hidden md:table-cell', },
    { header: "Class", accessor: "class" },
    { header: "Subject", accessor: "subject" },
    { header: "Type", accessor: "type" },
    { header: "Percent", accessor: "weight", className: 'hidden md:table-cell', },
    { header: "Actions", accessor: "actions" },
  ];

  return (
    <div className="mt-20 bg-white p-4 rounded-md flex-1 m-4">
      <div className="flex flex-wrap items-center gap-4 mb-4">
        <SelectDropdown label="Subject" param="subjectId" options={subjects} />
        <SelectDropdown label="Term" param="termId" options={terms} />
        <SelectDropdown label="Class" param="classId" options={classes} />
      </div>

      <div className="flex justify-between items-center mb-2">
        <h1 className="text-lg font-semibold">Assessments</h1>
        {(role === "admin" || role === "teacher") && (
          <FormContainer table="assessment" type="create"/>
        )}
      </div>

      <Table
        columns={columns}
        data={assessments}
        render={(item) => (
          <tr key={item.id} className="border-b text-sm even:bg-slate-50 hover:bg-slate-100">
            <td className="hidden md:table-cell">{item.title}</td>
            <td>{item.class.name}</td>
            <td>{item.subject.name}</td>
            <td>{item.type}</td>
            <td className="hidden md:table-cell">{item.weight}%</td>
            <td>
              <div className="flex gap-2">
                
                {(role === "admin" || role === "teacher") && (
                  <>
                    <ViewScoresModal assessmentId={item.id} teacherId={userId? userId : ""} />
                    <FormContainer table="assessment" type="delete" id={item.id} />
                  </>
                )}
              </div>
            </td>
          </tr>
        )}
      />

      <Pagination page={p} count={count} />
    </div>
  );
};

export default AssessmentListPage;
