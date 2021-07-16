import { BookOutlined } from '@ant-design/icons'
import { Button, message } from 'antd'
import {
  userBookmarkRiver,
  removeBookmarkRiver,
  removeBookmarkGage,
  userBookmarkGage,
} from 'controllers'
import { useAppDispatch, useAppSelector } from 'store'
import { fetchUser, selectUserData } from 'store/slices/user.slice'
import { useEffect, useState } from 'react'
import { Gage, River } from '../../interfaces'

export enum BookmarkEntity {
  GAGE = 'GAGE',
  RIVER = 'RIVER',
}

interface BookMarkProps {
  entityId: number
  entity: BookmarkEntity
}

export const Bookmark = (props: BookMarkProps) => {
  const user = useAppSelector(selectUserData)
  const [buttonText, setButtonText] = useState('Bookmark')
  const [bookmarked, setBookmarked] = useState(false)
  const dispatch = useAppDispatch()

  const checkBookmark = () => {
    let data

    if (props.entity === 'RIVER') {
      data = user.reaches
        ?.map((reach: River) => reach.id)
        .includes(props.entityId)
    }

    if (props.entity === 'GAGE') {
      data = user.gages?.map((gage: Gage) => gage.id).includes(props.entityId)
    }

    setBookmarked(data || false)
    setButtonText(data ? 'Remove Bookmark' : 'Bookmark')
  }

  useEffect(() => {
    checkBookmark()
  }, [user, props])

  const handleBookmark = async () => {
    try {
      if (bookmarked) {
        if (!user.id) return

        if (props.entity === 'RIVER') {
          await removeBookmarkRiver(user.id, props.entityId)
        } else if (props.entity === 'GAGE') {
          await removeBookmarkGage(user.id, props.entityId)
        }

        setButtonText('Bookmark')
        setBookmarked(false)
        message.success('Bookmark Removed')
        dispatch(fetchUser(user.id))
      } else {
        if (props.entity === 'RIVER') {
          await userBookmarkRiver(user.id || 0, props.entityId)
        } else if (props.entity === 'GAGE') {
          await userBookmarkGage(user.id, props.entityId)
        }
        setButtonText('Remove Bookmark')
        setBookmarked(true)
        message.success('Bookmark Added')
        dispatch(fetchUser(user.id))
      }
    } catch (e) {
      console.log('e', e)
      message.error('Something went wrong...')
    }
  }

  return (
    <Button
      onClick={() => handleBookmark()}
      key="1"
      type="dashed"
      disabled={!user.id}
      icon={<BookOutlined />}
    >
      {buttonText}
    </Button>
  )
}
