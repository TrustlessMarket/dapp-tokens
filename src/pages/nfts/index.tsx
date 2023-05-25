import Layout from '@/layouts';
import NFTsPage from '@/modules/NFTs';
import { Box } from '@chakra-ui/react';

const CollectionListPage = () => {
  return (
    <>
      <Box bgColor={'#0F0F0F'}>
        <Layout isHideFooter={true}>
          <NFTsPage />
        </Layout>
      </Box>
    </>
  );
};

export default CollectionListPage;
