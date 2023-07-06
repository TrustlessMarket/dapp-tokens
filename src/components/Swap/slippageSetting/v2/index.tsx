/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/no-children-prop */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Box, Button, Flex, Text } from '@chakra-ui/react';
import { SetStateAction, useCallback, useEffect, useState } from 'react';
import styles from '../styles.module.scss';
import debounce from 'lodash/debounce';
import { useAppDispatch, useAppSelector } from '@/state/hooks';
import { selectPnftExchange, updateSlippageNOS } from '@/state/pnftExchange';

export const SLIPPAGES = [0.5, 1, 1.5, 2];

const SlippageSetting = ({ error: myError }: { error: any }) => {
  const [slippage, setSlippage] = useState(
    useAppSelector(selectPnftExchange).slippageNOS,
  );
  const dispatch = useAppDispatch();
  const [error, setError] = useState(myError);

  useEffect(() => {
    return () => {};
  }, []);

  useEffect(() => {
    setError(myError);
  }, [myError]);

  const handleSetSlippage = (value: SetStateAction<number>) => {
    // const e = validateSlippage(value);
    // setError(e);
    // onError && onError(e)
    // if(!e) {
    // onUpdate('slippage', value);
    dispatch(updateSlippageNOS(value));
    setSlippage(value);
    // }

    // onUpdate && onUpdate('slippage', value);
  };

  const onValueChange = (amount: string) => {
    onValueChangeCallback(amount);
  };

  const onValueChangeCallback = useCallback(
    debounce((p) => handleBaseAmountChange(p), 1000),
    [],
  );

  const handleBaseAmountChange = (amount: SetStateAction<number>) => {
    handleSetSlippage(amount);
  };

  return (
    <Box className={styles.wrapper}>
      <Text fontSize="xs" fontWeight="medium" color={'#B1B5C3'} textAlign={'left'}>
        Slippage Tolerance
      </Text>
      <Flex direction={'column'} mt={2}>
        <Flex alignItems="center" gap={2}>
          {/*<InputGroup size="sm">
            <Input
              value={slippage}
              className={'inputSlippage'}
              id={'inputSlippage'}
              fontSize={'sm'}
              fontWeight={'medium'}
              onChange={(e) => onValueChange(e.target.value)}
              disabled
            />
            <InputRightAddon children="%" />
          </InputGroup>*/}
          <Flex
            gap={1}
            className={styles.listButton}
            justifyContent={'space-between'}
            w={'100%'}
          >
            {SLIPPAGES.map((value) => (
              <Button
                key={value}
                variant={'ghost'}
                className={Number(slippage) === value ? styles.selected : undefined}
                color={Number(slippage) === value ? '#000000' : '#B1B5C3'}
                onClick={() => handleSetSlippage(value)}
              >
                {value}%
              </Button>
            ))}
          </Flex>
        </Flex>
        {error && (
          <Text fontWeight="medium" fontSize="xs" color="brand.danger.400">
            {error}
          </Text>
        )}
        <Text
          fontSize="xs"
          fontWeight="medium"
          color={'#777E90'}
          mt={2}
          textAlign={'left'}
        >
          Your transaction will revert if the price changes unfavorably by more than
          this percentage.
        </Text>
      </Flex>
    </Box>
  );
};

export default SlippageSetting;
