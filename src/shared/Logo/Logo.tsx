import Image from 'next/image';
import Link from 'next/link';
import type { FC } from 'react';
interface LogoProps {
  className?: string;
}

const Logo: FC<LogoProps> = ({ className = 'hidden' }) => {
  return (
    <Link className="flex cursor-pointer items-center gap-2" href="/">
      <Image src="/logo.png" alt="logo" width={60} height={60} />{' '}
      <span className={`${className} text-2xl font-bold`}>Poste.</span>
    </Link>
  );
};

export default Logo;
