import {Box, Center, Flex, Link, ListItem, Text, UnorderedList} from "@chakra-ui/react";

const STEPS = [
  {
    step: '1',
    title: 'Create a TC Wallet',
    desc: (
      <Box>
        <UnorderedList>
          <ListItem>
            Go to <Link href={"https://trustlesswallet.io/"} target={"_blank"} style={{textDecoration: 'underline'}}>trustlesswallet.io</Link> and create a TC Wallet by clicking <Text as="span" fontStyle={"italic"}>"Connect wallet"</Text> to connect your Metamask wallet.
          </ListItem>
          <ListItem>
            After connecting, you will have a TC wallet address and a BTC wallet address to cover the network fee.
          </ListItem>
        </UnorderedList>
      </Box>
    )
  },
  {
    step: '2',
    title: 'Get $TC and $BTC for network fee',
    desc: (
        <Box>
          <UnorderedList>
            <ListItem>
              Go to <Link href={"https://trustlessfaucet.io/"} target={"_blank"} style={{textDecoration: 'underline'}}>https://trustlessfaucet.io/</Link> to claim $TC for free.
            </ListItem>
            <ListItem>
              Send $BTC to your newly generated BTC wallet address for the network fee.<br/>
              You can check your $BTC balance here:
            </ListItem>
          </UnorderedList>
        </Box>
      )
  },
  {
    step: '3',
    title: 'Wrap your BTC (or other cryptocurrencies)',
    desc: (
        <Box>
          <UnorderedList>
            <ListItem>
              Go to <Link href={"https://trustlessbridge.io/"} target={"_blank"} style={{textDecoration: 'underline'}}>https://trustlessbridge.io/</Link>, and connect your wallet.
            </ListItem>
            <ListItem>
              Choose your preferred cryptocurrency (4 options: BTC, ETH, USDC, PEPE).
            </ListItem>
            <ListItem>
              Send the amount of the chosen crypto you want to trade to this wallet, and your crypto will be automatically wrapped.
            </ListItem>
            <ListItem>
              Once the transaction is completed, check your wrapped crypto balance under the Tokens tab in your Trustless Wallet: <Link href={"https://trustlesswallet.io/"} target={"_blank"} style={{textDecoration: 'underline'}}>https://trustlesswallet.io/</Link>
            </ListItem>
          </UnorderedList>
        </Box>
      )
  },
  {
    step: '4',
    title: 'Start trading Smart BRC-20 tokens with Trustless Market',
    desc: (
        <Box>
          <UnorderedList>
            <ListItem>
              You are now ready to swap BRC-20 tokens using WBTC.
            </ListItem>
            <ListItem>
              Go to <Link href={"https://trustless.market/"} style={{textDecoration: 'underline'}}>https://trustless.market</Link> and select the token you want to swap.
            </ListItem>
            <ListItem>
              After choosing a token and the amount you want to trade, click <Text as="span" fontStyle={"italic"}>"Approve use of WBTC"</Text>, then click <Text as="span" fontStyle={"italic"}>"Swap"</Text>.
            </ListItem>
          </UnorderedList>
        </Box>
      )
  },
  {
    step: '5',
    title: 'Process the transactions',
    desc: (
        <Box>
          <UnorderedList>
            <ListItem>
              Go to <Link href={"https://trustlesswallet.io/"} target={"_blank"} style={{textDecoration: 'underline'}}>https://trustlesswallet.io/</Link>, click <Text as="span" fontStyle={"italic"}>"Process"</Text> your transaction on the transactions tab and wait for the confirmation on the mempool.
            </ListItem>
          </UnorderedList>
        </Box>
      )
  },
];

const SwapTokens = () => {
  return (
    <Flex direction={"column"} gap={6}>
      {
        STEPS.map(s => {
          return (
            <Flex gap={6} color={"#FFFFFF"} bg={"#1E1E22"} borderRadius={"8px"} p={6} key={s.step}>
              <Center fontSize={"28px"} fontWeight={"700"} borderRadius={"50%"}
                      bg={"#3385FF"}
                      w={"50px"} h={"50px"} minW={"50px"} minH={"50px"}
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
  )
};

export default SwapTokens;