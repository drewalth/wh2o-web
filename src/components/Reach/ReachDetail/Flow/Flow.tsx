import { Row, Col, Divider } from 'antd'
import { useBreakpoint } from '../../../../hooks'
import { useReachDetailContext } from '../ReachDetailContext'
import { FlowChart } from './FlowChart'
import { FlowChartControls } from './FlowChartControls'
import { FlowHeader } from './FlowHeader'
import { FlowProvider } from './FlowProvider'
import { FlowForecast } from './FlowForecast'

export type FlowProps = {}

export const Flow = () => {
  const { reach } = useReachDetailContext()
  const { isMobile } = useBreakpoint()

  const gages = reach?.gages || []

  const chartCol = {
    span: isMobile ? 24 : 20,
  }

  const controlCol = {
    span: isMobile ? 24 : 4,
  }

  const tableCol = {
    span: 24,
  }

  return (
    <FlowProvider gages={gages}>
      <Row>
        <Col span={24}>
          <FlowHeader />
          <Divider />
        </Col>
      </Row>
      <Row gutter={24}>
        <Col {...chartCol}>
          <FlowChart />
        </Col>
        <Col {...controlCol}>
          <FlowChartControls />
        </Col>
        <Col span={24}>
          <Divider />
        </Col>
      </Row>
      <Row>
        <Col {...tableCol}>
          <FlowForecast />
        </Col>
      </Row>
    </FlowProvider>
  )
}
