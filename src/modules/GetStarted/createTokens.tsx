import {Box, Center, Flex, Link, ListItem, Text, UnorderedList} from "@chakra-ui/react";
import Step from "@/modules/GetStarted/step";

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
    title: <Box>Go to <Link href={"https://trustless.market/"} style={{textDecoration: 'underline'}}>https://trustless.market</Link></Box>,
    desc: (
      <Box>
        <UnorderedList>
          <ListItem>
            Click <Text as="span" fontStyle={"italic"}>"Issue Smart BRC-20"</Text>.
          </ListItem>
          <ListItem>
            A window titled <Text as="span" fontStyle={"italic"}>"Create BRC-20"</Text> will pop up.
          </ListItem>
        </UnorderedList>
      </Box>
    )
  },
  {
    step: '5',
    title: 'Enter token details.',
    desc: (
      <Box>
        <UnorderedList>
          <ListItem>
            Token name, symbol, and max supply are required.
          </ListItem>
          <ListItem>
            Select the network fee and click <Text as="span" fontStyle={"italic"}>"Create"</Text> (Some $BTC and $TC are required to pay the network fees.)
          </ListItem>
          <ListItem>
            Wait for the confirmation on the mempool.
          </ListItem>
        </UnorderedList>
      </Box>
    )
  },
];

const CreateTokens = () => {
  return (
    <Flex direction={"column"} gap={6}>
      <Text>1. Issue a new SBRC-20 token.</Text>
      {
        STEPS.map(s => {
          return (
            <Step data={s} key={s.step}/>
          );
        })
      }
      <Text>2. Create a liquidity pool.</Text>
      <Text>A. Import pool</Text>
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
      <Text>B. Add liquidity to existing pools</Text>
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

export default CreateTokens;