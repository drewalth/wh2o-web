import React from 'react';
import { Typography, Statistic, Row, Col } from 'antd';
import { useGageContext } from './gageContext';
import { GageReadingsChart } from './GageReadingsChart';

export const GageDetail = () => {
  const { loading, error, gage } = useGageContext();

  if (loading) {
    return <div>loading...</div>;
  }

  if (error) {
    return <div>error</div>;
  }

  if (gage) {
    return (
      <div>
        <Typography.Title level={1}>{gage.name}</Typography.Title>

        <Row>
          <Col span={12}>
            <Statistic title={'lastest reading'} value={gage.latestReading + ' ' + gage.metric || '-'} />
          </Col>
          <Col span={12}>
            {gage.readings.length > 0 && <GageReadingsChart readings={gage.readings} metric={gage.metric} />}
          </Col>
        </Row>
      </div>
    );
  }

  return null;
};
