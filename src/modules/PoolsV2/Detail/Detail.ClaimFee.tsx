import FiledButton from '@/components/Swap/button/filedButton';
import React from 'react';
import { IDetailPositionBase } from './interface';

const DetailClaimFee: React.FC<IDetailPositionBase> = ({ positionDetail }) => {
  return (
    <FiledButton isDisabled={!Boolean(positionDetail)} btnSize="l">
      Collect Fees
    </FiledButton>
  );
};

export default DetailClaimFee;
