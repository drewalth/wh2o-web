import { Card, Col, Row, Spin, Typography } from 'antd'
import { useEffect } from 'react'
import { clearToken } from '../../lib/token'
import { useUserContext } from '../../components/User/UserContext'
import { useNavigate } from 'react-router-dom'

export const Logout = () => {
  const { reset } = useUserContext()
  const navigate = useNavigate()
  useEffect(() => {
    ;(async () => {
      clearToken()
      reset()
      await new Promise((resolve) => setTimeout(resolve, 3000))
      navigate('/')
    })()
  }, [])

  return (
    <Row justify={'center'}>
      <Col span={24} sm={4}>
        <Card>
          <div
            style={{
              display: 'flex',
              flexFlow: 'column nowrap',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Spin />
            <Typography.Text type={'secondary'}>
              Clearing session data...
            </Typography.Text>
          </div>
        </Card>
      </Col>
    </Row>
  )
}
