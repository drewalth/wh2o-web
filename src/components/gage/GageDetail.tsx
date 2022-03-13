import React, {useEffect} from 'react';
import {Button, Card, Col, Row, Statistic, Typography} from 'antd';
import {useGageContext} from './gageContext';
import {GageReadingsChart} from './GageReadingsChart';

import {ArrowUpOutlined} from '@ant-design/icons';
import moment from 'moment';
import {BackButton} from '../common';
import {useUserContext} from '../user/userContext';
import {GagePageData} from "../../../gatsby-node";

type PageContext = {
    pageContext: {
        gage: GagePageData
    }
}

const GageDetail = ({pageContext: {gage: preloadedData}}: PageContext) => {
    const {loading, error, gage, loadGageDetail} = useGageContext();
    const {addUserGage, data: userData} = useUserContext();

    useEffect(() => {
        (async () => {
            await loadGageDetail(preloadedData.id)
        })()
    }, [])

    return (
        <div>
            <BackButton path={'/gages'}/>
            <Typography.Title level={1} style={{lineHeight: 1.25, margin: '1rem 0 0 0', padding: 0}}>
                {preloadedData.name}
            </Typography.Title>
            <Typography.Title level={4} style={{margin: 0, marginBottom: 32}}>
                {`${preloadedData.state}, ${preloadedData.country}`}
            </Typography.Title>
            <Row gutter={24}>
                <Col span={24} md={24} lg={12}>
                    <Card>
                        <Row gutter={24} style={{marginBottom: 24}}>
                            <Col span={12}>
                                <Statistic title={'latest reading'}
                                           loading={loading}
                                           value={gage?.latestReading + ' ' + gage?.metric || '-'}/>
                            </Col>
                            <Col span={12}>
                                <Statistic
                                    title={'delta'}
                                    value={80}
                                    prefix={<ArrowUpOutlined/>}
                                    valueStyle={{color: '#3f8600'}}
                                    loading={loading}
                                    suffix={gage?.metric || 'cfs'}
                                />
                            </Col>
                        </Row>
                        <Row gutter={24}>
                            <Col span={12}>
                                <Statistic title={'last fetched'}
                                           loading={loading}
                                           value={moment(gage?.updatedAt).format('llll') || '-'}/>
                            </Col>
                            <Col span={12}>
                                <Statistic
                                    title={'source'}
                                    formatter={() => (
                                        <>
                                            <a
                                                href={`https://waterdata.usgs.gov/nwis/uv?site_no=${gage?.siteId || 0}`}
                                                target={'_blank'}
                                                rel="noreferrer"
                                            >
                                                {preloadedData.source}
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
                    {gage && gage.readings.length > 0 &&
                    <GageReadingsChart readings={gage.readings} metric={gage.metric}/>}
                </Col>
            </Row>
        </div>
    );
};

export default GageDetail
