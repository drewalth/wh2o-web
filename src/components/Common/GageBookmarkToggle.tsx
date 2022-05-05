import { Button, notification, Tooltip } from 'antd'
import React, { ReactNode } from 'react'
import { addUserGage, removeUserGage } from '../../controllers'
import { useUserContext } from '../User/UserContext'
import { HeartFilled, HeartOutlined } from '@ant-design/icons'

type BookmarkButtonOptions = {
  text: string
  onClick: () => void
  icon?: ReactNode
}

type GageBookmarkToggleProps = {
  gageId: number
  type?: 'default' | 'icon'
}

export const GageBookmarkToggle = ({
  gageId,
  type,
}: GageBookmarkToggleProps) => {
  const { user, reload } = useUserContext()

  const bookMarkButtonoptions: BookmarkButtonOptions = (() => {
    const exists = user?.gages.find((g) => g.id === gageId)

    const getText = () => {
      if (!user) {
        return 'Bookmark Gage'
      }
      return !!exists ? 'Remove Bookmark' : 'Bookmark Gage'
    }

    return {
      text: getText(),
      icon: !!exists ? <HeartFilled /> : <HeartOutlined />,
      onClick: async () => {
        try {
          if (!user) {
            throw new Error('Must sign in')
          }
          const fn = !!exists ? removeUserGage : addUserGage
          await fn(gageId, user.id)

          notification.success({
            message: !!exists ? 'Bookmark removed' : 'Bookmark added',
            placement: 'bottomRight',
          })
          await reload()
        } catch (e) {
          notification.error({
            message: 'Something went wrong',
            placement: 'bottomRight',
          })
        }
      },
    }
  })()

  const getButtonBase = () => {
    const disabled = !user

    if (disabled) {
      return (
        <Tooltip title={'Log in to bookmark gage'}>
          <Button
            type={type === 'icon' ? 'ghost' : 'primary'}
            disabled={disabled}
            onClick={bookMarkButtonoptions.onClick}
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
          disabled={disabled}
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
        disabled={disabled}
        onClick={bookMarkButtonoptions.onClick}
      >
        {bookMarkButtonoptions.text}
      </Button>
    )
  }

  return getButtonBase()
}
