"use client"
import React, { useEffect, useState } from 'react';
import { Flex, Progress } from 'antd';
import { set } from 'zod';

const AdminProgress = ({ loading }: { loading: boolean }) => {

    const [percent, setPercent] = useState(0);

    useEffect(() => {
        if (percent <= 100 && loading == true) {
            setTimeout(() => {
                 setPercent(percent + 10);
            }, 200);
               
        }
        if (loading == false) {
            setPercent(100)
        }
    }, [percent]);

    return (
        < Flex wrap gap="small" >
            <Progress type="circle" percent={percent} size={80} />
        </Flex >
    )
};

export default AdminProgress;