import { CDN_URL } from '@/configs';
import { StyledEmpty } from './Empty.styled';

export type TEmpty = {
  infoText?: string | React.ReactNode;
  isTable?: boolean;
};

const Empty = ({ infoText = '', isTable = false }: TEmpty) => {
  return (
    <StyledEmpty className={'notFound'} isTable={isTable}>
      <img
        width={95}
        height={95}
        src={`${CDN_URL}/icons/empty-white.svg`}
        alt="Not found item"
        className={'notFound_image'}
      />
      <h5 className="content">{infoText}</h5>
    </StyledEmpty>
  );
};

export default Empty;
