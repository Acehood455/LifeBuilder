import Image from "next/image";
import CountChart from "./CountChart";
import prisma from "@/lib/prisma";

const countChartContainer = async () => {

    const data = await prisma.student.groupBy({
        by: ['sex'],
        _count: true
    })
    const boys = data.find((bd) => bd.sex === 'MALE')?._count || 0;
    const girls = data.find((bd) => bd.sex === 'FEMALE')?._count || 0;

  return (
    <div className="bg-[#e6f2ff] rounded-xl w-full h-full p-4">
        {/* Title */}
        <div className='flex justify-between items-center'>
            <h1 className='text-lg font-semibold'>Students</h1>
            <Image src='/moreDark.png' alt='' width={20} height={20} />
        </div>

        {/* Chart */}
        <CountChart boys={boys} girls={girls} />

        {/* Bottom */}
        <div className='flex justify-center gap-16'>
            <div className="flex flex-col gap-1">
                <div className="w-5 h-5 bg-blue-500 rounded-full" />
                <h1 className='font-bold'>{boys}</h1>
                <h2 className='text-xs text-gray-300'>Boys ({Math.round((boys / (boys+girls)) * 100)}%)</h2>
            </div>

            <div className="flex flex-col gap-1">
                <div className="w-5 h-5 bg-pink-500 rounded-full" />
                <h1 className='font-bold'>{girls}</h1>
                <h2 className='text-xs text-gray-300'>Girls ({Math.round((girls / (boys+girls)) * 100)}%)</h2>
            </div>
        </div>
    </div>
  );
};

export default countChartContainer;
