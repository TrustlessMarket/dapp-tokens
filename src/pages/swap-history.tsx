import Layout from '@/layouts';
import SwapHistory from '@/modules/SwapHistory';
import {Box} from "@chakra-ui/react";

export default function SwapHistoryPage() {
  return (
    <>
      <Box bgColor={"#0F0F0F"}>
        <Layout>
          <SwapHistory />
        </Layout>
      </Box>
    </>
  );
}
