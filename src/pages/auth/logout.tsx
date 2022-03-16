import React, { useEffect, useState } from 'react'
import { Col, Row, Spin, Typography } from 'antd'
import { authColSpan } from '../../components/auth/defaults'
import { CheckCircleOutlined } from '@ant-design/icons'
import { resetCache } from '../../components/apollo/ApolloProvider'
import { navigate } from 'gatsby'

const Logout = () => {
  const [showSpinner, setShowSpinner] = useState(true)

  useEffect(() => {
    ;(async () => {
      await new Promise((resolve) => setTimeout(resolve, 2000))
      await resetCache()
      setShowSpinner(false)
      await new Promise((resolve) => setTimeout(resolve, 1000))
      await navigate('/')
    })()
  }, [])

  return (
    <Row justify={'center'} align={'middle'}>
      <Col {...authColSpan}>
        <div
          style={{
            display: 'flex',
            flexFlow: 'column nowrap',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          {showSpinner ? (
            <>
              <Spin />
              <Typography.Text type={'secondary'}>Clearing session data...</Typography.Text>
            </>
          ) : (
            <>
              <CheckCircleOutlined style={{ fontSize: 26 }} />
              <Typography.Text type={'secondary'}>Peace.</Typography.Text>
            </>
          )}
        </div>
      </Col>
    </Row>
  )
}

export default Logout
