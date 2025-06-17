// components/results/SignatureFooter.tsx
export default function SignatureFooter() {
  return (
    <div className="w-full">
      <div className="w-full overflow-hidden">
        <h6 className="mb-0 mt-5 ml-[15px] font-bold whitespace-nowrap overflow-hidden">
          Form Teacher's Comment _____________________________________________________________________________________________________________________________________.
        </h6>
        <h6 className="mb-0 mt-0 ml-[15px] font-bold whitespace-nowrap overflow-hidden">
          Principal's Comment ________________________________________________________________________________________________________________________________________.
        </h6>
      </div>
      <div className="flex justify-between mt-8 pt-4 ">
        <div className="text-center w-1/2 px-4">
          <div className="border-b-2 border-black w-40 mx-auto"></div>
          <span>Form Teacher</span>
        </div>
        <div className="text-center w-1/2 px-4">
          <div className="border-b-2 border-black w-40 mx-auto"></div>
          <span>Principal</span>
        </div>
      </div>
    </div>
  );
}