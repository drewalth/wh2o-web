import React from 'react';
import { Typography, Statistic, Row, Col, Card, Button } from 'antd';
import { useGageContext } from './gageContext';
import { GageReadingsChart } from './GageReadingsChart';

import { ArrowUpOutlined } from '@ant-design/icons';
import moment from 'moment';
import { BackButton } from '../common';
import { useUserContext } from '../user/userContext';

export const GageDetail = () => {
  const { loading, error, gage } = useGageContext();
  const { addUserGage, data: userData } = useUserContext();

  if (loading) {
    return <div>loading...</div>;
  }

  if (error) {
    return <div>error</div>;
  }

  if (gage) {
    return (
      <div>
        <BackButton path={'/gage'} />
        <Typography.Title level={1} style={{ lineHeight: 1.25, margin: '1rem 0 0 0', padding: 0 }}>
          {gage.name}
        </Typography.Title>
        <Typography.Title level={4} style={{ margin: 0, marginBottom: 32 }}>
          {`${gage.state}, ${gage.country}`}
        </Typography.Title>
        <Row gutter={24}>
          <Col span={24} md={24} lg={12}>
            <Card>
              <Row gutter={24} style={{ marginBottom: 24 }}>
                <Col span={12}>
                  <Statistic title={'latest reading'} value={gage.latestReading + ' ' + gage.metric || '-'} />
                </Col>
                <Col span={12}>
                  <Statistic
                    title={'delta'}
                    value={80}
                    prefix={<ArrowUpOutlined />}
                    valueStyle={{ color: '#3f8600' }}
                    suffix={gage.metric}
                  />
                </Col>
              </Row>
              <Row gutter={24}>
                <Col span={12}>
                  <Statistic title={'last fetched'} value={moment(gage.updatedAt).format('llll') || '-'} />
                </Col>
                <Col span={12}>
                  <Statistic
                    title={'source'}
                    formatter={() => (
                      <>
                        <a
                          href={`https://waterdata.usgs.gov/nwis/uv?site_no=${gage.siteId}`}
                          target={'_blank'}
                          rel="noreferrer"
                        >
                          {gage.source}
                        </a>
                      </>
                    )}
                  />
                </Col>
              </Row>
              <Row>
                <Col>
                  {userData && (
                    <Button
                      onClick={async () => {
                        await addUserGage(gage.id);
                      }}
                    >
                      Bookmark
                    </Button>
                  )}
                </Col>
              </Row>
            </Card>
          </Col>
          <Col span={24} md={24} lg={12}>
            {gage.readings.length > 0 && <GageReadingsChart readings={gage.readings} metric={gage.metric} />}
          </Col>
        </Row>
      </div>
    );
  }

  return null;
};
