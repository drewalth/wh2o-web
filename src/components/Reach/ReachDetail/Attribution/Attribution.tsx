import { DataSource } from '../../../../types'
import { Typography } from 'antd'
import { useReachDetailContext } from '../ReachDetailContext'

export const Attribution = () => {
  const { reach } = useReachDetailContext()

  const dataSourceUrl = reach?.dataSourceUrl || ''
  const dataSource = reach?.dataSource

  if (dataSourceUrl.length) {
    return (
      <>
        <Typography.Text type={'secondary'}>Data Source</Typography.Text>
        <Typography.Link
          target={'_blank'}
          rel={'noreferrer'}
          href={dataSourceUrl}
        >
          {dataSourceUrl}
        </Typography.Link>
        {dataSource === DataSource.AMERICAN_WHITEWATER && (
          <>
            <Typography.Text type={'secondary'}>
              Please consider supporting American Whitewater
            </Typography.Text>
            <Typography.Link
              target={'_blank'}
              rel={'noreferrer'}
              href={
                'https://membership.americanwhitewater.org/s/lightningmembership'
              }
            >
              Support AW
            </Typography.Link>
          </>
        )}
      </>
    )
  }

  return null
}
