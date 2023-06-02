/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/no-children-prop */
import FiledButton from '@/components/Swap/button/filedButton';
import FieldText from '@/components/Swap/form/fieldText';
import InputWrapper from '@/components/Swap/form/inputWrapper';
import { ILaunchpad } from '@/interfaces/launchpad';
import { IToken } from '@/interfaces/token';
import { colors } from '@/theme/colors';
import { required } from '@/utils/formValidate';
import { Flex, Text } from '@chakra-ui/react';
import { useWeb3React } from '@web3-react/core';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { Field, useForm, useFormState } from 'react-final-form';
import { IoIosAddCircleOutline, IoIosRemoveCircleOutline } from 'react-icons/io';
import { StyledLaunchpadFormStep1 } from './LaunchpadManage.styled';
import FileDropzoneUpload from '@/components/Swap/form/fileDropzoneUpload';
import { CDN_URL } from '@/configs';
import { MAX_FILE_SIZE } from '../UpdateTokenInfo/form';

interface ILaunchpadFormStep4 {
  detail?: ILaunchpad;
  tokens: IToken[];
  liquidTokens: IToken[];
  balanceToken: string;
  step: number;
  launchpadConfigs: any;
}

const defaultFaqs = [
  {
    id: 1,
  },
];

const LaunchpadFormStep4: React.FC<ILaunchpadFormStep4> = ({
  detail,
  tokens,
  balanceToken,
  liquidTokens,
  launchpadConfigs,
}) => {
  const { account } = useWeb3React();

  const [faqs, setFaqs] = useState<any[]>(defaultFaqs);

  const router = useRouter();
  const { values } = useFormState();
  const { change } = useForm();
  const [uploading, setUploading] = useState(false);

  const onAddChoice = () => {
    setFaqs((value) => [
      ...value,
      {
        id: value.length + 1,
      },
    ]);
  };

  const onRemoveChoose = (i: any) => {
    setFaqs((value: any[]) => value.filter((v) => v.id !== i.id));
  };

  useEffect(() => {
    if (detail?.qandA) {
      setFaqs(JSON.parse(detail.qandA).map((v: any, i: number) => ({ id: i + 1 })));
    }
  }, [detail]);

  const onFileChange = async (file: File) => {
    console.log('file', file);
  };

  return (
    <StyledLaunchpadFormStep1 className={'step-2-container'}>
      <InputWrapper
        className="field-container"
        theme="dark"
        label={<Text>CSV</Text>}
      >
        <FileDropzoneUpload
          className="image-drop-container"
          accept="text/csv"
          maxSize={MAX_FILE_SIZE}
          onChange={onFileChange}
          url={values?.image || `${CDN_URL}/icons/ic_upload_media.svg`}
          loading={uploading}
        />
      </InputWrapper>
    </StyledLaunchpadFormStep1>
  );
};

export default LaunchpadFormStep4;
