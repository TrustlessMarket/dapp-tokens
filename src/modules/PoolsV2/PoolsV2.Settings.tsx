/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/no-children-prop */
import InfoTooltip from '@/components/Swap/infoTooltip';
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
import { IoSettings } from 'react-icons/io5';
import s from './styles.module.scss';
import { Field, useForm, useFormState } from 'react-final-form';
import FieldAmount from '@/components/Swap/form/fieldAmount';
import cs from 'classnames';

const ItemMaxSlippage = () => {
  const { values } = useFormState();
  const { change } = useForm();
  const slippage: any = values?.slippage || 0;
  return (
    <Accordion allowToggle>
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
            <AccordionIcon />
          </AccordionButton>
        </Text>
        <AccordionPanel pb={4}>
          <Flex alignItems={'center'} gap={4}>
            <Flex className={s.slippageSwitch}>
              <Box
                onClick={() => change('slippage', 0)}
                className={cs(
                  s.slippageSwitch__item,
                  Number(slippage) <= 0 && s.slippageSwitch__itemActive,
                )}
              >
                <Text>Auto</Text>
              </Box>
              <Box
                className={cs(
                  s.slippageSwitch__item,
                  Number(slippage) > 0 && s.slippageSwitch__itemActive,
                )}
                onClick={() => change('slippage', 0.5)}
              >
                <Text>Custom</Text>
              </Box>
            </Flex>
            <Field children={FieldAmount} name="slippage" />
          </Flex>
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
};

const PoolsV2Settings = () => {
  return (
    <Popover placement="bottom-end">
      <PopoverTrigger>
        <Button className={s.btnSetting}>
          <IoSettings color="#fff" />
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
