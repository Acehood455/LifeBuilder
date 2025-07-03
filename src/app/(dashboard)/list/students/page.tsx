import FormContainer from "@/components/FormContainer";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import { ITEM_PER_PAGE } from "@/lib/settings";
import Image from "next/image";
import Link from "next/link";
import { Class, Grade, Prisma, Student } from "../../../../../generated/prisma";
import prisma from "@/lib/prisma";
import { getUserRole } from "@/lib/utils";
import SelectDropdown from "@/components/SelectDropdown";

type StudentList = Student & {class: Class, grade: Grade}


const StudentListPage = async ({searchParams}: {searchParams: {[key:string]: string | undefined} }) => {
    const { role } = await getUserRole();
    const classes = await prisma.class.findMany();

    const {page, ...queryParams} = searchParams;
    const p = page ? parseInt(page) : 1;

    // Url Params Conditions
    const query : Prisma.StudentWhereInput = {}
    
    if (queryParams) {
        for (const [key, value] of Object.entries(queryParams)) {
            if (value !== undefined){
                switch (key) {
                    case 'teacherId':
                        query.class = {
                            lessons: {
                                some: {
                                    teacherId: value
                                },
                            },
                        };
                        break;
                    case 'search':
                        query.OR = [
                            { name: { contains: value, mode: 'insensitive' } },
                            { surnName: { contains: value, mode: 'insensitive' } },
                          ];
                        break;
                    case 'classId':
                        query.classId = parseInt(value);
                        break;
                    default:
                        break;
                 
                }
            }
        }
    }
    
    const [studentsData, count] = await prisma.$transaction([
        prisma.student.findMany({
            where: query,
            include: {
                class: true,
                grade: true,
            },
            take: ITEM_PER_PAGE,
            skip: ITEM_PER_PAGE * (p - 1),
        }),
        prisma.student.count({where: query})
    ])

    // console.log(count);

    const columns = [
        {
            header: 'Info', 
            accessor:'info',
        },
        {
            header: 'Admission Number', 
            accessor:'admissionNumber', 
            className: 'hidden md:table-cell',
        },
        {
            header: 'Grade', 
            accessor:'grade', 
            className: 'hidden md:table-cell',
        },
        {
            header: 'Phone', 
            accessor:'phone', 
            className: 'hidden md:table-cell',
        },
        {
            header: 'Address', 
            accessor:'address', 
            className: 'hidden md:table-cell',
        },
        ...(role === 'admin' ? [{
            header: 'Actions', 
            accessor:'action', 
        }] : []),
    ]
    
    const renderRow = (item:StudentList) =>(
        <tr key={item.id} className="border-b border-gray-200 even:bg-[#dce8f5] text-sm hover:bg-[#b3d7ff] ">
            <td className="flex items-center gap-2 p-2">
                <Image src={item.img || '/noAvatar.png'} 
                       alt='' width={40} 
                       height={40} 
                       className="md:hidden xl:block w-10 h-10 rounded-full object-cover " 
                />
                <div className="flex flex-col">
                    <h3 className='font-semibold'>{item.name + ' ' + item.surnName}</h3>
                    <h3 className='text-xs text-gray-500'>{item.class.name}</h3>
                </div>
            </td>
    
            <td className="hidden md:table-cell">{item.admissionNumber}</td>
            <td className="hidden md:table-cell">{item.grade.level}</td>
            <td className="hidden md:table-cell">{item.phone}</td>
            <td className="hidden md:table-cell">{item.address}</td>
    
            <td className="">
                <div className="flex items-center gap-2">
                    {(role === 'admin' || role === 'teacher') && ( 
                        <Link href={`/list/students/${item.id}`}>
                            <button className="w-7 h-7 flex items-center justify-center rounded-full bg-blue-400 hover:bg-blue-600">
                                <Image src='/view.png' alt='' width={16} height={16} />
                            </button>
                        </Link>
                    )}
    
                    {role === 'admin' && ( 
                        <FormContainer table="student" type="delete" id={item.id} />
                    )}
                </div>
            </td>
        </tr>
    ); 
    

  return (
    <div className="mt-20 bg-[#e6f2ff] p-4 rounded-md flex-1 m-4">
      {/* Top */}
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold mb-4 md:mb-0">All Students</h1>

        <div className="flex sm:items-center sm:justify-between">
            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                <SelectDropdown 
                label="Class" 
                param="classId" 
                options={classes} 
                />
                
                <TableSearch/>
            </div>

            <div className="flex items-center gap-4 self-end">
                {/* <button className="w-8 h-8 flex items-center justify-center rounded-full bg-Yellow">
                    <Image src='/filter.png' alt='' width={14} height={14} />
                </button>

                <button className="w-8 h-8 flex items-center justify-center rounded-full bg-Yellow">
                    <Image src='/sort.png' alt='' width={14} height={14} />
                </button> */}
                
                {role === 'admin' && ( 
                    <button className="w-8 h-8 flex items-center justify-center rounded-full bg-Yellow">
                        <FormContainer table="student" type="create" />
                    </button>
                )}
            </div>
        </div>
      </div>
        
      {/* List */}
      <Table columns={columns} render={renderRow} data={studentsData} />

      {/* Pagination */}
      <Pagination page={p} count={count} />
    </div>
    );
};

export default StudentListPage;
