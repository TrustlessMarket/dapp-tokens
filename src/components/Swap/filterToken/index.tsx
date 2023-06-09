/* eslint-disable @typescript-eslint/no-explicit-any */
import FiledButton from '@/components/Swap/button/filedButton';
import FieldText from '@/components/Swap/form/fieldText';
import ListTable, { ColumnProp } from '@/components/Swap/listTable';
import TokenBalance from '@/components/Swap/tokenBalance';
import {COMMON_TOKEN_CONTRACT, L2_COMMON_TOKEN_CONTRACT} from '@/constants/common';
import useDebounce from '@/hooks/useDebounce';
import { closeModal, openModal } from '@/state/modal';
import { Box, Center, Flex, Icon, Text } from '@chakra-ui/react';
import { useWindowSize } from '@trustless-computer/dapp-core';
import cx from 'classnames';
import { clone } from 'lodash';
import React, { useEffect, useMemo, useState } from 'react';
import { Field, Form, useFormState } from 'react-final-form';
import {useDispatch, useSelector} from 'react-redux';
import { AiOutlineCaretDown } from 'react-icons/ai';
import styles from './styles.module.scss';
import { compareString } from '@/utils';
import { RxMagnifyingGlass } from 'react-icons/rx';
import VerifiedBadge, {
  getTextColorStatus,
  VERIFIED_STATUS,
} from '@/components/Swap/filterToken/verifiedBadge';
import { IToken } from '@/interfaces/token';
import { ImWarning } from 'react-icons/im';
import { HiBadgeCheck } from 'react-icons/hi';
import {IResourceChain} from "@/interfaces/chain";
import {selectPnftExchange} from "@/state/pnftExchange";
import {SupportedChainId} from "@/constants/chains";

interface FilterButtonProps {
  data: any[] | undefined;
  commonData?: any[];
  handleSelectItem: (_: any) => void;
  parentClose?: () => void;
  value: any;
  disabled?: boolean;
  className?: any;
  onExtraSearch?: (_: any) => any;
  renderSelectItem?: (_: any) => any;
}

interface FilterModalProps extends FilterButtonProps {
  handleSubmit: (_: any) => void;
  onClose: () => void;
}

