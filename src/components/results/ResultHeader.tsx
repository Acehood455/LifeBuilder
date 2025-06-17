import Image from "next/image";

interface Props {
  school: {
    name: string;
    address: string;
    phone: string;
    email: string;
    logoUrl?: string;
  };
  student: {
    name: string;
    surnName: string;
    className: string;
    term: string;
    session: string;
  };
}

const ResultHeader = ({ school }: Props) => {
  return (
    <div className="text-center bg-[#d9d9d9] border-b-2 border-black pb-2 ">
      <div className="flex items-center justify-between ">
        <div className="w-24 h-24 relative ml-2">
          {school.logoUrl && (
            <Image
              src={school.logoUrl}
              alt="School Logo"
              fill
              className="object-contain"
            />
          )}
        </div>
        <div className="flex-1 text-center">
          <h1 className="text-xl font-bold uppercase">{school.name}</h1>
          <p className="text-sm">{school.address}</p>
          <p className="text-sm">
            Tel: {school.phone} | Email: {school.email}
          </p>
        </div>
        <div className="w-24" /> {/* Placeholder to balance logo */}
      </div>
    </div>
  );
};

export default ResultHeader;
