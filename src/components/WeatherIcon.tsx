import { cn } from '@/app/utils/cn';
import Image from 'next/image';
import React from 'react';

type WeatherIconProps = React.HTMLProps<HTMLDivElement> & { iconName: string };

export default function WeatherIcon({ iconName, ...props }: WeatherIconProps) {
  return (
    <div {...props} className={cn('relative h-20 w-20')}>
      <Image
        width={100}
        height={100}
        alt='weather-icon'
        className='absolute h-full w-full'
        src={`https://openweathermap.org/img/wn/${iconName}@4x.png`}
      />
    </div>
  );
}
