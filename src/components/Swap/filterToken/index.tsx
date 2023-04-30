/* eslint-disable @typescript-eslint/no-explicit-any */
import FiledButton from '@/components/Swap/button/filedButton';
import FieldText from '@/components/Swap/form/fieldText';
import ListTable, {ColumnProp} from '@/components/Swap/listTable';
import useDebounce from '@/hooks/useDebounce';
import {closeModal, openModal} from '@/state/modal';
import {shortCryptoAddress} from '@/utils';
import {Box, Flex, Text} from '@chakra-ui/react';
import {useWindowSize} from '@trustless-computer/dapp-core';
import {clone, isEmpty} from 'lodash';
import React, {useEffect, useMemo, useState} from 'react';
import {Field, Form, useFormState} from 'react-final-form';
import {useDispatch} from 'react-redux';
import styles from './styles.module.scss';
import {AiOutlineCaretDown} from "react-icons/ai";

interface FilterButtonProps {
  data: any[];
  commonData?: any[];
  handleSelectItem: (_: any) => void;
  parentClose?: () => void;
  value: any;
}

interface FilterModalProps extends FilterButtonProps {
  handleSubmit: (_: any) => void;
  onClose: () => void;
}

const FilterModal: React.FC<FilterModalProps> = ({
  handleSubmit,
  data,
  onClose,
  handleSelectItem,
  commonData,
}) => {
  const { mobileScreen } = useWindowSize();
  const { values } = useFormState();
  const columns: ColumnProp[] = useMemo(
    () => [
      {
        id: 'market',
        label: 'Token',
        labelConfig: {
          fontSize: '12px',
          fontWeight: '500',
          color: '#B1B5C3',
        },
        config: {
          borderBottom: 'none',
        },
        render(row: DataRow) {
          return (
            <Flex gap={4} alignItems={'center'}>
              {/*<AvatarNFT tradingPair={row?.extra_item} />*/}
              <Box>
                <Text fontSize={'md'} fontWeight={'normal'}>
                  {row?.symbol}
                </Text>
                <Text fontSize={'sm'} fontWeight={'medium'}>
                  {shortCryptoAddress(row?.contract_address)}
                </Text>
              </Box>
            </Flex>
          );
        },
      },
    ],
    [],
  );

  const debounced = useDebounce(values?.search_text);
  const [rows, setRows] = useState(data);

  const onSearch = (text: string) => {
    const _data = clone(data);
    if (text) {
      const __data = _data.filter(
        (v: DataRow) =>
          v.name.toLowerCase().includes(text.toLowerCase()) ||
          v.code.toLowerCase().includes(text.toLowerCase()) ||
          v.symbol?.toLowerCase().includes(text.toLowerCase()) ||
          v.contract_address.toLowerCase().includes(text.toLowerCase()),
      );
      setRows(__data);
    } else {
      setRows(_data);
    }
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
      <Field
        component={FieldText}
        name="search_text"
        placeholder="Search name or paste address"
        style={{
          textAlign: 'left',
        }}
        // fieldChanged={onChange}
      />
      {commonData && commonData?.length > 0 && (
        <Box mt={4}>
          <Text fontSize={'12px'} fontWeight="500">
            Common tokens
          </Text>
          <Box mt={1}>
            <Flex gap={4} maxW="100%" overflow="auto">
              {commonData?.map((row: DataRow) => (
                <Flex
                  key={row.id}
                  alignItems="center"
                  gap={1}
                  borderRadius={'4px'}
                  border="1px solid #e6e8ec"
                  px={2}
                  py={1}
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

      <Box
        maxHeight={mobileScreen ? 'calc(100vh - 250px)' : '50vh'}
        overflow="auto"
        mt={4}
      >
        <ListTable data={rows} columns={columns} onItemClick={onItemClick} />
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
  contract_address: string;
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
      contract_address: d?.address,
      extra_item: d,
    };
  });
};

const FilterButton: React.FC<FilterButtonProps> = ({
  data,
  handleSelectItem,
  commonData = [],
  value,
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

  const handleSelectToken = (token: React.SetStateAction<null>) => {
    setSelectedToken(token);
    handleSelectItem && handleSelectItem(token);
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
        className: mobileScreen && styles.filterModalContent,
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
    <FiledButton onClick={handleOpenModal} className={styles.filterButton}>
      <Flex gap={2} alignItems={'center'} justifyContent={"space-between"} width={"100%"}>
        {
          selectedToken ? (
            <Text>{selectedToken?.symbol}</Text>
          ) : (
            <Text>Select token</Text>
          )
        }
        <AiOutlineCaretDown color={"#686A6C"}/>
      </Flex>
    </FiledButton>
  );
};

export default FilterButton;
