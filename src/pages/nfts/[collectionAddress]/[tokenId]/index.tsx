import Layout from '@/layouts';
import TokenDetail from '@/modules/NFTs/TokenDetail';
import { Box } from '@chakra-ui/react';
import { NextPage } from 'next';

const TokenDetailPage: NextPage = () => {
  return (
    <Box bgColor={'#0F0F0F'}>
      <Layout isHideFooter={true}>
        <TokenDetail />
      </Layout>
    </Box>
  );
};

export default TokenDetailPage;
