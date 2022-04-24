import { Card, Col, Row, Spin, Typography } from 'antd'
import { useEffect, useState } from 'react'
import { clearToken } from '../../lib/token'
import { useUserContext } from '../../components/User/UserContext'
import { RequestStatus } from '../../types'
import { CheckCircleTwoTone } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'

export const Logout = () => {
  const { reset } = useUserContext()
  const navigate = useNavigate()
  const [status, setStatus] = useState<RequestStatus>('loading')
  useEffect(() => {
    ;(async () => {
      clearToken()
      reset()
      await new Promise((resolve) => setTimeout(resolve, 2000))
      setStatus('success')
      await new Promise((resolve) => setTimeout(resolve, 2000))
      navigate('/')
    })()
  }, [])

  return (
    <Row justify={'center'}>
      <Col span={24} sm={12} md={8} lg={12} xl={6}>
        <Card>
          <div
            style={{
              display: 'flex',
              flexFlow: 'column nowrap',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            {status === 'loading' ? (
              <>
                <Spin />
                <Typography.Text type={'secondary'}>
                  Clearing session data...
                </Typography.Text>
              </>
            ) : (
              <>
                <CheckCircleTwoTone size={32} />
                <Typography.Text type={'secondary'}>
                  Cleared. See ya!
                </Typography.Text>
              </>
            )}
          </div>
        </Card>
      </Col>
    </Row>
  )
}
