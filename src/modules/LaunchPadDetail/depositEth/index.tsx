/* eslint-disable @typescript-eslint/no-explicit-any */
import {Box, Center, Flex, Input, InputGroup, InputRightElement, Text} from "@chakra-ui/react";
import FiledButton from "@/components/Swap/button/filedButton";
import {QRCodeSVG} from "qrcode.react";
import React from "react";
import styles from './styles.module.scss';
import {FiCopy} from 'react-icons/fi';
import px2rem from "@/utils/px2rem";
import CopyToClipboard from "react-copy-to-clipboard";
import {toast} from "react-hot-toast";
import {useAppSelector} from "@/state/hooks";
import {selectPnftExchange} from "@/state/pnftExchange";

const DepositEth = (props: any) => {
    const {address, onClose,network} = props;
    const configs = useAppSelector(selectPnftExchange).configs;

    return (
        <Box className={styles.wrapper}>
            <Text
                fontSize={px2rem(16)}
                fontWeight={400}
                color={"#1C1C1C"}
                opacity={0.7}
            >
                Here is your unique {network} address. You can send your {network} to this address from your Metamask or your Exchanges.
            </Text>
            <Flex justifyContent={"center"} mt={10} mb={10}>
                <QRCodeSVG width={175} height={175} value={address} />
            </Flex>
            <Text
                fontSize={px2rem(16)}
                fontWeight={500}
            >Address {network}</Text>
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
            <Text
                fontSize={px2rem(16)}
                fontWeight={500}
                mt={2}
            >Fee: {network=="ethereum"?configs?.lpEthFee.toString()+" ETH":configs?.lpBtcFee.toString()+" BTC"}</Text>
            <FiledButton
                btnSize={'h'}
                onClick={onClose}
                mt={6}
            >
                DONE
            </FiledButton>
        </Box>
    );
};

export default DepositEth;