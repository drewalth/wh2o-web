import React, { useEffect } from 'react';
import { AutoComplete } from 'antd';
import { useLazyQuery } from '@apollo/client';
import { GAGES_SEARCH } from '../gage/queries';
import { debounce } from 'lodash';
import { Gage } from '../../types';

export type GageSelectProps = {
  onSelect: (gageId: number) => void;
};

export const GageSelect = ({ onSelect }: GageSelectProps) => {
  const [handleSearch, { data }] =
    useLazyQuery<{ gagesSearch: { gages: Gage[]; limit: number; offset: number; total: number } }>(GAGES_SEARCH);

  const debouncedSearch = debounce(handleSearch, 500);

  const formatOptions = () => {
    if (!data?.gagesSearch) return [];

    return data?.gagesSearch?.gages?.filter((el) => !!el.id).map((g) => ({ value: g.id, label: g.name }));
  };

  useEffect(() => {
    console.log('data', data);
  }, [data]);

  return (
    <AutoComplete
      options={formatOptions()}
      onSelect={onSelect}
      onSearch={(searchText: string) => {
        debouncedSearch({
          variables: {
            gageSearchInput: {
              name: searchText,
              limit: 25,
              offset: 0
            }
          }
        });
      }}
    />
  );
};
