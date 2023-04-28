import cx from "classnames";
import React, { useEffect } from "react";

import darkLoading from "@/assets/json/light.json";

import styles from "./styles.module.scss";
import {useAppDispatch, useAppSelector} from "@/state/hooks";
import {hideLoadingOverlay, selectLoadingOverlay} from "@/state/loadingOverlay";
import LottiePlayer from "@/components/Swap/lottiePlayer";

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
  const {
    active = true,
    children,
    message,
    spinner,
    timeout = 0,
    callback,
  } = props;
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

export const ComponentLoading = ({ show }) => {
  return (
    <div className={cx(styles.loadingOverlay, show && styles.show)}>
      {/* <LoadingOverlay
    active={active}
    spinner={spinner || defaulSpinner()}
    text={message}
  >
    {children}
  </LoadingOverlay> */}
      <div className={styles.inner}>
        <LottiePlayer className={styles.bg} autoplay loop src={darkLoading} />
        {/* <img alt="" src={Mascot} /> */}
      </div>
    </div>
  );
};

export default MyLoadingOverlay;
