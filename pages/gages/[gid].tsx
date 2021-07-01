import { useEffect, useState } from 'react'
import { getGage } from 'controllers'
import { GetServerSideProps } from 'next'
import { Card, Col, Layout, PageHeader, Row } from 'antd'
import { IGage, GageModel } from '../../interfaces'
import { useRouter } from 'next/router'

interface GageDetailProps {
  id: string
}

const GageDetail = (props: GageDetailProps) => {
  const router = useRouter()

  const { id } = props

  const [loading, setLoading] = useState(false)
  const [gage, setGage] = useState<IGage>(GageModel)
  const [error, setError] = useState(false)

  const load = async () => {
    try {
      setLoading(true)
      const result = await getGage(id)
      console.log(result)
      setGage(result)
    } catch (e) {
      console.log('e', e)
      setError(true)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  return (
    <>

          <PageHeader
            title={gage.name}
            onBack={() => router.push('/gages')}
            extra={
              [
                // <Button key="1" type="primary">
                //   Bookmark
                // </Button>
              ]
            }
          />
          <Layout.Content style={{ padding: '0 24px' }}>
            <Row gutter={24}>
              <Col span={12}>
                <Card>yo</Card>
              </Col>
              <Col span={12}>
                <Card>Flow chart</Card>
              </Col>
            </Row>
          </Layout.Content>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {
      id: context.query.gid,
    }, // will be passed to the page component as props
  }
}

export default GageDetail
