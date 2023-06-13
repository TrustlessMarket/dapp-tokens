import {Box, Center, Flex, Input, InputGroup, InputRightElement, Text} from "@chakra-ui/react";
import FiledButton from "@/components/Swap/button/filedButton";
import {QRCodeSVG} from "qrcode.react";
import React from "react";
import styles from './styles.module.scss';
import {FiCopy} from 'react-icons/fi';
import px2rem from "@/utils/px2rem";
import CopyToClipboard from "react-copy-to-clipboard";
import {toast} from "react-hot-toast";

const DepositEth = (props: any) => {
  const {address, onClose} = props;
  return (
    <Box className={styles.wrapper}>
      <Text
        fontSize={px2rem(16)}
        fontWeight={400}
        color={"#1C1C1C"}
        opacity={0.7}
      >Here is your unique Ethereum address. You can send your ETH to this address from your Metamask or your Exchange.</Text>
      <Flex justifyContent={"center"} mt={10} mb={10}>
        <QRCodeSVG width={175} height={175} value={address} />
      </Flex>
      <Text
        fontSize={px2rem(16)}
        fontWeight={500}
      >Address (ERC20)</Text>
      <InputGroup size="sm" mt={1}>
        <Input
          value={address}
          fontSize={px2rem(16)}
          fontWeight={500}
          disabled
        />
        <InputRightElement
          mr={4}
          height="100%"
        >
          <CopyToClipboard
            onCopy={() => toast.success('Copied address!')}
            text={address}
          >
            <Center
              minW={px2rem(40)}
              minH={px2rem(40)}
              bgColor={"#F7F7FA"}
              borderRadius={"8px"}
              cursor={"pointer"}
            >
              <FiCopy />
            </Center>
          </CopyToClipboard>
        </InputRightElement>
      </InputGroup>
      <FiledButton
        btnSize={'h'}
        onClick={onClose}
        mt={8}
      >
        DONE
      </FiledButton>
    </Box>
  );
};

export default DepositEth;