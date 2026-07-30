"use client";
import { Spin } from 'antd';
import { getServices } from './../../../utils.js';
import {
    useQuery,
} from '@tanstack/react-query';
import TableComponent from './TableComponent';
import type { TableColumnsType } from 'antd';

export interface DataType {
    id: number,
    userid: number,
    title: string,
    description: string,
    needed: string,
    created_at: Date,
    updated_at: Date,
    status: string,
    username: string,
    avatar: string,
    address: string
}

const columns: TableColumnsType<DataType> = [
    {
        title: 'Заголовок',
        width: 100,
        dataIndex: 'title',
        key: 'title',
        fixed: 'start',
    },
    {
        title: 'Имя',
        width: 100,
        dataIndex: 'username',
        key: 'username',
        fixed: 'start',
    },
    {
        title: 'Статус',
        width: 100,
        dataIndex: 'status',
        key: 'status',
        fixed: 'start',

    },
]

const AdminPanel = () => {

    const { isPending, isError, data, error } = useQuery({ queryKey: ['adminservices'], queryFn: getServices })

    if (isPending) {
        return <div style={{ display: "flex", width: "100%", justifyContent: "center" }}><Spin /></div>;
    }

    if (isError) {
        console.log(error)
        return <span>Ошибка сервера</span>
    }

    return (

        <TableComponent dataSource={data.rows} columns={columns} />

    );
}

export default AdminPanel;