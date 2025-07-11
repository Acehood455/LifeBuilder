import FormContainer from "@/components/FormContainer";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import Image from "next/image";
import { Prisma, Subject, Teacher } from "../../../../../generated/prisma";
import { getUserRole } from "@/lib/utils";

type SubjectList = Subject & {teachers: Teacher[]}


const SubjectsListPage = async ({searchParams}: {searchParams: {[key:string]: string | undefined} }) => {
    const { role} = await getUserRole();

    const {page, ...queryParams} = searchParams;
    const p = page ? parseInt(page) : 1;

    // Url Params Conditions
    const query : Prisma.SubjectWhereInput = {}
    
    if (queryParams) {
        for (const [key, value] of Object.entries(queryParams)) {
            if (value !== undefined){
                switch (key) {
                    case 'search':
                        query.name = 
                            {contains: value, mode: 'insensitive'};
                    break;
                default:
                    break;
                 
                }
            }
        }
    }
    
    const [subjectsData, count] = await prisma.$transaction([
        prisma.subject.findMany({
            where: query,
            include: {
                teachers: true,
            },
            take: ITEM_PER_PAGE,
            skip: ITEM_PER_PAGE * (p - 1),
        }),
        prisma.subject.count({where: query})
    ])

    // console.log(count);

    
const columns = [
    {
        header: 'Subject Name', 
        accessor:'name',
    },
    {
        header: 'Teachers', 
        accessor:'teachers', 
        className: 'hidden md:table-cell',
    },
    {
        header: 'Actions', 
        accessor:'action', 
    },
]

const renderRow = (item:SubjectList) =>(
    <tr key={item.id} className="border-b border-gray-200 even:bg-[#dce8f5] text-sm hover:bg-[#b3d7ff] ">
        <td className="flex items-center gap-2 p-2">
            {item.name}
        </td>

        <td className="hidden md:table-cell">
            {item.teachers.map(teacher => teacher.name).join(', ')}
        </td>

        <td className="">
            <div className="flex items-center gap-2">
            {role === 'admin' && ( 
                <>
                    <FormContainer table="subject" type="update" data={item} />
                    <FormContainer table="subject" type="delete" id={item.id} />
                </>
                )}
            </div>
        </td>
    </tr>
); 

    
  return (
    <div className="mt-20 bg-[#e6f2ff] p-4 rounded-md flex-1 m-4">
      {/* Top */}
      <div className="flex items-center justify-between">
        <h1 className="block text-lg font-semibold">Subjects</h1>

        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
            <TableSearch />

            <div className="flex items-center gap-4 self-end">
                {/* <button className="w-8 h-8 flex items-center justify-center rounded-full bg-Yellow">
                    <Image src='/filter.png' alt='' width={14} height={14} />
                </button>
                <button className="w-8 h-8 flex items-center justify-center rounded-full bg-Yellow">
                    <Image src='/sort.png' alt='' width={14} height={14} />
                </button> */}
                {role === 'admin' && ( 
                    <button className="w-8 h-8 flex items-center justify-center rounded-full bg-Yellow">
                        <FormContainer table="subject" type="create" />
                    </button>
                )}
            </div>
        </div>
      </div>
        
      {/* List */}
      <Table columns={columns} render={renderRow} data={subjectsData} />

      {/* Pagination */}
      <Pagination page={p} count={count} />
    </div>
    );
};

export default SubjectsListPage;
