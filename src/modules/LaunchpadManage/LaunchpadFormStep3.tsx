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

interface ILaunchpadFormStep3 {
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

const LaunchpadFormStep3: React.FC<ILaunchpadFormStep3> = ({
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

  return (
    <StyledLaunchpadFormStep1 className={'step-2-container'}>
      <InputWrapper theme="dark">
        {faqs.map((v, i) => (
          <Flex alignItems={'center'} gap={6} key={i}>
            <InputWrapper
              className="item-faq-container"
              key={`q-${i}`}
              label={
                <Flex alignItems={'center'}>
                  <Text style={{ color: colors.white }}>{`Question ${v.id}`}</Text>
                  {i > 0 && (
                    <FiledButton
                      className="btn-remove"
                      onClick={() => onRemoveChoose(v)}
                    >
                      <IoIosRemoveCircleOutline /> Remove
                    </FiledButton>
                  )}
                </Flex>
              }
            >
              <Field
                name={`faq_q_${v.id}`}
                placeholder="Question"
                children={FieldText}
                validate={required}
              />
            </InputWrapper>
            <InputWrapper className="item-faq-container" key={`a${i}`} label={` `}>
              <Field
                name={`faq_a_${v.id}`}
                placeholder="Answer"
                children={FieldText}
                validate={required}
              />
            </InputWrapper>
          </Flex>
        ))}
      </InputWrapper>
      <Flex>
        <FiledButton onClick={onAddChoice} className="btn-add-faq">
          <IoIosAddCircleOutline /> Add more FAQ
        </FiledButton>
      </Flex>
    </StyledLaunchpadFormStep1>
  );
};

export default LaunchpadFormStep3;
