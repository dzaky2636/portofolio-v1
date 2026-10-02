'use client';

import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { useCopyEmail } from '@/components/CopyEmailProvider';

interface CopyEmailButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

export default function CopyEmailButton({
  children,
  className,
  type = 'button',
  ...props
}: CopyEmailButtonProps) {
  const copyEmail = useCopyEmail();

  return (
    <button type={type} className={className} onClick={copyEmail} {...props}>
      {children}
    </button>
  );
}
