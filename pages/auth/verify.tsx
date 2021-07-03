import { GetServerSideProps, GetServerSidePropsContext } from 'next'
import { useEffect, useState } from 'react'
import { verifyUser } from '../../controllers'
import { useRouter } from 'next/router'
import { message, Result, Spin, Typography } from 'antd'

interface VerifyProps {
  id: number
  token: string
}

const Verify = (props: VerifyProps) => {
  const { id, token } = props
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [verified, setVerified] = useState(false)

  const handleVerification = async () => {
    try {
      setLoading(true)
      const result = await verifyUser(id, token)

      if (result === 'verified') {
        setLoading(false)
        setVerified(true)

        await new Promise((resolve) => setTimeout(resolve, 2000))

        await router.push(`/user/${id}`)
      }
    } catch (e) {
      console.log('e', e)
      message.error('Verification Failed')
      await router.push('/')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!id || !token) {
      router.replace('/')
    }
    handleVerification()
  }, [id])

  return (
    <div
      style={{
        height: 300,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {loading && (
        <>
          <Spin />{' '}
          <Typography.Title level={3} style={{ marginLeft: 16 }}>
            Verifying your account...
          </Typography.Title>
        </>
      )}

      {!loading && verified && (
        <Result status="success" title="Successfully Verified Your Account" />
      )}
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  return {
    props: {
      id: Number(context.query.id) || 0,
      token: context.query.token || '',
    },
  }
}

export default Verify
