import cx from "classnames";

import LottiePlayer from "../lottiePlayer";
import darkLoading from "./json/light.json";
import styles from "./styles.module.scss";

interface LoadingProps {
  height?: number | string;
  dark?: boolean;
  className?: string;
}

const Loading = (props: LoadingProps) => {
  const { height = 30, dark = true, className } = props;

  return (
    <div className={cx(styles.container, className)}>
      <LottiePlayer
        className={styles.bg}
        autoplay
        loop
        style={{ height: height }}
        src={darkLoading}
      />
    </div>
  );
};

export default Loading;
