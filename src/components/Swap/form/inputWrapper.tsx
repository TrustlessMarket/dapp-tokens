import React from "react";
import cx from "classnames";

import styles from "./styles.module.scss";
import InfoTooltip from "../infoTooltip";
import { Box, Flex } from "@chakra-ui/react";

interface InputWrapperProps {
  label?: string | React.ReactNode;
  rightLabel?: string | React.ReactNode;
  desc?: string | React.ReactNode;
  children: React.ReactNode;
  className?: string;
  theme?: "light" | "dark";
}

const InputWrapper = (props: InputWrapperProps) => {
  const {
    className,
    label,
    desc,
    children,
    rightLabel,
    theme = "dark",
  } = props;

  return (
    <div
      className={cx([
        styles.inputWrapper,
        className,
        theme === "dark" && styles.inputWrapperDark,
      ])}
    >
      {label && (
        <div className={cx(styles.labelWrapper, "labelWrapper")}>
          <Flex alignItems="flex-end" justifyContent={"space-between"} gap={1}>
            <Box>
              <label>{label}</label>
              {desc && <InfoTooltip iconSize="sm" label={desc} />}
            </Box>
            <Box className="labelRightWrapper">{rightLabel}</Box>
          </Flex>
        </div>
      )}
      {children}
    </div>
  );
};

export default InputWrapper;
