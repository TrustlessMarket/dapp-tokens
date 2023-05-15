import React from 'react';
import { StyledHorizontalItem } from './HorizontalItem.styled';
import { Text } from '@chakra-ui/react';

interface HorizontalItemProps {
  value?: string;
  valueTitle?: string;
  label?: string;
  className?: string;
}

const HorizontalItem: React.FC<HorizontalItemProps> = ({
  className,
  value,
  label,
  valueTitle,
}) => {
  return (
    <StyledHorizontalItem className={className}>
      <Text className="label">{label}</Text>
      <Text
        className="value"
        title={valueTitle}
        _hover={{
          cursor: valueTitle ? 'help' : 'auto',
        }}
      >
        {value}
      </Text>
    </StyledHorizontalItem>
  );
};

export default HorizontalItem;
