import { Card, Col, Modal, Row, Typography } from 'antd'
import { Link } from 'react-router-dom'

export const LegalContent = () => {
  return (
    <>
      <Typography.Title level={1}>Legal</Typography.Title>
      <Typography.Title level={3}>Disclaimer</Typography.Title>
      <Typography.Paragraph>
        All data presented by this website, wh2o.io, or any other wh2o
        application is considered provisional and is subject to change.
        <br />
        <br />
        The owners, creators, maintainers, and/or contributors to the wh2o.io
        datasets are not liable for any injury or death caused as a result of
        referencing or consuming any of the wh2o applications datasets or using
        any wh2o service/product.
        <br />
        <br />
        River sports and activities that take place in or on any river, creek,
        or stream are inherintly risky. Users and consumers of wh2o datasets
        and/or services must exercise good judgement and caution before engaging
        in any river related activities.
        <br />
        <br />
        Users and consumers of wh2o datasets and services must agree to these
        terms.
      </Typography.Paragraph>
      <Typography.Title level={5}>Alpha</Typography.Title>
      <Typography.Paragraph>
        This application is still in the alpha phase of development. As such,
        data may suddenly be lost or corrupted as a result of ongoing
        development and feature exploration. <br />
        <br />
        Users who sign up for the wh2o service during this phase are advised{' '}
        <i>not</i> to spend a great deal of time and effort bookmarking gages or
        creating notifications just incase any wh2o data is accidentally
        destroyed. <br />
        <br />
        Users will be notified when wh2o.io has entered the Beta phase. If you
        would like to wait until the beta phase to create an account, you can
        join the waitlist by submitting your email and selecting "BETA_WAITLIST"
        on the <Link to={'/contact'}>Contact</Link> form.
      </Typography.Paragraph>
      <Typography.Title level={3}>Privacy</Typography.Title>
      <Typography.Paragraph>
        All user provided information; email addresses, telephone numbers,
        names, timezone or any other information collected by wh2o.io or any
        wh2o application is only used to provide user account verification,
        email notifications, and user created SMS notifications.
        <br />
        <br />
        Your data will never be sold to any other party. <strong>Ever</strong>.
      </Typography.Paragraph>
    </>
  )
}

export const Legal = () => {
  return (
    <Row justify={'center'}>
      <Col span={24} sm={20} md={18} lg={16} xl={12}>
        <Card>
          <LegalContent />
        </Card>
      </Col>
    </Row>
  )
}

export type LegalModalProps = {
  visible: boolean
  onOk: () => void
  onCancel: () => void
}

export const LegalModal = ({ visible, onOk }: LegalModalProps) => {
  return (
    <Modal
      visible={visible}
      onOk={onOk}
      okText={'Close'}
      cancelButtonProps={{ hidden: true }}
    >
      <LegalContent />
    </Modal>
  )
}
