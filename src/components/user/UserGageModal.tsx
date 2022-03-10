import React, { useMemo, useState } from 'react';
import { Form, Input, Modal, Select } from 'antd';
import { Gage, GageSearchInput, GageSearchResponse } from '../../types';
import { useQuery } from '@apollo/client';
import { GAGES_SEARCH } from '../gage/queries';
import { usStates } from '../../helpers/usStates';
import { debounce } from 'lodash';

export type UserGageModalProps = {
  visible: boolean;
  onCancel: () => void;
  onOk: (gageId: number) => Promise<void>;
};

export const UserGageModal = ({ visible, onCancel, onOk }: UserGageModalProps) => {
  const [selectedGage, setSelectedGage] = useState(0);
  const [gageSearchInput, setGageSearchInput] = useState<GageSearchInput>({
    limit: 25,
    offset: 0,
    state: 'CO',
    country: 'US'
  });
  const { data, loading, error } = useQuery<{ gagesSearch: GageSearchResponse }>(GAGES_SEARCH, {
    variables: {
      gageSearchInput
    }
  });

  const memoStates = useMemo(() => usStates, []);
  const handleValueChange = debounce((val) => setGageSearchInput(Object.assign({}, gageSearchInput, val)), 300);

  return (
    <Modal visible={visible} onCancel={onCancel} onOk={() => onOk(selectedGage)} destroyOnClose>
      <Form initialValues={gageSearchInput} onValuesChange={handleValueChange}>
        <Form.Item label={'Name'} name={'name'}>
          <Input />
        </Form.Item>
        <Form.Item label={'State'} name={'state'}>
          <Select>
            {memoStates.map((state) => (
              <Select.Option key={state.abbreviation} value={state.abbreviation}>
                {state.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label={'Gage Options'}>
          <Select onSelect={(val: number) => setSelectedGage(val)}>
            {data?.gagesSearch?.gages?.map((el) => (
              <Select.Option key={el.id} value={el.id}>
                {el.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};
