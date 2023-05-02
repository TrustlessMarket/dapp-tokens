import { Box, Flex, useColorMode } from '@chakra-ui/react';
import { StyledHowToBuyContainer } from './HowToBuy.styled';
import Text from '@/components/Text';

const HowToBuyMain = () => {
  const { colorMode } = useColorMode();
  return (
    <StyledHowToBuyContainer className={colorMode}>
      <Text className="title">How to Buy</Text>

      <Box className="content">
        <Flex className="content-section">
          <Box className="content-right">
            <Text className="content-right-title">Create a Wallet</Text>
            <Text className="content-right-desc">
              download metamask or your wallet of choice from the app store or google
              play store for free. Desktop users, download the google chrome
              extension by going to{' '}
              <a href="https://metamask.io/download/" target="_blank">
                metamask.io.
              </a>
            </Text>
          </Box>
        </Flex>
        <Flex>
          <Box>
            <Text>Get Some WBTC</Text>
            <Text>
              have WBTC in your wallet to swap $DEV, $NAKA,.... If you don’t have any
              WBTC, you can buy directly on metamask, transfer from another wallet,
              or buy on another exchange and send it to your wallet.
            </Text>
          </Box>
        </Flex>
      </Box>
    </StyledHowToBuyContainer>
  );
};

export default HowToBuyMain;
