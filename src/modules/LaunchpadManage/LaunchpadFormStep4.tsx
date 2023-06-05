/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/no-children-prop */
import FileDropzoneUpload from '@/components/Swap/form/fileDropzoneUpload';
import InputWrapper from '@/components/Swap/form/inputWrapper';
import { CDN_URL } from '@/configs';
import { ILaunchpad } from '@/interfaces/launchpad';
import { IToken } from '@/interfaces/token';
import { uploadFile } from '@/services/file';
import { Flex, Text } from '@chakra-ui/react';
import { useWeb3React } from '@web3-react/core';
import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useState } from 'react';
import { useForm, useFormState } from 'react-final-form';
import { FaFileCsv } from 'react-icons/fa';
import { FiDownloadCloud } from 'react-icons/fi';
import { MAX_FILE_SIZE } from '../UpdateTokenInfo/form';
import { StyledLaunchpadFormStep1 } from './LaunchpadManage.styled';

interface ILaunchpadFormStep4 {
  detail?: ILaunchpad;
  tokens: IToken[];
  liquidTokens: IToken[];
  balanceToken: string;
  step: number;
  launchpadConfigs: any;
}

const LaunchpadFormStep4: React.FC<ILaunchpadFormStep4> = ({
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

  useEffect(() => {
    //
  }, []);

  const onDrop = useCallback(async (acceptedFile: File) => {
    try {
      setUploading(true);
      const res = await uploadFile({ file: acceptedFile });
      console.log('res', res);

      change('boost_url', res?.url);
    } catch (error) {
    } finally {
      setUploading(false);
    }

    // // Creating the object of FileReader Class
    // const read = new FileReader();
    // // when readAsText will invoke, onload() method on the read object will execute.
    // read.onload = function (e) {
    //   // perform some operations with read data
    //   csvFileToArray(read.result);
    // };
    // // Invoking the readAsText() method by passing the uploaded file as a parameter
    // if (acceptedFile) {
    //   read.readAsText(acceptedFile);
    // } else {
    //   change('boost_file_url', []);
    // }
  }, []);

  // const csvFileToArray = (rawString: any) => {
  //   const csvHeader = rawString.slice(0, rawString.indexOf('\n')).split(',');
  //   const csvRows = rawString.slice(rawString.indexOf('\n') + 1).split('\n');

  //   const array = csvRows.map((i: any) => {
  //     const values = i.split(',');
  //     const obj = csvHeader.reduce((object: any, header: any, index: any) => {
  //       object[header.trim()] =
  //         header.trim() === 'boost'
  //           ? Number(values[index].trim())
  //           : values[index].trim();
  //       return object;
  //     }, {});
  //     return obj;
  //   });
  //   change('boost', array);
  // };

  return (
    <StyledLaunchpadFormStep1 className={'step-2-container'}>
      <InputWrapper
        className="field-container"
        theme="dark"
        label={<Text>CSV</Text>}
      >
        <FileDropzoneUpload
          className="image-drop-container"
          accept={{ 'text/csv': ['.csv'] }}
          maxSize={MAX_FILE_SIZE}
          onChange={onDrop}
          url={`${CDN_URL}/icons/ic_upload_media.svg`}
          loading={uploading}
          icon={<FaFileCsv style={{ fontSize: 50, marginBottom: 10 }} />}
        />
      </InputWrapper>
      <Flex gap={4}>
        <Flex
          className="btn-download-template"
          onClick={() =>
            window.open(
              'https://storage.googleapis.com/tc-cdn-prod/upload/boost_template.csv',
              '_blank',
            )
          }
        >
          <FiDownloadCloud />
          Download CSV Template
        </Flex>
        {detail?.boostUrl && (
          <Flex
            className="btn-download-template primary"
            onClick={() => window.open(detail?.boostUrl, '_blank')}
          >
            <FiDownloadCloud />
            Download My Boost File
          </Flex>
        )}
      </Flex>
    </StyledLaunchpadFormStep1>
  );
};

export default LaunchpadFormStep4;