const FilterModal: React.FC<FilterModalProps> = ({
  handleSubmit,
  data = [],
  onClose,
  handleSelectItem,
  // commonData,
  onExtraSearch,
}) => {
  const { mobileScreen } = useWindowSize();
  const { values } = useFormState();
  const [loading, setLoading] = useState(false);
  const currentChain: IResourceChain = useSelector(selectPnftExchange).currentChain;
  const isL2 = compareString(currentChain?.chainId, SupportedChainId.L2);
  const commonContract = isL2 ? L2_COMMON_TOKEN_CONTRACT : COMMON_TOKEN_CONTRACT;

  const commonData = useMemo(() => {
    const res = [];
    for (let i = 0; i < commonContract.length; i++) {
      const address = commonContract[i];

      const token = data?.find((e) => compareString(e?.address, address));
      if (token) {
        res.push(token);
      }
    }
    return res;
  }, [data?.length]);

  const columns: ColumnProp[] = useMemo(
    () => [
      {
        id: 'market',
        label: (
          <Flex
            w={'100%'}
            gap={4}
            alignItems={'flex-start'}
            justifyContent={'space-between'}
          >
            <Text>TOKEN</Text>
            <Text>BALANCE</Text>
          </Flex>
        ),
        labelConfig: {
          fontSize: '12px',
          fontWeight: '500',
          color: '#1C1C1C',
        },
        config: {
          borderBottom: 'none',
        },
        render(row: DataRow) {
          return (
            <Flex gap={4} alignItems={'flex-start'} justifyContent={'space-between'}>
              {/*<AvatarNFT tradingPair={row?.extra_item} />*/}
              <Box>
                <Flex gap={1}>
                  <Text fontSize={'md'} fontWeight={'600'}>
                    {row?.name}
                  </Text>
                  <Text
                    fontSize={'md'}
                    fontWeight={'normal'}
                    color={'rgba(0, 0, 0, 0.7)'}
                  >
                    {row?.symbol}
                  </Text>
                  <VerifiedBadge token={row.extra_item} />
                </Flex>
                <Text
                  fontSize={'xs'}
                  fontWeight={'normal'}
                  color={'rgba(0, 0, 0, 0.7)'}
                >
                  {row?.network}
                </Text>
              </Box>
              <TokenBalance token={row.extra_item} />
            </Flex>
          );
        },
      },
    ],
    [],
  );

  const debounced = useDebounce(values?.search_text);
  const [rows, setRows] = useState(data);

  const onSearch = async (text: string) => {
    const _data = clone(data) || [];
    setLoading(true);
    if (text) {
      const __data = _data.filter(
        (v: DataRow) =>
          v.name.toLowerCase().includes(text.toLowerCase()) ||
          v.code?.toLowerCase().includes(text.toLowerCase()) ||
          v.symbol?.toLowerCase().includes(text.toLowerCase()) ||
          v.address.toLowerCase().includes(text.toLowerCase()),
      );

      if (__data.length === 0 && onExtraSearch) {
        try {
          const ___data = await onExtraSearch(text.toLowerCase());
          setRows(___data);
        } catch (error) {
        } finally {
          setLoading(false);
        }
      } else {
        setRows(__data);
      }
    } else {
      setRows(_data);
    }
    setLoading(false);
  };

  useEffect(() => {
    onSearch(values?.search_text);
  }, [debounced]);

  const onItemClick = (e: DataRow) => {
    handleSelectItem(e.extra_item);
    onClose();
  };

  return (
    <form onSubmit={handleSubmit}>
      {commonData && commonData?.length > 0 && (
        <Box mb={4}>
          <Text fontSize={'12px'} fontWeight="500">
            COMMON TOKENS
          </Text>
          <Box mt={2}>
            <Flex gap={4} maxW="100%" overflow="auto">
              {commonData?.map((row: DataRow) => (
                <Flex
                  key={row.id}
                  alignItems="center"
                  gap={1}
                  borderRadius={'4px'}
                  border="1px solid #e6e8ec"
                  px={4}
                  py={2}
                  onClick={() => onItemClick(row)}
                  cursor="pointer"
                  minW={'50px'}
                  justifyContent={'center'}
                >
                  {/*<AvatarNFT tradingPair={row.extra_item} />*/}
                  <Box>
                    <Text
                      fontSize={'sm'}
                      fontWeight={'medium'}
                      whiteSpace={'nowrap'}
                    >
                      {row?.symbol}
                    </Text>
                  </Box>
                </Flex>
              ))}
            </Flex>
          </Box>
        </Box>
      )}
      <Box>
        <Field
          component={FieldText}
          name="search_text"
          placeholder="Search name or paste address"
          style={{
            textAlign: 'left',
            fontSize: '14px',
          }}
          // fieldChanged={onChange}
          prependComp={
            <Box mt={2}>
              <RxMagnifyingGlass fontSize={'32px'} color={'#B6B6B6'} />
            </Box>
          }
          borderColor={'#ECECED'}
        />
      </Box>
      <Box
        maxHeight={mobileScreen ? 'calc(100vh - 250px)' : '50vh'}
        overflow="auto"
        mt={4}
      >
        <ListTable
          data={rows}
          columns={columns}
          onItemClick={onItemClick}
          initialLoading={loading}
        />
      </Box>
    </form>
  );
};

export interface DataRow {
  id: string;
  name: string;
  code: string;
  img: string;
  symbol?: string;
  address: string;
  network?: string;
  extra_item?: any;
}

export const parseData = (data: any[]): DataRow[] => {
  return data.map((d: any) => {
    return {
      id: d.id,
      name: d?.name,
      code: d?.slug,
      symbol: d?.symbol,
      img: d?.thumbnail,
      address: d?.address,
      network: d?.network,
      extra_item: d,
    };
  });
};

