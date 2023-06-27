import { IToken } from '@/interfaces/token';
import React from 'react';
import s from './styles.module.scss';
import { Avatar, Box, Flex, Text } from '@chakra-ui/react';
import { getTokenIconUrl } from '@/utils';
import cs from 'classnames';

interface IAddItemToken {
  token: IToken;
  hideName?: boolean;
}

const AddItemToken: React.FC<IAddItemToken> = ({ token, hideName }) => {
  return (
    <Flex className={cs(s.addItemTokenContainer, 'customAddItemToken')}>
      <Avatar
        className={s.addItemTokenContainer__avatar}
        src={getTokenIconUrl(token)}
      />
      <Box>
        <Text className={s.addItemTokenContainer__symbol}>{token.symbol}</Text>
        {!hideName && (
          <Text className={s.addItemTokenContainer__name}>{token.name}</Text>
        )}
      </Box>
    </Flex>
  );
};

export default AddItemToken;
