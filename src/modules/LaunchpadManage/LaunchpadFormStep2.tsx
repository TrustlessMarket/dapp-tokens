/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/no-children-prop */
import FieldRichEditor from '@/components/Swap/form/fieldRichEditor';
import FieldText from '@/components/Swap/form/fieldText';
import FileDropzoneUpload from '@/components/Swap/form/fileDropzoneUpload';
import InputWrapper from '@/components/Swap/form/inputWrapper';
import { CDN_URL } from '@/configs';
import { ILaunchpad } from '@/interfaces/launchpad';
import { IToken } from '@/interfaces/token';
import { uploadFile } from '@/services/file';
import { logErrorToServer } from '@/services/swap';
import { validateYoutubeLink } from '@/utils';
import { composeValidators, required } from '@/utils/formValidate';
import { Text } from '@chakra-ui/react';
import { useWeb3React } from '@web3-react/core';
import { useRouter } from 'next/router';
import React, { useCallback, useState } from 'react';
import { Field, useForm, useFormState } from 'react-final-form';
import { MAX_FILE_SIZE } from '../UpdateTokenInfo/form';
import { StyledLaunchpadFormStep1 } from './LaunchpadManage.styled';

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
  const { account } = useWeb3React();

  const router = useRouter();
  const { values } = useFormState();
  const { change } = useForm();
  const [uploading, setUploading] = useState(false);

  const onFileChange = async (file: File) => {
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
          accept={{
            'image/*': ['.png'],
          }}
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
        children={FieldRichEditor}
        label="Story"
      />
    </StyledLaunchpadFormStep1>
  );
};

export default LaunchpadFormStep2;
