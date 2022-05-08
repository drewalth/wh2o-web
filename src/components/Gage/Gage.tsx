import React, { useEffect, useRef, useState } from 'react'
import GageTable from './GageTable'
import { Button, Card, Form, Input, PageHeader, Select } from 'antd'
import { useGagesContext } from '../Provider/GageProvider'
import { Country, GageSearchParams, GageSource } from '../../types'
import { canadianProvinces, StateEntry, usStates } from '../../lib'
import { SyncOutlined } from '@ant-design/icons'
import debounce from 'lodash.debounce'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

export const Gage = (): JSX.Element => {
  const navigate = useNavigate()
  const [windowWidth, setWindowWidth] = useState(window.innerWidth)
  const isMobile = windowWidth <= 900
  const formRef = useRef<HTMLFormElement>(null)
  const { searchParams, setSearchParams, resetPagination, reset } =
    useGagesContext()
  const { t } = useTranslation()

  const handleResize = () => {
    setWindowWidth(window.innerWidth)
  }
  useEffect(() => {
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

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

  const getStateInputLabel = () => {
    if (searchParams.country === Country.CA) {
      return t('province')
    }
    return t('state')
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

  return (
    <>
      <PageHeader title={t('search')} onBack={() => navigate('/')} />
      <Card>
        <Form
          // @ts-ignore
          ref={formRef}
          layout={isMobile ? 'vertical' : 'inline'}
          initialValues={searchParams}
          onValuesChange={handleOnValuesChange}
        >
          <Form.Item name={'country'} label={t('country')}>
            <Select>
              {Object.values(Country).map((country) => (
                <Select.Option key={country} value={country}>
                  {(() => {
                    switch (country) {
                      case Country.NZ:
                        return 'New Zealand'
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
              {properties[searchParams.country].states.map((state) => (
                <Select.Option
                  key={state.abbreviation}
                  value={state.abbreviation}
                >
                  {state.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name={'source'} label={t('source')}>
            <Select>
              {properties[searchParams.country].sources.map((source) => (
                <Select.Option key={source} value={source}>
                  {source}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name={'searchTerm'} label={t('gageName')}>
            <Input placeholder={t('gageName')} allowClear />
          </Form.Item>
          <Form.Item>
            <Button
              type={'ghost'}
              title={t('resetSearch')}
              onClick={() => {
                reset()
                setFormAttributes(Country.US)
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
