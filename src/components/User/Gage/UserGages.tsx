import React, { useRef, useState } from 'react'
import { canadianProvinces, StateEntry, usStates } from '../../../lib'
import { Button, Divider, Form, Input, Modal, notification, Select } from 'antd'
import { Country, GageSource } from '../../../types'
import { useGagesContext } from '../../Provider/GageProvider'
import { addUserGage } from '../../../controllers'
import { UserGageTable } from './UserGageTable'
import { useUserContext } from '../UserContext'
import debounce from 'lodash.debounce'

export const UserGages = (): JSX.Element => {
  const formRef = useRef<HTMLFormElement>(null)
  const [createModalVisible, setCreateModalVisible] = useState(false)
  const [selectedGageSiteId, setSelectedGageSiteId] = useState<number>()
  const { searchParams, setSearchParams, resetPagination, gages } =
    useGagesContext()
  const { user, reload } = useUserContext()

  const stateOptions: StateEntry[] =
    searchParams.country === Country.CA ? canadianProvinces : usStates

  const sourceOptions: GageSource[] =
    searchParams.country === Country.CA
      ? [GageSource.ENVIRONMENT_CANADA]
      : [GageSource.USGS]

  const setFormAttributes = (country: Country) => {
    if (formRef && formRef.current) {
      const form = formRef.current

      switch (country) {
        case Country.US:
          form.setFields([
            {
              name: 'country',
              value: 'US',
            },
            {
              name: 'state',
              value: 'AL',
            },
            {
              name: 'source',
              value: 'USGS',
            },
          ])
          return
        default:
        case Country.CA:
          form.setFields([
            {
              name: 'country',
              value: 'CA',
            },
            {
              name: 'state',
              value: 'BC',
            },
            {
              name: 'source',
              value: 'ENVIRONMENT_CANADA',
            },
          ])

          return
      }
    }
  }

  const handleOnValuesChange = debounce((val) => {
    try {
      if (searchParams.country === Country.US && val.country === Country.CA) {
        resetPagination()
        setSearchParams(
          Object.assign({}, searchParams, {
            ...val,
            source: GageSource.ENVIRONMENT_CANADA,
            state: 'BC',
          }),
        )
        setFormAttributes(Country.CA)
        return
      }

      if (searchParams.country === Country.CA && val.country === Country.US) {
        resetPagination()
        setSearchParams(
          Object.assign({}, searchParams, {
            ...val,
            source: GageSource.USGS,
            state: 'AL',
          }),
        )
        setFormAttributes(Country.US)
        return
      }

      if (searchParams.state !== val.state) {
        resetPagination()
      }

      setSearchParams(Object.assign({}, searchParams, val))
    } catch (e) {
      console.error(e)
    }
  }, 300)

  const handleClose = () => {
    setCreateModalVisible(false)
  }

  const handleOk = async () => {
    try {
      if (!user) return

      if (!selectedGageSiteId) {
        console.error('no selected gage')
        return
      }
      await addUserGage(selectedGageSiteId, user.id)
      await reload()
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
          preserve={false}
          // @ts-ignore
          ref={formRef}
          wrapperCol={{
            span: 23,
          }}
          layout={'vertical'}
          onValuesChange={handleOnValuesChange}
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
          <Form.Item name={'searchTerm'} label={'Search'}>
            <Input placeholder={'Gage Name'} allowClear />
          </Form.Item>
          <Divider />
          <Form.Item name={'id'} label={'Gage Search Results'}>
            <Select
              onSelect={(value) => {
                console.log('value: ', value)
                setSelectedGageSiteId(value)
              }}
            >
              {gages &&
                gages.length > 0 &&
                gages.map((g) => (
                  <Select.Option key={g.id} value={g.id}>
                    {g.name}
                  </Select.Option>
                ))}
            </Select>
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
