import { Col, Layout, PageHeader, Row, Card, Button } from 'antd'
import { useRouter } from 'next/router'
import { SubscriptionPrice } from '../interfaces'

const Pricing = () => {
  const router = useRouter()

  return (
    <>
      <PageHeader title="Pricing" onBack={() => router.push('/')} />
      <Layout.Content style={{ padding: '0 24px' }}>
        <Row gutter={24}>
          <Col span={24} md={8}>
            <Card title={'Free'} extra={<h1>$0</h1>}>
              <ul>
                <li>3 Daily Flow Report Emails</li>
                <li>1 Immediate Flow Report Email</li>
                <li>3 Gage Bookmarks</li>
                <li>3 River Bookmarks</li>
              </ul>
            </Card>
          </Col>
          <Col span={24} md={8}>
            <Card
              title={'Premium 🎉'}
              extra={<h1>$2.00/m</h1>}
              actions={[
                <form action="/api/checkout_sessions" method="POST">
                  <input
                    type="hidden"
                    name="priceId"
                    value={SubscriptionPrice.premium}
                  />
                  <Button htmlType={'submit'} type={'primary'}>
                    Purchase
                  </Button>
                </form>,
              ]}
            >
              <ul>
                <li>River PDF Downloads</li>
                <li>5 Daily Flow Report Emails</li>
                <li>3 Immediate Flow Report Emails</li>
                <li>10 Gage Bookmarks</li>
                <li>10 River Bookmarks</li>
              </ul>
            </Card>
          </Col>
          <Col span={24} md={8}>
            <Card
              title={'Deluxe ✨'}
              extra={<h1>$5.00/m</h1>}
              actions={[
                <form action="/api/checkout_sessions" method="POST">
                  <input
                    type="hidden"
                    name="priceId"
                    value={SubscriptionPrice.deluxe}
                  />
                  <Button htmlType={'submit'}>Purchase</Button>
                </form>,
              ]}
            >
              <ul>
                <li>River PDF Downloads</li>
                <li>10 Daily Flow Report Emails</li>
                <li>6 Immediate Flow Report Emails</li>
                <li>Unlimited Gage Bookmarks</li>
                <li>Unlimited River Bookmarks</li>
              </ul>
            </Card>
          </Col>
        </Row>
      </Layout.Content>
    </>
  )
}

export default Pricing
