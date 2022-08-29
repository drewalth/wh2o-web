import React, { useRef } from 'react'
import GageTable from './GageTable'
import { Card, Collapse, Form, Input, PageHeader, Select } from 'antd'
import { DEFAULT_PAGINATION, useGagesContext } from '../Provider/GageProvider'
import { Country, GageSearchParams, GageSource } from '../../types'
import { canadianProvinces, StateEntry, usStates } from '../../lib'
import debounce from 'lodash.debounce'
import { useTranslation } from 'react-i18next'
import { useBreakpoint } from '../../hooks'
import { SEO } from '../Common'

export const Gage = (): JSX.Element => {
  const { isMobile } = useBreakpoint()
  const formRef = useRef<HTMLFormElement>(null)
  const {
    searchParams,
    setSearchParams,
    resetPagination,
    fetchGages,
    pagination,
  } = useGagesContext()
  const { t } = useTranslation()

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
        {
          name: 'name',
          value: '',
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
    [Country.CL]: {
      states: [{ abbreviation: '--', name: '--' }] as StateEntry[],
      sources: [GageSource.ENVIRONMENT_CHILE],
      setFields: () => setFormAttributes(Country.CL),
      setParams: (val: GageSearchParams) =>
        handleCountryChange(val, Country.CL),
    },
  }

  const handleCountryChange = async (
    val: GageSearchParams,
    country: Country,
  ) => {
    resetPagination()
    const params: GageSearchParams = {
      ...searchParams,
      ...val,
      ...pagination,
      country,
      source: properties[country].sources[0],
      state: properties[country].states[0].abbreviation,
      ...DEFAULT_PAGINATION,
    }
    setSearchParams(params)
    await fetchGages(params)
  }

  const getStateInputLabel = () => {
    if (searchParams.country !== Country.US) {
      return t('province')
    }
    return t('state')
  }

  const handleOnValuesChange = debounce(async (val) => {
    if (val.country) {
      properties[val.country].setParams(val)
      properties[val.country].setFields()
    } else {
      const params = { ...searchParams, ...val }
      setSearchParams(params)
      await fetchGages(params)
    }
  }, 300)

  const filtersForm = (
    <Form
      // @ts-ignore
      ref={formRef}
      layout={isMobile ? 'vertical' : 'inline'}
      initialValues={searchParams}
      onValuesChange={handleOnValuesChange}
      style={{ marginBottom: 24 }}
    >
      <Form.Item name={'country'} label={t('country')}>
        <Select>
          {Object.values(Country).map((country) => (
            <Select.Option key={country} value={country}>
              {(() => {
                switch (country) {
                  case Country.NZ:
                    return t('newZealand')
                  case Country.US:
                    return t('unitedStates')
                  case Country.CL:
                    return t('chile')
                  default:
                  case Country.CA:
                    return t('canada')
                }
              })()}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item name={'state'} label={getStateInputLabel()}>
        <Select>
          {properties[searchParams.country].states.map((state) => (
            <Select.Option key={state.abbreviation} value={state.abbreviation}>
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
      <Form.Item name={'name'} label={t('gageName')}>
        <Input placeholder={t('gageName')} allowClear />
      </Form.Item>
    </Form>
  )

  const getFiltersForm = () => {
    if (isMobile) {
      return (
        <Collapse style={{ marginBottom: 24 }}>
          <Collapse.Panel key={'form'} header={'Filters'}>
            {filtersForm}
          </Collapse.Panel>
        </Collapse>
      )
    }

    return filtersForm
  }

  return (
    <>
      <PageHeader title={`${t('gage')}  ${t('search')}`} />
      <Card>
        {getFiltersForm()}
        <GageTable />
      </Card>
      <SEO title={'wh2o - Gage Search'} link={'https://wh2o.io/gage'} />
    </>
  )
}
