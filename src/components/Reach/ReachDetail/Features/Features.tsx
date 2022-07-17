import { useState } from 'react'
import { Typography } from 'antd'
import { useReachDetailContext } from '../ReachDetailContext'
import { FeatureCard } from './FeatureCard'
import { FeatureEditModal } from './FeatureEditModal'
import { Feature } from '../../../../types'

export const Features = () => {
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
      {features.map((feat, idx) => (
        <FeatureCard
          feature={feat}
          key={idx}
          onEdit={onEdit}
          media={getFeatureMedia(feat.id)}
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
