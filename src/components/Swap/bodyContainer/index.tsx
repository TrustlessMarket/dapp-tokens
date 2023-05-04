import React from "react";
import cx from "classnames";
import {Box, BoxProps} from "@chakra-ui/react";

import styles from "./styles.module.scss";
import {useScreenLayout} from "@/hooks/useScreenLayout";

interface BodyContainerProps {
  children: React.ReactNode;
  className?: string;
  bgColor?: string;
  boxConfig?: BoxProps;
}

const BodyContainer = (props: BodyContainerProps) => {
  const {
    className,
    children,
    boxConfig,
  } = props;

  const { headerHeight, footerHeight } = useScreenLayout();

  const contentHeight = Number(headerHeight) + Number(footerHeight);

  return (
    <Box
      className={cx(className, styles.bodyContainer)}
      minHeight={`calc(100vh - ${contentHeight}px)`}
      {...boxConfig}
    >
      <div>{children}</div>
    </Box>
  );
};

export default BodyContainer;
