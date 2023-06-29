/* eslint-disable react/display-name */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/no-children-prop */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {transactionType} from '@/components/Swap/alertInfoProcessing/types';
import FiledButton from '@/components/Swap/button/filedButton';
import WrapperConnected from '@/components/WrapperConnected';
import {IPoolV2AddPair} from '@/pages/pools/v2/add/[[...id]]';
import {Box, Divider, Flex, Text} from '@chakra-ui/react';
import React, {forwardRef, useEffect, useImperativeHandle, useState,} from 'react';
import {useForm, useFormState} from 'react-final-form';
import s from './styles.module.scss';
import RemoveHeader from "@/modules/PoolsV2/Remove/Remove.Header";
import {IPosition} from "@/interfaces/position";
import RemoveAmount from "@/modules/PoolsV2/Remove/Remove.Amount";
import useGetEarnedFee from "@/hooks/contract-operations/pools/v3/useGetEarnedFee";
import Card from '@/components/Swap/card';
import HorizontalItem from "@/components/Swap/horizontalItem";
import {colors} from "@/theme/colors";
import {getTokenIconUrl} from "@/utils";
import {getAmountsForLiquidity} from "@/utils/utilities";
import {getSqrtRatioAtTick} from "@/utils/number";
import {ethers} from "ethers";

interface IFormRemovePoolsV2Container extends IPoolV2AddPair {
  handleSubmit: (_: any) => void;
  submitting?: boolean;
  positionDetail?: IPosition
}

const FormRemovePoolsV2Container = forwardRef<any, IFormRemovePoolsV2Container>(
  (props, ref) => {
    const { handleSubmit, ids, submitting, positionDetail } = props;
    const { call: getEarnedFee } = useGetEarnedFee();
    const [earnedFees, setEarnedFees] = useState([0, 0]);
    const [pooledAmount, setPooledAmount] = useState(["0", "0"]);
    const token0Obj = positionDetail?.pair?.token0Obj;
    const token1Obj = positionDetail?.pair?.token1Obj;
    const { values } = useFormState();

    const isDisabled = values?.percent <= 0;

    console.log('values', values);
    console.log('positionDetail', positionDetail);
    console.log('=====')

    const { restart, change } = useForm();

    useImperativeHandle(ref, () => {
      return {
        reset: () =>
          restart(),
      };
    });

    useEffect(() => {
      if(positionDetail?.tokenId) {
        getEarnedFeeInfo();
        getPooledAmount();
      }
    }, [JSON.stringify(positionDetail)]);

    const getEarnedFeeInfo = async () => {
      const res = await getEarnedFee({tokenId: positionDetail?.tokenId});
      setEarnedFees(res);
    }

    const getPooledAmount = async () => {
      const currentSqrtRatioX96 = getSqrtRatioAtTick(positionDetail?.pair?.tick || 0);
      const lowerSqrtRatioX96 = getSqrtRatioAtTick(positionDetail?.tickLower || 0);
      const upperSqrtRatioX96 = getSqrtRatioAtTick(positionDetail?.tickUpper || 0);

      const res = getAmountsForLiquidity(
        currentSqrtRatioX96,
        lowerSqrtRatioX96,
        upperSqrtRatioX96,
        ethers.utils.parseEther(positionDetail?.liquidity || "0")
      );

      setPooledAmount([ethers.utils.formatEther(res[0]), ethers.utils.formatEther(res[1])]);
    }

    return (
      <form onSubmit={handleSubmit}>
        <RemoveHeader />
        <Box className={s.container__content_body}>
          <Flex direction={"column"} gap={12} className={s.formContainer}>
            <Card bgColor={"rgb(19, 26, 42)"} p={6} border={"1px solid rgb(41, 50, 73)"}>
              <RemoveAmount />
            </Card>
            <Card bgColor={"rgb(19, 26, 42)"} p={6} border={"1px solid rgb(41, 50, 73)"} className={s.resultContainer}>
              <Flex direction={"column"} gap={1}>
                <HorizontalItem
                  label={<Text color={"#FFFFFF"} fontSize={"md"} fontWeight={"medium"}>Pooled {token0Obj?.symbol}:</Text>}
                  value={
                    <Flex gap={1} color={"#FFFFFF"} fontSize={"md"} fontWeight={"medium"}>
                      {pooledAmount[0]}
                      <img
                        src={getTokenIconUrl(token0Obj)}
                        alt={token0Obj?.thumbnail || 'default-icon'}
                        className={'avatar'}
                      />
                    </Flex>
                  }
                />
                <HorizontalItem
                  label={<Text color={"#FFFFFF"} fontSize={"md"} fontWeight={"medium"}>Pooled {positionDetail?.pair?.token1Obj?.symbol}:</Text>}
                  value={
                    <Flex gap={1} color={"#FFFFFF"} fontSize={"md"} fontWeight={"medium"}>
                      {pooledAmount[1]}
                      <img
                        src={getTokenIconUrl(token1Obj)}
                        alt={token1Obj?.thumbnail || 'default-icon'}
                        className={'avatar'}
                      />
                    </Flex>
                  }
                />
                <Divider borderColor={colors.white500} my={2}/>
                <HorizontalItem
                  label={<Text color={"#FFFFFF"} fontSize={"md"} fontWeight={"medium"}>{token0Obj?.symbol} Fees Earned:</Text>}
                  value={
                    <Flex gap={1} color={"#FFFFFF"} fontSize={"md"} fontWeight={"medium"}>
                      {earnedFees[0]}
                      <img
                        src={getTokenIconUrl(token0Obj)}
                        alt={token0Obj?.thumbnail || 'default-icon'}
                        className={'avatar'}
                      />
                    </Flex>
                  }
                />
                <HorizontalItem
                  label={<Text color={"#FFFFFF"} fontSize={"md"} fontWeight={"medium"}>{token1Obj?.symbol} Fees Earned:</Text>}
                  value={
                    <Flex gap={1} color={"#FFFFFF"} fontSize={"md"} fontWeight={"medium"}>
                      {earnedFees[1]}
                      <img
                        src={getTokenIconUrl(token1Obj)}
                        alt={token1Obj?.thumbnail || 'default-icon'}
                        className={'avatar'}
                      />
                    </Flex>
                  }
                />
              </Flex>
            </Card>

            <WrapperConnected>
              <FiledButton
                isDisabled={submitting || isDisabled}
                isLoading={submitting}
                type="submit"
                btnSize="h"
                processInfo={{
                  id: transactionType.removeLiquidity,
                }}
                containerConfig={{
                  w: '100%'
                }}
              >
                {values?.percent <= 0 ? 'Enter a percent' : 'Remove'}
              </FiledButton>
            </WrapperConnected>
          </Flex>
        </Box>
      </form>
    );
  },
);

export default FormRemovePoolsV2Container;
