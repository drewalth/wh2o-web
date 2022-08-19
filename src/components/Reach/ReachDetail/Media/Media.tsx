import { useState } from 'react'
import { Button } from 'antd'
import { useUserContext } from '../../../User/UserContext'
import { CreateMediaModal } from './CreateMediaModal'
import { useTranslation } from 'react-i18next'
import { Gallery } from './Gallery'
import { useReachDetailContext } from '../ReachDetailContext'
import { EmptyBlock } from '../../../Common'

export const Media = () => {
  const { t } = useTranslation()
  const [modalVisible, setModalVisible] = useState(false)

  const { canContribute, user } = useUserContext()

  const { reach, load } = useReachDetailContext()

  const media = reach?.media || []
  const features = reach?.features || []

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
            features={features}
            onCancel={() => setModalVisible(false)}
            reachId={reach?.id || ''}
            userId={user?.id || ''}
            onSuccess={async () => {
              setModalVisible(false)
              await load()
            }}
          />
        </div>
      )}

      {media.length === 0 ? (
        <EmptyBlock title={'No Media. Log in to add some.'} />
      ) : (
        <Gallery media={media} onSuccess={load} />
      )}
    </div>
  )
}
