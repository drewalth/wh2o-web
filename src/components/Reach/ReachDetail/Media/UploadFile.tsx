import { UploadOutlined } from '@ant-design/icons'
import type { UploadProps } from 'antd'
import { Button, message, Upload } from 'antd'
import React from 'react'
import { getToken } from '../../../../lib/token'
import { MediaType } from '../../../../types'

const baseUrl = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000'

export type UploadFileProps = {
  type: MediaType
  onSuccess: (filePath: string) => void
}
/**
 *
 * wrapper around antd Upload component
 *
 * @see https://ant.design/components/upload/
 */
export const UploadFile = ({
  type,
  onSuccess,
}: UploadFileProps): JSX.Element => {
  const props: UploadProps = {
    name: 'file',
    action: `${baseUrl}/media/single-upload`,
    accept: type === MediaType.IMAGE ? '.png,.jpg' : '.mov,.mp4',
    headers: {
      authorization: `Bearer ${getToken()}`,
    },
    onChange(info) {
      if (info.file.status === 'done') {
        message.success(`${info.file.name} file uploaded successfully`)
        onSuccess(info.file.response)
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} file upload failed.`)
      }
    },
  }

  return (
    <Upload {...props}>
      <Button icon={<UploadOutlined />}>Click to Upload</Button>
    </Upload>
  )
}
