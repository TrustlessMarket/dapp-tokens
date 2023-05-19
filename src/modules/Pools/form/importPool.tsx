/* eslint-disable @typescript-eslint/no-explicit-any */
import FiledButton from '@/components/Swap/button/filedButton';
import FilterButton from '@/components/Swap/filterToken';
import {ROUTE_PATH} from '@/constants/route-path';
import {IMPORTED_TOKENS, LIQUID_PAIRS} from '@/constants/storage-key';
import {NULL_ADDRESS} from '@/constants/url';
import useGetPair from '@/hooks/contract-operations/swap/useGetPair';
import useGetReserves from '@/hooks/contract-operations/swap/useReserves';
import useInfoERC20Token, {IInfoERC20TokenResponse,} from '@/hooks/contract-operations/token/useInfoERC20Token';
import useSupplyERC20Liquid from '@/hooks/contract-operations/token/useSupplyERC20Liquid';
import {IToken} from '@/interfaces/token';
import {getTokens} from '@/services/token-explorer';
import {camelCaseKeys, compareString, formatCurrency, sortAddressPair,} from '@/utils';
import {isDevelop} from '@/utils/commons';
import {Box, Center, Flex, Stat, StatHelpText, StatNumber, Text} from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import cx from 'classnames';
import {useRouter} from 'next/router';
import React, {useEffect, useRef, useState} from 'react';
import {Form, useForm} from 'react-final-form';
import {toast} from 'react-hot-toast';
import {BsPlus} from 'react-icons/bs';
import Web3 from 'web3';
import {ScreenType} from '..';
import styles from './styles.module.scss';

interface MakeFormImportPoolProps {
  onSubmit: (_: any) => void;
  submitting: boolean;
}

