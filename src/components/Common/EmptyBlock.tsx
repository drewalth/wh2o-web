import { Empty, Typography } from 'antd'
import { useTranslation } from 'react-i18next'
import { ReactNode } from 'react'

export type EmptyBlockProps = {
  title?: string
  action?: ReactNode
}

export const EmptyBlock = ({ title, action }: EmptyBlockProps) => {
  const { t } = useTranslation()
  return (
    <>
      <Empty
        image={Empty.PRESENTED_IMAGE_SIMPLE}
        description={
          <Typography.Text type={'secondary'}>
            {title || t('noData')}
          </Typography.Text>
        }
      />
      {action}
    </>
  )
}
