import { Button, notification, Tooltip } from 'antd'
import React, { ReactNode, useState } from 'react'
import { addUserGage, removeUserGage } from '../../controllers'
import { useUserContext } from '../User/UserContext'
import { HeartFilled, HeartOutlined } from '@ant-design/icons'
import { RequestStatus } from '../../types'
import { useTranslation } from 'react-i18next'

type BookmarkButtonOptions = {
  text: string
  onClick: () => void
  icon?: ReactNode
  disabled: boolean
}

type GageBookmarkToggleProps = {
  gageId: number
  type?: 'default' | 'icon'
}

export const GageBookmarkToggle = ({
  gageId,
  type,
}: GageBookmarkToggleProps) => {
  const { user, reload, canBookmarkGages } = useUserContext()
  const [requestStatus, setRequestStatus] = useState<RequestStatus>()
  const { t } = useTranslation()

  const bookMarkButtonoptions: BookmarkButtonOptions = (() => {
    const exists = user?.gages.find((g) => g.id === gageId)

    const getText = () => {
      if (!user) {
        return t('bookmarkGage')
      }
      return !!exists ? t('removeBookmark') : t('bookmarkGage')
    }

    const getIcon = () => {
      return !!exists ? <HeartFilled /> : <HeartOutlined />
    }

    return {
      text: getText(),
      icon: getIcon(),
      disabled: !user || (!exists && !canBookmarkGages),
      onClick: async () => {
        try {
          if (!user) {
            throw new Error('Must sign in')
          }
          setRequestStatus('loading')
          const fn = !!exists ? removeUserGage : addUserGage
          await fn(gageId, user.id)
          setRequestStatus('success')
          notification.success({
            message: !!exists ? t('bookmarkRemoved') : t('bookmarkAdded'),
            placement: 'bottomRight',
          })
          await reload()
        } catch (e) {
          setRequestStatus('failure')
          notification.error({
            message: t('somethingWentWrong'),
            placement: 'bottomRight',
          })
        }
      },
    }
  })()

  const getButtonBase = () => {
    if (!user) {
      return (
        <Tooltip title={t('signInToBookmarkGage')}>
          <Button
            type={type === 'icon' ? 'ghost' : 'primary'}
            disabled
            onClick={bookMarkButtonoptions.onClick}
            loading={requestStatus === 'loading'}
          >
            {type !== 'icon' && bookMarkButtonoptions.text}
            {type === 'icon' && bookMarkButtonoptions.icon}
          </Button>
        </Tooltip>
      )
    }

    if (type === 'icon') {
      return (
        <Button
          type={'ghost'}
          disabled={bookMarkButtonoptions.disabled}
          loading={requestStatus === 'loading'}
          title={bookMarkButtonoptions.text}
          onClick={bookMarkButtonoptions.onClick}
        >
          {bookMarkButtonoptions.icon}
        </Button>
      )
    }
    return (
      <Button
        type={'primary'}
        loading={requestStatus === 'loading'}
        disabled={bookMarkButtonoptions.disabled}
        onClick={bookMarkButtonoptions.onClick}
      >
        {bookMarkButtonoptions.text}
      </Button>
    )
  }

  return getButtonBase()
}
