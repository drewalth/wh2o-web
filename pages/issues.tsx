import { Card, Col, Layout, PageHeader, Row, Table, Typography } from 'antd'
import { useRouter } from 'next/router'
import { GetStaticPropsContext } from 'next'
import { useEffect } from 'react'

interface IssuesProps {
  tickets: any[]
}

const Issues = (props: IssuesProps) => {
  const { tickets } = props

  useEffect(() => {
    console.log(tickets)
  }, [])

  const router = useRouter()
  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      render: (title: string, val: any) => (
        <a
          href={`https://github.com/drewalth/wh2o-docker/issues/${val.number}`}
          target="_blank"
        >
          {title}
        </a>
      ),
    },
  ]

  return (
    <>
      <PageHeader title="Issues" onBack={() => router.push('/')} />
      <Layout.Content style={{ padding: '0 24px' }}>
        <Row>
          <Col span={24}>
            <Card>
              <Typography.Paragraph style={{ maxWidth: '80%' }}>
                Bug reports, feature requests and general To-Dos. To submit a
                ticket or weight-in on a potential new feature, please create an
                account with{' '}
                <a href="https://github.com/" target="_blank">
                  GitHub
                </a>{' '}
                and visit the{' '}
                <a
                  href="https://github.com/drewalth/wh2o-docker/issues"
                  target="_blank"
                >
                  issue board
                </a>
                .
              </Typography.Paragraph>
              <div style={{ maxWidth: '100%', overflowX: 'scroll' }}>
                <Table columns={columns} dataSource={tickets || []} />
              </div>
            </Card>
          </Col>
        </Row>
      </Layout.Content>
    </>
  )
}

export const getStaticProps = async (context: GetStaticPropsContext) => {
  let tickets

  try {
    const result = await fetch(
      'https://api.github.com/repos/drewalth/wh2o-docker/issues'
    )
      .then((res) => res.json())
      .catch((e) => {
        console.log('e', e)
      })

    if (result) {
      tickets = result
    }
  } catch (e) {
    console.log('e', e)
  }

  return {
    props: {
      tickets,
    },
  }
}

export default Issues
