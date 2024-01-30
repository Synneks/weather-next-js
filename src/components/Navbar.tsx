import React from 'react';
import { MdWbSunny, MdMyLocation, MdOutlineLocationOn } from 'react-icons/md';
import SearchBox from './SearchBox';

type Props = {};

export default function Navbar({}: Props) {
  return (
    <div className='sticky left-0 top-0 z-50 bg-white shadow-sm'>
      <div className='mx-auto flex h-[80px] w-full max-w-7xl items-center justify-between px-3'>
        <div className='flex items-center justify-center gap-2'>
          <h2 className='text-3xl text-gray-500'>Weather</h2>
          <MdWbSunny className='text-3xl text-yellow-300' />
        </div>
        <section className='flex items-center gap-2'>
          <MdMyLocation className='cursor-pointer text-2xl text-gray-500 opacity-80 hover:opacity-100' />
          <MdOutlineLocationOn className='text-2xl' />
          <p className='text-sm text-slate-900/80'>Jakarta</p>
          <button>
            <SearchBox />
          </button>
        </section>
      </div>
    </div>
  );
}
