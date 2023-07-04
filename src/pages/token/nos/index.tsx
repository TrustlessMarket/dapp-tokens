import Layout from '@/layouts';
import TokenDetail from '@/modules/Token';
import {Box} from '@chakra-ui/react';

const Token = () => {
  return (
    <>
      <Box bgColor={'#0F0F0F'}>
        <Layout isHideFooter={true}>
          <TokenDetail />
        </Layout>
      </Box>
    </>
  );
};

export default Token;
