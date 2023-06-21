import Layout from '@/layouts';
import TMTransferHistory from '@/modules/TMTransferHistory';
import {Box} from '@chakra-ui/react';
import {colors} from '@/theme/colors';

export default function Started() {
  return (
    <>
      <Box bgColor={colors.dark}>
        <Layout>
          <TMTransferHistory />
        </Layout>
      </Box>
    </>
  );
}
