import { useState } from 'react'
import { Button, Divider, Typography } from 'antd'
import { useReachDetailContext } from '../ReachDetailContext'
import { FeatureCard } from './FeatureCard'
import { FeatureEditModal } from './FeatureEditModal'
import { Feature } from '../../../../types'
import { useUserContext } from '../../../User/UserContext'
import { useTranslation } from 'react-i18next'

export const Features = () => {
  const { t } = useTranslation()
  const { canContribute } = useUserContext()
  const { reach, load } = useReachDetailContext()
  const [editFeature, setEditFeature] = useState<Feature | undefined>()
  const [editModalVisible, setEditModalVisible] = useState(false)

  const features = reach?.features || []

  const onEdit = (f: Feature) => {
    setEditFeature(f)
    setEditModalVisible(true)
  }

  const onCancel = () => {
    setEditFeature(undefined)
    setEditModalVisible(false)
  }

  const onSuccess = async () => {
    setEditFeature(undefined)
    setEditModalVisible(false)
    await load()
  }

  // not a big fan of this...
  const getFeatureMedia = (featureId: number) => {
    const media = reach?.media || []

    if (media.length > 0) {
      return media.filter((m) => m.featureId === featureId)
    }
    return []
  }

  if (features.length === 0) {
    return <Typography.Text>Feature data unavailable</Typography.Text>
  }

  return (
    <>
      {canContribute && (
        <>
          <div
            style={{
              display: 'flex',
              width: '100%',
              justifyContent: 'flex-end',
            }}
          >
            <Button type={'primary'} onClick={() => setEditModalVisible(true)}>
              {t('addEntity', { entity: t('feature') })}
            </Button>
            <FeatureEditModal
              visible={editModalVisible}
              feature={editFeature}
              onCancel={onCancel}
              onSuccess={onSuccess}
            />
          </div>
          <Divider />
        </>
      )}
      {features.map((feat, idx) => (
        <FeatureCard
          feature={feat}
          key={idx}
          onEdit={onEdit}
          media={getFeatureMedia(feat.id)}
          onDelete={load}
        />
      ))}
      <FeatureEditModal
        visible={editModalVisible}
        feature={editFeature}
        onCancel={onCancel}
        onSuccess={onSuccess}
      />
    </>
  )
}
