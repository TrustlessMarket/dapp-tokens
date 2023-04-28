import BigNumber from "bignumber.js";

export const required = (value: any) => (value ? undefined : "Required");
export const isNameValid = (value: any) =>
  value
    ? /[^A-Za-z0-9# ]+/i.test(value)
      ? "Should be word, number, #."
      : undefined
    : "Required";
export const isEmail = (message?: string) => (value: string) =>
  value &&
  !/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i.test(
    value
  )
    ? message || "Invalid email address"
    : undefined;

export const composeValidators =
  (...validators: any[]) =>
  (value: any, values: any) =>
    validators.reduce(
      (error, validator) => error || validator(value, values),
      undefined
    );

export const maxValue = (max: number, message?: string) => (value: number) => {
  if (isNaN(value)) return `Invalid number`;
  if (new BigNumber(value).isGreaterThan(max))
    return message || `Should be less than ${max}`;
  return undefined;
};

export const minValue = (min: number, message?: string) => (value: number) => {
  if (isNaN(value)) return `Invalid number`;
  if (new BigNumber(value).isLessThan(min))
    return message || `Should be greater than ${min}`;
  return undefined;
};
