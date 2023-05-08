/* eslint-disable react/no-children-prop */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { transactionType } from '@/components/Swap/alertInfoProcessing/types';
import FiledButton from '@/components/Swap/button/filedButton';
import FilterButton from '@/components/Swap/filterToken';
import FieldAmount from '@/components/Swap/form/fieldAmount';
import InputWrapper from '@/components/Swap/form/inputWrapper';
import WrapperConnected from '@/components/WrapperConnected';
import { UNIV2_ROUTER_ADDRESS } from '@/configs';
import {
  BRIDGE_SUPPORT_TOKEN,
  TRUSTLESS_BRIDGE,
  TRUSTLESS_FAUCET,
} from '@/constants/common';
import { getMessageError } from '@/constants/error';
import { ROUTE_PATH } from '@/constants/route-path';
import { IMPORTED_TOKENS, LIQUID_PAIRS } from '@/constants/storage-key';
import { NULL_ADDRESS } from '@/constants/url';
import { AssetsContext } from '@/contexts/assets-context';
import pairsMock from '@/dataMock/tokens.json';
import useAddLiquidity, {
  IAddLiquidityParams,
} from '@/hooks/contract-operations/pools/useAddLiquidity';
import useRemoveLiquidity, {
  IRemoveLiquidParams,
} from '@/hooks/contract-operations/pools/useRemoveLiquidity';
import useGetPair from '@/hooks/contract-operations/swap/useGetPair';
import useGetReserves from '@/hooks/contract-operations/swap/useReserves';
import useApproveERC20Token from '@/hooks/contract-operations/token/useApproveERC20Token';
import useBalanceERC20Token from '@/hooks/contract-operations/token/useBalanceERC20Token';
import useInfoERC20Token, {
  IInfoERC20TokenResponse,
} from '@/hooks/contract-operations/token/useInfoERC20Token';
import useIsApproveERC20Token from '@/hooks/contract-operations/token/useIsApproveERC20Token';
import useSupplyERC20Liquid from '@/hooks/contract-operations/token/useSupplyERC20Liquid';
import useContractOperation from '@/hooks/contract-operations/useContractOperation';
import { IToken } from '@/interfaces/token';
import { TransactionStatus } from '@/interfaces/walletTransaction';
import { logErrorToServer } from '@/services/swap';
import { getTokens } from '@/services/token-explorer';
import { useAppDispatch, useAppSelector } from '@/state/hooks';
import {
  requestReload,
  requestReloadRealtime,
  selectPnftExchange,
  updateCurrentTransaction,
} from '@/state/pnftExchange';
import { getIsAuthenticatedSelector } from '@/state/user/selector';
import {
  camelCaseKeys,
  compareString,
  formatCurrency,
  sortAddressPair,
} from '@/utils';
import { isDevelop } from '@/utils/commons';
import { composeValidators, requiredAmount } from '@/utils/formValidate';
import { formatAmountBigNumber } from '@/utils/format';
import px2rem from '@/utils/px2rem';
import {
  Box,
  Flex,
  Stat,
  StatHelpText,
  StatNumber,
  Text,
  forwardRef,
} from '@chakra-ui/react';
import { useWeb3React } from '@web3-react/core';
import BigNumber from 'bignumber.js';
import cx from 'classnames';
import { isEmpty } from 'lodash';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import {
  useCallback,
  useContext,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { Field, Form, useForm, useFormState } from 'react-final-form';
import toast from 'react-hot-toast';
import { BsPlus } from 'react-icons/bs';
import { useDispatch, useSelector } from 'react-redux';
import { default as Web3, default as web3 } from 'web3';
import { ScreenType } from '..';
import styles from './styles.module.scss';

const LIMIT_PAGE = 50;

export const MakeFormSwap = forwardRef((props, ref) => {
  const { onSubmit, submitting, fromAddress, toAddress } = props;
  const [loading, setLoading] = useState(false);
  const [baseToken, setBaseToken] = useState<IToken>();
  const [quoteToken, setQuoteToken] = useState<IToken>();
  const [isApproveBaseToken, setIsApproveBaseToken] = useState<boolean>(true);
  const [isApproveQuoteToken, setIsApproveQuoteToken] = useState<boolean>(true);
  const [isApproveAmountBaseToken, setIsApproveAmountBaseToken] =
    useState<string>('0');
  const [isApproveAmountQuoteToken, setIsApproveAmountQuoteToken] =
    useState<string>('0');
  const [isApprovePoolToken, setIsApprovePoolToken] = useState<boolean>(true);
  const [isApproveAmountPoolToken, setIsApproveAmountPoolToken] =
    useState<string>('0');
  const [tokensList, setTokensList] = useState<IToken[]>([]);
  const { call: isApproved } = useIsApproveERC20Token();
  const { call: tokenBalance } = useBalanceERC20Token();
  const { call: infoToken } = useInfoERC20Token();
  const { call: approveToken } = useApproveERC20Token();
  const { call: getPair } = useGetPair();
  const { call: getReserves } = useGetReserves();
  const { call: getSupply } = useSupplyERC20Liquid();
  const [baseBalance, setBaseBalance] = useState('0');
  const [quoteBalance, setQuoteBalance] = useState('0');
  const [pairAddress, setPairAddress] = useState(NULL_ADDRESS);
  const [percentPool, setPercentPool] = useState('0');
  const [perPrice, setPerPrice] = useState<{
    _reserve0: string;
    _reserve1: string;
  }>({
    _reserve0: '-',
    _reserve1: '-',
  });
  const [supply, setSupply] = useState<{
    ownerSupply: string;
    totalSupply: string;
  }>({
    ownerSupply: '0',
    totalSupply: '0',
  });

  const [sliderPercent, setSliderPercent] = useState(0);

  const { juiceBalance } = useContext(AssetsContext);
  const isAuthenticated = useSelector(getIsAuthenticatedSelector);

  const router = useRouter();
  const type = router.query.type;
  const isScreenRemove = compareString(type, ScreenType.remove);

  const isPaired = !compareString(pairAddress, NULL_ADDRESS);
  const needReload = useAppSelector(selectPnftExchange).needReload;

  const refTokensList = useRef<IToken[]>([]);

  const dispatch = useDispatch();
  const { account } = useWeb3React();
  const { values } = useFormState();
  const { change, restart } = useForm();
  const btnDisabled = loading;

  useImperativeHandle(ref, () => {
    return {
      reset: reset,
    };
  });

  const reset = async () => {
    restart({});
  };

  useEffect(() => {
    fetchTokens();
  }, []);

  useEffect(() => {
    checkPair();
  }, [baseToken, quoteToken, needReload]);

  useEffect(() => {
    change('isApproveBaseToken', isApproveBaseToken);
  }, [isApproveBaseToken]);

  useEffect(() => {
    change('isApproveQuoteToken', isApproveQuoteToken);
  }, [isApproveQuoteToken]);

  useEffect(() => {
    change('isApprovePoolToken', isApprovePoolToken);
  }, [isApprovePoolToken]);

  useEffect(() => {
    if (fromAddress && refTokensList.current.length > 0) {
      const findFromToken = refTokensList.current.find((v) =>
        compareString(v.address, fromAddress),
      );

      if (findFromToken) {
        handleSelectBaseToken(findFromToken);
      }
    }
  }, [fromAddress, tokensList.length, needReload]);

  useEffect(() => {
    if (toAddress && refTokensList.current.length > 0) {
      const findFromToken = refTokensList.current.find((v) =>
        compareString(v.address, toAddress),
      );

      if (findFromToken) {
        handleSelectQuoteToken(findFromToken);
      }
    }
  }, [toAddress, tokensList.length, needReload]);

  useEffect(() => {
    if (isScreenRemove) {
      setIsApprovePoolToken(
        checkBalanceIsApprove(
          isApproveAmountPoolToken,
          Web3.utils.toWei(values?.liquidValue || '0', 'ether'),
        ),
      );
    }
  }, [needReload, values?.liquidValue]);

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
        const [resReserve, resSupply, resAmountApprovePool] = await Promise.all([
          getReserves({
            address: response,
          }),
          getSupply({
            liquidAddress: response,
          }),
          checkTokenApprove({
            address: response,
          }),
        ]);

        if (Number(resSupply.totalSupply) !== 0) {
          setPercentPool(
            new BigNumber(resSupply.ownerSupply)
              .dividedBy(resSupply.totalSupply)
              .multipliedBy(100)
              .toString(),
          );
          setSupply(resSupply);
        }

        console.log(
          resSupply?.totalSupply?.toString(),
          formatAmountBigNumber(resReserve._reserve0, baseToken.decimal),
          formatAmountBigNumber(resReserve._reserve1, baseToken.decimal),
        );

        if (isScreenRemove) {
          setBaseBalance(Web3.utils.fromWei(resReserve._reserve0, 'ether'));
          setQuoteBalance(Web3.utils.fromWei(resReserve._reserve1, 'ether'));
          setIsApproveAmountPoolToken(resAmountApprovePool);
        }

        setPerPrice(resReserve);
      } else {
        setPerPrice({
          _reserve0: '-',
          _reserve1: '-',
        });
      }

      setPairAddress(response);
    } catch (error) {
      console.log('error', error);
    }
  };

  const fetchTokens = async (page = 1, _isFetchMore = false) => {
    try {
      setLoading(true);
      const res = await getTokens({
        limit: LIMIT_PAGE * 10,
        page: page,
        is_test: isDevelop() ? '1' : '',
      });
      let _list: IToken[] = [];
      if (isDevelop()) {
        _list = camelCaseKeys(pairsMock);
      } else {
        _list = camelCaseKeys(res);
      }
      const _getImportTokens = getImportTokens();
      _list = _getImportTokens.concat(_list);
      refTokensList.current = _list;
      setTokensList(_list);
    } catch (err: unknown) {
      console.log('Failed to fetch tokens owned');
    } finally {
      setLoading(false);
    }
  };

  const checkTokenApprove = async (token: IToken | any) => {
    try {
      const response = await isApproved({
        erc20TokenAddress: token.address,
        address: UNIV2_ROUTER_ADDRESS,
      });
      return response;
    } catch (error) {
      console.log('error', error);
      throw error;
    }
  };

  const getTokenBalance = async (token: IToken | any) => {
    try {
      const response = await tokenBalance({
        erc20TokenAddress: token.address,
      });
      return response;
    } catch (error) {
      console.log('error', error);
      throw error;
    }
  };

  const requestApproveToken = async (
    token: IToken | any,
    approveContract: string = UNIV2_ROUTER_ADDRESS,
  ) => {
    try {
      dispatch(
        updateCurrentTransaction({
          id: transactionType.createPoolApprove,
          status: TransactionStatus.info,
        }),
      );

      const response: any = await approveToken({
        erc20TokenAddress: token.address,
        address: approveContract,
      });
      dispatch(
        updateCurrentTransaction({
          status: TransactionStatus.success,
          id: transactionType.createPoolApprove,
          hash: response.hash,
          infoTexts: {
            success: `${
              isScreenRemove ? 'This liquidity' : token?.symbol
            } has been approved successfully.`,
          },
        }),
      );
    } catch (error) {
      console.log('error', error);

      throw error;
    } finally {
    }
  };

  const handleSelectBaseToken = async (token: IToken) => {
    setBaseToken(token);
    change('baseToken', token);
    try {
      const [_isApprove, _tokenBalance] = await Promise.all([
        checkTokenApprove(token),
        getTokenBalance(token),
      ]);
      setIsApproveAmountBaseToken(web3.utils.fromWei(_isApprove));
      // if (isScreenAdd) {
      setBaseBalance(_tokenBalance);
      // }
    } catch (error) {
      throw error;
    }
  };

  const handleSelectQuoteToken = async (token: IToken) => {
    setQuoteToken(token);
    change('quoteToken', token);
    try {
      const [_isApprove, _tokenBalance] = await Promise.all([
        checkTokenApprove(token),
        getTokenBalance(token),
      ]);

      setIsApproveAmountQuoteToken(web3.utils.fromWei(_isApprove));
      // if (isScreenAdd) {
      setQuoteBalance(_tokenBalance);
      // }
    } catch (error) {
      throw error;
    }
  };

  const validateBaseAmount = useCallback(
    (_amount: any) => {
      if (Number(_amount) > Number(baseBalance)) {
        return `Max amount is ${formatCurrency(baseBalance)}`;
      }

      return undefined;
    },
    [values.baseAmount, baseBalance],
  );

  const validateQuoteAmount = useCallback(
    (_amount: any) => {
      if (Number(_amount) > Number(quoteBalance)) {
        return `Max amount is ${formatCurrency(quoteBalance)}`;
      }
      return undefined;
    },
    [values.quoteAmount, quoteBalance],
  );

  const onChangeValueQuoteAmount = (_amount: any = 0) => {
    if (isPaired && baseToken && quoteToken) {
      const tokens = sortAddressPair(baseToken, quoteToken);
      const findIndex = tokens.findIndex((v) =>
        compareString(v.address, baseToken.address),
      );
      const rate =
        findIndex === 0
          ? new BigNumber(web3.utils.fromWei(perPrice._reserve0)).dividedBy(
              web3.utils.fromWei(perPrice._reserve1),
            )
          : new BigNumber(web3.utils.fromWei(perPrice._reserve1)).dividedBy(
              web3.utils.fromWei(perPrice._reserve0),
            );

      console.log(rate.toFixed(18));

      const _baseAmount = new BigNumber(_amount)
        .multipliedBy(rate.toFixed(18))
        .toFixed(18);

      console.log('_baseAmount', _baseAmount);

      change('baseAmount', Number(_baseAmount));
      setIsApproveBaseToken(
        checkBalanceIsApprove(isApproveAmountBaseToken, _baseAmount),
      );
    }

    if (Number(_amount) > 0 && baseToken && quoteToken) {
      setIsApproveQuoteToken(
        checkBalanceIsApprove(
          isApproveAmountQuoteToken,
          Web3.utils.toWei(_amount, 'ether'),
        ),
      );
    }
  };

  const onChangeValueBaseAmount = (_amount: any) => {
    if (isPaired && baseToken && quoteToken) {
      const tokens = sortAddressPair(baseToken, quoteToken);

      const findIndex = tokens.findIndex((v) =>
        compareString(v.address, baseToken.address),
      );

      const rate =
        findIndex === 1
          ? new BigNumber(perPrice._reserve0).dividedBy(perPrice._reserve1)
          : new BigNumber(perPrice._reserve1).dividedBy(perPrice._reserve0);
      const _quoteAmount = new BigNumber(_amount).multipliedBy(rate).toString();
      change('quoteAmount', _quoteAmount);
      setIsApproveQuoteToken(
        checkBalanceIsApprove(isApproveAmountQuoteToken, _quoteAmount),
      );
    }
    if (Number(_amount) > 0 && baseToken && quoteToken) {
      setIsApproveBaseToken(
        checkBalanceIsApprove(
          isApproveAmountBaseToken,
          Web3.utils.toWei(_amount, 'ether'),
        ),
      );
    }
  };

  const handleChangeMaxBaseAmount = () => {
    change('baseAmount', baseBalance);
    onChangeValueBaseAmount(baseBalance);
  };

  const handleChangeMaxQuoteAmount = () => {
    change('quoteAmount', quoteBalance);
    onChangeValueQuoteAmount(quoteBalance);
  };

  const checkBalanceIsApprove = (required: any = 0, amount: any = 0) => {
    return required > 0 && new BigNumber(required).minus(amount).toNumber() >= 0;
  };

  const onApprove = async () => {
    try {
      setLoading(true);

      if (!isEmpty(baseToken) && !isApproveBaseToken) {
        await requestApproveToken(baseToken);
        const [_isApprove] = await Promise.all([checkTokenApprove(baseToken)]);
        setIsApproveAmountBaseToken(web3.utils.fromWei(_isApprove));
        setIsApproveBaseToken(
          checkBalanceIsApprove(web3.utils.fromWei(_isApprove), values?.baseAmount),
        );
      } else if (!isEmpty(quoteToken) && !isApproveQuoteToken) {
        await requestApproveToken(quoteToken);
        const [_isApprove] = await Promise.all([checkTokenApprove(quoteToken)]);
        setIsApproveAmountQuoteToken(web3.utils.fromWei(_isApprove));
        setIsApproveQuoteToken(
          checkBalanceIsApprove(web3.utils.fromWei(_isApprove), values?.quoteAmount),
        );
      } else if (isScreenRemove && !isApprovePoolToken && pairAddress) {
        await requestApproveToken({
          address: pairAddress,
        });
        const _isApprove = await checkTokenApprove({ address: pairAddress });
        setIsApproveAmountPoolToken(web3.utils.fromWei(_isApprove));
        setIsApprovePoolToken(
          checkBalanceIsApprove(web3.utils.fromWei(_isApprove), values?.liquidValue),
        );
      }

      // toast.success('Transaction has been created. Please wait for few minutes.');
    } catch (err) {
      const message =
        (err as Error).message || 'Something went wrong. Please try again later.';
      logErrorToServer({
        type: 'error',
        address: account,
        error: JSON.stringify(err),
        message: message,
      });
      dispatch(
        updateCurrentTransaction({
          status: TransactionStatus.error,
          id: transactionType.createPoolApprove,
          infoTexts: {
            error: getMessageError(err, {}).title,
          },
        }),
      );
    } finally {
      setLoading(false);
    }
  };

  const renderPricePool = () => {
    if (!baseToken || !quoteToken) {
      return;
    }
    const [token1, token2] = sortAddressPair(baseToken, quoteToken);

    console.log('perPrice', perPrice);

    return (
      <Flex className="price-pool-content">
        <Box>
          <Stat>
            <StatNumber>
              {!isPaired
                ? '-'
                : formatCurrency(
                    new BigNumber(Web3.utils.fromWei(perPrice._reserve0))
                      .dividedBy(Web3.utils.fromWei(perPrice._reserve1))
                      .toString(),
                    10,
                  )}
            </StatNumber>
            <StatHelpText>{`${token1.symbol} per ${token2.symbol}`}</StatHelpText>
          </Stat>
        </Box>
        <Box>
          <Stat>
            <StatNumber>
              {!isPaired
                ? '-'
                : formatCurrency(
                    new BigNumber(Web3.utils.fromWei(perPrice._reserve1, 'ether'))
                      .dividedBy(Web3.utils.fromWei(perPrice._reserve0, 'ether'))
                      .toString(),
                    10,
                  )}
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

  const renderContentTitle = () => {
    switch (type) {
      case ScreenType.add_liquid:
        return {
          title: 'Add liquidity',
          btnTitle: isPaired ? 'Supply' : 'Create & Supply',
          btnBgColor: '#3385FF',
        };

      case ScreenType.remove:
        return {
          title: 'Remove liquidity',
          btnTitle: 'Remove',
          btnBgColor: '#BC1756',
        };

      case ScreenType.add_pool:
        return {
          title: 'Import pool',
          btnTitle: 'Import',
          btnBgColor: '#3385FF',
        };

      default:
        return {
          title: 'Create a Pool',
          btnTitle: 'Create',
          btnBgColor: '#3385FF',
        };
    }
  };

  const onChangeSlider = (v: any) => {
    if (baseToken && quoteToken) {
      const [token1, token2] = sortAddressPair(baseToken, quoteToken);
      const { _reserve0, _reserve1 } = perPrice;

      const cPercent = Number(v) / 100;
      const _percentPool = Number(percentPool) / 100;

      const __reserve0 = new BigNumber(_percentPool)
        .multipliedBy(_reserve0)
        .toString();
      const __reserve1 = new BigNumber(_percentPool)
        .multipliedBy(_reserve1)
        .toString();

      const _baseBalance = new BigNumber(cPercent)
        .multipliedBy(Web3.utils.fromWei(__reserve0, 'ether'))
        .toString();
      const _quoteBalance = new BigNumber(cPercent)
        .multipliedBy(Web3.utils.fromWei(__reserve1, 'ether'))
        .toString();

      const liquidValue = new BigNumber(cPercent)
        .multipliedBy(_percentPool)
        .multipliedBy(supply.ownerSupply)
        .toString();

      change('baseAmount', _baseBalance);
      change('quoteAmount', _quoteBalance);
      change('liquidValue', liquidValue);
      change('sliderPercent', v);
    }
  };

  const isDisabled = (!baseToken && !quoteToken) || isScreenRemove;

  return (
    <form onSubmit={onSubmit} style={{ height: '100%' }}>
      {isScreenRemove && (
        <Flex alignItems={'flex-end'} gap={10} className="remove-amount-container">
          <Box flex={1}>
            <Text className="title">Remove Amount</Text>
            <Text className="percent">{values?.sliderPercent || 0}%</Text>
          </Box>
          <Box flex={3}>
            <div>
              <Slider
                step={1}
                defaultValue={0}
                value={values?.sliderPercent || 0}
                min={0}
                max={100}
                onChange={onChangeSlider}
                disabled={!baseToken || !quoteToken}
              />
            </div>
          </Box>
        </Flex>
      )}

      <InputWrapper
        className={cx(styles.inputAmountWrap, styles.inputBaseAmountWrap)}
        theme="light"
        label={' '}
        rightLabel={
          !isEmpty(baseToken) && (
            <Flex gap={1} fontSize={px2rem(16)}>
              <Text>
                Balance: {formatCurrency(baseBalance)} {baseToken?.symbol}
              </Text>
              <Text
                cursor={'pointer'}
                color={'#3385FF'}
                onClick={handleChangeMaxBaseAmount}
              >
                MAX
              </Text>
            </Flex>
          )
        }
      >
        <Flex gap={4} direction={'column'}>
          <Field
            name="baseAmount"
            children={FieldAmount}
            validate={composeValidators(requiredAmount, validateBaseAmount)}
            fieldChanged={onChangeValueBaseAmount}
            disabled={submitting || isDisabled}
            // placeholder={"Enter number of tokens"}
            decimals={baseToken?.decimal || 18}
            className={styles.inputAmount}
            prependComp={
              <FilterButton
                disabled={isScreenRemove}
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
            }
            borderColor={'#5B5B5B'}
          />
        </Flex>
      </InputWrapper>
      <Flex justifyContent={'center'} mt={6}>
        <Box
          className="btn-transfer"
          p={2}
          border={'1px solid #3385FF'}
          borderRadius={'8px'}
        >
          <BsPlus color="#3385FF" />
        </Box>
      </Flex>

      <InputWrapper
        className={cx(styles.inputAmountWrap, styles.inputQuoteAmountWrap)}
        theme="light"
        label={' '}
        rightLabel={
          !isEmpty(quoteToken) && (
            <Flex gap={1} fontSize={px2rem(16)}>
              <Text>
                Balance: {formatCurrency(quoteBalance)} {quoteToken?.symbol}
              </Text>
              <Text
                cursor={'pointer'}
                color={'#3385FF'}
                onClick={handleChangeMaxQuoteAmount}
              >
                MAX
              </Text>
            </Flex>
          )
        }
      >
        <Flex gap={4} direction={'column'}>
          <Field
            name="quoteAmount"
            // placeholder={`0 ${revertCoin[1].symbol}`}
            children={FieldAmount}
            validate={composeValidators(requiredAmount, validateQuoteAmount)}
            fieldChanged={onChangeValueQuoteAmount}
            disabled={submitting || isDisabled}
            // placeholder={"Enter number of tokens"}
            decimals={quoteToken?.decimal || 18}
            className={cx(styles.inputAmount, styles.collateralAmount)}
            prependComp={
              <FilterButton
                disabled={isScreenRemove}
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
            }
            // hideError={true}
            borderColor={'#5B5B5B'}
          />
        </Flex>
      </InputWrapper>

      {baseToken && quoteToken && (
        <Box className={styles.pricePoolContainer}>
          <Text>Initial prices and pool share</Text>
          {renderPricePool()}
        </Box>
      )}
      {isAuthenticated && new BigNumber(juiceBalance || 0).lte(0) && (
        <Text fontSize="md" color="brand.warning.400" textAlign={'left'}>
          Your TC balance is insufficient. You can receive free TC on our faucet site{' '}
          <Link
            href={TRUSTLESS_FAUCET}
            target={'_blank'}
            style={{ textDecoration: 'underline' }}
          >
            here
          </Link>
          .
        </Text>
      )}
      {isAuthenticated &&
        baseToken &&
        BRIDGE_SUPPORT_TOKEN.includes(baseToken?.symbol) &&
        new BigNumber(baseBalance || 0).lte(0) && (
          <Text fontSize="md" color="brand.warning.400" textAlign={'left'}>
            Insufficient {baseToken?.symbol} balance! Consider swapping your{' '}
            {baseToken?.symbol?.replace('W', '')} to trustless network{' '}
            <Link
              href={TRUSTLESS_BRIDGE}
              target={'_blank'}
              style={{ textDecoration: 'underline' }}
            >
              here
            </Link>
            .
          </Text>
        )}
      {isAuthenticated &&
        quoteToken &&
        BRIDGE_SUPPORT_TOKEN.includes(quoteToken?.symbol) &&
        new BigNumber(quoteBalance || 0).lte(0) && (
          <Text fontSize="md" color="brand.warning.400" textAlign={'left'}>
            Insufficient {quoteToken?.symbol} balance! Consider swapping your{' '}
            {quoteToken?.symbol?.replace('W', '')} to trustless network{' '}
            <Link
              href={TRUSTLESS_BRIDGE}
              target={'_blank'}
              style={{ textDecoration: 'underline' }}
            >
              here
            </Link>
            .
          </Text>
        )}
      <WrapperConnected
        type={
          !Boolean(isApproveBaseToken) ||
          !Boolean(isApproveQuoteToken) ||
          (isScreenRemove && !isApprovePoolToken && Boolean(values?.liquidValue))
            ? 'button'
            : 'submit'
        }
        className={styles.submitButton}
      >
        {!Boolean(isApproveBaseToken) ||
        !Boolean(isApproveQuoteToken) ||
        (isScreenRemove && !isApprovePoolToken && Boolean(values?.liquidValue)) ? (
          <FiledButton
            isLoading={loading}
            isDisabled={loading}
            loadingText="Processing"
            btnSize={'h'}
            onClick={onApprove}
            type="button"
            processInfo={{
              id: transactionType.createPoolApprove,
            }}
          >
            {!isScreenRemove
              ? `APPROVE USE OF ${
                  !isApproveBaseToken ? baseToken?.symbol : quoteToken?.symbol
                }`
              : `APPROVE USE OF THIS LIQUIDITY`}
          </FiledButton>
        ) : (
          <FiledButton
            isDisabled={submitting || btnDisabled}
            isLoading={submitting}
            type="submit"
            // borderRadius={'100px !important'}
            // className="btn-submit"
            btnSize={'h'}
            containerConfig={{ flex: 1 }}
            loadingText={submitting ? 'Processing' : ' '}
            processInfo={{
              id: transactionType.createPool,
            }}
            style={{ backgroundColor: renderContentTitle().btnBgColor }}
          >
            {renderContentTitle().btnTitle}
          </FiledButton>
        )}
      </WrapperConnected>
    </form>
  );
});

