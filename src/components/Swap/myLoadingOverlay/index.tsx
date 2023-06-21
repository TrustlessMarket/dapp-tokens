/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-types */
import cx from 'classnames';
import React, {useEffect} from 'react';

import styles from './styles.module.scss';
import {useAppDispatch, useAppSelector} from '@/state/hooks';
import {hideLoadingOverlay, selectLoadingOverlay} from '@/state/loadingOverlay';
import {Spinner} from "@chakra-ui/react";

interface MyLoadingOverlayProps {
  active?: boolean;
  children?: React.ReactNode;
  message?: string;
  show?: boolean;
  spinner?: React.ReactNode;
  timeout?: number;
  callback?: Function;
}

const MyLoadingOverlay = (props: MyLoadingOverlayProps) => {
  const { timeout = 0, callback } = props;
  const dispatch = useAppDispatch();
  const show = useAppSelector(selectLoadingOverlay).show;

  useEffect(() => {
    if (show && timeout > 0) {
      setTimeout(() => {
        dispatch(hideLoadingOverlay());
        if (callback) callback();
      }, timeout);
    }
  }, [show]);

  return <ComponentLoading show={show} />;
};

export const ComponentLoading = ({ show }: { show: any }) => {
  return (
    <div className={cx(styles.loadingOverlay, show && styles.show)}>
      <div className={styles.inner}>
        <Spinner speed="0.65s" emptyColor="gray.200" color="blue.500" />
      </div>
    </div>
  );
};

export default MyLoadingOverlay;
