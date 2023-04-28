import React from 'react';

import IconSadGray from './img_sad_gray.svg';
import IconSmileGray from './img_smile_gray.svg';

import {Center, Text} from '@chakra-ui/react';
import Image from "next/image";

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
};

const EmptyList = (props: EmptyListProps) => {
  const { className, labelText = 'No result found', imageSize = 80, positive = false } = props;

  return (
    <Center flexDirection='column' className={className} p={8} gap={4}>
      {
        !props.hideIcon && <Image w={imageSize} src={positive ? IconSmileGray : IconSadGray} alt={"icon"}/>
      }
      <Text fontSize='lg' color='text.secondary' fontWeight='semibold'>{labelText}</Text>
    </Center>
  );
};

export default EmptyList;
