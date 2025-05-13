import React from 'react';

import type { ButtonProps } from '@/src/shared/Button/Button';
import Button from '@/src/shared/Button/Button';

export interface ButtonSecondaryProps extends ButtonProps {
  href?: string;
}

const ButtonSecondary: React.FC<ButtonSecondaryProps> = ({
  className = '',
  ...args
}) => {
  return <Button className={`${className}`} {...args} />;
};

export default ButtonSecondary;
