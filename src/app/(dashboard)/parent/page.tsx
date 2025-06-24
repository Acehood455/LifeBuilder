import Announcements from "@/components/Announcements";
import BigCalenderContainer from "@/components/BigCalenderContainer";
import prisma from "@/lib/prisma";
import { getUserRole } from "@/lib/utils";


const ParentPage = async () => {
  const {userId} = await getUserRole();
  const currentUserId = userId;
  
  const students = await prisma.student.findMany({
    where: {
      parentId: currentUserId!,
    },
  });

  return (
    <div className="p-4 flex gap-4 flex-col md:flex-row mt-20">
      {/* LEFT */}
      <div className="w-full lg:w-2/3 flex flex-col gap-8">
        {students.map((student) => (
          <div className="w-full" key={student.id}>
            <div className="h-full bg-white p-4 rounded-md">
              <h1 className="text-xl font-semibold">
                Schedule ({student.name + " " + student.surnName})
              </h1>
              <BigCalenderContainer type="classId" id={student.classId} />
            </div>
          </div>
        ))}
      </div>
      {/* RIGHT */}
      <div className="w-full xl:w-1/3 flex flex-col gap-8">
        <Announcements />
      </div>
    </div>
  );
};

export default ParentPage;
