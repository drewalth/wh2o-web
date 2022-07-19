import { Button, Typography, Row, Col } from 'antd'
import { AccessMap } from './AccessMap'
import { useReachDetailContext } from '../ReachDetailContext'
import { EmptyBlock } from '../../../Common'
import { useState } from 'react'
import { AccessEditModal } from './AccessEditModal'

export const Access = () => {
  const { reach, load } = useReachDetailContext()
  const [editModalVisible, setEditModalVisible] = useState(false)
  const accessDetails = reach?.access || ''

  const onCancel = () => setEditModalVisible(false)
  const onSuccess = async () => {
    setEditModalVisible(false)
    await load()
  }

  return (
    <>
      <Row style={{ marginBottom: 24 }}>
        <Col span={24}>
          <AccessMap latitude={reach?.latitude} longitude={reach?.longitude} />
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          {accessDetails ? (
            <Typography.Paragraph>{accessDetails}</Typography.Paragraph>
          ) : (
            <EmptyBlock
              title={'Access details unavailable'}
              action={
                <Button onClick={() => setEditModalVisible(true)}>
                  Add Access Details
                </Button>
              }
            />
          )}
        </Col>
      </Row>
      {reach && (
        <AccessEditModal
          reach={reach}
          onSuccess={onSuccess}
          visible={editModalVisible}
          onCancel={onCancel}
        />
      )}
    </>
  )
}
