import EventList from "./EventList";
import Image from "next/image";
import EventCalender from "./EventCalender";

const EventCalenderContainer = async ({searchParams}: 
    {searchParams: {[keys:string]: string | undefined}}) => {

    const {date} = searchParams;
  return (
    <div className='bg-[#e6f2ff] p-4 rounded-md'>
        <EventCalender />
        <div className='flex items-center justify-between'>
            <h1 className='text-xl font-semibold my-4'>Events</h1>
            <Image src='/moreDark.png' alt='' width={20} height={20} />
        </div>

        <div className="flex flex-col gap-4">
            <EventList dateParam={date} />
        </div>
    </div>
  );
};

export default EventCalenderContainer;
