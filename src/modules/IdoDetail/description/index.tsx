import {GridItem, Heading, SimpleGrid, Text} from "@chakra-ui/react";
import styles from './styles.module.scss';
import {CDN_URL} from "@/configs";
import BodyContainer from "@/components/Swap/bodyContainer";

const IdoDescription = () => {
  return (
    <BodyContainer className={styles.wrapper}>
      <SimpleGrid className={"max-content"} columns={[1, 2]} spacingX={10}>
        <GridItem>
          <Heading
            // className={`${s.rowContent_content_heading}`}
            as={'h2'}
            mb={'3.2rem'}
            fontSize={'3.6rem'}
            lineHeight={'3.6rem'}
            fontWeight={600}
          >
            A historical symbol of New Bitcoin City.
          </Heading>
          <Text mt={2}>
            Welcome to New Bitcoin City. It is a radically new way to explore
            Bitcoin — more than just a currency.
          </Text>
          <Text mt={2}>
            New Bitcoin City is a diverse corner of web3. All neighborhoods
            are unique.{' '}
            <a
              target="_blank"
              className={styles.contentLink}
              href="https://generative.xyz/"
            >
              Generative Village
            </a>{' '}
            has some of the most unique crypto art.{' '}
            <a
              target="_blank"
              className={styles.contentLink}
              href="https://trustlesstyles.market/"
            >
              DeFi District
            </a>{' '}
            powers decentralized finance.{' '}
            <a
              target="_blank"
              className={styles.contentLink}
              href="https://generative.xyz/ai"
            >
              Perceptrons Square
            </a>{' '}
            is known for on-chain AI.{' '}
            <a
              target="_blank"
              className={styles.contentLink}
              href="https://generative.xyz/metaverse"
            >
              Fantasy Land
            </a>{' '}
            is an autonomous, self-evolving metaverse.
          </Text>
          <Text mt={2}>
          New Bitcoin City is powered by{' '}
            <a
              target="_blank"
              className={styles.contentLink}
              href="https://trustless.computer/"
            >
              Trustless Computer
            </a>{' '}
            protocol. Trustless Computer lets developers write smart contracts
            on Bitcoin. Now you can build dapps on Bitcoin.
          </Text>
        </GridItem>
        <GridItem>
          <img
            src={`${CDN_URL}/pages/gm/gm-img-2_3.png`}
            alt="trustless.maket"
          />
        </GridItem>
      </SimpleGrid>
    </BodyContainer>
  )
}

export default IdoDescription;