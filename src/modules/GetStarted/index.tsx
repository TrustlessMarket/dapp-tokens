import {StyledTokens, UploadFileContainer} from './GetStarted.styled';
import {Box, Center, Flex, Link, Text} from "@chakra-ui/react";
import styles from "@/modules/Swap/styles.module.scss";
import BodyContainer from "@/components/Swap/bodyContainer";

const STEPS = [
  {
    step: '1',
    title: 'Create a TC Wallet',
    desc: <Box>
      <Text>Go to <Link href={"https://trustlesswallet.io/"} target={"_blank"} style={{textDecoration: 'underline'}}>trustlesswallet.io</Link> and connect your Metamask wallet</Text>
      <Text>After connecting, you will have a TC wallet address and a BTC wallet address</Text>
    </Box>
  },
  {
    step: '2',
    title: 'Get Some $TC and $BTC to cover network fees',
    desc: <Box>
      <Text>First, head to <Link href={"https://trustlessfaucet.io/"} target={"_blank"} style={{textDecoration: 'underline'}}>https://trustlessfaucet.io/</Link> to claim some $TC for free</Text>
      <Text>Then, send some $BTC to your newly generated BTC wallet address for network fee</Text>
    </Box>
  },
  {
    step: '3',
    title: 'Wrap your $BTC',
    desc: <Box>
      <Text>Go to <Link href={"https://trustlessbridge.io/"} target={"_blank"} style={{textDecoration: 'underline'}}>trustlessbridge.io</Link>, connect your wallet and send the amount of $BTC you would like to trade to this wallet. This should take 4 Bitcoin blocks which is around 45 ~ 60 minutes</Text>
      <Text>Your $BTC will be automatically converted to WBTC</Text>
      <Text>You can check your WBTC balance under the Tokens tab in your TC wallet (<Link href={"https://trustlesswallet.io/"} target={"_blank"} style={{textDecoration: 'underline'}}>trustlesswallet.io</Link>)</Text>
    </Box>
  },
  {
    step: '4',
    title: 'Start trading Smart BRC-20 tokens with Trustless Market',
    desc: <Box>
      <Text>With WBTC (Wrapped BTC), you are now ready to swap BRC-20 tokens</Text>
      <Text>Go to <Link href={"https://trustless.market/"} style={{textDecoration: 'underline'}}>https://trustless.market</Link> - an Uniswap-like DEX for Smart BRC-20 tokens, select the token you would like to swap, and confirm</Text>
    </Box>
  },
]

const GetStarted = () => {
  return (
    <BodyContainer className={styles.wrapper}>
      <StyledTokens>
        <div className="background"></div>
        <div>
          <h3 className="upload_title">Let’s get you ready for Bitcoin DeFi.</h3>
        </div>
        <UploadFileContainer>
          <div className="upload_left">
            <Flex direction={"column"} gap={6}>
              {
                STEPS.map(s => {
                  return (
                    <Flex gap={6} color={"#FFFFFF"} bg={"#000000AA"} borderRadius={"8px"} p={6} key={s.step}>
                      <Center fontSize={"28px"} fontWeight={"700"} borderRadius={"50%"}
                              bg={"linear-gradient(90deg, #00c6ff 0%, #0072ff 100%)"}
                              w={"60px"} h={"60px"} minW={"60px"} minH={"60px"}
                      >
                        {s.step}
                      </Center>
                      <Flex direction={"column"} alignItems={"flex-start"} textAlign={"left"}>
                        <Text fontSize={"28px"} fontWeight={"700"}>{s.title}</Text>
                        <Box fontSize={"md"}>
                          {s.desc}
                        </Box>
                      </Flex>
                    </Flex>
                  )
                })
              }
            </Flex>
          </div>
        </UploadFileContainer>
      </StyledTokens>
    </BodyContainer>
  );
};

export default GetStarted;
