'use client';

import Container from '@/components/Container';
import Navbar from '@/components/Navbar';
import axios from 'axios';
import { format, parseISO } from 'date-fns';
import { useQuery } from 'react-query';
import { convertKelvinToCelsius } from './utils/convertKelvinToCelsius';

//https://api.openweathermap.org/data/2.5/forecast?q=${place}&appid=${process.env.NEXT_PUBLIC_WEATHER_KEY}&cnt=56
export default function Home() {
  const { isLoading, error, data } = useQuery('repoData', async () => {
    const { data } = await axios.get(
      `https://api.openweathermap.org/data/2.5/forecast?q=Cluj&appid=${process.env.NEXT_PUBLIC_WEATHER_KEY}&cnt=56`
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
        <section className='space-y-4'>
          <div className='space-y-2'>
            <h2 className='flex items-end gap-1 text-2xl'>
              <p> {format(parseISO(firstData?.dt_txt ?? ''), 'EEEE')}</p>
              <p className='text-xl'>
                ({format(parseISO(firstData?.dt_txt ?? ''), 'dd.MM.yyyy')})
              </p>
            </h2>
            <Container className='items-center gap-10 px-6'>
              <div className='flex flex-col px-4'>
                <span className='text-5xl'>
                  {convertKelvinToCelsius(firstData?.main.temp ?? 0)}°C
                </span>
                <p className='space-x-1 whitespace-nowrap text-xs'>
                  Feels like{' '}
                  {convertKelvinToCelsius(firstData?.main.feels_like ?? 0)}°C
                </p>
                <p className='space-x-2 text-xs'>
                  <span>
                    {convertKelvinToCelsius(firstData?.main.temp_min ?? 0)}°C↓
                  </span>
                  <span>
                    {convertKelvinToCelsius(firstData?.main.temp_max ?? 0)}°C↑
                  </span>
                </p>
              </div>
              {/* time and weather icon */}
              <div className='flex w-full justify-between gap-10 overflow-x-auto pr-3 sm:gap-16'>
                {data?.list.map((item, index) => (
                  <div
                    key={index}
                    className='flex flex-col items-center justify-between gap-2 text-xs font-semibold'
                  >
                    <p className='whitespace-nowrap'>
                      {format(parseISO(item?.dt_txt ?? ''), 'h:mm')}
                    </p>
                    <p>
                      {convertKelvinToCelsius(item?.main.temp ?? 0)}
                      °C
                    </p>
                  </div>
                ))}
              </div>
            </Container>
          </div>
        </section>
        {/* next 7 day */}
        <section></section>
      </main>
    </div>
  );
}
