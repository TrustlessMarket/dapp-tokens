import Layout from '@/layouts';
import GetStarted from '@/modules/GetStarted';
import {Box} from '@chakra-ui/react';
import {colors} from '@/theme/colors';

export default function Started() {
  return (
    <>
      <Box bgColor={colors.dark}>
        <Layout>
          <GetStarted />
        </Layout>
      </Box>
    </>
  );
}
