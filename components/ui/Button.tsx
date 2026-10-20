import Link from 'next/link';
import { forwardRef } from 'react';
import { cn } from '@/lib/cn';

type Variant = 'primary' | 'secondary' | 'light' | 'ghost';
type Size = 'sm' | 'md' | 'lg';

const base =
  'relative inline-flex select-none items-center justify-center gap-2 whitespace-nowrap rounded-full font-sans font-medium tracking-[0.01em] ' +
  'transition-[background-color,color,border-color,text-decoration-color,transform] duration-300 ease-soft active:scale-[0.985] ' +
  'disabled:pointer-events-none disabled:opacity-50';

const variants: Record<Variant, string> = {
  primary: 'bg-charcoal text-ivory hover:bg-espresso',
  secondary: 'border border-charcoal/20 bg-transparent text-charcoal hover:border-charcoal hover:bg-charcoal/[0.03]',
  light: 'bg-ivory text-charcoal hover:bg-white',
  ghost: 'bg-transparent px-0 py-2 text-[0.9rem] text-charcoal underline decoration-charcoal/25 underline-offset-[6px] hover:decoration-charcoal',
};

const sizes: Record<Size, string> = {
  sm: 'h-10 px-5 text-[0.85rem]',
  md: 'h-12 px-7 text-[0.92rem]',
  lg: 'h-14 px-8 text-[0.98rem]',
};

type CommonProps = {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
  className?: string;
  children: React.ReactNode;
};

type ButtonAsLink = CommonProps & { href: string } & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href' | 'className'>;
type ButtonAsButton = CommonProps & { href?: undefined } & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'className'>;

export type ButtonProps = ButtonAsLink | ButtonAsButton;

/** The one button style. Renders a Next <Link> when `href` is given. */
export const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(function Button(props, ref) {
  const { variant = 'primary', size = 'md', fullWidth, className, children, ...rest } = props;
  const classes = cn(base, variants[variant], variant !== 'ghost' && sizes[size], fullWidth && 'w-full', className);

  if ('href' in rest && rest.href !== undefined) {
    const { href, ...anchorRest } = rest as Omit<ButtonAsLink, keyof CommonProps> & { href: string };
    return (
      <Link ref={ref as React.Ref<HTMLAnchorElement>} href={href} className={classes} {...anchorRest}>
        {children}
      </Link>
    );
  }

  const { type = 'button', ...buttonRest } = rest as Omit<ButtonAsButton, keyof CommonProps>;
  return (
    <button ref={ref as React.Ref<HTMLButtonElement>} type={type} className={classes} {...buttonRest}>
      {children}
    </button>
  );
});
