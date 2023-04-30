/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import FiledButton from '@/components/Swap/button/filedButton';
import Card from '@/components/Swap/card';
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
import { useEffect, useMemo, useState } from 'react';
import { IoArrowBackOutline } from 'react-icons/io5';
import { StyledTokens, UploadFileContainer } from './Pools.styled';
import CreateMarket from './form';
import styles from './styles.module.scss';
import { transactionType } from '@/components/Swap/alertInfoProcessing/types';
import ListTable from '@/components/Swap/listTable';
import { camelCaseKeys } from '@/utils';
import mockTokenPair from '@/dataMock/pairLiquid.json';
import { IToken } from '@/interfaces/token';

const LiquidityContainer = () => {
  const [showAction, setShowAction] = useState(false);
  const [data, setData] = useState([]);
  // const [isCreate, setIsCreate] = useState(true);

  const handleChooseAction = (_create: boolean) => {
    setShowAction(true);
    // setIsCreate(create);
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
          return (
            <Accordion allowMultiple allowToggle>
              <AccordionItem>
                <h2>
                  <AccordionButton>
                    <Box as="span" flex="1" textAlign="left">
                      {row.name}
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                </h2>
                <AccordionPanel pb={4}>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                  eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
                  ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                  aliquip ex ea commodo consequat.
                </AccordionPanel>
              </AccordionItem>
            </Accordion>
          );
        },
      },
    ];
  }, []);

  useEffect(() => {
    fetchLiquid();
  }, []);

  const fetchLiquid = async () => {
    try {
      setData(camelCaseKeys(mockTokenPair));
    } catch (error) {}
  };

  return (
    <StyledTokens>
      <div className="background"></div>

      <div>
        {!showAction && (
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
                  onClick={() => handleChooseAction(true)}
                >
                  Create Pool
                </FiledButton>
              </Flex>
            </Flex>
          </>
        )}
      </div>
      <UploadFileContainer>
        <div className="upload_left">
          <Box className={styles.wrapper}>
            {showAction ? (
              <Box>
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
                    borderColor={'#000'}
                    borderWidth={1}
                    colorScheme="whiteAlpha"
                    isRound
                    variant="outline"
                    icon={<Icon as={IoArrowBackOutline} />}
                    onClick={() => setShowAction(false)}
                    aria-label={''}
                  />
                  <Heading as={'h6'} color={'#000000 !important'}>Create Pool</Heading>
                </Flex>
                <Box mt={6}>
                  <CreateMarket />
                </Box>
              </Box>
            ) : (
              <ListTable data={data} columns={columns} noHeader />
            )}
          </Box>
        </div>
      </UploadFileContainer>
    </StyledTokens>
  );
};

export default LiquidityContainer;
