import { useReachDetailContext } from '../ReachDetailContext'
import { Typography } from 'antd'
import { DataSource } from '../../../../types'

export const Source = () => {
  const { reach } = useReachDetailContext()

  const getSourceLabel = (s: DataSource): string => {
    switch (s) {
      default:
      case DataSource.AMERICAN_WHITEWATER:
        return 'American Whitewater'
    }
  }

  const getDonateLink = (s: DataSource): string => {
    switch (s) {
      default:
      case DataSource.AMERICAN_WHITEWATER:
        return 'https://membership.americanwhitewater.org/s/lightningmembership'
    }
  }

  if (reach) {
    return (
      <div>
        <Typography.Paragraph>
          River data is added by wh2o users and is collected from various
          sources on the internet. Initial data for this river was gathered from{' '}
          <Typography.Link
            href={reach.dataSourceUrl}
            target={'_blank'}
            rel={'noreferrer nofollow'}
          >
            {getSourceLabel(reach.dataSource)}
          </Typography.Link>
          . Please consider supporting American Whitewater with a{' '}
          <Typography.Link
            href={getDonateLink(reach.dataSource)}
            target={'_blank'}
          >
            donation or membership
          </Typography.Link>
          .
        </Typography.Paragraph>
      </div>
    )
  }
  return null
}
