import { useAppSelector } from '@/state/hooks';
import { selectPnftExchange } from '@/state/pnftExchange';
import {
  Box,
  Button,
  Center,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
} from '@chakra-ui/react';
import Image from 'next/image';
import { useState } from 'react';
import gear from './img/gear.svg';
import SlippageSetting from './index';
import styles from './styles.module.scss';

const SlippageSettingButton = () => {
  const slippage = useAppSelector(selectPnftExchange).slippage;
  const [error, setError] = useState(null);

  const handleCloseSetting = () => {
    const elements = document.getElementsByClassName(
      'inputSlippage',
    ) as unknown as HTMLElement[];
    for (let i = 0; i < elements.length; i++) {
      const e = elements[i] as HTMLInputElement;
      e.value = slippage.toString();
    }
  };

  const handleOpenSetting = () => {
    setError(null);
  };

  return (
    <Box className={styles.buttonWrappper}>
      <Popover
        placement="top"
        onClose={handleCloseSetting}
        onOpen={handleOpenSetting}
      >
        <PopoverTrigger>
          <Button
            w={'40px'}
            h={'40px'}
            borderRadius={'50%'}
            bg={'#F4F5F6 !important'}
            p={0}
          >
            <Center>
              <Image src={gear} alt={'gear'} />
            </Center>
          </Button>
        </PopoverTrigger>
        <PopoverContent>
          <PopoverArrow />
          {/*<PopoverCloseButton />*/}
          {/*<PopoverHeader>Confirmation!</PopoverHeader>*/}
          <PopoverBody>
            <SlippageSetting error={error} />
          </PopoverBody>
        </PopoverContent>
      </Popover>
    </Box>
  );
};

export default SlippageSettingButton;