import React from 'react';
import {Button} from 'antd';
import {ArrowLeftOutlined} from '@ant-design/icons';
import {navigate} from "gatsby";

type BackButtonProps = {
    path: string;
};

export const BackButton = ({path}: BackButtonProps) => {
    // const history = useHistory();
    return (
        <Button onClick={() => navigate(path)} size="small">
            <ArrowLeftOutlined/>
        </Button>
    );
};
