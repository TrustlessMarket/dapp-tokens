/* eslint-disable @typescript-eslint/no-explicit-any */
import BigNumber from 'bignumber.js';
import { reduce } from 'lodash';

export const required = (value: unknown) => (value ? undefined : 'Required');
export const requiredAmount = (value: unknown) =>
  value && Number(value) !== 0 ? undefined : 'Required';

export const isEmail = (message?: string) => (value: string) =>
  value &&
  !/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i.test(
    value,
  )
    ? message || 'Invalid email address'
    : undefined;

export const composeValidators =
  (...validators: any[]) =>
  (value: unknown, values: unknown, props: any) =>
    reduce(
      validators,
      (error, validator) => error || validator(value, values, props),
      undefined,
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