const MakeFormImportPool: React.FC<MakeFormImportPoolProps> = ({
  onSubmit,
  submitting,
}) => {
  const [tokensList, setTokensList] = useState<IToken[]>([]);
  const router = useRouter();
  const refTokensList = useRef<IToken[]>([]);
  const [pairAddress, setPairAddress] = useState(NULL_ADDRESS);
  const [percentPool, setPercentPool] = useState('0');
  const [perPrice, setPerPrice] = useState<{
    _reserve0: string;
    _reserve1: string;
  }>({
    _reserve0: '-',
    _reserve1: '-',
  });

  const [baseToken, setBaseToken] = useState<IToken>();
  const [quoteToken, setQuoteToken] = useState<IToken>();

  const { call: infoToken } = useInfoERC20Token();
  const { call: getPair } = useGetPair();
  const { call: getReserves } = useGetReserves();
  const { call: getSupply } = useSupplyERC20Liquid();

  const { change } = useForm();

  const fromAddress = router?.query?.f;
  const toAddress = router?.query?.t;

  const isPaired = !compareString(pairAddress, NULL_ADDRESS);

  useEffect(() => {
    fetchTokens();
  }, []);

  useEffect(() => {
    handleSelectBaseToken;
  }, [router?.query?.f]);

  useEffect(() => {
    if (fromAddress && refTokensList.current.length > 0) {
      const findFromToken = refTokensList.current.find((v) =>
        compareString(v.address, fromAddress),
      );

      if (findFromToken) {
        handleSelectBaseToken(findFromToken);
      }
    }
  }, [fromAddress, tokensList.length]);

  useEffect(() => {
    if (toAddress && refTokensList.current.length > 0) {
      const findFromToken = refTokensList.current.find((v) =>
        compareString(v.address, toAddress),
      );

      if (findFromToken) {
        handleSelectQuoteToken(findFromToken);
      }
    }
  }, [toAddress, tokensList.length]);

  useEffect(() => {
    checkPair();
  }, [baseToken, quoteToken]);

  const checkPair = async () => {
    if (!baseToken?.address || !quoteToken?.address) {
      return;
    }

    try {
      const response = await getPair({
        tokenA: baseToken,
        tokenB: quoteToken,
      });

      if (!compareString(response, NULL_ADDRESS)) {
        const [resReserve, resSupply] = await Promise.all([
          getReserves({
            address: response,
          }),
          getSupply({
            liquidAddress: response,
          }),
        ]);

        if (Number(resSupply.totalSupply) !== 0) {
          setPercentPool(
            new BigNumber(resSupply.ownerSupply)
              .dividedBy(resSupply.totalSupply)
              .multipliedBy(100)
              .toString(),
          );
        }

        setPerPrice(resReserve);
      } else {
        setPerPrice({
          _reserve0: '-',
          _reserve1: '-',
        });
      }

      setPairAddress(response);
    } catch (error) {}
  };

  const getImportTokens = () => {
    const checkExistKey = localStorage.getItem(IMPORTED_TOKENS);
    let currentImportedTokens: IToken[] = [];
    if (checkExistKey) {
      currentImportedTokens = JSON.parse(checkExistKey) || [];
    }
    return currentImportedTokens;
  };

  const updateImportTokens = (_item: IToken) => {
    const currentImportedTokens: IToken[] = getImportTokens();
    currentImportedTokens.push(_item);
    localStorage.setItem(IMPORTED_TOKENS, JSON.stringify(currentImportedTokens));
  };

  const updateTokenList = (_item: IToken) => {
    const findExist = refTokensList.current.findIndex((v) =>
      compareString(v.address, _item.address),
    );

    if (findExist < 0) {
      updateImportTokens(_item);
      refTokensList.current = [_item, ...refTokensList.current];
      setTokensList(refTokensList.current);
    }
  };

  const fetchTokens = async (page = 1, _isFetchMore = false) => {
    try {
      const res = await getTokens({
        limit: 500,
        page: page,
        is_test: isDevelop() ? '1' : '',
      });
      let _list: IToken[] = camelCaseKeys(res);
      const _getImportTokens = getImportTokens();
      _list = _getImportTokens.concat(_list);
      refTokensList.current = _list;
      setTokensList(_list);
    } catch (err: unknown) {
      console.log('Failed to fetch tokens owned');
    } finally {
    }
  };

  const onExtraSearch = async (txtSearch: any) => {
    try {
      const response: IInfoERC20TokenResponse = await infoToken({
        erc20TokenAddress: txtSearch,
      });

      const _item: IToken = {
        id: response.address,
        address: response.address,
        name: response.name,
        symbol: response.symbol,
        decimal: response.decimals,
      };

      updateTokenList(_item);

      return [
        {
          ..._item,
          code: response.symbol,
          extra_item: _item,
        },
      ];
    } catch (error) {
      console.log('error', error);
      return [];
    }
  };

  const handleSelectBaseToken = async (token: IToken) => {
    setBaseToken(token);
    change('baseToken', token);
    // try {
    //   const [_isApprove, _tokenBalance] = await Promise.all([
    //     checkTokenApprove(token),
    //     getTokenBalance(token),
    //   ]);
    //   setIsApproveAmountBaseToken(_isApprove);
    //   if (isScreenAdd) {
    //     setBaseBalance(_tokenBalance);
    //   }
    // } catch (error) {
    //   throw error;
    // }
  };

  const handleSelectQuoteToken = async (token: IToken) => {
    setQuoteToken(token);
    change('quoteToken', token);
    // try {
    //   const [_isApprove, _tokenBalance] = await Promise.all([
    //     checkTokenApprove(token),
    //     getTokenBalance(token),
    //   ]);

    //   setIsApproveAmountQuoteToken(_isApprove);
    //   if (isScreenAdd) {
    //     setQuoteBalance(_tokenBalance);
    //   }
    // } catch (error) {
    //   throw error;
    // }
  };

  const renderPricePool = () => {
    if (!baseToken || !quoteToken) {
      return;
    }
    const [token1, token2] = sortAddressPair(baseToken, quoteToken);

    const pair1 = new BigNumber(Web3.utils.fromWei(perPrice._reserve0))
      .dividedBy(Web3.utils.fromWei(perPrice._reserve1))
      .toFixed(18);

    const pair2 = new BigNumber(Web3.utils.fromWei(perPrice._reserve1, 'ether'))
      .dividedBy(Web3.utils.fromWei(perPrice._reserve0, 'ether'))
      .toFixed(18);

    return (
      <Flex gap={4} flexWrap={'wrap'} className="price-pool-content">
        <Box>
          <Stat>
            <StatNumber>
              {!isPaired
                ? '-'
                : formatCurrency(pair1, Number(pair1) > 1000000 ? 4 : 18)}
            </StatNumber>
            <StatHelpText>{`${token1.symbol} per ${token2.symbol}`}</StatHelpText>
          </Stat>
        </Box>
        <Box>
          <Stat>
            <StatNumber>
              {!isPaired
                ? '-'
                : formatCurrency(pair2, Number(pair2) > 1000000 ? 4 : 18)}
            </StatNumber>
            <StatHelpText>{`${token2.symbol} per ${token1.symbol}`}</StatHelpText>
          </Stat>
        </Box>
        <Box>
          <Stat>
            <StatNumber>{formatCurrency(percentPool)}%</StatNumber>
            <StatHelpText>Share of Pool</StatHelpText>
          </Stat>
        </Box>
      </Flex>
    );
  };

  const renderInfoPair = () => {
    if (isPaired) {
      return (
        <Box className={styles.pricePoolContainer}>
          <Text style={{ textAlign: 'center' }}>Initial prices and pool share</Text>
          {renderPricePool()}
        </Box>
      );
    }

    return (
      <Box>
        <Text>You don’t have liquidity in this pool yet.</Text>
        <a
          onClick={() =>
            router.replace(
              `${ROUTE_PATH.POOLS}?type=${ScreenType.add_liquid}&f=${fromAddress}&t=${toAddress}`,
            )
          }
        >
          Add liquidity.
        </a>
      </Box>
    );
  };

  return (
    <form onSubmit={onSubmit}>
      <Flex
        direction={"column"}
        gap={6}
      >
        <FilterButton
          data={tokensList}
          commonData={tokensList.slice(0, 3)}
          handleSelectItem={(_token: IToken) =>
            router.replace(
              `${ROUTE_PATH.POOLS}?type=${router?.query?.type}&f=${_token.address}&t=${router?.query?.t}`,
            )
          }
          parentClose={close}
          value={baseToken}
          onExtraSearch={onExtraSearch}
        />
        <Flex gap={2} justifyContent={"center"}>
          <Center
            w={'28px'}
            h={'28px'}
            minW={"28px"}
            minH={"28px"}
            borderRadius={'50%'}
            bgColor={"rgba(255, 255, 255, 0.1)"}
          >
            <BsPlus fontWeight={'bold'} fontSize={'14px'}/>
          </Center>
        </Flex>
        {/*<Box
          className="btn-transfer"
          p={2}
          border={'1px solid #3385FF'}
          borderRadius={'8px'}
        >
          <BsPlus color="#3385FF" />
        </Box>*/}
        <FilterButton
          data={tokensList}
          commonData={tokensList.slice(0, 3)}
          handleSelectItem={(_token: IToken) =>
            router.replace(
              `${ROUTE_PATH.POOLS}?type=${router?.query?.type}&f=${router?.query?.f}&t=${_token.address}`,
            )
          }
          parentClose={close}
          value={quoteToken}
          onExtraSearch={onExtraSearch}
        />
      </Flex>
      {baseToken && quoteToken && (
        <Box className="box-info-pair">{renderInfoPair()}</Box>
      )}
      {isPaired && (
        <FiledButton
          isDisabled={submitting}
          isLoading={submitting}
          type="submit"
          // borderRadius={'100px !important'}
          // className="btn-submit"
          btnSize={'h'}
          containerConfig={{ flex: 1 }}
          loadingText={submitting ? 'Processing' : ' '}
          style={{ backgroundColor: '#3385FF' }}
        >
          Import pool
        </FiledButton>
      )}
    </form>
  );
};

