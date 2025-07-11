// Navbar.tsx
'use client';
import { useUser } from "@clerk/nextjs";
import { UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import clsx from "clsx";

interface NavbarProps {
  className?: string;
}

const Navbar = ({ className = "" }: NavbarProps) => {
  const { user, isLoaded } = useUser();

  if (!isLoaded || !user) return null;

  const role = user?.publicMetadata?.role as string | undefined;
  const fullName = user?.fullName || role?.toUpperCase() || "Admin";

  return (
    <div
      className={clsx(
        "flex items-center justify-between md:p-4 bg-[#e6f2ff]",
        // Only apply fixed width styles on desktop
        "md:fixed md:z-50 md:w-[86%] md:bg-[#e6f2ff]",
        className
      )}
    >
      <Link href="/" className="flex items-center gap-2">
        <Image
          src="/favicon.png"
          alt="logo"
          width={70}
          height={70}
          className="min-w-[50px] block md:hidden mr-[50px]"
        />
      </Link>

      <div className="hidden md:flex items-center gap-2 text-xs rounded-full ring-[1.5px] ring-gray-300 px-2">
        <Image src="/search.png" alt="search" width={14} height={14} />
        <input
          type="text"
          placeholder="Search..."
          className="w-[200px] p-2 bg-transparent outline-none"
        />
      </div>

      <div className="flex items-center gap-6 justify-end w-full">
        <div className="bg-[#e6f2ff] rounded-full w-7 h-7 flex items-center justify-center cursor-pointer">
          <Image src="/message.png" alt="" width={20} height={20} />
        </div>

        <div className="bg-[#e6f2ff] rounded-full w-7 h-7 flex items-center justify-center cursor-pointer relative">
          <Image src="/announcement.png" alt="" width={20} height={20} />
          <div className="absolute -top-3 -right-3 w-5 h-5 flex items-center justify-center bg-purple-500 text-white rounded-full text-sm">
            1
          </div>
        </div>

        <div className="flex flex-col">
          <span className="text-xs leading-3 font-medium">{fullName}</span>
          <span className="text-[10px] text-gray-500 text-right">
            {user?.publicMetadata?.role as string}
          </span>
        </div>

        <UserButton />
      </div>
    </div>
  );
};

export default Navbar;