const FilterButton: React.FC<FilterButtonProps> = ({
  data = [],
  handleSelectItem,
  commonData = [],
  value,
  disabled,
  onExtraSearch,
  renderSelectItem,
  className,
}) => {
  const dispatch = useDispatch();
  const { mobileScreen } = useWindowSize();
  const handleSubmit = () => {
    try {
    } catch (error) {}
  };
  const [selectedToken, setSelectedToken] = useState<any>();

  useEffect(() => {
    if (value && value?.address) {
      setSelectedToken(value);
    } else {
      setSelectedToken(null);
    }
  }, [value?.address]);

  const handleSelectToken = (token: React.SetStateAction<unknown>) => {
    setSelectedToken(token);
    handleSelectItem && handleSelectItem(token);
    handleShowWarningToken(token as IToken);
  };

  const handleShowWarningToken = (token?: IToken) => {
    if (!token?.status || token?.status === VERIFIED_STATUS.PREMIUM) {
      return;
    }
    const id = 'modalWarningToken';
    const close = () => dispatch(closeModal({ id }));
    dispatch(
      openModal({
        id,
        theme: 'dark',
        // title: 'Confirm swap',
        className: styles.modalWarningToken,
        modalProps: {
          centered: true,
          size: mobileScreen ? 'full' : 'xl',
          zIndex: 9999999,
        },
        render: () => (
          <Flex direction={'column'} gap={2}>
            <Flex
              gap={2}
              justifyContent={'center'}
              color={getTextColorStatus(token.status)}
              alignItems={'center'}
            >
              <Text fontSize={'40px'} fontWeight={'medium'}>
                {token?.status === VERIFIED_STATUS.WARNING ? 'Warning' : 'Caution'}
              </Text>
              <Center w={'40px'} h={'40px'} minW={'40px'} minH={'40px'}>
                <Icon as={ImWarning} fontSize={'30px'} />
              </Center>
            </Flex>
            <Flex
              direction={'column'}
              color={getTextColorStatus(token.status)}
              maxW={'500px'}
              mt={4}
            >
              {token?.status === VERIFIED_STATUS.WARNING && (
                <>
                  <Text>
                    The name of this token is misleading and its trading volume is
                    extremely low, which may increase the potential risk of trading
                    this token.
                  </Text>
                  <Text>
                    Please keep these warnings in mind before proceeding with any
                    trades involving this token.
                  </Text>
                </>
              )}
              {token?.status === VERIFIED_STATUS.CAUTION && (
                <Text>
                  This token has a low trading volume, which may increase your risk
                  if you decide to trade it.
                </Text>
              )}
            </Flex>
            <FiledButton
              loadingText="Processing"
              btnSize={'h'}
              onClick={close}
              mt={4}
            >
              Confirm
            </FiledButton>
          </Flex>
        ),
      }),
    );
  };

  const handleOpenModal = () => {
    // parentClose?.();
    const id = 'modalSearch';
    const close = () => dispatch(closeModal({ id }));
    dispatch(
      openModal({
        id,
        theme: 'dark',
        title: 'Select a Token',
        className: styles.modalContent,
        modalProps: {
          centered: true,
          size: mobileScreen ? 'full' : 'xl',
          zIndex: 9999999,
        },
        render: () => (
          <Form onSubmit={handleSubmit}>
            {({ handleSubmit }) => (
              <FilterModal
                handleSubmit={handleSubmit}
                data={parseData(data)}
                onClose={close}
                handleSelectItem={handleSelectToken}
                commonData={parseData(commonData)}
                value={undefined}
                onExtraSearch={onExtraSearch}
              />
            )}
          </Form>
        ),
      }),
    );

    if (mobileScreen) {
      setTimeout(() => {
        const modal = document.getElementsByClassName(
          'chakra-modal__content-container',
        )[0] as HTMLElement;
        if (modal) {
          modal.style.zIndex = '9999999';
        }

        const modalHeaderWrapElement = document.getElementsByClassName(
          'modal-header-wrap',
        )[0] as HTMLElement;

        const modalChakraHeaderWrapElement = document.getElementsByClassName(
          'chakra-modal__header',
        )[0] as HTMLElement;

        const modalChakraHeaderCloseBtnElement = document.getElementsByClassName(
          'chakra-modal__close-btn',
        )[0] as HTMLElement;

        const modalChakraHeaderCloseBtnFirstChildElement =
          document.getElementsByClassName('chakra-modal__close-btn')[0]
            .firstChild as HTMLElement;

        modalHeaderWrapElement.style.padding = '0';
        modalHeaderWrapElement.style.marginTop = '-16px';
        modalChakraHeaderWrapElement.style.fontSize = '24px';
        modalChakraHeaderWrapElement.style.fontWeight = '500';
        modalChakraHeaderCloseBtnElement.style.top = '20px';
        modalChakraHeaderCloseBtnFirstChildElement.style.width = '16px';
        modalChakraHeaderCloseBtnFirstChildElement.style.height = '16px';
      }, 100);
    }
  };

  return (
    <FiledButton
      isDisabled={disabled}
      onClick={handleOpenModal}
      className={cx(styles.filterButton, className, 'filterButton')}
      containerConfig={{
        className: 'filterContainer',
      }}
    >
      <Flex
        gap={2}
        alignItems={'center'}
        justifyContent={'space-between'}
        width={'100%'}
        color={'#FFFFFF'}
      >
        {selectedToken ? (
          renderSelectItem ? (
            renderSelectItem(selectedToken)
          ) : (
            <Flex direction={'column'} alignItems={'flex-start'}>
              <Flex gap={1} alignItems={'center'}>
                <Text fontWeight={'500'} fontSize={'md'}>
                  {selectedToken?.symbol}
                </Text>
                {selectedToken?.status && (
                  <Icon
                    as={
                      selectedToken?.status === VERIFIED_STATUS.PREMIUM
                        ? HiBadgeCheck
                        : ImWarning
                    }
                    fontSize={'14px'}
                    color={getTextColorStatus(selectedToken?.status)}
                  />
                )}
              </Flex>
              <Text fontSize={'xs'}>{selectedToken?.network}</Text>
            </Flex>
          )
        ) : (
          <Text className="select-placeholder">Select a token</Text>
        )}
        <AiOutlineCaretDown fontSize={'16px'} />
      </Flex>
    </FiledButton>
  );
};

export default FilterButton;
