import React from 'react';
import { Table } from 'antd';
import type { TableColumnsType } from 'antd';
import { createStyles } from 'antd-style';
import { DataType } from './AdminPanel'
import { redirect } from 'next/navigation'

const useStyle = createStyles({
    customTable: {
        '.ant-table': {
            '.ant-table-container': {
                '.ant-table-body, .ant-table-content': {
                    scrollbarWidth: 'thin',
                    scrollbarColor: '#eaeaea transparent'
                }
            }
        }
    }
});


interface TableComponentProps {
    dataSource: DataType[];
    columns: TableColumnsType<DataType>;
}

const TableComponent: React.FC<TableComponentProps> = ({ dataSource, columns }) => {
    const { styles } = useStyle();

    const serviceId = (record: DataType) => {
        redirect(`/admin/${record.id}`);
    }

    return (
        <Table<DataType>
            className={styles.customTable}
            pagination={false}
            columns={columns}
            dataSource={dataSource}
            scroll={{ x: 'max-content' }}
            rowKey="id"
            onRow={(record) => ({
                onClick: () => serviceId(record),
                style: { cursor: 'pointer' },
            })}

        />
    );
};

export default TableComponent;