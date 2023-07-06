/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/no-children-prop */
import InfoTooltip from '@/components/Swap/infoTooltip';
import { SLIPPAGES } from '@/components/Swap/slippageSetting/v2';
import { useAppSelector } from '@/state/hooks';
import { selectPnftExchange, updateSlippageNOS } from '@/state/pnftExchange';
import { formatCurrency } from '@/utils';
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Flex,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Text,
} from '@chakra-ui/react';
import cs from 'classnames';
import { ImWarning } from 'react-icons/im';
import { IoSettings } from 'react-icons/io5';
import s from './styles.module.scss';
import { useDispatch } from 'react-redux';
import { useState } from 'react';

const ItemMaxSlippage = () => {
  const dispatch = useDispatch();
  const slippage = useAppSelector(selectPnftExchange).slippageNOS;

  const [value, setValue] = useState(slippage);

  const onChangeSlippage = (_value: any) => {
    setValue(_value);
    dispatch(updateSlippageNOS(_value));
  };

  return (
    <Accordion allowToggle defaultIndex={[0]}>
      <AccordionItem className={s.slippageContainer}>
        <Text>
          <AccordionButton>
            <InfoTooltip
              iconColor="#A0AEC0"
              showIcon
              label="Your transaction may be frontrun and result in an unfavorable trade."
            >
              Max slippage
            </InfoTooltip>
            <Flex gap={1} alignItems={'center'}>
              {Number(slippage) > 0 ? (
                <Text className={s.slippageContainer__percent}>
                  {formatCurrency(slippage)}%
                </Text>
              ) : (
                <Text className={s.slippageContainer__percent}>Auto</Text>
              )}
              <AccordionIcon />
            </Flex>
          </AccordionButton>
        </Text>
        <AccordionPanel pb={4}>
          <Flex className={s.slippageSwitch} alignItems={'center'}>
            {SLIPPAGES.map((l) => (
              <Box
                key={l}
                flex={1}
                onClick={() => onChangeSlippage(l)}
                className={cs(
                  s.slippageSwitch__item,
                  Number(l) === Number(value) && s.slippageSwitch__itemActive,
                )}
              >
                <Text>{l}%</Text>
              </Box>
            ))}
            {/* <Flex flex={1} className={s.slippageSwitch}>
              <Box
                flex={1}
                onClick={() => change('slippage', 0)}
                className={cs(
                  s.slippageSwitch__item,
                  Number(slippage) <= 0 && s.slippageSwitch__itemActive,
                )}
              >
                <Text>Auto</Text>
              </Box>
              <Box
                flex={1}
                className={cs(
                  s.slippageSwitch__item,
                  Number(slippage) > 0 && s.slippageSwitch__itemActive,
                )}
                onClick={() => change('slippage', 0.5)}
              >
                <Text>Custom</Text>
              </Box>
            </Flex> */}
            {/* <Box flex={1}>
              <Field
                children={FieldAmount}
                name="slippage"
                appendComp={
                  <Flex
                    alignItems={'center'}
                    justifyContent={'center'}
                    height={'40px'}
                    width={'20px'}
                  >
                    <Text color={'#fff'}>%</Text>
                  </Flex>
                }
              />
            </Box> */}
          </Flex>
          {Number(slippage) > 1 && (
            <Flex alignItems={'center'} gap={2} mt={2}>
              <ImWarning color="#F6AD55" />
              <Text className={s.slippageSwitch__warning}>
                Your transaction may be frontrun and result in an unfavorable trade.
              </Text>
            </Flex>
          )}
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
};

const PoolsV2Settings = () => {
  const slippage = useAppSelector(selectPnftExchange).slippageNOS;
  return (
    <Popover placement="bottom-end">
      <PopoverTrigger>
        <Button
          className={cs(
            s.btnSetting,
            Number(slippage) > 0 && s.btnSettingWithText,
            Number(slippage) > 1 && s.btnSettingWithTextWarning,
          )}
        >
          {Number(slippage) > 0 && (
            <Text className={s.btnSetting__slippage}>
              {formatCurrency(slippage)}% slippage
            </Text>
          )}
          <IoSettings color="rgba(255, 255, 255, 0.5)" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className={s.listSetting}>
        <PopoverArrow bgColor={'#353945'} color={'#353945'} />
        <PopoverBody>
          <ItemMaxSlippage />
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

export default PoolsV2Settings;
