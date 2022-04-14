import React, { useEffect, useState } from 'react'
import GageTable from './GageTable'
import { Form, Input, Select } from 'antd'
import { useGagesContext } from '../Provider/GageProvider'
import { getUsStates } from '../../controllers'
import { Country, GageSource } from '../../types'

export const Gage = (): JSX.Element => {
  const [usStates, setUsStates] = useState<
    { name: string; abbreviation: string }[]
  >([])

  const { searchParams, setSearchParams } = useGagesContext()

  // const getGageSourceOptions = (): GageSource[] => {
  //   if (searchParams.country === Country.CA) {
  //     return [GageSource.ENVIRONMENT_CANADA]
  //   }
  //
  //   return [GageSource.USGS]
  // }
  //
  // const getStateOptions = () => {
  //   if (searchParams.country === Country.CA) {
  //     return Object.values(CanadianProvinces)
  //   }
  //
  //   return usStates.length > 0 ? usStates : []
  // }

  useEffect(() => {
    ;(async () => {
      const result = await getUsStates()
      setUsStates(result)
    })()
  }, [])

  return (
    <>
      <Form
        layout={'inline'}
        initialValues={searchParams}
        onValuesChange={(val) => {
          setSearchParams(Object.assign({}, searchParams, val))
        }}
        wrapperCol={{ span: 24 }}
      >
        <Form.Item name={'searchTerm'}>
          <Input placeholder={'Gage Name'} />
        </Form.Item>
        <Form.Item name={'state'}>
          <Select>
            {usStates.length > 0 &&
              usStates.map((state) => (
                <Select.Option
                  key={state.abbreviation}
                  value={state.abbreviation}
                >
                  {state.name}
                </Select.Option>
              ))}
          </Select>
        </Form.Item>
        <Form.Item name={'source'}>
          <Select>
            {Object.values(GageSource).map((source) => (
              <Select.Option key={source} value={source}>
                {source}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item name={'country'}>
          <Select>
            {Object.values(Country).map((country) => (
              <Select.Option key={country} value={country}>
                {country}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
      <div className={'mb-2'} />
      <GageTable />
    </>
  )
}
