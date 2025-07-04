import FormContainer from "@/components/FormContainer";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import Image from "next/image";
import { getUserRole } from "@/lib/utils";
import { Prisma } from "../../../../../generated/prisma";

const EventListPage = async ({searchParams}: {searchParams: {[key:string]: string | undefined} }) => {
    const {userId, role} = await getUserRole();

    const {page, search} = searchParams;
    const p = page ? parseInt(page) : 1;

    // Base query conditions
    const query: Prisma.EventWhereInput = {};
    
    // Search condition
    if (search) {
        query.title = { contains: search, mode: 'insensitive' };
    }

    // Role-based conditions
    if (role !== 'admin') {
        query.OR = [
            { classId: null }, // Show events not assigned to any class
            // Show events assigned to classes the user has access to
            ...(role === 'teacher' ? [
                { class: { supervisorId: userId } }
            ] : []),
            ...(role === 'student' ? [
                { class: { students: { some: { id: userId } } } }
            ] : []),
            ...(role === 'parent' ? [
                { class: { students: { some: { parentId: userId } } } }
            ] : [])
        ];
    }

    const [data, count] = await prisma.$transaction([
        prisma.event.findMany({
            where: query,
            include: {
                class: {
                    select: {
                        id: true,
                        name: true
                    }
                },
            },
            orderBy: {
                startTime: 'desc' // Show most recent events first
            },
            take: ITEM_PER_PAGE,
            skip: ITEM_PER_PAGE * (p - 1),
        }),
        prisma.event.count({ where: query })
    ]);

    const columns = [
    {
        header: 'Title', 
        accessor: 'title',
        className: 'min-w-[150px]' // Set minimum width
    },
    {
        header: 'Class', 
        accessor: 'class',
        className: 'min-w-[100px]',
        render: (classInfo: { name: string } | null) => classInfo?.name || '-'
    },
    {
        header: 'Date',  
        accessor: 'startTime',
        className: '',
        render: (date: Date) => (
            <div className="flex flex-col">
                <span>{new Intl.DateTimeFormat('en-US').format(date)}</span>
                <span className="text-xs text-gray-500">
                    {date.toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: false
                    })}
                    {' - '}
                    {new Date(date.getTime() + 60*60*1000).toLocaleTimeString('en-US', { // Example: +1 hour
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: false
                    })}
                </span>
            </div>
        )
    },
    ...(role === 'admin' ? [{
        header: 'Actions', 
        accessor: 'action',
        className: 'min-w-[100px]'
    }] : []),
];
    
    const renderRow = (item: any) => (
    <tr key={item.id} className="border-b border-gray-200 even:bg-[#dce8f5] text-sm hover:bg-[#b3d7ff]">
        <td className="p-2">
            {item.title}
        </td>
        <td className="p-2">
            {item.class?.name || 'All Classes'}
        </td>
        <td className="">
            <div className="flex flex-col">
                <span>{new Intl.DateTimeFormat('en-US').format(item.startTime)}</span>
                <span className="text-xs text-gray-500">
                    {item.startTime.toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: false
                    })}
                    {' - '}
                    {item.endTime.toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: false
                    })}
                </span>
            </div>
        </td>
        {role === 'admin' && (
            <td className="p-2">
                <div className="flex items-center gap-2">
                    <FormContainer table="event" type="update" data={item} />
                    <FormContainer table="event" type="delete" id={item.id} />
                </div>
            </td>
        )}
    </tr>
);

    return (
        <div className="mt-20 bg-[#e6f2ff] p-4 rounded-md flex-1 m-4">
            <div className="flex items-center justify-between">
                <h1 className="md:block text-lg font-semibold">Events</h1>
                <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
                    <TableSearch />
                    <div className="flex items-center gap-4 self-end">
                        
                        {role === 'admin' && ( 
                            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-Yellow">
                                <FormContainer table="event" type="create" />
                            </button>
                        )}
                    </div>
                </div>
            </div>
            
            <Table columns={columns} render={renderRow} data={data} />
            <Pagination page={p} count={count} />
        </div>
    );
};

export default EventListPage;