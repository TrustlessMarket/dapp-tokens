import {Box, Button, Flex, Input, InputGroup, InputRightAddon, Text} from "@chakra-ui/react";
import {useCallback, useEffect, useState} from "react";
import styles from './styles.module.scss';
import debounce from "lodash/debounce";
import {useAppDispatch, useAppSelector} from "@/state/hooks";
import {selectPnftExchange, updateSlippage} from "@/state/pnftExchange";

const SLIPPAGES = [0.5, 1, 1.5, 2];

const SlippageSetting = ({onUpdate, error: myError, onError}) => {
  const [slippage, setSlippage] = useState(useAppSelector(selectPnftExchange).slippage);
  const dispatch = useAppDispatch();
  const [error, setError] = useState(myError);

  useEffect(() => {
    return () => {
    }
  }, []);
  
  useEffect(() => {
    setError(myError);
  }, [myError])

  const handleSetSlippage = (value) => {
    // const e = validateSlippage(value);
    // setError(e);
    // onError && onError(e)
    // if(!e) {
      // onUpdate('slippage', value);
      dispatch(updateSlippage(value));
      setSlippage(value);
    // }

    // onUpdate && onUpdate('slippage', value);
  }

  const onValueChange = (amount) => {
    onValueChangeCallback(amount);
  };

  const onValueChangeCallback = useCallback(
    debounce((p) => handleBaseAmountChange(p), 1000),
    []
  );

  const handleBaseAmountChange = (amount) => {
    handleSetSlippage(amount);
  };

  return (
    <Box className={styles.wrapper}>
      <Text fontSize='xs' fontWeight='medium' color={"#B1B5C3"} mb={2}>Slippage Tolerance</Text>
      <Flex direction={"column"}>
        <Flex alignItems='center' gap={2}>
          <InputGroup size='sm'>
            <Input value={slippage} className={"inputSlippage"} id={"inputSlippage"} fontSize={"sm"} fontWeight={"medium"} onChange={e => onValueChange(e.target.value)} disabled/>
            <InputRightAddon children='%' />
          </InputGroup>
          <Flex gap={1} className={styles.listButton}>
            {
              SLIPPAGES.map(value => (
                <Button
                  key={value}
                  variant={"ghost"}
                  className={Number(slippage) === value ? styles.selected : undefined}
                  color={Number(slippage) === value ? "#000000" : "#B1B5C3"}
                  onClick={() => handleSetSlippage(value)}
                >
                  {value}%
                </Button>
                )
              )
            }
          </Flex>
        </Flex>
        {error &&<Text fontWeight="medium" fontSize="xs" color="brand.danger.400">{error}</Text>}
        <Text fontSize='xs' fontWeight='medium' color={"#777E90"} mt={2} textAlign={"left"}>Your transaction will revert if the price changes unfavorably by more
          than this percentage.</Text>
      </Flex>
    </Box>
  )
}

export default SlippageSetting;