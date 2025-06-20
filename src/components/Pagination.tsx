'use client'

import { ITEM_PER_PAGE } from "@/lib/settings";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

const Pagination = ({ page, count }: { page: number; count: number }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const hasPrev = ITEM_PER_PAGE * (page - 1) > 0;
  const hasNext = ITEM_PER_PAGE * (page - 1) + ITEM_PER_PAGE < count;
  
  const totalPages = Math.ceil(count / ITEM_PER_PAGE);
  
  const changePage = (newPage: number) => {
    // Create a new URLSearchParams object based on current search params
    const params = new URLSearchParams(searchParams?.toString() || '');
    params.set('page', newPage.toString());
    router.push(`${pathname}?${params}`);
  };

  const getPageRange = () => {
    let start = Math.max(1, page - 2);
    let end = Math.min(totalPages, page + 2);
    
    if (page <= 3) {
      end = Math.min(5, totalPages);
    }
    else if (page >= totalPages - 2) {
      start = Math.max(totalPages - 4, 1);
    }
    
    return { start, end };
  };

  const { start, end } = getPageRange();

  return (
    <div className="p-4 gap-1 flex-wrap flex items-center justify-between text-gray-500">
      <button 
        disabled={!hasPrev} 
        className="py-2 px-4 rounded-md bg-slate-200 text-xs font-semibold disabled:opacity-50 disabled:cursor-not-allowed" 
        onClick={() => changePage(page - 1)}
      >
        Prev
      </button>

      <div className="flex items-center gap-2 text-sm">
        {start > 1 && (
          <>
            <button 
              className={`px-2 rounded-sm ${page === 1 ? 'bg-Sky' : ''}`} 
              onClick={() => changePage(1)}
            >
              1
            </button>
            {start > 2 && <span>...</span>}
          </>
        )}

        {Array.from({ length: end - start + 1 }, (_, index) => {
          const pageIndex = start + index;
          return (
            <button 
              key={pageIndex} 
              className={`px-2 rounded-sm ${page === pageIndex ? 'bg-Sky' : ''}`} 
              onClick={() => changePage(pageIndex)}
            >
              {pageIndex}
            </button>
          );
        })}

        {end < totalPages && (
          <>
            {end < totalPages - 1 && <span>...</span>}
            <button 
              className={`px-2 rounded-sm ${page === totalPages ? 'bg-Sky' : ''}`} 
              onClick={() => changePage(totalPages)}
            >
              {totalPages}
            </button>
          </>
        )}
      </div>
      
      <button 
        disabled={!hasNext} 
        className="py-2 px-4 rounded-md bg-slate-200 text-xs font-semibold disabled:opacity-50 disabled:cursor-not-allowed" 
        onClick={() => changePage(page + 1)}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;