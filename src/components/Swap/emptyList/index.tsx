/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';

import { Center, Text } from '@chakra-ui/react';
import { BsInbox } from 'react-icons/bs';
import {colors} from "@/theme/colors";

interface EmptyListProps {
  className?: string;
  link?: string;
  label?: string;
  labelText?: React.ReactNode;
  type?: string;
  imageSize?: number;
  theme?: 'light' | 'dark';
  positive?: boolean;
  hideIcon?: boolean;
}

const EmptyList = (props: EmptyListProps) => {
  const {
    className,
    labelText = 'No result found',
    imageSize = 80,
    // positive = false,
    theme = 'dark'
  } = props;

  return (
    <Center flexDirection="column" className={className} p={8} gap={4}>
      {!props.hideIcon && (
        <BsInbox style={{ color: '#999999' }} fontSize={'100px'} />
        // <img
        //   width={imageSize}
        //   src={`${CDN_URL}/icons/ic-empty-list.svg`}
        //   alt={'icon'}
        // />
      )}
      <Text fontSize="md" color={theme === 'dark' ? colors.white : colors.black} fontWeight="semibold">
        {labelText}
      </Text>
    </Center>
  );
};

export default EmptyList;
