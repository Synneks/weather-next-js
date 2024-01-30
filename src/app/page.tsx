'use client';

import Navbar from '@/components/Navbar';
import axios from 'axios';
import { format, parseISO } from 'date-fns';
import { useQuery } from 'react-query';

//https://api.openweathermap.org/data/2.5/forecast?q=${place}&appid=${process.env.NEXT_PUBLIC_WEATHER_KEY}&cnt=56
export default function Home() {
  const { isLoading, error, data } = useQuery('repoData', async () => {
    const { data } = await axios.get(
      `https://api.openweathermap.org/data/2.5/forecast?q=pune&appid=${process.env.NEXT_PUBLIC_WEATHER_KEY}&cnt=56`
    );
    return data;
  });

  const firstData = data?.list[0];

  console.log(data?.city.country);

  if (isLoading)
    return (
      <div className='flex min-h-screen items-center justify-center'>
        <p className='animate-bounce text-gray-500'>Loading...</p>
      </div>
    );

  return (
    <div className='flex min-h-screen flex-col gap-4 bg-gray-100'>
      <Navbar />
      <main className='mx-auto flex w-full max-w-7xl flex-col gap-9 px-3 pb-10 pt-4'>
        {/* today */}
        <section>
          <div>
            <h2 className='flex items-end gap-1 text-2xl'>
              <p> {format(parseISO(firstData?.dt_txt ?? ''), 'EEEE')}</p>
              <p className='text-xl'>
                ({format(parseISO(firstData?.dt_txt ?? ''), 'dd.MM.yyyy')})
              </p>
            </h2>
            <div></div>
          </div>
        </section>
        {/* next 7 day */}
        <section></section>
      </main>
    </div>
  );
}
