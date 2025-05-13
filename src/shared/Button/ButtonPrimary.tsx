import React from 'react';

import type { ButtonProps } from '@/src/shared/Button/Button';
import Button from '@/src/shared/Button/Button';

export interface ButtonPrimaryProps extends ButtonProps {
  href?: string;
}

const ButtonPrimary: React.FC<ButtonPrimaryProps> = ({
  className = '',
  ...args
}) => {
  return (
    <Button
      className={`rounded-full bg-[#295DAC] text-white hover:bg-[#295DAC]/90 disabled:bg-opacity-70 ${className}`}
      {...args}
    />
  );
};

export default ButtonPrimary;
