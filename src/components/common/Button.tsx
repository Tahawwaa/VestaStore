import type { ButtonHTMLAttributes } from 'react';
import { cn } from '../../utils/cn';
export function Button({
  variant = 'primary',
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'outline' | 'text' }) {
  return <button className={cn('button', `button-${variant}`, className)} {...props} />;
}
