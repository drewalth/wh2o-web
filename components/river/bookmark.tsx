import { BookOutlined } from '@ant-design/icons'
import { Button, message } from 'antd'
import { userBookmarkRiver, removeBookmarkRiver } from 'controllers'
import { useAppSelector } from 'store'
import { selectUserData } from 'store/slices/user.slice'
import { useState } from 'react'

interface BookMarkProps {
  riverId: number
}

export const Bookmark = (props: BookMarkProps) => {
  const user = useAppSelector(selectUserData)
  const [buttonText, setButtonText] = useState('Bookmark')
  const [bookmarked, setBookmarked] = useState(false)

  const handleBookmark = async () => {
    try {
      if (
        bookmarked ||
        user.rivers
          // @ts-ignore
          .map((river) => river.riverId)
          .includes(props.riverId)
      ) {
        if (!user.id) return

        await removeBookmarkRiver(user.id, props.riverId)
        setButtonText('Bookmark')
        setBookmarked(false)
        message.success('Bookmark Removed')
      } else {
        await userBookmarkRiver(user.id || 0, props.riverId)
        setButtonText('Remove Bookmark')
        setBookmarked(true)
        message.success('Bookmark Added')
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
