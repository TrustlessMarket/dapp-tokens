import {Box, Divider, Flex, forwardRef, Text, useToast,} from "@chakra-ui/react";
import {useRouter} from "next/router";
import React, {useRef, useState,} from "react";
import {Field, Form, useForm, useFormState} from "react-final-form";
import styles from "./styles.module.scss";
import HorizontalItem from "@/components/Swap/horizontalItem";
import SlippageSettingButton from "@/components/Swap/slippageSetting/button";

export const MakeFormSwap = forwardRef((props, ref) => {
  const {
    onSubmit,
    submitting,
  } = props;

  return (
    <form onSubmit={onSubmit} style={{ height: "100%" }}>
      <HorizontalItem
        label={
          <Text fontSize={"md"} color={"#B1B5C3"}>
            Swap
          </Text>
        }
        value={
          <SlippageSettingButton></SlippageSettingButton>
        }
      />
    </form>
  );
});

// @ts-ignore
const TradingForm = ({ initValues }) => {
  const refForm = useRef();
  const [submitting, setSubmitting] = useState(false);
  const toast = useToast();
  const router = useRouter();

  const handleSubmit = async (values: any) => {
    try {
      setSubmitting(true);

    } catch (e) {
      // toastError(toast, e, { slippage, maxSlippage: 2 });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box className={styles.container}>
      <Form
        onSubmit={handleSubmit}
        initialValues={{  }}
      >
        {({ handleSubmit }) => (
          <MakeFormSwap
            ref={refForm}
            onSubmit={handleSubmit}
            submitting={submitting}
          />
        )}
      </Form>
    </Box>
  );
};

export default TradingForm;
