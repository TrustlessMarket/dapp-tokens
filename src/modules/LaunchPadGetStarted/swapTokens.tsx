import {Box, Flex, Link, ListItem, Text, UnorderedList} from "@chakra-ui/react";
import {CDN_URL} from "@/configs";
import React from "react";
import Step from "@/modules/GetStarted/step";
import styles from './styles.module.scss';

const STEPS = [
  {
    step: '1',
    title: 'Create a TC Wallet',
    desc: (
      <Box>
        <UnorderedList>
          <ListItem>
            Go to <Link href={"https://trustlesswallet.io/"} target={"_blank"} style={{textDecoration: 'underline'}}>trustlesswallet.io</Link> and create a TC Wallet by clicking <Text as="span" fontStyle={"italic"}>"Connect wallet"</Text> to connect your Metamask wallet.
            <img
              alt="swap_step1_1"
              className={styles.introImg}
              src={`${CDN_URL}/upload/1683705812924381070-1683705812-swap_step1_1.png`}
            />
          </ListItem>
          <ListItem>
            After connecting, you will have a TC wallet address and a BTC wallet address to cover the network fee.
            <img
              alt="swap_step1_1"
              className={styles.introImg}
              src={`${CDN_URL}/pages/trustlessmarket/get_started/swap_step_1.2_v1.png`}
            />
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
              Go to <Link href={"https://tcgasstation.com/"} target={"_blank"} style={{textDecoration: 'underline'}}>https://tcgasstation.com/</Link> to buy $TC (1 TC = 0.0069 ETH). 0.1 TC should be sufficient for about 10 normal transactions.
              <img
                alt="swap_step1_1"
                className={styles.introImg}
                src={`${CDN_URL}/pages/trustlessmarket/get_started/swap_step_2.1_v1.png`}
              />
            </ListItem>
            <ListItem>
              Send $BTC to your newly generated BTC wallet address for the network fee. Please send $BTC from a wallet/platform that supports taproot type.<br/>
              Then you can check your $BTC balance to cover gas fee here:
              <img
                alt="swap_step1_1"
                className={styles.introImg}
                src={`${CDN_URL}/pages/trustlessmarket/get_started/swap_step_2.2_v1.png`}
              />
            </ListItem>
          </UnorderedList>
        </Box>
      )
  },
  {
    step: '3',
    title: 'Wrap your BTC or ETH',
    desc: (
        <Box>
          <UnorderedList>
            <ListItem>
              <Text>Go to <Link href={"https://trustlessbridge.io/"} target={"_blank"} style={{textDecoration: 'underline'}}>https://trustlessbridge.io/</Link>, choose your preferred cryptocurrency.</Text>
            </ListItem>
          </UnorderedList>
          <Text fontWeight={"700"} mt={2}>3.1. Wrap BTC:</Text>
          <UnorderedList>
            <ListItem>
              Copy your TC address at <Link href={"https://trustlesswallet.io/"} target={"_blank"} style={{textDecoration: 'underline'}}>https://trustlesswallet.io/</Link> and paste it here. Then click “Transfer”.
              <img
                alt="swap_step1_1"
                className={styles.introImg}
                src={`${CDN_URL}/pages/trustlessmarket/get_started/swap_step_3.1.1_v1.png`}
              />
            </ListItem>
            <ListItem>
              Transfer your BTC to the following address. Your $BTC will be automatically wrapped.
              <img
                alt="swap_step1_1"
                className={styles.introImg}
                src={`${CDN_URL}/pages/trustlessmarket/get_started/swap_step_3.1.2_v1.png`}
              />
            </ListItem>
          </UnorderedList>
          <Text fontWeight={"700"} mt={2}>3.2. Wrap ETH</Text>
          <UnorderedList>
            <ListItem>
              Put in the amount of ETH you want to wrap. Copy your TC address at <Link href={"https://trustlesswallet.io/"} target={"_blank"} style={{textDecoration: 'underline'}}>https://trustlesswallet.io/</Link> and paste it here. Then click “Transfer”.
              <img
                alt="swap_step1_1"
                className={styles.introImg}
                src={`${CDN_URL}/pages/trustlessmarket/get_started/swap_step_3.2.1_v1.png`}
              />
            </ListItem>
            <ListItem>
              Once the transaction is completed, check your wrapped crypto balance under the Tokens tab in your Trustless Wallet: <Link href={"https://trustlesswallet.io/"} target={"_blank"} style={{textDecoration: 'underline'}}>https://trustlesswallet.io/</Link>
              <img
                alt="swap_step1_1"
                className={styles.introImg}
                src={`${CDN_URL}/upload/1683706594179996670-1683706594-swap_step3_3.png`}
              />
            </ListItem>
          </UnorderedList>
        </Box>
      )
  },
  {
    step: '4',
    title: 'Participate in the crowdfunding of the projects',
    desc: (
        <Box>
          <UnorderedList>
            <ListItem>
              <Text>Go to <Link href={"https://trustless.market/launchpad"} style={{textDecoration: 'underline'}}>https://trustless.market/launchpad</Link> and select the project you want to support</Text>
              <img
                alt="swap_step1_1"
                className={styles.introImg}
                src={`${CDN_URL}/pages/trustlessmarket/get_started/launchpad_step_4.png`}
              />
            </ListItem>
          </UnorderedList>
          <Text fontWeight={"700"} mt={2}>4.1. Voting:</Text>
          <UnorderedList>
            <ListItem>
              Select the project with the “Voting” status. Then click “Support this Launchpad”.
              <img
                alt="launchpad_step1_1"
                className={styles.introImg}
                src={`${CDN_URL}/pages/trustlessmarket/get_started/launchpad_step_4.1.1.png`}
              />
            </ListItem>
            <ListItem>
              Put in the amount of $TM you want to vote. If you don’t have $TM, you can earn 1 $TM for each time you add liquidity and 0.1 $TM for each swap on <Link href={"https://trustless.market/"} style={{textDecoration: 'underline'}}>Trustless Market DEX</Link>. Alternatively, join our <Link href={"https://discord.gg/HPuZHUexgv"} style={{textDecoration: 'underline'}}>Discord channel</Link> for updates about potential $TM airdrops.
              <img
                alt="launchpad_step1_1"
                className={styles.introImg}
                src={`${CDN_URL}/pages/trustlessmarket/get_started/launchpad_step_4.1.2.png`}
              />
            </ListItem>
            <ListItem>
              Click “Approve of TM“ {'=>'} Click “Confirm”
              <img
                alt="launchpad_step1_1"
                className={styles.introImg}
                src={`${CDN_URL}/pages/trustlessmarket/get_started/launchpad_step_4.1.3.png`}
              />
            </ListItem>
            <ListItem>
              Then go to <Link href={"https://trustlesswallet.io/"} style={{textDecoration: 'underline'}}>https://trustlesswallet.io/</Link>, click “Process” your transaction on the transactions tab and wait for the confirmation on the mempool
            </ListItem>
          </UnorderedList>
          <Text>*Note: <Text fontWeight={"700"} as={"span"}>If a project is listed on the launchpad, voters will receive 5% of the project's total crowdfunding amount proportionally in project’s tokens.</Text></Text>
          <Text fontWeight={"700"} mt={2}>4.2. Contributing</Text>
          <UnorderedList>
            <ListItem>
              Select the project with the “Funding” status.
            </ListItem>
            <ListItem>
              Put in the amount you want to contribute (in WETH or WBTC). Then click “Approve” {"=>"} Click “Confirm”
              <img
                alt="launchpad_step1_1"
                className={styles.introImg}
                src={`${CDN_URL}/pages/trustlessmarket/get_started/launchpad_step_4.2.1.png`}
              />
            </ListItem>
            <ListItem>
              Then go to <Link href={"https://trustlesswallet.io/"} style={{textDecoration: 'underline'}}>https://trustlesswallet.io/</Link>, click “Process” your transaction on the transactions tab and wait for the confirmation on the mempool
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
            <Step data={s} key={s.step}/>
          )
        })
      }
    </Flex>
  )
};

export default SwapTokens;