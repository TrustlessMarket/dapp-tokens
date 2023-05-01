import React from 'react';
import { StyledHorizontalItem } from './HorizontalItem.styled';
import Text from '../Text';

interface HorizontalItemProps {
  value?: string;
  label?: string;
}

const HorizontalItem: React.FC<HorizontalItemProps> = ({ value, label }) => {
  return (
    <StyledHorizontalItem>
      <Text className="label">{label}</Text>
      <Text className="value">{value}</Text>
    </StyledHorizontalItem>
  );
};

export default HorizontalItem;
