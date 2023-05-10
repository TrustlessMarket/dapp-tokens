import {Box, Center, Flex, Link, ListItem, Text, UnorderedList} from "@chakra-ui/react";
import Step from "@/modules/GetStarted/step";

const STEPS_CREATE_TOKEN = [
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

const STEPS_IMPORT_POOL = [
  {
    step: '1',
    title: <Box>Go to <Link href={"https://trustless.market/"} style={{textDecoration: 'underline'}}>https://trustless.market</Link>, and click <Text as="span" fontStyle={"italic"}>"POOLS"</Text>.</Box>,
    desc: (
      <Box>

      </Box>
    )
  },
  {
    step: '2',
    title: <Box>Click <Text as="span" fontStyle={"italic"}>"Import Pool"</Text></Box>,

    desc: (
      <Box>

      </Box>
    )
  },
  {
    step: '3',
    title: <Box>Select the tokens you want to import, then click <Text as="span" fontStyle={"italic"}>"Import pool"</Text> and sign.</Box>,
    desc: (
      <Box>
      </Box>
    )
  },
  {
    step: '4',
    title: <Box>Process the transactions</Box>,
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

const STEPS_ADD_LIQUIDITY = [
  {
    step: '1',
    title: <Box>Click <Text as="span" fontStyle={"italic"}>"+Add liquidity"</Text></Box>,
    desc: (
      <Box>

      </Box>
    )
  },
  {
    step: '2',
    title: <Box>Select the tokens and the amount you want to add, then click <Text as="span" fontStyle={"italic"}>"Supply"</Text></Box>,
    desc: (
      <Box>

      </Box>
    )
  },
  {
    step: '3',
    title: <Box>Process the transactions</Box>,
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

const CreateTokens = () => {
  return (
    <>
      <Text fontSize={"xl"} color={"#FFFFFF"} fontWeight={"medium"}>1. Issue a new SBRC-20 token.</Text>
      <Flex direction={"column"} gap={6} mt={6}>
        {
          STEPS_CREATE_TOKEN.map(s => {
            return (
              <Step data={s} key={s.step}/>
            );
          })
        }
      </Flex>
      <Text fontSize={"xl"} color={"#FFFFFF"} fontWeight={"medium"} mt={6}>2. Create a liquidity pool.</Text>
      <Text fontSize={"md"} color={"#FFFFFF"} fontWeight={"normal"}>A. Import pool</Text>
      <Flex direction={"column"} gap={6} mt={6}>
        {
          STEPS_IMPORT_POOL.map(s => {
            return (
              <Step data={s} key={s.step}/>
            )
          })
        }
      </Flex>
      <Text fontSize={"md"} color={"#FFFFFF"} fontWeight={"normal"} mt={6}>B. Add liquidity to existing pools</Text>
      <Flex direction={"column"} gap={6} mt={6}>
        {
          STEPS_ADD_LIQUIDITY.map(s => {
            return (
              <Step data={s} key={s.step}/>
            )
          })
        }
      </Flex>
    </>
  )
};

export default CreateTokens;