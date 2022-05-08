import { useNavigate, useSearchParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { RequestStatus } from '../../types'
import { Result, Spin, Typography } from 'antd'
import { authVerify } from '../../controllers'
import { useTranslation } from 'react-i18next'

export const Verify = () => {
  const [params] = useSearchParams()
  const token = params.get('token')
  const email = params.get('email')
  const [requestStatus, setRequestStatus] = useState<RequestStatus>('loading')
  const navigate = useNavigate()
  const { t } = useTranslation()

  useEffect(() => {
    ;(async () => {
      if (!token || !email) {
        navigate('/', { replace: true })
        return
      }

      try {
        setRequestStatus('loading')
        await authVerify(token, email)
        setRequestStatus('success')
      } catch (e) {
        setRequestStatus('failure')
        navigate('/', { replace: true })
      }
    })()
  }, [])

  return (
    <>
      {requestStatus === 'loading' && (
        <div
          style={{
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Spin />
          <Typography.Title level={5} style={{ marginLeft: 16 }}>
            {t('verifyingYourAccount')}
          </Typography.Title>
        </div>
      )}
      {requestStatus === 'failure' && (
        <Result title={t('failedToVerifyAccount')} status={'error'} />
      )}
      {requestStatus === 'success' && (
        <Result title={t('accountVerified')} status={'success'} />
      )}
    </>
  )
}
