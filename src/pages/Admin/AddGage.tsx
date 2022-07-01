import React, { useRef, useState } from 'react'
import { Button, Form, Input, notification, Select } from 'antd'
import {
  Country,
  CreateGageDto,
  GageMetric,
  GageSearchParams,
  GageSource,
  RequestStatus,
} from '../../types'
import { useTranslation } from 'react-i18next'
import { createGage } from '../../controllers'
import { canadianProvinces, StateEntry, usStates } from '../../lib'

const DEFAULT_FORM: CreateGageDto = {
  description: '',
  disabled: false,
  siteId: '',
  source: GageSource.USGS,
  state: usStates[0].abbreviation,
  name: '',
  country: 'US',
  metric: GageMetric.CFS,
}

export const AddGage = () => {
  const formRef = useRef<HTMLFormElement>(null)
  const [form, setForm] = useState<CreateGageDto>(DEFAULT_FORM)
  const { t } = useTranslation()
  const [requestStatus, setRequestStatus] = useState<RequestStatus>('success')

  const handleSubmit = async () => {
    try {
      setRequestStatus('loading')
      await createGage(form)
      setRequestStatus('success')
      setForm({ ...form, name: '', siteId: '' })
      notification.success({
        message: 'Gage created',
        placement: 'bottomRight',
      })
    } catch (e) {
      console.error(e)
      setRequestStatus('failure')
      notification.error({
        message: 'Failed to create gage',
        placement: 'bottomRight',
      })
    }
  }

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
          name: 'metric',
          value: properties[country].metrics[0],
        },
      ])
    }
  }

  const imperialMetrics: GageMetric[] = [GageMetric.FT, GageMetric.CFS]
  const restOfWorldMetrics: GageMetric[] = [GageMetric.CMS, GageMetric.M]

  const properties = {
    [Country.CA]: {
      states: canadianProvinces,
      sources: [GageSource.ENVIRONMENT_CANADA],
      metrics: restOfWorldMetrics,
      setFields: () => setFormAttributes(Country.CA),
      setParams: (val: GageSearchParams) =>
        handleCountryChange(val, Country.CA),
    },
    [Country.US]: {
      states: usStates,
      sources: [GageSource.USGS],
      metrics: imperialMetrics,
      setFields: () => setFormAttributes(Country.US),
      setParams: (val: GageSearchParams) =>
        handleCountryChange(val, Country.US),
    },
    [Country.NZ]: {
      states: [{ abbreviation: '--', name: '--' }] as StateEntry[],
      sources: [GageSource.ENVIRONMENT_AUCKLAND],
      metrics: restOfWorldMetrics,
      setFields: () => setFormAttributes(Country.NZ),
      setParams: (val: GageSearchParams) =>
        handleCountryChange(val, Country.NZ),
    },
    [Country.CL]: {
      states: [{ abbreviation: '--', name: '--' }] as StateEntry[],
      sources: [GageSource.ENVIRONMENT_CHILE],
      metrics: restOfWorldMetrics,
      setFields: () => setFormAttributes(Country.CL),
      setParams: (val: GageSearchParams) =>
        handleCountryChange(val, Country.CL),
    },
  }

  const handleCountryChange = (val: GageSearchParams, country: Country) => {
    setForm(
      Object.assign({}, form, {
        ...val,
        source: properties[country].sources[0],
        state: properties[country].states[0].abbreviation,
        metric: properties[country].metrics[0],
        country,
      }),
    )
  }

  const getStateInputLabel = () => {
    if (form.country === Country.CA) {
      return t('province')
    }
    return t('state')
  }

  const formValid = form.name.length > 0 && form.siteId.length > 0

  return (
    <Form
      // @ts-ignore
      ref={formRef}
      onSubmitCapture={handleSubmit}
      initialValues={form}
      onValuesChange={(val) => {
        if (val.country) {
          properties[val.country].setParams(val)
          properties[val.country].setFields()
        } else {
          setForm(Object.assign({}, form, { ...val }))
        }
      }}
    >
      <Form.Item name={'name'} label={t('gageName')} required>
        <Input />
      </Form.Item>
      <Form.Item name={'siteId'} label={t('stationId')} required>
        <Input />
      </Form.Item>
      <Form.Item name={'country'} label={t('country')} required>
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
      <Form.Item name={'state'} label={getStateInputLabel()} required>
        <Select>
          {properties[form.country].states.map((state) => (
            <Select.Option key={state.abbreviation} value={state.abbreviation}>
              {state.name}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item name={'source'} label={t('source')} required>
        <Select>
          {properties[form.country].sources.map((source) => (
            <Select.Option key={source} value={source}>
              {source}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item name={'metric'} label={t('metric')} required>
        <Select>
          {properties[form.country].metrics.map((metric) => (
            <Select.Option key={metric} value={metric}>
              {metric}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
      <Button
        htmlType={'submit'}
        type={'primary'}
        disabled={!formValid}
        loading={requestStatus === 'loading'}
      >
        {t('submit')}
      </Button>
    </Form>
  )
}
