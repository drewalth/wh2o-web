import { Button, Result } from 'antd'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

export const FiveHundred = () => {
  const navigate = useNavigate()
  const { t } = useTranslation()
  return (
    <div>
      <Result
        status="500"
        title="500"
        subTitle={t('somethingWentWrong')}
        extra={
          <Button onClick={() => navigate('/')} type="primary">
            {t('backToPage', { page: t('home') })}
          </Button>
        }
      />
    </div>
  )
}
