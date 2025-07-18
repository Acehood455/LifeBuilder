import FormContainer from "@/components/FormContainer";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import Image from "next/image";
import Link from "next/link";
import { Class, Prisma, Subject, Teacher } from "../../../../../generated/prisma";
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { getUserRole } from "@/lib/utils";

type TeacherList = Teacher & {subjects: Subject[]} & {classes: Class[]}


const TeacherListPage = async ({searchParams}: {searchParams: {[key:string]: string | undefined} }) => {
    const {role} = await getUserRole();

    const {page, ...queryParams} = searchParams;
    const p = page ? parseInt(page) : 1;

    // Url Params Conditions
    const query : Prisma.TeacherWhereInput = {}
    
    if (queryParams) {
        for (const [key, value] of Object.entries(queryParams)) {
            if (value !== undefined){
                switch (key) {
                    case 'classId':
                        query.lessons =
                            {some:
                                {classId:
                                    parseInt(value)}};
                        break;
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
    
    const [data, count] = await prisma.$transaction([
        prisma.teacher.findMany({
            where: query,
            include: {
                subjects: true,
                classes: true,
            },
            take: ITEM_PER_PAGE,
            skip: ITEM_PER_PAGE * (p - 1),
        }),
        prisma.teacher.count({where: query})
    ])

    // console.log(count);


    const columns = [
        {
            header: 'Info', 
            accessor:'info',
        },
        // {
        //     header: 'Teacher Username', 
        //     accessor:'teacherId', 
        //     className: 'hidden md:table-cell',
        // },
        {
            header: 'Subjects', 
            accessor:'subjects', 
            // className: 'hidden md:table-cell',
        },
        {
            header: 'Classes', 
            accessor:'classes', 
            className: 'hidden md:table-cell',
        },
        {
            header: 'Email', 
            accessor:'email', 
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
    
    const renderRow = (item:TeacherList) =>(
        <tr key={item.id} className="border-b border-gray-200 even:bg-[#dce8f5] text-sm hover:bg-[#b3d7ff] ">
            <td className="flex items-center gap-2 p-2">
                <Image src={item.img || "/noAvatar.png"} 
                       alt='' width={40} 
                       height={40} 
                       className="md:hidden xl:block w-10 h-10 rounded-full object-cover " 
                />
                <div className="flex flex-col">
                    <h3 className='font-semibold'>{item.name + ' ' + item.surnName}</h3>
                    <h3 className='text-xs text-gray-500'>{item?.phone}</h3>
                </div>
            </td>
    
            {/* <td className="hidden md:table-cell">{item.username}</td> */}
            <td className="">{item.subjects.map(subject => subject.name).join(', ')}</td>
            <td className="hidden md:table-cell">{item.classes.map(className => className.name).join(', ')}</td>
            <td className="hidden md:table-cell">{item?.email}</td>
            <td className="hidden md:table-cell">{item.address}</td>
    
            <td className="">
                {role === 'admin' && ( 
                    <div className="flex items-center gap-2">
                        <Link href={`/list/teachers/${item.id}`}>
                            <button className="w-7 h-7 flex items-center justify-center rounded-full bg-blue-400 hover:bg-blue-600">
                                <Image src='/view.png' alt='' width={16} height={16} />
                            </button>
                        </Link>
        
                            <FormContainer table="teacher" type="delete" id={item.id} />
                    </div>
                )}
            </td>
        </tr>
    ); 
    
        
  return (
    <div className="mt-20 bg-[#e6f2ff] p-4 rounded-md flex-1 m-4">
      {/* Top */}
      <div className="flex items-center justify-between">
        <h1 className="block text-lg font-semibold">All Teachers</h1>

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
                        <FormContainer table="teacher" type="create" />
                    </button>
                )}
            </div>
        </div>
      </div>
        
      {/* List */}
      <Table columns={columns} render={renderRow} data={data} />

      {/* Pagination */}
      <Pagination page={p} count={count} />
    </div>
    );
};

export default TeacherListPage;
