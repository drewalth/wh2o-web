import React, { useEffect, useState } from 'react'
// import GageTable from './GageTable'
import { AutoComplete, Button, Form, Modal, notification, Select } from 'antd'
import { CreateGageDto, GageMetric } from '../../types'
import { useGagesContext } from '../Provider/GageProvider'
import { createGage, getUsStates } from '../../controllers'

const defaultForm: CreateGageDto = {
  Name: '',
  SiteId: '',
  Metric: GageMetric.CFS,
}

export const Gage = (): JSX.Element => {
  const [usStates, setUsStates] = useState<
    { name: string; abbreviation: string }[]
  >([])
  const [createModalVisible, setCreateModalVisible] = useState(false)
  const [createForm, setCreateForm] = useState<CreateGageDto>(defaultForm)
  const { searchParams, gages, setSearchParams } = useGagesContext()
  const [options, setOptions] = useState<{ value: string; label: string }[]>([])

  useEffect(() => {
    ;(async () => {
      const result = await getUsStates()
      setUsStates(result)
    })()
  }, [])

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
    setCreateForm(defaultForm)
    setCreateModalVisible(false)
  }

  const handleOk = async () => {
    try {
      const gageName = gages.find((g) => g.siteId === createForm.SiteId)?.name

      await createGage({
        Name: gageName || 'Untitled',
        SiteId: createForm.SiteId,
        Metric: GageMetric.CFS,
      })
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
          <Form.Item label={'State'} name={'state'}>
            <Select>
              {usStates.map((val, index) => (
                <Select.Option value={val.abbreviation} key={index}>
                  {val.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name={'SiteId'} label={'Gage Name'}>
            <AutoComplete options={options} onSearch={onSearch} />
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
      {/*<GageTable />*/}
    </>
  )
}
