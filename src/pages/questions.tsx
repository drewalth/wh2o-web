import React from 'react'
import { Col, Collapse, Row, Typography } from 'antd'

const { Panel } = Collapse

const Questions = () => {
  return (
    <>
      <Row>
        <Col>
          <Typography.Title>FAQ</Typography.Title>
        </Col>
      </Row>
      <Row>
        <Col span={24} sm={18} md={16} lg={14} xl={12}>
          <Collapse defaultActiveKey={['1']}>
            <Panel header="Why haven't some gages been updated in a long time?" key="1">
              <p>
                This is something we are actively working on. Due to USGS API and infrastructure limitations, gages that
                have been bookmarked by a user are prioritized. If you would like a gage to start being updated, add it
                as a bookmark in your Account Dashboard.
              </p>
            </Panel>
            <Panel header="Why can't I see historical flow data?" key="2">
              <p>
                In an effort to keep infrastructure and data storage costs as low as possible, gage readings older than
                6 hours are deleted from the database. When gage readings are fetched we save the latest reading on the
                associated gage record.
              </p>
            </Panel>
            <Panel header="How do I add a missing gage?" key="3">
              <p>
                Unfortunately there is no method for adding a gage from the application UI. New gages must be added
                manually to the database. This is not ideal. We are working on a gage submission form.{' '}
              </p>
            </Panel>
            <Panel header="How do I submit a bug report?" key="4">
              <p>
                If you would like to submit a bug report, please first create a GitHub account, then add a new issue on
                the{' '}
                <a href={'https://github.com/drewalth/wh2o-docker'} target={'_blank'} rel={'noreferrer'}>
                  wh2o-docker
                </a>{' '}
                board.
              </p>
            </Panel>
            <Panel header="Are there plans to support river gages outside of the United States?" key="5">
              <p>Yes! We are currently working on supporting Canadian gages. Then New Zealand just for Todd Henry.</p>
            </Panel>
          </Collapse>
        </Col>
      </Row>
    </>
  )
}

export default Questions
