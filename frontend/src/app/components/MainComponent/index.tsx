"use client";
import { useEffect, useState } from 'react';
import styles from './styles.module.css'
import { useAppDispatch, useAppSelector } from "@/app/redux/hooks";
import { fetchGetServicesWithUsers } from '@/app/redux/slice/service';
import Preloader from '../PreloaderComponent';
import PaginationComponent from '../PaginationComponent';
import Link from 'next/link';


const MainComponent = () => {
    const dispatch = useAppDispatch();
    const dataServices = useAppSelector((state) => state.serviceReducer);

    // Сначала устанавливаем page = 1 (на сервере и при первом клиентском рендере)
    const [page, setPage] = useState<number>(1);
    const [leftWrapperPage, setLeftWrapperPage] = useState<number>(0)
    // Флаг, чтобы знать, когда состояние "гидратировано" (чтобы избежать FOUC/мелькания)
    const [isHydrated, setIsHydrated] = useState(false);

    useEffect(() => {
        dispatch(fetchGetServicesWithUsers(page))
    }, [dispatch, page])

    useEffect(() => {
        // Этот эффект выполняется ТОЛЬКО на клиенте
        const savedPage = typeof window !== 'undefined'
            ? localStorage.getItem('page')
            : null;

        const savedleftWrapperPage = typeof window !== 'undefined'
            ? localStorage.getItem('left')
            : null;

        if (savedPage !== null) {
            setPage(Number(savedPage));
        }
        if (savedleftWrapperPage !== null) {

            setLeftWrapperPage(Number(savedleftWrapperPage));
        }

        setIsHydrated(true); // теперь можно рендерить Pagination
    }, []);

    const changePage = (newPage: number,) => {
        setPage(newPage);
        if (typeof window !== 'undefined') {
            localStorage.setItem('page', newPage.toString());
        }
    };

    const changeLeft = (leftWrapperPage: number) => {
        setLeftWrapperPage(leftWrapperPage)
        if (typeof window !== 'undefined') {
            localStorage.setItem('left', leftWrapperPage.toString());
        }
    }


    return (
        <>
            <div>
                <section className={styles.welcome}>
                    <h2>Добро пожаловать в сообщество обмена услугами</h2>
                    <p>Помогайте другим — получайте помощь в ответ!</p>
                </section>
                {dataServices.status == "pending" ? <Preloader /> : null}
                {(dataServices.services.length === 0 && dataServices.status == "fulfilled") && <div style={{textAlign: "center"}}>Никто пока не разместил услуги.</div>}
                <section className={styles.servicesGrid}>
                    {dataServices.status == "fulfilled" && dataServices.services.map(el =>
                        <Link href={`/service/${el.id}`} key={el.id}> <div className={styles.serviceCard} >
                            <h3>{el.title}</h3>
                            <p>{el.description}</p>
                            <p>{el.needed}</p>
                            <p>Создан: {el.updated_at != null && new Date(el.updated_at).toLocaleDateString()}</p>
                            <p>От: <strong>{el.username}</strong></p>
                            <p>адрес: {el.address}</p>
                        </div></Link>
                    )}

                </section>
            </div>
            {(dataServices.services.length === 0 && dataServices.status == "fulfilled") ? null : isHydrated && <PaginationComponent
                totalPages={Math.ceil(dataServices.totalPages / 10)}
                page={page} changePage={changePage}
                leftWrapperPageProp={leftWrapperPage}
                changeLeft={changeLeft}
            />}
        </>
    );
}

export default MainComponent;
