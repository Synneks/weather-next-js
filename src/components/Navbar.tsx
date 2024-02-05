'use client';

import React, { useState } from 'react';
import { MdWbSunny, MdMyLocation, MdOutlineLocationOn } from 'react-icons/md';
import SearchBox from './SearchBox';
import axios from 'axios';
import { useAtom } from 'jotai';
import { loadingCityAtom, placeAtom } from '@/app/atom';

type Props = { location: string };

export default function Navbar({ location }: Props) {
  const [city, setCity] = useState('');
  const [error, setError] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [place, setPlace] = useAtom(placeAtom);
  const [loadingCity, setLoadingCity] = useAtom(loadingCityAtom);

  async function handleInputChange(value: string) {
    setCity(value);
    if (value.length > 2) {
      axios
        .get(
          `https://api.openweathermap.org/data/2.5/find?q=${value}&appid=${process.env.NEXT_PUBLIC_WEATHER_KEY}`
        )
        .then((response) => {
          const suggestions = response.data.list.map(
            (item: { name: any }) => item.name
          );
          setSuggestions(suggestions);
          setError('');
          setShowSuggestions(true);
        })
        .catch((error) => {
          setSuggestions([]);
          setShowSuggestions(false);
          setError('Something went wrong, please try again.');
        });
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }

  function handleSuggestionClick(value: string) {
    setCity(value);
    setShowSuggestions(false);
  }

  function handleSubmitSearch(e: React.FormEvent<HTMLFormElement>) {
    setLoadingCity(true);
    e.preventDefault();
    if (suggestions.length == 0) {
      setError('City not found');
      setLoadingCity(false);
    } else {
      setError('');
      setTimeout(() => {
        setLoadingCity(false);
        setPlace(city);
        setShowSuggestions(false);
      }, 500);
    }
  }

  function handleCurrentLocation() {
    setLoadingCity(true);
    setCity('');
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      axios
        .get(
          `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${process.env.NEXT_PUBLIC_WEATHER_KEY}`
        )
        .then((response) => {
          setTimeout(() => {
            setPlace(response.data.name);
            setLoadingCity(false);
          }, 500);
        })
        .catch((error) => {
          setLoadingCity(false);
        });
    });
  }

  return (
    <>
      <nav className='sticky left-0 top-0 z-50 bg-white shadow-sm'>
        <div className='mx-auto flex h-[80px] w-full max-w-7xl items-center justify-between px-3'>
          <div className='flex items-center justify-center gap-2'>
            <h2 className='text-3xl text-gray-500'>Weather</h2>
            <MdWbSunny className='text-3xl text-yellow-300' />
          </div>
          <section className='flex items-center gap-2'>
            <MdMyLocation
              title='Select current location'
              onClick={handleCurrentLocation}
              className='cursor-pointer text-2xl text-gray-500 opacity-80 hover:opacity-100'
            />
            <MdOutlineLocationOn className='text-2xl' />
            <p className='text-sm text-slate-900/80'>{location}</p>
            <div className='relative hidden md:flex'>
              {/* Search */}
              <SearchBox
                value={city}
                onSubmit={handleSubmitSearch}
                onChange={(e) => handleInputChange(e.target.value)}
              />
              <SuggestionBox
                {...{
                  showSuggestions,
                  suggestions,
                  handleSuggestionClick,
                  error,
                }}
              />
            </div>
          </section>
        </div>
      </nav>
      <section className='flex max-w-7xl md:hidden'>
        <div className='relative'>
          {/* Search */}
          <SearchBox
            value={city}
            onSubmit={handleSubmitSearch}
            onChange={(e) => handleInputChange(e.target.value)}
          />
          <SuggestionBox
            {...{
              showSuggestions,
              suggestions,
              handleSuggestionClick,
              error,
            }}
          />
        </div>
      </section>
    </>
  );
}

function SuggestionBox({
  showSuggestions,
  suggestions,
  handleSuggestionClick,
  error,
}: {
  showSuggestions: boolean;
  suggestions: string[];
  handleSuggestionClick: (value: string) => void;
  error: string;
}) {
  if (error && suggestions.length < 1) {
    return (
      <ul className='absolute left-0 top-[44px] mb-4 flex min-w-[200px] flex-col gap-1 rounded-md  border border-gray-300 bg-white px-2 py-2'>
        <li className='text-red-500'>{error}</li>
      </ul>
    );
  }

  if (showSuggestions && suggestions.length > 0) {
    return (
      <ul className='absolute left-0 top-[44px] mb-4 flex min-w-[200px] flex-col gap-1 rounded-md  border border-gray-300 bg-white px-2 py-2'>
        {suggestions.map((suggestion, index) => (
          <li
            key={index}
            className='cursor-pointer rounded p-1 hover:bg-gray-200'
            onClick={() => handleSuggestionClick(suggestion)}
          >
            {suggestion}
          </li>
        ))}
      </ul>
    );
  }

  return null;
}
