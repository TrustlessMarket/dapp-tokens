/* eslint-disable @typescript-eslint/no-unused-vars */
import FiledButton from '@/components/Swap/button/filedButton';
import Card from '@/components/Swap/card';
import { Box, Flex, Heading, Icon, IconButton } from '@chakra-ui/react';
import { useState } from 'react';
import { IoArrowBackOutline } from 'react-icons/io5';
import { StyledTokens, UploadFileContainer } from './Pools.styled';
import CreateMarket from './form';
import styles from './styles.module.scss';

const LiquidityContainer = () => {
  const [showAction, setShowAction] = useState(false);
  // const [isCreate, setIsCreate] = useState(true);

  const handleChooseAction = (_create: boolean) => {
    setShowAction(true);
    // setIsCreate(create);
  };

  // return (
  //   <StyledPools>
  //     <div className="background"></div>
  //     <div className="title_container">
  //       <h3 className="upload_title">Pools</h3>
  //       <Button bg={'white'} background={'blue'} onClick={onOpenNewPools}>
  //         <Text
  //           size="medium"
  //           color="bg1"
  //           className="button-text"
  //           fontWeight="medium"
  //         >
  //           + New
  //         </Text>
  //       </Button>
  //     </div>
  //     <StyledPoolFormContainer></StyledPoolFormContainer>
  //   </StyledPools>
  // );

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
              maxW={['auto', '70%']}
              marginX={'auto'}
              direction={['column', 'row']}
            >
              <Heading as={'h6'}>Pools</Heading>
              <Flex gap={4}>
                <FiledButton onClick={() => handleChooseAction(true)}>
                  Create Pool
                </FiledButton>
                {/*<FiledButton onClick={() => handleChooseAction(false)} className={styles.joinButton}>
                  Share Ownership
                </FiledButton>*/}
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
                  <Heading as={'h6'}>Create Pool</Heading>
                </Flex>
                <Box mt={6}>
                  <CreateMarket />
                </Box>
              </Box>
            ) : (
              <Card mt={6}>List Pools</Card>
            )}
          </Box>
        </div>
      </UploadFileContainer>
    </StyledTokens>
  );
};

export default LiquidityContainer;
