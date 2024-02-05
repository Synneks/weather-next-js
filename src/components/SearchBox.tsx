import { cn } from '@/app/utils/cn';
import React from 'react';
import { IoSearch } from 'react-icons/io5';

type Props = {
  className?: string;
  value: string;
  onChange: React.ChangeEventHandler<HTMLInputElement> | undefined;
  onSubmit: React.FormEventHandler<HTMLFormElement> | undefined;
};

export default function SearchBox(props: Props) {
  return (
    <form
      className={cn(
        'relative flex h-10 items-center justify-center',
        props.className
      )}
      onSubmit={props.onSubmit}
    >
      <input
        className='h-full w-[230px] rounded-l-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
        type='text'
        placeholder='Search location...'
        onChange={props.onChange}
        value={props.value}
      />
      <button className='h-full rounded-r-md bg-blue-500 px-4 py-[9px] text-white hover:bg-blue-600  focus:outline-none'>
        <IoSearch />
      </button>
    </form>
  );
}
