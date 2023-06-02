import { ReactSVG } from 'react-svg';
import React from 'react';
import px2rem from '@/utils/px2rem';

type IProps = {
  svgUrl: string;
  className?: string;
  size: number;

  onClick?: () => void;
};

const SvgInset: React.FC<IProps> = ({ svgUrl, className, size, onClick }) => {
  return (
    <ReactSVG
      onClick={onClick}
      className={className}
      src={svgUrl}
      beforeInjection={(svg): void => {
        if (size) {
          svg.setAttribute('height', `100%`);
          svg.setAttribute('width', `${px2rem(size)}`);
          svg.style.minWidth = `${size}`;
          svg.style.minHeight = `100%`;
          svg.style.width = `${px2rem(size)}`;
          svg.style.height = `100%`;
        }
      }}
    />
  );
};

export default SvgInset;
