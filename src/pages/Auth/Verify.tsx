import { useSearchParams } from 'react-router-dom'
import { useLayoutEffect, useState } from 'react'
import { RequestStatus } from '../../types'
import { Spin } from 'antd'
import { authVerify } from '../../controllers'

export const Verify = () => {
  const [params] = useSearchParams()
  const token = params.get('token')
  const email = params.get('email')
  const [requestStatus, setRequestStatus] = useState<RequestStatus>('loading')
  // const navigate = useNavigate()

  useLayoutEffect(() => {
    ;(async () => {
      if (!token || !email) {
        // navigate('/', { replace: true })
        return
      }

      try {
        setRequestStatus('loading')
        const result = await authVerify(token, email)
        setRequestStatus('success')
        console.log('result', result)
      } catch (e) {
        setRequestStatus('failure')
      }
    })()
  }, [])

  if (requestStatus === 'loading') {
    return (
      <div
        style={{
          height: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Spin />
      </div>
    )
  }

  return (
    <>
      <div>verify</div>
      <div>{token}</div>
    </>
  )
}
