import Layout from '@/layouts';
import LaunchpadContainer from '@/modules/Launchpad';
import {colors} from '@/theme/colors';
import {Box} from '@chakra-ui/react';
import React from 'react';

const IdoToken = () => {
  return (
    <>
      <Box bgColor={colors.dark}>
        <Layout>
          <LaunchpadContainer />
        </Layout>
      </Box>
    </>
  );
};

export default IdoToken;
