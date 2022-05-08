import { Button, Result } from 'antd'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

export const Unauthorized = () => {
  const navigate = useNavigate()
  const { t } = useTranslation()
  return (
    <div>
      <Result
        status="403"
        title="403"
        subTitle={t('unauthorized')}
        extra={
          <>
            <Button
              onClick={() => navigate('/auth/login', { replace: true })}
              type="primary"
            >
              {t('signIn')}
            </Button>
            <Button
              onClick={() => navigate('/auth/register', { replace: true })}
            >
              {t('register')}
            </Button>
          </>
        }
      />
    </div>
  )
}
