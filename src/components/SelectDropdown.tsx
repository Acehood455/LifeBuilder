'use client'

import { useSearchParams, useRouter } from 'next/navigation';

interface Option {
  id: number;
  name: string;
}

interface Props {
  label: string;
  param: string;
  options: Option[];
}

export default function SelectDropdown({ label, param, options }: Props) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams(searchParams);
    if (e.target.value) {
      params.set(param, e.target.value);
    } else {
      params.delete(param);
    }
    router.push(`?${params.toString()}`);
  };

  return (
    <label className="text-sm">
      {label}:{' '}
      <select onChange={handleChange} defaultValue={searchParams.get(param) || ''} className="border p-1 rounded-md">
        <option value="">All</option>
        {options.map((opt) => (
          <option key={opt.id} value={opt.id}>
            {opt.name}
          </option>
        ))}
      </select>
    </label>
  );
}
