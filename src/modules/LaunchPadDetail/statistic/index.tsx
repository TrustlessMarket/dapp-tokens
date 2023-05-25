/* eslint-disable @typescript-eslint/no-explicit-any */
import styles from './styles.module.scss';
import {Box, Text} from "@chakra-ui/react";
import Card from "@/components/Swap/card";
import React from "react";
import {useSelector} from "react-redux";
import {getIsAuthenticatedSelector} from "@/state/user/selector";

const Statistic = ({poolDetail} : any) => {
  const isAuthenticated = useSelector(getIsAuthenticatedSelector);

  return (
    <Box className={styles.wrapper}>
      <Card bgColor={"#1E1E22"} paddingX={8} paddingY={6}>
        {isAuthenticated && (
          <Text color={'#1b77fd'} mb={"8px !important"}>Connect wallet to see your boost rate</Text>
        )}
      </Card>
    </Box>
  )
};

export default Statistic;