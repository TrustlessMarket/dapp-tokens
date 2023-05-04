/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';

import { Center, Text } from '@chakra-ui/react';
import { BsInbox } from 'react-icons/bs';

interface EmptyListProps {
  className?: string;
  link?: string;
  label?: string;
  labelText?: React.ReactNode;
  type?: string;
  imageSize?: number;
  dark?: boolean;
  positive?: boolean;
  hideIcon?: boolean;
}

const EmptyList = (props: EmptyListProps) => {
  const {
    className,
    labelText = 'No result found',
    imageSize = 80,
    // positive = false,
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
      <Text fontSize="lg" color="text.secondary" fontWeight="semibold">
        {labelText}
      </Text>
    </Center>
  );
};

export default EmptyList;
