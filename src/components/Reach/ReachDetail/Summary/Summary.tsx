import { Col, Row, Statistic, Divider } from 'antd'
import { Gage } from '../../../../types'
import { useReachDetailContext } from '../ReachDetailContext'
import { Description } from './Description'

export const Summary = () => {
  const { reach } = useReachDetailContext()

  const rowProps = {
    style: {
      marginBottom: 24,
    },
    gutter: 24,
  }

  const colProps = {
    span: 8,
  }

  const rowTwoColProps = {
    span: 8,
  }

  const primaryGage: Gage | undefined = (() => {
    if (reach && reach.gages.length > 0) {
      if (reach.gages.length === 1) {
        return reach.gages[0]
      }

      const primaryG = reach.gages.find((g) => g.primary)

      return primaryG
    }
  })()

  return (
    <>
      <Row {...rowProps}>
        <Col {...colProps}>
          <Statistic title={'Grade'} value={reach?.grade || '-'} />
        </Col>
        <Col {...colProps}>
          <Statistic title={'Length'} value={reach?.length || '-'} />
        </Col>
        <Col {...colProps}>
          <Statistic title={'Avg. Gradient'} value={'-'} />
        </Col>
      </Row>
      <Row {...rowProps}>
        <Col {...rowTwoColProps}>
          <Statistic title={'Primary gage'} value={primaryGage?.name || '-'} />
        </Col>
        <Col {...rowTwoColProps}>
          <Statistic
            title={'Latest Reading'}
            value={primaryGage?.reading || '-'}
          />
        </Col>
      </Row>
      <Divider />
      <Row>
        <Col>
          <Description />
        </Col>
      </Row>
    </>
  )
}
