import React, { useRef } from 'react'
import GageTable from './GageTable'
import { Button, Card, Form, Input, PageHeader, Select } from 'antd'
import { useGagesContext } from '../Provider/GageProvider'
import { Country, GageSource } from '../../types'
import { canadianProvinces, usStates } from '../../lib/states'
// import { useAppContext } from '../App/AppContext'
import { SyncOutlined } from '@ant-design/icons'
import debounce from 'lodash.debounce'
import { useNavigate } from 'react-router-dom'

/**
 *
 * @todo fix source and state options inputs to reflect currently selected country
 */
export const Gage = (): JSX.Element => {
  const navigate = useNavigate()
  const formRef = useRef<HTMLFormElement>(null)
  const { searchParams, setSearchParams, resetPagination, reset } =
    useGagesContext()
  const stateOptions =
    searchParams.country === Country.CA ? canadianProvinces : usStates

  const sourceOptions =
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

  const getStateInputLabel = () => {
    if (searchParams.country === Country.CA) {
      return 'Province'
    }
    return 'State'
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

  return (
    <>
      <PageHeader title={'Search'} onBack={() => navigate('/')} />
      <Card>
        <Form
          // @ts-ignore
          ref={formRef}
          layout={'inline'}
          initialValues={searchParams}
          onValuesChange={handleOnValuesChange}
        >
          <Form.Item name={'country'} label={'Country'}>
            <Select>
              {Object.values(Country).map((country) => (
                <Select.Option key={country} value={country}>
                  {(() => {
                    switch (country) {
                      case Country.US:
                        return 'United States'
                      default:
                      case Country.CA:
                        return 'Canada'
                    }
                  })()}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name={'state'} label={getStateInputLabel()}>
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
          <Form.Item name={'searchTerm'}>
            <Input placeholder={'Gage Name'} allowClear />
          </Form.Item>
          <Form.Item>
            <Button
              type={'ghost'}
              title={'Reset Search'}
              onClick={() => {
                reset()
                setFormAttributes(Country.CA)
              }}
            >
              <SyncOutlined />
            </Button>
          </Form.Item>
        </Form>
      </Card>
      <GageTable />
    </>
  )
}
