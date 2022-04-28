import React, { useRef, useState } from 'react'
import debounce from 'lodash.debounce'
import {
  Button,
  Card,
  Checkbox,
  Col,
  Form,
  Input,
  Row,
  Select,
  Tooltip,
} from 'antd'
import GageTable from './GageTable'
import { useGagesContext } from '../Provider/GageProvider'
import { Country, GageSource } from '../../types'
import { canadianProvinces, usStates } from '../../lib'
import { GageMap } from './GageMap'
import { useUserContext } from '../User/UserContext'

/**
 *
 * @todo fix source and state options inputs to reflect currently selected country
 */
export const Gage = (): JSX.Element => {
  const formRef = useRef<HTMLFormElement>(null)
  const [enableFavoritesOnly, setFavoritesOnly] = useState(false)
  const { user } = useUserContext()
  const { searchParams, setSearchParams, resetPagination } = useGagesContext()
  const isVerified = Boolean(user?.verified)
  const favoriteSiteIds = user?.gages.map((g) => g.siteId) ?? []
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

  const handleSubmit = debounce((val) => {
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
    <Row
      gutter={[0, 24]}
      style={{ maxWidth: 1024, marginLeft: 'auto', marginRight: 'auto' }}
    >
      <Col span={24}>
        <Card size="small" style={{ backgroundColor: '#fafafa' }}>
          <Form
            // @ts-ignore
            ref={formRef}
            layout={'inline'}
            initialValues={searchParams}
            onFinish={handleSubmit}
            wrapperCol={{ span: 24 }}
          >
            <Form.Item name={'country'}>
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
            <Form.Item name={'searchTerm'}>
              <Input placeholder={'Gage Name'} allowClear />
            </Form.Item>
            <Form.Item>
              <Tooltip
                title={!isVerified ? 'Please verify your account' : undefined}
              >
                <Checkbox
                  checked={enableFavoritesOnly}
                  onChange={() => setFavoritesOnly((s) => !s)}
                  disabled={!isVerified}
                >
                  Favorites Only
                </Checkbox>
              </Tooltip>
            </Form.Item>
            <Form.Item>
              <Button type="primary" title="Reset Search" htmlType="submit">
                Search
              </Button>
            </Form.Item>
          </Form>
          <GageMap
            siteIds={enableFavoritesOnly ? favoriteSiteIds : undefined}
            style={{ margin: '12px -12px -12px -12px' }}
          />
        </Card>
      </Col>
      <Col span={24}>
        <GageTable
          siteIds={enableFavoritesOnly ? favoriteSiteIds : undefined}
        />
      </Col>
    </Row>
  )
}
