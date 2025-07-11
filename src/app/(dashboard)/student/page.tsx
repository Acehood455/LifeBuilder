import Announcements from "@/components/Announcements";
import BigCalenderContainer from "@/components/BigCalenderContainer";
import EventCalender from "@/components/EventCalender";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

const StudentPage = async () => {
  const {userId} = await auth()
  const classItem = await prisma.class.findMany({
    where: {
      students: {
        some: {
          id: userId!
        }
      }
    }
  })

  return (
  <div className="p-4 flex gap-4 flex-col xl:flex-row mt-20">
    {/* Left */}
    <div className="w-full xl-2/3">
      <div className="h-full bg-[#e6f2ff] p-4 rounded-md">
        <h1 className="text-xl font-semibold">Schedule (4A)</h1>
        
        <BigCalenderContainer type="classId" id={classItem[0].id} />
      </div>
    </div>

    {/* Right */}
    <div className="w-full xl:w-1/3 flex flex-col gap-8">
      <EventCalender />
      <Announcements />
    </div>
  </div>
  );
};

export default StudentPage;
