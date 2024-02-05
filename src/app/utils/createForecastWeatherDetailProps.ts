import { ForecastWeatherDetailProps } from '@/components/ForecastWeatherDetail';
import { format, fromUnixTime, parseISO } from 'date-fns';
import { metersToKilometers } from './metersToKilometers';
import { convertKelvinToCelsius } from './convertKelvinToCelsius';

export function createForecastWeatherDetailProps(
  weatherEntry: {
    weather: { description: string; icon: any }[];
    dt_txt: any;
    main: {
      feels_like: any;
      temp: any;
      temp_max: any;
      temp_min: any;
      pressure: any;
      humidity: any;
    };
    visibility: any;
    wind: { speed: any };
  },
  data: { city: { sunrise: any; sunset: any } }
): ForecastWeatherDetailProps {
  return {
    description: weatherEntry?.weather[0].description ?? '',
    weatherIcon: weatherEntry?.weather[0].icon ?? '01d',
    date: format(parseISO(weatherEntry?.dt_txt ?? ''), 'dd.MM'),
    day: format(parseISO(weatherEntry?.dt_txt ?? ''), 'EEEE'),
    feelsLike: weatherEntry?.main.feels_like ?? 0,
    temperature: weatherEntry?.main.temp ?? 0,
    tempMax: weatherEntry?.main.temp_max ?? 0,
    tempMin: weatherEntry?.main.temp_min ?? 0,
    airPressure: `${weatherEntry?.main.pressure} hPa`,
    humidity: `${weatherEntry?.main.humidity} %`,
    sunrise: format(fromUnixTime(data?.city.sunrise ?? 1702517657), 'H:mm'),
    sunset: format(fromUnixTime(data?.city.sunset ?? 1702517657), 'H:mm'),
    visibility: `${metersToKilometers(weatherEntry?.visibility ?? 10000)}`,
    windSpeed: `${convertKelvinToCelsius(weatherEntry?.wind.speed ?? 1.64)}`,
  } as ForecastWeatherDetailProps;
}
