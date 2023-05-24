import React, { useState } from 'react';
import { Button, Input } from '@chakra-ui/react';
import s from './styles.module.scss';
import { CDN_URL } from '@/configs';

interface IProps {
  onSearch: (_v: string) => void;
}

const Search: React.FC<IProps> = ({ onSearch }: IProps): React.ReactElement => {
  const [searchVal, setSearchVal] = useState('');

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onSearch(searchVal);
    }
  };

  const clearInput = () => {
    setSearchVal('');
    onSearch('');
  };

  return (
    <div className={s.searchBarWrapper}>
      <p className={s.searchTitle}>Find your contribution</p>
      <div className={s.formWrapper}>
        <div className={s.inputWrapper}>
          <Input
            onChange={e => setSearchVal(e.target.value)}
            onKeyDown={handleKeyDown}
            value={searchVal}
            className={s.input}
            placeholder="Enter your TC wallet address or ENS"
          />
          <button onClick={clearInput} className={s.clearBtn}>
            <img
              src={`${CDN_URL}/icons/clear-input-20.svg`}
              alt="x-contained"
            />
          </button>
        </div>
        <Button
          onClick={() => onSearch(searchVal)}
          isDisabled={!searchVal}
          className={s.submitBtn}
        >
          Search
        </Button>
      </div>
    </div>
  );
};

export default Search;
