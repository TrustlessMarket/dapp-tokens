/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/no-children-prop */
import SocialToken from '@/components/Social';
import FiledButton from '@/components/Swap/button/filedButton';
import FieldAmount from '@/components/Swap/form/fieldAmount';
import FieldSelect from '@/components/Swap/form/fieldDropdown';
import HorizontalItem from '@/components/Swap/horizontalItem';
import { TOKEN_ICON_DEFAULT } from '@/constants/common';
import { ROUTE_PATH } from '@/constants/route-path';
import { IToken } from '@/interfaces/token';
import { compareString, formatCurrency, validateYoutubeLink } from '@/utils';
import { composeValidators, required, requiredAmount } from '@/utils/formValidate';
import { Box, Flex, FormLabel, Spinner, Text } from '@chakra-ui/react';
import { px2rem } from '@trustless-computer/dapp-core';
import BigNumber from 'bignumber.js';
import { isEmpty, truncate } from 'lodash';
import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useState } from 'react';
import { Field, useForm, useFormState } from 'react-final-form';
import web3 from 'web3';
import { StyledLaunchpadFormStep1 } from './LaunchpadManage.styled';
import { LaunchpadManageHeaderProps } from './header';
import InfoTooltip from '@/components/Swap/infoTooltip';
import { colors } from '@/theme/colors';
import { ILaunchpad } from '@/interfaces/launchpad';
import tokenIcons from '@/constants/tokenIcons';
import InputWrapper from '@/components/Swap/form/inputWrapper';
import FileDropzoneUpload from '@/components/Swap/form/fileDropzoneUpload';
import { MAX_FILE_SIZE } from '../UpdateTokenInfo/form';
import { logErrorToServer } from '@/services/swap';
import { uploadFile } from '@/services/file';
import useTCWallet from '@/hooks/useTCWallet';
import { CDN_URL } from '@/configs';
import FieldMDEditor from '@/components/Swap/form/fieldMDEditor';
import FieldText from '@/components/Swap/form/fieldText';

interface ILaunchpadFormStep2 {
  detail?: ILaunchpad;
  tokens: IToken[];
  liquidTokens: IToken[];
  balanceToken: string;
  step: number;
  launchpadConfigs: any;
}

const LaunchpadFormStep2: React.FC<ILaunchpadFormStep2> = ({
  detail,
  tokens,
  balanceToken,
  liquidTokens,
  launchpadConfigs,
}) => {
  const { tcWalletAddress: account } = useTCWallet();

  const router = useRouter();
  const { values } = useFormState();
  const { change } = useForm();
  const [uploading, setUploading] = useState(false);

  const onFileChange = async (file: File) => {
    // setFile(file);

    if (!file) {
      change('image', file);
    }

    try {
      setUploading(true);
      if (file) {
        const res = await uploadFile({ file: file });
        change('image', res?.url);
      }
    } catch (err) {
      const message =
        (err as Error).message || 'Something went wrong. Please try again later.';
      logErrorToServer({
        type: 'error',
        address: account,
        error: JSON.stringify(err),
        message: message,
      });
    } finally {
      setUploading(false);
    }
  };

  const onValidateYoutubeLink = useCallback(
    (_link: any) => {
      if (!_link && !values.image) {
        return `Image or Youtube link is Required`;
      }

      return undefined;
    },
    [values.image],
  );

  return (
    <StyledLaunchpadFormStep1 className={'step-2-container'}>
      <InputWrapper
        className="field-container"
        theme="dark"
        label={<Text>Image</Text>}
      >
        <FileDropzoneUpload
          className="image-drop-container"
          accept="image/*"
          maxSize={MAX_FILE_SIZE}
          onChange={onFileChange}
          url={values?.image || `${CDN_URL}/icons/ic_upload_media.svg`}
          loading={uploading}
        />
      </InputWrapper>
      <Field
        validate={composeValidators(validateYoutubeLink, onValidateYoutubeLink)}
        name="video"
        children={FieldText}
        label="Youtube link"
      />
      <Field
        validate={required}
        name="description"
        children={FieldMDEditor}
        label="Description"
      />
    </StyledLaunchpadFormStep1>
  );
};

export default LaunchpadFormStep2;
