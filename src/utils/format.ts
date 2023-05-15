/* eslint-disable @typescript-eslint/no-explicit-any */
import Web3 from 'web3';
import BigNumber from 'bignumber.js';

export const exponentialToDecimal = (exponential: number): string => {
  let decimal = exponential.toString().toLowerCase();
  if (decimal.includes('e+')) {
    const exponentialSplitted = decimal.split('e+');
    let postfix = '';
    for (
      let i = 0;
      i <
      +exponentialSplitted[1] -
        (exponentialSplitted[0].includes('.')
          ? exponentialSplitted[0].split('.')[1].length
          : 0);
      i++
    ) {
      postfix += '0';
    }
    const addCommas = (text: string): string => {
      let j = 3;
      let textLength = text.length;
      while (j < textLength) {
        text = `${text.slice(0, textLength - j)}, ${text.slice(
          textLength - j,
          textLength,
        )}`;
        textLength++;
        j += 3 + 1;
      }
      return text;
    };
    decimal = addCommas(exponentialSplitted[0].replace('.', '') + postfix);
  }
  if (decimal.toLowerCase().includes('e-')) {
    const exponentialSplitted = decimal.split('e-');
    let prefix = '0.';
    for (let i = 0; i < +exponentialSplitted[1] - 1; i++) {
      prefix += '0';
    }
    decimal = prefix + exponentialSplitted[0].replace('.', '');
  }
  return decimal;
};

export const decimalToExponential = (decimal: number): number => {
  return parseFloat(`1e${decimal}`);
};

export const formatCurrency = (value: number): string => {
  function getDecimalPart(num: number): number {
    if (Number.isInteger(num)) {
      return 0;
    }

    const decimalStr = exponentialToDecimal(num).split('.')[1];
    return decimalStr.length;
  }

  const decimalLength = getDecimalPart(value);
  return value
    .toFixed(decimalLength > 2 ? decimalLength : 2)
    .replace(/\d(?=(\d{3})+\.)/g, '$&,');
};

export const formatBTCPrice = (
  price: number | string,
  emptyStr?: string,
  precision = 5,
): string => {
  if (!price) return emptyStr || '-';
  const priceNumb = new BigNumber(price).dividedBy(1e8).toNumber();
  return ceilPrecised(priceNumb, precision).toString().replace(',', '.');
};

export const formatPrice = (price: number | string, emptyStr?: string): string => {
  if (!price) return emptyStr || '-';
  const priceNumb = new BigNumber(price).toNumber();
  return ceilPrecised(priceNumb, 4).toString().replace(',', '.');
};

export const formatEthPrice = (
  price: string | number | any | null,
  emptyStr?: string,
  precision = 10,
): string => {
  if (!price) return emptyStr || '-';
  return ceilPrecised(parseFloat(Web3.utils.fromWei(`${price}`, 'ether')), precision)
    .toString()
    .replace(',', '.');
};

export const formatEthPriceFloor = (
  price: string | number | any | null,
  emptyStr?: string,
  precision = 10,
): string => {
  if (!price) return emptyStr || '-';
  // console.log(
  //   'aaaaa',
  //   floorPrecised(Web3.utils.fromWei(`${price}`, 'ether'), precision)
  //     .toString()
  //     .replace(',', '.'),
  // );

  return floorPrecised(
    parseFloat(Web3.utils.fromWei(`${price}`, 'ether')).toString(),
    precision,
  )
    .toString()
    .replace(',', '.');
};

export const formatEthPriceInput = (
  price: string | null,
  emptyStr?: string,
): string => {
  if (!price) return emptyStr || '-';
  const priceNumb = new BigNumber(price).dividedBy(1e18).toNumber();
  return ceilPrecised(priceNumb, 4).toString().replace(',', '.');
};

export const formatEthPriceSubmit = (
  price: string | null,
  emptyStr?: string,
): string => {
  if (!price) return emptyStr || '-';
  const priceNumb = new BigNumber(ceilPrecised(price))
    .multipliedBy(1e18)
    .toString(10);
  return priceNumb;
};

export const formatAmountBigNumber = (
  amount: number | string = 0,
  decimals: any = 18,
) => {
  return `${new BigNumber(amount).dividedBy(10 ** Number(decimals)).toString(10)}`;
};

export const formatAmountSigning = (
  amount: number | string = 0,
  decimals: any = 18,
) => {
  return `${new BigNumber(amount)
    .multipliedBy(10 ** Number(decimals))
    .toString(10)}`;
};

export const ceilPrecised = (number: number | string, precision = 18) => {
  const power = Math.pow(10, precision);
  return Math.ceil(Number(number) * power) / power;
};

export const floorPrecised = (number: string, precision = 8) => {
  const power = Math.pow(10, precision);
  return Math.floor(Number(number) * power) / power;
};

export const formatTCPrice = (price: string | null, emptyStr?: string): string => {
  if (!price) return emptyStr || '-';
  const priceNumb = new BigNumber(price).dividedBy(1e18).toNumber();
  return ceilPrecised(priceNumb, 4).toString().replace(',', '.');
};
