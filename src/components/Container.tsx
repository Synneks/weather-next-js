import { cn } from '@/app/utils/cn';
import React from 'react';

type Props = {};

export default function Container(props: React.HTMLProps<HTMLDivElement>) {
  return (
    <div
      {...props}
      className={cn(
        'flex w-full rounded-xl border bg-white py-4 shadow-sm',
        props.className
      )}
    />
  );
}
