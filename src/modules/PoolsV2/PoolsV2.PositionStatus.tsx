import InfoTooltip from '@/components/Swap/infoTooltip';
import { Flex, Text } from '@chakra-ui/react';
import React from 'react';
import { IDetailPositionBase } from './Detail/interface';
import { getRangeTick } from './utils';

const PoolsV2PositionStatus: React.FC<IDetailPositionBase> = ({
  positionDetail,
}) => {
  const rangeTick = getRangeTick(positionDetail);
  return (
    <InfoTooltip label={rangeTick?.status?.desc}>
      <Flex gap={1} alignItems={'center'}>
        <Text color={rangeTick?.status?.color}>{rangeTick?.status?.title}</Text>
        {rangeTick?.status?.iconName}
      </Flex>
    </InfoTooltip>
  );
};

export default PoolsV2PositionStatus;
