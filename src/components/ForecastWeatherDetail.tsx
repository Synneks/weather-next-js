import React from 'react';
import Container from './Container';
import WeatherIcon from './WeatherIcon';
import WeatherDetails, { WeatherDetailProps } from './WeatherDetails';
import { convertKelvinToCelsius } from '@/app/utils/convertKelvinToCelsius';

export type ForecastWeatherDetailProps = WeatherDetailProps & {
  weatherIcon: string;
  date: string;
  day: string;
  temperature: number;
  feelsLike: number;
  tempMin: string;
  tempMax: string;
  description: string;
};

function ForecastWeatherDetail(props: ForecastWeatherDetailProps) {
  return (
    <Container className='gap-4'>
      {/* left section */}
      <section className='flex items-center gap-4 px-4'>
        <div className='flex flex-col items-center text-xs'>
          <WeatherIcon iconName={props.weatherIcon} />
          <p>{props.date}</p>
          <p>{props.day}</p>
        </div>
        <div className='flex flex-col items-center px-4'>
          <span className='text-5xl'>
            {convertKelvinToCelsius(props.temperature ?? 0)}°
          </span>
          <p className='space-x-1 whitespace-nowrap text-xs'>
            Feels like {convertKelvinToCelsius(props.feelsLike ?? 0)}°C
          </p>
          <p className='text-xs capitalize'>{props.description}</p>
        </div>
      </section>
      {/* right section */}
      <section className='flex w-full justify-between gap-4 overflow-x-auto px-4 pr-10'>
        <WeatherDetails {...(props as WeatherDetailProps)} />
      </section>
    </Container>
  );
}

export default ForecastWeatherDetail;
