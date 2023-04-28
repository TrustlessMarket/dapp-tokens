import {
  Box,
  Button,
  Center,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger
} from "@chakra-ui/react";
import React, {useState} from "react";
import Image from "next/image";
import gear from './img/gear.svg';
import SlippageSetting from "./index";
import styles from './styles.module.scss';
import {useAppSelector} from "@/state/hooks";
import {selectPnftExchange} from "@/state/pnftExchange";

const SlippageSettingButton = () => {
  const slippage = useAppSelector(selectPnftExchange).slippage;
  const [error, setError] = useState(null);

  const handleCloseSetting = () => {
    const elements = document.getElementsByClassName("inputSlippage");
    for (let i = 0; i < elements.length; i++) {
      elements[i].value = slippage;
    }
  }

  const handleOpenSetting = () => {
    setError(null);
  }

  const handleError = (e) => {
    setError(e);
  }

  return (
    <Box className={styles.buttonWrappper}>
      <Popover placement="top" onClose={handleCloseSetting} onOpen={handleOpenSetting}>
        <PopoverTrigger>
          <Button w={"40px"} h={"40px"} borderRadius={"50%"} bg={"#F4F5F6 !important"} p={0}>
            <Center >
              <Image src={gear} alt={"gear"} />
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

  )
};

export default SlippageSettingButton;