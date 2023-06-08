/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box, GridItem, SimpleGrid, Text } from '@chakra-ui/react';
import styles from './styles.module.scss';
import React from 'react';
import Empty from '@/components/Empty';
import ReactMarkdown from 'react-markdown';

const IdoDescription = ({ poolDetail }: any) => {
  return (
    <Box className={styles.wrapper}>
      <SimpleGrid columns={[1, 1]} spacingX={10}>
        <GridItem>
          <Text whiteSpace={'pre-line'}>
            {poolDetail?.description ? (
              <ReactMarkdown>{poolDetail?.description}</ReactMarkdown>
            ) : (
              <Empty isTable={false} />
            )}
          </Text>
        </GridItem>
      </SimpleGrid>
    </Box>
  );
};

export default IdoDescription;
