/* eslint-disable @typescript-eslint/no-explicit-any */
import FiledButton from '@/components/Swap/button/filedButton';
import { toastError } from '@/constants/error';
import { WalletContext } from '@/contexts/wallet-context';
import { removeIdo } from '@/services/ido';
import { requestReload } from '@/state/pnftExchange';
import { colors } from '@/theme/colors';
import { showError } from '@/utils/toast';
import { Flex } from '@chakra-ui/react';
import { useContext, useState } from 'react';
import { toast } from 'react-hot-toast';
import { useDispatch } from 'react-redux';

const IdoTokenRemove = ({ ido, onClose }: { ido: any; onClose: any }) => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const { getSignature } = useContext(WalletContext);

  const onRemove = async () => {
    try {
      setLoading(true);
      const signature: any = await getSignature(ido.token.address);
      await removeIdo({
        id: ido.id,
        signature: signature,
        address: ido.token.address,
      });
      toast.success(`Removed IDO successfully.`);
      dispatch(requestReload());
    } catch (err) {
      toastError(showError, err, {});
    } finally {
      setLoading(false);
      onClose();
    }
  };

  return (
    <Flex gap={8} justifyContent={'center'}>
      <FiledButton
        style={{
          backgroundColor: colors.redPrimary,
        }}
        isLoading={loading}
        isDisabled={loading}
        onClick={onRemove}
      >
        Remove
      </FiledButton>
      <FiledButton
        variant={'outline'}
        style={{
          backgroundColor: 'transparent',
          borderColor: colors.darkBorderColor,
        }}
        _hover={{
          color: colors.black,
        }}
        onClick={onClose}
        isDisabled={loading}
      >
        Close
      </FiledButton>
    </Flex>
  );
};

export default IdoTokenRemove;
