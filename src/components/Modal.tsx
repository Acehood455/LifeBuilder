
// components/Modal.tsx
"use client";
import Image from "next/image";
import { FC, ReactNode } from "react";

const Modal: FC<{
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
}> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-md p-6 w-full max-w-3xl shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">{title}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800"><Image src="/close.png" alt="" width={14} height={14} /></button>
        </div>
        {children}
      </div>
    </div>
  );
};

export default Modal;
