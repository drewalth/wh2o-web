import React, { useState } from 'react'
import { canadianProvinces, StateEntry, usStates } from '../../../lib'
import { AutoComplete, Button, Form, Modal, notification, Select } from 'antd'
import { Country, GageSource } from '../../../types'
import { useGagesContext } from '../../Provider/GageProvider'
import { addUserGage } from '../../../controllers'
import { UserGageTable } from './UserGageTable'
import { useUserContext } from '../UserContext'

export const UserGages = (): JSX.Element => {
  const [createModalVisible, setCreateModalVisible] = useState(false)
  const [selectedGageSiteId, setSelectedGageSiteId] = useState('')
  const { searchParams, gages, setSearchParams } = useGagesContext()
  const { user } = useUserContext()
  const [options, setOptions] = useState<{ value: string; label: string }[]>([])

  const stateOptions: StateEntry[] =
    searchParams.country === Country.CA ? canadianProvinces : usStates

  const sourceOptions: GageSource[] =
    searchParams.country === Country.CA
      ? [GageSource.ENVIRONMENT_CANADA]
      : [GageSource.USGS]

  const onSearch = (searchText: string) => {
    const vals = gages?.filter((g) =>
      g.name.toLocaleLowerCase().includes(searchText.toLocaleLowerCase()),
    )

    if (vals.length) {
      setOptions(
        vals.map((g) => ({
          value: g.siteId,
          label: g.name,
        })),
      )
    }
  }

  const handleClose = () => {
    setCreateModalVisible(false)
  }

  const handleOk = async () => {
    try {
      if (!user || !selectedGageSiteId) return

      const selectedGageId = gages.find((g) => g.siteId === selectedGageSiteId)

      if (!selectedGageId) {
        console.error('no selected gage')
        return
      }

      await addUserGage(selectedGageId.id, user.id)

      notification.success({
        message: 'Gage Created',
        placement: 'bottomRight',
      })
      handleClose()
    } catch (e) {
      console.log(e)
    }
  }

  return (
    <>
      <Modal
        destroyOnClose
        visible={createModalVisible}
        onOk={handleOk}
        onCancel={handleClose}
      >
        <Form
          wrapperCol={{
            span: 23,
          }}
          layout={'vertical'}
          onValuesChange={(val) => {
            setSearchParams(Object.assign({}, searchParams, val))
          }}
          initialValues={searchParams}
        >
          <Form.Item label={'Country'} name={'country'}>
            <Select>
              {Object.values(Country).map((val, index) => (
                <Select.Option value={val} key={index}>
                  {val}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label={'Source'} name={'source'}>
            <Select>
              {sourceOptions.map((val, index) => (
                <Select.Option value={val} key={index}>
                  {val}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label={'State'} name={'state'}>
            <Select>
              {stateOptions.map((val, index) => (
                <Select.Option value={val.abbreviation} key={index}>
                  {val.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name={'SiteId'} label={'Gage Name'}>
            <AutoComplete
              options={options}
              onSearch={onSearch}
              onSelect={(val) => setSelectedGageSiteId(val)}
            />
          </Form.Item>
        </Form>
      </Modal>
      <div
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'flex-end',
          marginBottom: 24,
        }}
      >
        <Button
          type={'primary'}
          disabled={gages.length >= 15}
          onClick={() => setCreateModalVisible(true)}
        >
          Add Gage
        </Button>
      </div>
      <UserGageTable />
    </>
  )
}
