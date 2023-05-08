/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import FiledButton from '@/components/Swap/button/filedButton';
import WrapperConnected from '@/components/WrapperConnected';
import { IToken } from '@/interfaces/token';
import { Box, Flex } from '@chakra-ui/react';
import { useWeb3React } from '@web3-react/core';
import React, { useEffect, useState } from 'react';

interface IdoTokenManageFormProps {
  handleSubmit?: (_: any) => void;
}

const IdoTokenManageForm: React.FC<IdoTokenManageFormProps> = ({ handleSubmit }) => {
  const [tokens, setTokens] = useState<IToken[]>([]);
  const { account, isActive } = useWeb3React();

  useEffect(() => {
    getTokens();
  }, [isActive, account]);

  const getTokens = async () => {
    setTokens([]);
    if (!account || !isActive) {
      return;
    }
    try {
      //   const response = await getToken
    } catch (error) {}
  };

  return (
    <form onSubmit={handleSubmit}>
      <Box className="form-container">
        <Flex>
          <Box flex={1}>
            <WrapperConnected className="btn-submit">
              <FiledButton style={{ width: '100%' }}>Submit</FiledButton>
            </WrapperConnected>
          </Box>
          <Box flex={1}></Box>
        </Flex>
      </Box>
    </form>
  );
};

export default IdoTokenManageForm;
