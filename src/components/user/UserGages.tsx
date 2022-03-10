import React, { useState } from 'react';
import { GageTable } from '../common/GageTable';
import { useUserContext } from './userContext';
import { Button } from 'antd';
import { UserGageModal } from './UserGageModal';

export const UserGages = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const { data, loading, updateUser } = useUserContext();

  const handleDelete = async (id: number) => {
    const gages = data?.gages.filter((g) => g.id !== id).map((v) => v.id);

    await updateUser('gages', gages);
  };

  const handleAddGage = async (gageId: number) => {
    let payload: number[] = [];

    const existingGages = data?.gages.map((g) => g.id) || [];

    if (existingGages.length > 0) {
      payload = [...existingGages, gageId];
    } else {
      payload = [gageId];
    }

    await updateUser('gages', payload);
    setModalVisible(false);
  };

  return (
    <>
      <UserGageModal visible={modalVisible} onCancel={() => setModalVisible(false)} onOk={handleAddGage} />
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
        <Button onClick={() => setModalVisible(true)}>Add Bookmark</Button>
      </div>
      <GageTable
        gages={data?.gages || []}
        loading={loading}
        searchEnabled={false}
        viewButton={false}
        actions
        onDelete={handleDelete}
      />
    </>
  );
};
