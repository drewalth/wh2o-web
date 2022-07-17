import {
  CaretUpOutlined,
  LoginOutlined,
  LogoutOutlined,
  WarningOutlined,
  InfoCircleOutlined,
  HeatMapOutlined,
  VerticalAlignMiddleOutlined,
  PlayCircleOutlined,
} from '@ant-design/icons'
import { Tooltip } from 'antd'
import { useTranslation } from 'react-i18next'
import { Feature } from '../../../../types'

export type FeatureIconsProps = {
  feature: Feature
}

export const FeatureIcons = ({ feature }: FeatureIconsProps) => {
  const { t } = useTranslation()

  const {
    rapid,
    rangerStation,
    campsite,
    waterfall,
    hazard,
    poi,
    putIn,
    takeOut,
    accessPoint,
  } = feature

  const iconProps = {
    style: {
      fontSize: 24,
      marginRight: 8,
    },
  }

  return (
    <>
      {rapid && (
        <Tooltip title={t('rapid')}>
          <PlayCircleOutlined {...iconProps} />
        </Tooltip>
      )}
      {rangerStation && (
        <Tooltip title={t('rangerStation')}>
          <CaretUpOutlined {...iconProps} />
        </Tooltip>
      )}
      {campsite && (
        <Tooltip title={t('campsite')}>
          <CaretUpOutlined {...iconProps} />
        </Tooltip>
      )}
      {waterfall && (
        <Tooltip title={t('waterfall')}>
          <HeatMapOutlined {...iconProps} />
        </Tooltip>
      )}
      {hazard && (
        <Tooltip title={t('hazard')}>
          <WarningOutlined {...iconProps} />
        </Tooltip>
      )}
      {poi && (
        <Tooltip title={t('pointOfInterest')}>
          <InfoCircleOutlined {...iconProps} />
        </Tooltip>
      )}
      {putIn && (
        <Tooltip title={t('putIn')}>
          <LoginOutlined {...iconProps} />
        </Tooltip>
      )}
      {takeOut && (
        <Tooltip title={t('takeOut')}>
          <LogoutOutlined {...iconProps} />
        </Tooltip>
      )}
      {accessPoint && (
        <Tooltip title={t('accessPoint')}>
          <VerticalAlignMiddleOutlined {...iconProps} />
        </Tooltip>
      )}
    </>
  )
}