const ImportPool = () => {
  const { call: getPair } = useGetPair();
  const { call: getReserves } = useGetReserves();
  const { call: getSupply } = useSupplyERC20Liquid();
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (values: any) => {
    const { baseToken, quoteToken } = values;
    try {
      setSubmitting(true);
      const response = await getPair({
        tokenA: baseToken,
        tokenB: quoteToken,
      });
      const [resReserve, resSupply] = await Promise.all([
        getReserves({
          address: response,
        }),
        getSupply({
          liquidAddress: response,
        }),
      ]);

      const _pairs = localStorage.getItem(LIQUID_PAIRS);
      let __pairs: IToken[] = [];

      if (_pairs) {
        __pairs = JSON.parse(_pairs) || ([] as IToken[]);
      }
      const findIndex = __pairs.findIndex((v: IToken) =>
        compareString(v.address, response),
      );
      const extraInfo = {
        name: `${baseToken.symbol}-${quoteToken.symbol}`,
        symbol: `${baseToken.symbol}-${quoteToken.symbol}`,
        address: response,
        total_supply: resSupply.totalSupply,
        owner_supply: resSupply.ownerSupply,
        from_address: baseToken.address,
        from_balance: resReserve._reserve0,
        to_address: quoteToken.address,
        to_balance: resReserve._reserve1,
      };
      if (findIndex > -1) {
        __pairs[findIndex] = {
          ...__pairs[findIndex],
          ...extraInfo,
        };
      } else {
        __pairs.push({
          ...baseToken,
          ...extraInfo,
        });
      }
      localStorage.setItem(LIQUID_PAIRS, JSON.stringify(__pairs));
      toast.success('This pool added successfully.');
      router.replace(`${ROUTE_PATH.POOLS}?type=${ScreenType.default}`);
    } catch (error) {
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box className={cx(styles.container, styles.importPoolContainer)}>
      <Form onSubmit={handleSubmit} initialValues={{}}>
        {({ handleSubmit }) => (
          <MakeFormImportPool onSubmit={handleSubmit} submitting={submitting} />
        )}
      </Form>
    </Box>
  );
};

export default ImportPool;
