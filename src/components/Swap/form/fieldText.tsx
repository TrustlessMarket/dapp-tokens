import {
  Box,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";

import styles from "./styles.module.scss";

interface FieldTextProps {
  input?: any;
  meta?: any;
  label?: string;
  rightLabel?: string;
  placeholder?: string;
  errorMessage?: any;
  errorPlacement?: string;
  inputType?: "text" | "textarea";
  fieldChanged?: (_: any) => void;
}

const FieldText = (props: FieldTextProps) => {
  const {
    input,
    label,
    rightLabel,
    meta,
    placeholder,
    errorMessage,
    errorPlacement = "bottom",
    inputType = "text",
    appendComp,
    fieldChanged,
    // disabledInput, errorPlacement, zIndex, anchorAppend,
    ...restProps
  } = props;
  const { onChange, onBlur, onFocus, value } = input;
  const { error, touched } = meta;
  const shouldShowError = !!(touched && error) || (error && value);

  const isError = meta.error && meta.touched;

  const hasAppend = appendComp;

  const handleChange = (e: any) => {
    onChange(e.target.value);
    fieldChanged?.(e.target.value);
  };

  return (
    <FormControl isInvalid={isError}>
      {(label || rightLabel) && (
        <Flex justifyContent={"space-between"}>
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
        borderWidth={1}
        borderColor={
          shouldShowError ? "brand.danger.400" : "background.default"
        }
        borderRadius={8}
        bgColor="background.default"
        overflow="hidden"
      >
        <Box className={styles.formControl} bgColor="#f4f5f6">
          <Input
            as={inputType === "text" ? "input" : "textarea"}
            placeholder={placeholder}
            _placeholder={{ color: "#b3b3b3" }}
            value={value}
            onFocus={onFocus}
            onBlur={(e) => {
              onBlur();
              e?.target?.blur();
            }}
            onChange={handleChange}
            {...restProps}
          />
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

export default FieldText;
