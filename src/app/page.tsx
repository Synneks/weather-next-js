'use client';

import Container from '@/components/Container';
import Navbar from '@/components/Navbar';
import axios from 'axios';
import { format, fromUnixTime, parseISO } from 'date-fns';
import { useQuery } from 'react-query';
import { convertKelvinToCelsius } from './utils/convertKelvinToCelsius';
import WeatherIcon from '@/components/WeatherIcon';
import { getIconName } from './utils/getIconName';
import { Key, useEffect } from 'react';
import WeatherDetails from '@/components/WeatherDetails';
import { metersToKilometers } from './utils/metersToKilometers';
import ForecastWeatherDetail from '@/components/ForecastWeatherDetail';
import { createForecastWeatherDetailProps } from './utils/createForecastWeatherDetailProps';
import { useAtom } from 'jotai';
import { loadingCityAtom, placeAtom } from './atom';

export default function Home() {
  const [place, setPlace] = useAtom(placeAtom);
  const [loadingCity, setLoadingCity] = useAtom(loadingCityAtom);
  const { isLoading, error, data, refetch } = useQuery('repoData', async () => {
    const { data } = await axios.get(
      `https://api.openweathermap.org/data/2.5/forecast?q=${place}&appid=${process.env.NEXT_PUBLIC_WEATHER_KEY}&cnt=56`
    );
    return data;
  });

  useEffect(() => {
    refetch();
  }, [place, refetch]);

  const firstData = data?.list[0];

  const uniqueDates = [
    ...(new Set(
      data?.list.map(
        (entry: { dt: number }) =>
          new Date(entry.dt * 1000).toISOString().split('T')[0]
      )
    ) as Iterable<string>),
  ];

  // Filetering the data to get the first entry after 6 AM for each unique date
  const filteredData = uniqueDates.map((date) => {
    return data?.list.find(
      (entry: { dt: number; dt_txt: string | number | Date }) =>
        new Date(entry.dt * 1000).toISOString().split('T')[0] === date &&
        new Date(entry.dt_txt).getHours() >= 6
    );
  });

  if (isLoading)
    return (
      <div className='flex min-h-screen items-center justify-center'>
        <p className='animate-bounce text-gray-500'>Loading...</p>
      </div>
    );

  return (
    <div className='flex min-h-screen flex-col gap-4 bg-gray-100'>
      <Navbar location={data?.city.name} />
      <main className='mx-auto flex w-full max-w-7xl flex-col gap-9 px-3 pb-10 pt-4'>
        {loadingCity ? (
          <WeatherSkeleton />
        ) : (
          <>
            {/* today */}
            <section className='space-y-4'>
              <div className='space-y-2'>
                <h2 className='flex items-end gap-1 text-2xl'>
                  <p> {format(parseISO(firstData?.dt_txt ?? ''), 'EEEE')}</p>
                  <p className='text-xl'>
                    ({format(parseISO(firstData?.dt_txt ?? ''), 'dd.MM.yyyy')})
                  </p>
                </h2>
                {/* temperatures row*/}
                <Container className='items-center gap-10 px-6'>
                  <div className='flex flex-col items-center px-4'>
                    <span className='text-5xl'>
                      {convertKelvinToCelsius(firstData?.main.temp ?? 0)}°
                    </span>
                    <p className='space-x-1 whitespace-nowrap text-xs'>
                      Feels like{' '}
                      {convertKelvinToCelsius(firstData?.main.feels_like ?? 0)}
                      °C
                    </p>
                    <p className='space-x-2 text-xs'>
                      <span>
                        {convertKelvinToCelsius(firstData?.main.temp_min ?? 0)}
                        °C↓
                      </span>
                      <span>
                        {convertKelvinToCelsius(firstData?.main.temp_max ?? 0)}
                        °C↑
                      </span>
                    </p>
                  </div>
                  {/* time and weather icon */}
                  <div className='flex w-full justify-between gap-10 overflow-x-auto pr-3 sm:gap-16'>
                    {data?.list.map(
                      (
                        item: {
                          dt_txt: string;
                          weather: { icon: string }[];
                          main: { temp: any };
                        },
                        index: Key | null | undefined
                      ) => (
                        <div
                          key={index}
                          className='flex flex-col items-center justify-between gap-2 text-xs font-semibold'
                        >
                          <p className='whitespace-nowrap'>
                            {format(parseISO(item?.dt_txt ?? ''), 'H:mm')}
                          </p>
                          <WeatherIcon
                            iconName={getIconName(
                              item?.weather[0].icon,
                              item?.dt_txt
                            )}
                          />
                          <p>
                            {convertKelvinToCelsius(item?.main.temp ?? 0)}
                            °C
                          </p>
                        </div>
                      )
                    )}
                  </div>
                </Container>
              </div>
              {/* weather description */}
              <div className='flex gap-4'>
                {/* left */}
                <Container className='w-fit  flex-col items-center justify-center px-4'>
                  <p className='text-center capitalize'>
                    {firstData.weather[0].description}
                  </p>
                  <WeatherIcon
                    iconName={getIconName(
                      firstData?.weather[0].icon ?? '',
                      firstData?.dt_txt ?? ''
                    )}
                  />
                </Container>
                {/* right */}
                <Container className='justify-between  gap-4 overflow-x-auto bg-yellow-300/80 px-6'>
                  <WeatherDetails
                    visibility={`${metersToKilometers(firstData?.visibility ?? 10000)}km`}
                    humidity={`${firstData?.main.humidity ?? 99}%`}
                    windSpeed={`${firstData?.wind.speed ?? 1.54}m/s`}
                    airPressure={`${firstData?.main.pressure ?? 1024}hPa`}
                    sunrise={format(
                      fromUnixTime(data?.city.sunrise ?? 1702949452),
                      'hh:mm'
                    )}
                    sunset={format(
                      fromUnixTime(data?.city.sunset ?? 1702517657),
                      'H:mm'
                    )}
                  />
                </Container>
              </div>
            </section>
            {/* next 7 day */}
            <section className='flex w-full flex-col gap-4'>
              <p className='text-2xl'>Forecast (7 Days)</p>
              {filteredData.map((item, index) => (
                <ForecastWeatherDetail
                  key={index}
                  {...createForecastWeatherDetailProps(item, data)}
                />
              ))}
            </section>
          </>
        )}
      </main>
    </div>
  );
}

