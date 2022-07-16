import { notification } from 'antd'

/**
 * notify provides a wrapper around the antd notification
 * function so we don't have to constantly set placement to
 * bottomRight and helps enforce consistency
 */
export const notify = {
  error: (message: string) =>
    notification.error({
      message,
      placement: 'bottomRight',
    }),
  success: (message: string) =>
    notification.success({
      message,
      placement: 'bottomRight',
    }),
}
