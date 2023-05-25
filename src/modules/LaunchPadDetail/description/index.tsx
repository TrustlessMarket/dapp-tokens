/* eslint-disable @typescript-eslint/no-explicit-any */
import {Box, GridItem, SimpleGrid, Text} from "@chakra-ui/react";
import styles from './styles.module.scss';
import Intro from "@/modules/LaunchPadDetail/aboveTheFold/intro";
import React from "react";
import Empty from "@/components/Empty";

const IdoDescription = ({poolDetail} : any) => {
  return (
    <Box className={styles.wrapper}>
      <SimpleGrid className={"max-content"} columns={[1, 2]} spacingX={10}>
        <GridItem>
          <Text whiteSpace={"pre-line"}>
            {poolDetail?.description ? (
              <>{poolDetail?.description}</>
            ) : (
              <Empty isTable={false} />
            )}
          </Text>
        </GridItem>
        <GridItem>
          <Intro poolDetail={poolDetail}/>
        </GridItem>
      </SimpleGrid>
    </Box>
  )
}

export default IdoDescription;