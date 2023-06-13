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

export const isTwitter = (value: string) =>
  value && !/http(?:s)?:\/\/(?:www\.)?twitter\.com\/([a-zA-Z0-9_]+)/i.test(value)
    ? 'Invalid twitter address'
    : undefined;

export const isDiscord = (value: string) =>
  value &&
  !/(https?:\/\/)?(www\.)?(discord\.(gg|io|me|li)|discordapp\.com\/invite)\/.+[a-z]/i.test(
    value,
  )
    ? 'Invalid discord address'
    : undefined;

export const isTelegram = (value: string) =>
  value &&
  !/^(?:|(https?:\/\/)?(|www)[.]?((t|telegram)\.me)\/)[a-zA-Z0-9_]{5,32}/i.test(
    value,
  )
    ? 'Invalid telegram address'
    : undefined;

export const isWebsite = (value: string) =>
  value &&
  !/[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+/i.test(value)
    ? 'Invalid website address'
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