function WeatherSkeleton() {
  return (
    <>
      {/* today */}
      <section className='space-y-4'>
        <div className='space-y-2'>
          <h2 className='flex items-end gap-1 text-2xl'>
            <p className='h-6 w-24 animate-pulse bg-gray-200'></p>
          </h2>
          {/* temperatures row*/}
          <Container className='items-center gap-10 px-6'>
            <div className='flex flex-col items-center px-4'>
              <span className='h-6 w-24 animate-pulse bg-gray-200 text-5xl'></span>
              <p className='h-6 w-24 animate-pulse space-x-1 whitespace-nowrap bg-gray-200 text-xs'></p>
              <p className='h-6 w-24 animate-pulse space-x-2 bg-gray-200 text-xs'></p>
            </div>
            {/* time and weather icon */}
            <div className='flex w-full justify-between gap-10 overflow-x-auto pr-3 sm:gap-16'>
              {[...Array(5)].map((_, index) => (
                <div
                  key={index}
                  className='flex flex-col items-center justify-between gap-2 text-xs font-semibold'
                >
                  <p className='h-6 w-24 animate-pulse whitespace-nowrap bg-gray-200'></p>
                  <div className='h-6 w-24 animate-pulse bg-gray-200'></div>
                  <p className='h-6 w-24 animate-pulse bg-gray-200'></p>
                </div>
              ))}
            </div>
          </Container>
        </div>
        {/* weather description */}
        <div className='flex gap-4'>
          {/* left */}
          <Container className='w-fit  flex-col items-center justify-center px-4'>
            <p className='h-6 w-24 animate-pulse bg-gray-200 text-center capitalize'></p>
            <div className='h-6 w-24 animate-pulse bg-gray-200'></div>
          </Container>
          {/* right */}
          <Container className='justify-between  gap-4 overflow-x-auto  px-6'>
            <div className='h-6 w-24 animate-pulse bg-gray-200'></div>
          </Container>
        </div>
      </section>
      {/* next 7 day */}
      <section className='flex w-full flex-col gap-4'>
        <p className='h-6 w-24 animate-pulse bg-gray-200 text-2xl'></p>
        {[...Array(7)].map((_, index) => (
          <div
            key={index}
            className='h-6 w-full animate-pulse bg-gray-200'
          ></div>
        ))}
      </section>
    </>
  );
}
