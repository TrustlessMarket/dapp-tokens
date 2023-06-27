/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, ButtonProps, Flex } from '@chakra-ui/react';
import cx from 'classnames';
import React, { memo } from 'react';

import styles from './styles.module.scss';
import AlertInfoProcess from '../alertInfoProcessing';
import { IAlertInfoProcess } from '../alertInfoProcessing/interface';

export interface FiledButtonProps extends ButtonProps {
  btnSize?: 'h' | 'm' | 'l';
  containerConfig?: any;
  processInfo?: IAlertInfoProcess;
}

const FiledButton: React.FC<FiledButtonProps> = (props) => {
  const {
    children,
    className,
    btnSize = 'm',
    isLoading,
    containerConfig,
    loadingText,
    processInfo,
    ...otherProps
  } = props;

  return (
    <>
      {Boolean(processInfo) && (
        <AlertInfoProcess loading={isLoading} processInfo={processInfo} />
      )}
      <Flex
        direction={'column'}
        gap={1}
        alignItems={'center'}
        className={styles.container}
        {...containerConfig}
      >
        <Button
          className={cx(styles[`${btnSize}`], className)}
          isLoading={isLoading && !Boolean(processInfo)}
          isDisabled={isLoading}
          w={'100%'}
          loadingText={loadingText || 'Processing'}
          {...otherProps}
        >
          {children}
        </Button>
        {/* {(!isLoading || !Boolean(processInfo)) && (
          
        )} */}

        {/* {!isLoading && !Boolean(processInfo) && (
          <Button
            className={cx(styles[`${btnSize}`], className)}
            isLoading={isLoading}
            w={'100%'}
            loadingText={loadingText || 'Processing'}
            display={}
            {...otherProps}
          >
            {children}
          </Button>
        )} */}
      </Flex>
    </>
  );
};

export default memo(FiledButton);
