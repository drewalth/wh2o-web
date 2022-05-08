import React, { useRef, useState } from 'react'
import { canadianProvinces, StateEntry, usStates } from '../../../lib'
import { Button, Divider, Form, Input, Modal, notification, Select } from 'antd'
import {
  Country,
  GageSearchParams,
  GageSource,
  RequestStatus,
} from '../../../types'
import { useGagesContext } from '../../Provider/GageProvider'
import { addUserGage } from '../../../controllers'
import { UserGageTable } from './UserGageTable'
import { useUserContext } from '../UserContext'
import debounce from 'lodash.debounce'

export const UserGages = (): JSX.Element => {
  const formRef = useRef<HTMLFormElement>(null)
  const [requestStatus, setRequestStatus] = useState<RequestStatus>('success')
  const [createModalVisible, setCreateModalVisible] = useState(false)
  const [selectedGageSiteId, setSelectedGageSiteId] = useState<number>()
  const { searchParams, setSearchParams, resetPagination, gages } =
    useGagesContext()
  const { user, reload, canBookmarkGages } = useUserContext()

  const setFormAttributes = (country: Country) => {
    if (formRef && formRef.current) {
      const form = formRef.current
      form.setFields([
        {
          name: 'country',
          value: country,
        },
        {
          name: 'state',
          value: properties[country].states[0].abbreviation,
        },
        {
          name: 'source',
          value: properties[country].sources[0],
        },
      ])
    }
  }

  const handleCountryChange = (val: GageSearchParams, country: Country) => {
    resetPagination()
    setSearchParams(
      Object.assign({}, searchParams, {
        ...val,
        source: properties[country].sources[0],
        state: properties[country].states[0].abbreviation,
        country,
      }),
    )
  }

  const properties = {
    [Country.CA]: {
      states: canadianProvinces,
      sources: [GageSource.ENVIRONMENT_CANADA],
      setFields: () => setFormAttributes(Country.CA),
      setParams: (val: GageSearchParams) =>
        handleCountryChange(val, Country.CA),
    },
    [Country.US]: {
      states: usStates,
      sources: [GageSource.USGS],
      setFields: () => setFormAttributes(Country.US),
      setParams: (val: GageSearchParams) =>
        handleCountryChange(val, Country.US),
    },
    [Country.NZ]: {
      states: [{ abbreviation: '--', name: '--' }] as StateEntry[],
      sources: [GageSource.ENVIRONMENT_AUCKLAND],
      setFields: () => setFormAttributes(Country.NZ),
      setParams: (val: GageSearchParams) =>
        handleCountryChange(val, Country.NZ),
    },
  }

  const handleOnValuesChange = debounce((val) => {
    if (val.country) {
      properties[val.country].setParams(val)
      properties[val.country].setFields()
    } else {
      setSearchParams(
        Object.assign({}, searchParams, {
          ...val,
        }),
      )
    }
  }, 300)

  const handleClose = () => {
    setCreateModalVisible(false)
  }

  const getStateInputLabel = () => {
    if (searchParams.country === Country.CA) {
      return 'Province'
    }
    return 'State'
  }

  const handleOk = async () => {
    try {
      if (!user) return

      if (!selectedGageSiteId) {
        console.error('no selected gage')
        return
      }
      setRequestStatus('loading')
      await addUserGage(selectedGageSiteId, user.id)
      await reload()
      setRequestStatus('success')
      notification.success({
        message: 'Gage Created',
        placement: 'bottomRight',
      })
      handleClose()
    } catch (e) {
      console.log(e)
      setRequestStatus('failure')
      notification.error({
        message: 'Failed to bookmark gage',
        placement: 'bottomRight',
      })
    }
  }

  return (
    <>
      <Modal
        destroyOnClose
        visible={createModalVisible}
        onOk={handleOk}
        onCancel={handleClose}
        confirmLoading={requestStatus === 'loading'}
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
              {properties[searchParams.country].sources.map((val, index) => (
                <Select.Option value={val} key={index}>
                  {val}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label={getStateInputLabel()} name={'state'}>
            <Select>
              {properties[searchParams.country].states.map((val, index) => (
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
          disabled={!canBookmarkGages}
          onClick={() => setCreateModalVisible(true)}
        >
          Bookmark Gage
        </Button>
      </div>
      <UserGageTable />
    </>
  )
}
