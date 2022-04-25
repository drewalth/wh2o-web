import { useLocalNavGuard } from '../../hooks'
import { Card, Col, Row, Tabs } from 'antd'
import { useState } from 'react'
import { AddGage } from './AddGage'

type TabKey = '1' | '2'

export const Admin = () => {
  useLocalNavGuard({ checkIsAdmin: true })
  const [activeTab, setActiveTab] = useState<TabKey>('1')
  return (
    <Row>
      <Col span={24}>
        <Card>
          <Row>
            <Col>
              <Tabs
                onChange={(val) => setActiveTab(val as TabKey)}
                tabPosition={'left'}
                defaultActiveKey="1"
                style={{ height: 220 }}
              >
                <Tabs.TabPane tab={'Gages'} key={'1'} />
              </Tabs>
            </Col>
            <Col>{activeTab === '1' && <AddGage />}</Col>
          </Row>
        </Card>
      </Col>
    </Row>
  )
}
