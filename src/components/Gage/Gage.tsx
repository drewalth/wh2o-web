import React from 'react'
import GageTable from './GageTable'
import { Form, Input, Select } from 'antd'
import { useGagesContext } from '../Provider/GageProvider'
import { Country, GageSource } from '../../types'
import { usStates, canadianProvinces } from '../../lib/states'

/**
 *
 * @todo fix source and state options inputs to reflect currently selected country
 */
export const Gage = (): JSX.Element => {
  const { searchParams, setSearchParams } = useGagesContext()

  const stateOptions =
    searchParams.country === Country.CA ? canadianProvinces : usStates

  const sourceOptions =
    searchParams.country === Country.CA
      ? [GageSource.ENVIRONMENT_CANADA]
      : [GageSource.USGS]

  return (
    <>
      <Form
        layout={'inline'}
        initialValues={searchParams}
        onValuesChange={(val) => {
          if (
            searchParams.country === Country.US &&
            val.country === Country.CA
          ) {
            setSearchParams(
              Object.assign({}, searchParams, {
                ...val,
                source: GageSource.ENVIRONMENT_CANADA,
                state: 'BC',
              }),
            )

            return
          }

          if (
            searchParams.country === Country.CA &&
            val.country === Country.US
          ) {
            setSearchParams(
              Object.assign({}, searchParams, {
                ...val,
                source: GageSource.USGS,
                state: 'AL',
              }),
            )

            return
          }

          setSearchParams(Object.assign({}, searchParams, val))
        }}
        wrapperCol={{ span: 24 }}
      >
        <Form.Item name={'searchTerm'}>
          <Input placeholder={'Gage Name'} />
        </Form.Item>
        <Form.Item name={'state'}>
          <Select>
            {stateOptions.map((state) => (
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
            {sourceOptions.map((source) => (
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
