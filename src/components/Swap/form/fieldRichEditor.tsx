/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/no-children-prop */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Box,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  InputGroup,
  InputLeftElement,
  InputRightElement,
} from '@chakra-ui/react';

import styles from './styles.module.scss';

import dynamic from 'next/dynamic';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { useState } from 'react';
import { EditorProps } from 'react-draft-wysiwyg';

import { ContentState, convertToRaw } from 'draft-js';

const Editor = dynamic<EditorProps>(
  () => import('react-draft-wysiwyg').then((mod) => mod.Editor),
  { ssr: false },
);
interface FieldRichEditorProps {
  input?: any;
  meta?: any;
  label?: string;
  rightLabel?: string;
  placeholder?: string;
  errorMessage?: any;
  prependComp?: any;
  appendComp?: any;
  errorPlacement?: string;
  inputType?: 'text' | 'textarea';
  fieldChanged?: (_: any) => void;
  borderColor?: string;
}

const FieldRichEditor = (props: FieldRichEditorProps) => {
  const {
    input,
    label,
    rightLabel,
    meta,
    placeholder,
    inputType = 'text',
    prependComp,
    appendComp,
    fieldChanged,
    // disabledInput, errorPlacement, zIndex, anchorAppend,
    borderColor = 'background.default',
    ...restProps
  } = props;
  const { onChange, onBlur, onFocus, value } = input;
  const { error, touched } = meta;
  const shouldShowError = !!(touched && error) || (error && value);

  const isError = meta.error && meta.touched;

  const hasAppend = appendComp;

  const _contentState = ContentState.createFromText('Sample content state');
  const raw = convertToRaw(_contentState); // RawDraftContentState JSON
  const [contentState, setContentState] = useState(raw); // ContentState JSON

  const handleChange = (e: any) => {
    console.log(e);
    // onChange(e);
    // fieldChanged?.(e);
  };

  return (
    <FormControl isInvalid={isError}>
      {(label || rightLabel) && (
        <Flex justifyContent={'space-between'}>
          <Box>
            <FormLabel fontSize="xs" fontWeight="medium">
              {label}
            </FormLabel>
          </Box>
          <Box>
            <FormLabel fontSize="xs" fontWeight="medium">
              {rightLabel}
            </FormLabel>
          </Box>
        </Flex>
      )}
      <InputGroup
        borderStyle={'solid'}
        borderWidth={1}
        borderColor={shouldShowError ? 'brand.danger.400' : borderColor}
        borderRadius={8}
        bgColor="background.default"
        overflow="hidden"
        style={{ height: 300 }}
      >
        {prependComp && (
          <InputLeftElement
            children={prependComp}
            // ml={2}
            // mr={2}
            // height="100%"
            position={'relative'}
          />
        )}
        <Box data-color-mode="dark" className={styles.formControl}>
          {/* <MDEditor
            style={{ minHeight: 300 }}
            editorState={value}
            onEditorStateChange={handleChange}
            {...restProps}
          /> */}
          <Editor
            defaultContentState={contentState}
            onContentStateChange={setContentState}
            wrapperClassName="wrapper-class"
            editorClassName="editor-class"
            toolbarClassName="toolbar-class"
          />
          {/* <Input
            as={inputType === 'text' ? 'input' : 'textarea'}
            placeholder={placeholder}
            _placeholder={{ color: '#b3b3b3' }}
            value={value}
            onFocus={onFocus}
            onBlur={(e) => {
              onBlur();
              e?.target?.blur();
            }}
            onChange={handleChange}
            {...restProps}
          /> */}
        </Box>
        {hasAppend && (
          <InputRightElement w="fit-content" pr={2} children={appendComp} />
        )}
      </InputGroup>
      <FormErrorMessage fontSize="sm" color="brand.danger.400">
        {error}
      </FormErrorMessage>
    </FormControl>
  );
};

export default FieldRichEditor;
