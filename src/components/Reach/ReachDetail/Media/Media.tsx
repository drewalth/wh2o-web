import { useState } from 'react'
import { Button, Typography } from 'antd'
import { useUserContext } from '../../../User/UserContext'
import { CreateMediaModal } from './CreateMediaModal'
import { useTranslation } from 'react-i18next'
import { Gallery } from './Gallery'
import { useReachDetailContext } from '../ReachDetailContext'

export const Media = () => {
  const { t } = useTranslation()
  const [modalVisible, setModalVisible] = useState(false)

  const { canContribute, user } = useUserContext()

  const { reach, load } = useReachDetailContext()

  const media = reach?.media || []

  return (
    <div>
      {canContribute && (
        <div
          style={{
            display: 'flex',
            width: '100%',
            justifyContent: 'flex-end',
            marginBottom: 24,
          }}
        >
          <Button type={'primary'} onClick={() => setModalVisible(true)}>
            {t('addEntity', { entity: t('media') })}
          </Button>
          <CreateMediaModal
            visible={modalVisible}
            onCancel={() => setModalVisible(false)}
            reachId={reach?.id || 0}
            userId={user?.id || 0}
            onSuccess={async () => {
              setModalVisible(false)
              await load()
            }}
          />
        </div>
      )}

      {media.length === 0 ? (
        <Typography.Text>No media available</Typography.Text>
      ) : (
        <Gallery media={media} />
      )}
    </div>
  )
}
