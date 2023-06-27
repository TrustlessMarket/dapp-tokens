/* eslint-disable @typescript-eslint/no-explicit-any */
import { CDN_URL } from '@/configs';
import { StyledEmpty } from './Empty.styled';

export type TEmpty = {
  infoText?: string | React.ReactNode;
  isTable?: boolean;
  size?: any;
};

const Empty = ({ infoText = '', isTable = false, size = 95 }: TEmpty) => {
  return (
    <StyledEmpty className={'notFound'} isTable={isTable}>
      <img
        width={size}
        height={size}
        src={`${CDN_URL}/icons/empty-white.svg`}
        alt="Not found item"
        className={'notFound__image'}
      />
      <h5 className="content">{infoText}</h5>
    </StyledEmpty>
  );
};

export default Empty;
