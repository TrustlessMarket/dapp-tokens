/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import HorizontalItem from '@/components/HorizontalItem';
import FiledButton from '@/components/Swap/button/filedButton';
import ListTable from '@/components/Swap/listTable';
import { ROUTE_PATH } from '@/constants/route-path';
import { LIQUID_PAIRS } from '@/constants/storage-key';
import useGetReserves from '@/hooks/contract-operations/swap/useReserves';
import useSupplyERC20Liquid from '@/hooks/contract-operations/token/useSupplyERC20Liquid';
import { IToken } from '@/interfaces/token';
import { camelCaseKeys, formatCurrency } from '@/utils';
import { formatAmountBigNumber } from '@/utils/format';
import px2rem from '@/utils/px2rem';
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Flex,
  Heading,
  Icon,
  IconButton,
} from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';
import { IoArrowBackOutline } from 'react-icons/io5';
import { StyledTokens, UploadFileContainer } from './Pools.styled';
import CreateMarket from './form';
import styles from './styles.module.scss';

export enum ScreenType {
  default = 'default',
  add = 'add',
  remove = 'remove',
}

const ItemLiquid = ({ pool }: { pool: IToken }) => {
  const { call: getSupply } = useSupplyERC20Liquid();
  const { call: getReserves } = useGetReserves();
  const [result, setResult] = useState<any>({});
  const router = useRouter();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await Promise.all([
        getSupply({
          liquidAddress: pool.address,
        }),
        getReserves({
          address: pool.address,
        }),
      ]);
      setResult({ ...response[0], ...response[1] });
    } catch (error) {}
  };

  return (
    <Accordion allowMultiple allowToggle>
      <AccordionItem>
        <h2>
          <AccordionButton>
            <Box as="span" flex="1" textAlign="left">
              {pool.name}
            </Box>
            <AccordionIcon />
          </AccordionButton>
        </h2>
        <AccordionPanel>
          <HorizontalItem
            label="Your pool total tokens:"
            value={pool.ownerSupply.toString()}
          />
          <HorizontalItem
            label={`Pooled ${pool.name.split('-')[0]}:`}
            value={formatCurrency(
              formatAmountBigNumber(pool.fromBalance, pool.decimal),
            ).toString()}
          />
          <HorizontalItem
            label={`Pooled ${pool.name.split('-')[1]}:`}
            value={formatCurrency(
              formatAmountBigNumber(pool.toBalance, pool.decimal),
            ).toString()}
          />
          <HorizontalItem
            label="Your pool share:"
            value={`${formatCurrency(
              new BigNumber(pool.ownerSupply)
                .dividedBy(pool.totalSupply)
                .multipliedBy(100)
                .toString(),
              2,
            ).toString()}%`}
          />
          <Flex gap={4} mt={4} justifyContent={'center'}>
            <FiledButton
              style={{
                backgroundColor: 'gray',
              }}
              btnSize="l"
              onClick={() =>
                router.replace(
                  `${ROUTE_PATH.POOLS}?type=${ScreenType.add}&f=${pool.fromAddress}&t=${pool.toAddress}`,
                )
              }
            >
              Add
            </FiledButton>
            {/* <FiledButton
              btnSize="l"
              style={{
                backgroundColor: 'red',
              }}
              onClick={() =>
                router.replace(
                  `${ROUTE_PATH.POOLS}?type=${ScreenType.remove}&f=${pool.fromAddress}&t=${pool.toAddress}`,
                )
              }
            >
              Remove
            </FiledButton> */}
          </Flex>
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
};

const LiquidityContainer = () => {
  const [data, setData] = useState([]);
  // const [isCreate, setIsCreate] = useState(true);

  const router = useRouter();
  const routerQuery = router.query;

  useEffect(() => {
    renderScreen();
  }, [routerQuery]);

  const renderScreen = () => {
    switch (routerQuery.type) {
      case ScreenType.add:
      case ScreenType.remove:
        return (
          <>
            <Flex
              direction={'column'}
              justifyContent={'center'}
              alignItems={'center'}
              position={'relative'}
            >
              <IconButton
                position={'absolute'}
                left={0}
                top={'6px'}
                size={'sm'}
                borderColor={'#FFFFFF'}
                borderWidth={1}
                colorScheme="whiteAlpha"
                isRound
                variant="outline"
                icon={<Icon as={IoArrowBackOutline} color={'#FFFFFF'} />}
                onClick={() =>
                  router.replace(`${ROUTE_PATH.POOLS}?type=${ScreenType.default}`)
                }
                aria-label={''}
              />
              <Heading as={'h6'}>Create Pool</Heading>
            </Flex>
            <UploadFileContainer>
              <div className="upload_left">
                <Box className={styles.wrapper}>
                  <Box>
                    <CreateMarket
                      type={routerQuery.type}
                      fromAddress={routerQuery?.f}
                      toAddress={routerQuery?.t}
                    />
                  </Box>
                </Box>
              </div>
            </UploadFileContainer>
          </>
        );

      default:
        return (
          <>
            <Flex
              gap={4}
              alignItems={'center'}
              justifyContent={'space-between'}
              // maxW={['auto', '70%']}
              marginX={'auto'}
              direction={['column', 'row']}
            >
              <Heading as={'h6'}>Pools</Heading>
              <Flex gap={4}>
                <FiledButton
                  style={{ background: 'orange' }}
                  // onClick={() => handleChooseAction(true)}
                  fontSize={`${px2rem(16)} !important`}
                  onClick={() =>
                    router.replace(`${ROUTE_PATH.POOLS}?type=${ScreenType.add}`)
                  }
                >
                  Create Pool
                </FiledButton>
              </Flex>
            </Flex>

            <UploadFileContainer>
              <div className="upload_left">
                <Box className={styles.wrapper}>
                  <ListTable
                    data={data}
                    columns={columns}
                    noHeader
                    emptyLabel="No pool found."
                  />
                </Box>
              </div>
            </UploadFileContainer>
          </>
        );
    }
  };

  const columns = useMemo(() => {
    return [
      {
        id: 'rank',
        label: '',
        // labelConfig: {
        //   fontSize: '14px',
        //   fontWeight: '500',
        //   color: '#B1B5C3',
        // },
        config: {
          borderBottomWidth: '0',
        },
        render(row: IToken) {
          return <ItemLiquid pool={row} />;
        },
      },
    ];
  }, []);

  useEffect(() => {
    fetchLiquid();
  }, []);

  const fetchLiquid = async () => {
    try {
      let pairLiquid = localStorage.getItem(LIQUID_PAIRS);

      if (pairLiquid) {
        pairLiquid = JSON.parse(pairLiquid) || [];
        setData(camelCaseKeys(pairLiquid));
      }
    } catch (error) {}
  };

  return (
    <StyledTokens>
      <div className="background"></div>
      {renderScreen()}
    </StyledTokens>
  );
};

export default LiquidityContainer;
