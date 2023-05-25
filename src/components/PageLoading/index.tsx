import React from 'react';
import { Spinner } from '@chakra-ui/react';
import s from './styles.module.scss';

interface IProps {
  bgColor?: string;
  spinnerColor?: string;
  thickness?: string;
}

const PageLoading: React.FC<IProps> = ({
  bgColor = '#0F0F0F',
  spinnerColor = '#fff',
  thickness = '4px'
}: IProps): React.ReactElement => {
  return (
    <div
      className={s.loadingWrapper}
      style={{
        backgroundColor: bgColor,
      }}
    >
      <Spinner
        thickness={thickness}
        color={spinnerColor}
        size='xl'
      />
    </div>
  )
}

export default PageLoading;
