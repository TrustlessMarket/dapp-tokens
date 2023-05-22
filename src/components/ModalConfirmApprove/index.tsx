import React from 'react';
import { StyledModalConfirmApprove } from './styled';
import { Box, Text } from '@chakra-ui/react';
import { CDN_URL } from '@/configs';
import FiledButton from '../Swap/button/filedButton';

const ModalConfirmApprove = ({
  onApprove,
  onClose,
}: {
  onClose: () => void;
  onApprove: () => void;
}) => {
  const handleApprove = () => {
    onApprove();
    onClose();
  };

  return (
    <StyledModalConfirmApprove>
      <Text className="desc">
        When the Metamask pop-up appears, follow this guide and click the default
        option to save money on gas fees for your next trade.
      </Text>
      <img
        src={`${CDN_URL}/images/guide_approve_amount.png`}
        alt="guild-approve-amount"
      />
      <Box mt={4} />
      <FiledButton btnSize="h" onClick={handleApprove}>
        Confirm
      </FiledButton>
    </StyledModalConfirmApprove>
  );
};

export default ModalConfirmApprove;
