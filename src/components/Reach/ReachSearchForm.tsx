import { Form, Input, Select } from 'antd'
import { useReachContext } from '../Provider/ReachProvider/ReachContext'
import { Country, ReachSearchParams } from '../../types'
import { StateEntry, usStates } from '../../lib'
import { useRef } from 'react'
import debounce from 'lodash.debounce'
import { useBreakpoint } from '../../hooks'
import { useTranslation } from 'react-i18next'

export const ReachSearchForm = () => {
  const { t } = useTranslation()
  const formRef = useRef<HTMLFormElement>(null)
  const { searchParams, setSearchParams } = useReachContext()
  const { isMobile } = useBreakpoint()

  const selectedCountry = searchParams.country

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
          name: 'name',
          value: '',
        },
      ])
    }
  }

  const properties = {
    [Country.US]: {
      states: usStates,
      setFields: () => setFormAttributes(Country.US),
      setParams: (val: ReachSearchParams) =>
        handleCountryChange(val, Country.US),
    },
    [Country.CL]: {
      states: [{ abbreviation: '--', name: '--' }] as StateEntry[],
      setFields: () => setFormAttributes(Country.CL),
      setParams: (val: ReachSearchParams) =>
        handleCountryChange(val, Country.CL),
    },
  }

  const handleCountryChange = (val: ReachSearchParams, country: Country) => {
    setSearchParams({
      ...val,
      country,
      state: properties[country].states[0].abbreviation,
    })
  }

  const handleValueChange = debounce((val) => {
    if (val.country) {
      properties[val.country].setParams(val)
      properties[val.country].setFields()
    } else {
      setSearchParams({ ...searchParams, ...val })
    }
  }, 300)

  return (
    <Form
      // @ts-ignore
      ref={formRef}
      initialValues={searchParams}
      onValuesChange={handleValueChange}
      layout={isMobile ? 'vertical' : 'inline'}
      style={{ marginBottom: 24 }}
    >
      <Form.Item label={t('country')} name={'country'}>
        <Select>
          {Object.values(Country).map((c) => (
            <Select.Option key={c} value={c}>
              {(() => {
                switch (c) {
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
      <Form.Item label={t('state')} name={'state'}>
        <Select>
          {properties[selectedCountry].states.map((c) => (
            <Select.Option key={c.abbreviation} value={c.abbreviation}>
              {c.name}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item label={t('name')} name={'name'}>
        <Input />
      </Form.Item>
    </Form>
  )
}
