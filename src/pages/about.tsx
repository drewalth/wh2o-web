import React from 'react'
import { Col, Collapse, Row, Typography } from 'antd'

const { Panel } = Collapse

const About = () => {
  return (
    <>
      <Row>
        <Col span={24} sm={18} md={16} lg={14} xl={12}>
          <Typography.Title>About</Typography.Title>
          <Typography.Paragraph>
            This project was started to provide a one-stop-shop for checking USGS river gage flows. In addition, the app
            gives users the ability to create custom flow reports and notifications. So instead of checking various gage
            pages before your next paddling adventure, all of your bookmarked gages live in your Account Dashboard.
            <br />
            <br />
            Don't want to check gages every day? With wh2o you can create daily reports of all your gages to be sent
            right to your email inbox.
          </Typography.Paragraph>
        </Col>
      </Row>
      <Row>
        <Col span={24} sm={18} md={16} lg={14} xl={12}>
          <Typography.Title>Privacy</Typography.Title>
          <Typography.Paragraph>We will never share or sell your data. Ever.</Typography.Paragraph>
          <Typography.Title level={4}>Collection</Typography.Title>
          <Typography.Paragraph>
            We do not collect information about users in the background. The only information we keep, is the
            information you provide which is only used for accessing your account, as well as sending the reports and
            notifications you create.
          </Typography.Paragraph>
        </Col>
      </Row>
      <Row>
        <Col span={24} sm={18} md={16} lg={14} xl={12}>
          <Typography.Title>Technology</Typography.Title>
          <Typography.Paragraph>
            The app is broken up into three parts: server (API), client (frontend), and data. The API is built on
            Node.js using the Nest.js framework and runs an Apollo GraphQL server.
            <br />
            <br />
            The frontend is built with Gatsby.js, a React.js framework, which statically generates pre-rendered HTML of
            all of our pages ensuring fast load times. TypeScript (TS) is used in both API and frontend apps. In
            addition, TS types/interfaces are generated from the GraphQL schema and synced between API and frontend.
            Very cool.
            <br />
            <br />
            We use PostgreSQL for our database engine and Redis for job queueing.
            <br />
            <br />
            This is a hobby/side-project. As such, keeping hosting costs down is paramount. The API and Database run on
            free-tier Heroku services. The frontend is served from Netlify and CRON jobs run on an overburdened
            Raspberry Pi in Drew's livingroom.
          </Typography.Paragraph>
        </Col>
      </Row>
    </>
  )
}

export default About
