/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-empty-function */
import {Box, Flex, Progress, SimpleGrid, Text} from "@chakra-ui/react";
import {compareString, formatCurrency, shortenAddress} from "@/utils";
import Jazzicon, {jsNumberForAddress} from 'react-jazzicon';
import React, {useMemo} from "react";
import {useWindowSize} from "@trustless-computer/dapp-core";
import InfoTooltip from "@/components/Swap/infoTooltip";
import HorizontalItem from "@/components/Swap/horizontalItem";
import {TC_EXPLORER} from "@/configs";
import {useWeb3React} from "@web3-react/core";
import Slider from "react-slick";
import styles from './styles.module.scss';
import {chunk} from "lodash";
import {HiArrowLeft, HiArrowRight} from "react-icons/hi";

const ProposalResult = ({title, totalVote, className, data}: any) => {
  const {mobileScreen, tabletScreen} = useWindowSize();
  const {account} = useWeb3React();
  const perPage = 20;

  const numSlide = useMemo(() => {
    return Math.floor((data?.voters?.length || 0) / perPage) + 1;
  }, [JSON.stringify(data)]);

  const pageData = useMemo(() => {
    const res = (data?.voters || []).concat([...Array((perPage * numSlide) - (data?.voters?.length || 0))].map(function () {
    }));
    return chunk(res, perPage);
  }, [JSON.stringify(data), numSlide]);

  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />
  };

  function SampleNextArrow(props: any) {
    const { className, style, onClick } = props;
    return (
      <Box
        className={className}
        style={{ ...style }}
        onClick={onClick}
      >
        <HiArrowRight fontSize={'30px'} color={"#FFFFFF"}/>
      </Box>
    );
  }

  function SamplePrevArrow(props: any) {
    const { className, style, onClick } = props;
    return (
      <Box
        className={className}
        style={{ ...style }}
        onClick={onClick}
      >
        <HiArrowLeft fontSize={'30px'} color={"#FFFFFF"}/>
      </Box>
    );
  }

  return (
    <Box className={className}>
      <Flex justifyContent={"space-between"}>
        <Text className={"side-title"}>{title}</Text>
        <Text className={"side-total"} color={"#FFFFFF"}>No. of Supporters: {formatCurrency(data?.totalVoter, 0)}</Text>
        <Text className={"side-total"} color={"#FFFFFF"}>No. of TM
          Supported: {formatCurrency(data?.totalAmount, 0)} / {totalVote}</Text>
      </Flex>
      <Progress
        max={100}
        value={(Number(data?.totalAmount) / totalVote) * 100}
        h="20px"
        className={"progress-bar"}
        mt={4}
      />
      <Slider {...settings} className={styles.listVote}>
        {
          pageData?.map((d: any, i: number) => {
            return (
              <Box key={i}>
                <SimpleGrid spacingY={4} columns={perPage / 2} w={"100%"}>
                  {
                    d?.map((d: any, index: number) => {
                      return d ? (
                        <InfoTooltip label={<Box>
                          <HorizontalItem
                            label={<Text color={"rgba(255, 255, 255, 0.7)"}>Address</Text>}
                            value={<Text color={"#FFFFFF"}>{shortenAddress(d.voter, 4, 4)}</Text>}
                          />
                          <HorizontalItem
                            label={<Text color={"rgba(255, 255, 255, 0.7)"}>Amount</Text>}
                            value={<Text color={"#FFFFFF"}>{formatCurrency(d.amount)} {'TM'}</Text>}
                          />
                        </Box>
                        }
                                     key={d.voter}
                        >
                          <Box key={d.voter} paddingX={4}>
                            <a
                              title="explorer"
                              href={`${TC_EXPLORER}/address/${d.voter}`}
                              target="_blank"
                              style={{textDecoration: 'underline'}}
                            >
                              <Jazzicon
                                diameter={mobileScreen || tabletScreen ? 40 : 60}
                                seed={jsNumberForAddress(d.voter)}
                              />
                            </a>
                            {compareString(account, d.voter) &&
                                <Text color={"rgba(255, 255, 255, 0.7)"} textAlign={"center"} mt={-2}>You</Text>}
                          </Box>
                        </InfoTooltip>
                      ) : (
                        <Box
                          key={index}
                          width={`${mobileScreen || tabletScreen ? 40 : 60}px`}
                          height={`${mobileScreen || tabletScreen ? 40 : 60}px`}
                          borderRadius={"50%"}
                          backgroundColor={"#1E1E22"}
                          marginX={4}
                        >
                        </Box>
                      )
                    })
                  }
                </SimpleGrid>
              </Box>
            )
          })
        }
      </Slider>
    </Box>
  );
}

export default ProposalResult;