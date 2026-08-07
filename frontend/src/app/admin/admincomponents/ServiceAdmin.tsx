"use client";
import { usePathname } from 'next/navigation'
import { getServiceId, changeStatusServiceByIdAdmin } from './../../../utils'
import { Spin, Card, Result, Button } from 'antd';
import {
    useMutation,
    useQuery,
    useQueryClient
} from '@tanstack/react-query';
//import { Image } from 'antd';
import Image from 'next/image';

const classSelector = {
    marginBottom: '10px'
}

const ServiceAdmin = () => {
    const pathname = usePathname()
    const pathnameArr = pathname.split('/');
    const queryClient = useQueryClient();


    const mutation = useMutation({
        mutationFn: changeStatusServiceByIdAdmin,
        onSuccess: (newService) => {

            queryClient.invalidateQueries({ queryKey: ['serviceid'] });

        },
        onError: (error) => {
            console.error('Error creating user:', error);
        },
    });



    const { isPending, isError, data } = useQuery({ queryKey: ['serviceid', pathnameArr[2]], queryFn: () => getServiceId(pathnameArr[2]) })

    if (isPending) return <div style={{ display: 'flex', justifyContent: "center" }}> <Spin /></div>
    if (isError) return <div style={{ display: 'flex', justifyContent: "center" }}>
        <Result
            status="warning"
            title="Ошибка загрузки данных." />
    </div>

    const item = data.rows[0];

    const { id, userid, title, description, needed, created_at, updated_at, status, username, avatar, address } = item;
console.log(updated_at)
    const changeStatus = (currentStatus: string) => {

        mutation.mutate({ currentStatus, id });
    }
    return (
        <div style={{ display: 'flex', justifyContent: "center",  overflowWrap: "break-word"}}>
            <Card title={title} variant="borderless" style={{ width: 500, fontSize: "150%", maxHeight: "500px", overflow: "auto" }}>
                <Image
                    src={avatar}
                    width={200}
                    height={200}
                    alt="Picture of the author"
                />
                <p style={classSelector}>Автор:  {username}</p>
                <p style={classSelector}>Адрес: {address}</p>
                <p style={classSelector}>Описание:  {description}</p>
                <p style={classSelector}>Что нужно:  {needed}</p>
               <p style={classSelector}>Создано:  {updated_at !== null ? updated_at.slice(0, updated_at.indexOf('T')) : created_at.slice(0, created_at.indexOf('T'))}</p>
                <p style={classSelector}>Статус: {status}</p>
                {status === 'одобрен' ? <Button color="danger" variant="solid" onClick={() => changeStatus('модерация')} >
                    Снять с публикации </Button> : <Button type="primary" onClick={() => changeStatus('одобрен')}>Одобрить</Button>}
            </Card>

        </div>)
}

export default ServiceAdmin;