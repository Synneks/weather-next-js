import React from 'react';
import { BsSunrise, BsSunset } from 'react-icons/bs';
import { FiDroplet } from 'react-icons/fi';
import { ImMeter } from 'react-icons/im';
import { LuEye } from 'react-icons/lu';
import { MdAir } from 'react-icons/md';

export type WeatherDetailProps = {
  visibility: string;
  humidity: string;
  windSpeed: string;
  airPressure: string;
  sunrise: string;
  sunset: string;
};

const weatherIcons: { [K in keyof WeatherDetailProps]: React.ReactNode } = {
  visibility: <LuEye />,
  humidity: <FiDroplet />,
  windSpeed: <MdAir />,
  airPressure: <ImMeter />,
  sunrise: <BsSunrise />,
  sunset: <BsSunset />,
};

const weatherDetailKeys = Object.keys(weatherIcons) as Array<
  keyof WeatherDetailProps
>;

export default function WeatherDetails(props: WeatherDetailProps) {
  return (
    <>
      {Object.keys(props)
        .filter((key) =>
          weatherDetailKeys.includes(key as keyof WeatherDetailProps)
        )
        .map((key, index) => {
          return (
            <SingleWeatherDetail
              key={index}
              icon={weatherIcons[key as keyof WeatherDetailProps]}
              information={key}
              value={props[key as keyof WeatherDetailProps]}
            />
          );
        })}
    </>
  );
}

function SingleWeatherDetail(props: SingleWeatherDetailProps) {
  return (
    <div className='flex flex-col items-center justify-between gap-2 text-xs font-semibold text-black/80'>
      <p className='whitespace-nowrap capitalize'>{props.information}</p>
      <div className='text-3xl'>{props.icon}</div>
      <p>{props.value}</p>
    </div>
  );
}

export type SingleWeatherDetailProps = {
  information: string;
  icon: React.ReactNode;
  value: string;
};