const CreateMarket = ({
  fromAddress,
  toAddress,
  type,
}: {
  fromAddress?: any;
  toAddress?: any;
  type?: any;
}) => {
  const refForm = useRef<any>();
  const [submitting, setSubmitting] = useState(false);
  const dispatch = useAppDispatch();
  const { account } = useWeb3React();

  // const {run} = useContractOperation()
  const { run: addLiquidity } = useContractOperation<IAddLiquidityParams, boolean>({
    operation: useAddLiquidity,
  });

  const { run: removeLiquidity } = useContractOperation<
    IRemoveLiquidParams,
    boolean
  >({
    operation: useRemoveLiquidity,
  });

  // const { call: addLiquidity } = useAddLiquidity();

  const { call: getPair } = useGetPair();
  const { call: getReserves } = useGetReserves();
  const { call: getSupply } = useSupplyERC20Liquid();

  const isRemove = compareString(type, ScreenType.remove);

  const checkPair = async (baseToken: IToken, quoteToken: IToken) => {
    try {
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
    } catch (error) {}
  };

  const handleSubmit = async (values: any, e: any) => {
    const {
      baseToken,
      quoteToken,
      baseAmount,
      quoteAmount,
      isApproveQuoteToken,
      isApproveBaseToken,
    } = values;
    // if (!isApproveQuoteToken || !isApproveBaseToken) {
    //   return;
    // }
    try {
      setSubmitting(true);
      dispatch(
        updateCurrentTransaction({
          status: TransactionStatus.info,
          id: transactionType.createPool,
        }),
      );

      const [token0, token1] = sortAddressPair(baseToken, quoteToken);

      const { amount0, amount1 } =
        baseToken.address.toLowerCase() < quoteToken.address.toLowerCase()
          ? { amount0: baseAmount, amount1: quoteAmount }
          : { amount0: quoteAmount, amount1: baseAmount };

      let response: any;

      if (isRemove) {
        const data = {
          tokenA: token0?.address,
          tokenB: token1?.address,
          amountAMin: '0',
          amountBMin: '0',
          liquidValue: values?.liquidValue || '0',
        };

        response = await removeLiquidity(data);
      } else {
        const data = {
          tokenA: token0?.address,
          tokenB: token1?.address,
          amountAMin: '0',
          amountADesired: amount0,
          amountBDesired: amount1,
          amountBMin: '0',
        };

        response = await addLiquidity(data);
      }

      toast.success('Transaction has been created. Please wait for few minutes.');

      await checkPair(token0, token1);
      refForm.current?.reset();
      dispatch(requestReload());
      dispatch(requestReloadRealtime());
      dispatch(
        updateCurrentTransaction({
          status: TransactionStatus.success,
          id: transactionType.createPool,
          hash: response.hash,
          infoTexts: {
            success: 'Pool has been created successfully.',
          },
        }),
      );
    } catch (err) {
      console.log('err', err);
      const message =
        (err as Error).message || 'Something went wrong. Please try again later.';
      logErrorToServer({
        type: 'error',
        address: account,
        error: JSON.stringify(err),
        message: message,
      });
      dispatch(
        updateCurrentTransaction({
          status: TransactionStatus.error,
          id: transactionType.createPool,
          infoTexts: {
            error: message,
          },
        }),
      );
      // showError({
      //   message: message,
      // });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box className={styles.container}>
      <Form onSubmit={handleSubmit} initialValues={{}}>
        {({ handleSubmit }) => (
          <MakeFormSwap
            ref={refForm}
            onSubmit={handleSubmit}
            submitting={submitting}
            fromAddress={fromAddress}
            toAddress={toAddress}
          />
        )}
      </Form>
    </Box>
  );
};

export default CreateMarket;
