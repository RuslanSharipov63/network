"use client";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/app/redux/hooks";
import { fetchGetservice } from "@/app/redux/slice/service";

import { useParams } from 'next/navigation';
import styles from "./styles.module.css";
//import { fetchGetServiceWithUser } from "@/app/redux/slice/service"; // ← предполагаю, что такой экшн есть (иначе — создадим)
import Preloader from "../PreloaderComponent";
import Link from "next/link";
import ModalMessage from "./modalmessage";

// Заглушка рейтинга (можно заменить на реальный компонент)
const StarRating = ({ rating = 0 }: { rating?: number }) => {
    return (
        <div className={styles.raitingStars}>
            {[...Array(5)].map((_, i) => (
                <span key={i} style={{ color: i < Math.floor(rating) ? "#FFD700" : "#ddd" }}>
                    ★
                </span>
            ))}
            <span style={{ marginLeft: "8px", fontSize: "0.9em", color: "#666" }}>
                {rating.toFixed(1)}
            </span>
        </div>
    );
};

const ServiceComponent = () => {
    const dispatch = useAppDispatch();
    const params = useParams();
    const { id } = params;

    const serviceState = useAppSelector((state) => state.serviceReducer);
    const { user } = useAppSelector((state) => state.authUserReducer);
    const [isHydrated, setIsHydrated] = useState(false);
    const [isOpen, setIsOpen] = useState(false);


    useEffect(() => {
        setIsHydrated(true);
        if (id && typeof id != "object") { dispatch(fetchGetservice(id)) }
    }, []);

    if (!isHydrated || serviceState.status === "pending") {
        return <Preloader />;
    }
    if (!serviceState.success) {
        return (
            <div className={styles.centered}>
                <h2>Услуга не найдена</h2>
                <p>Проверьте ссылку или вернитесь на главную.</p>
                <Link href="/" className={styles.backLink}>← На главную</Link>
            </div>
        );
    }

    const createdAt = serviceState.services[0].updated_at
        ? new Date(serviceState.services[0].updated_at).toLocaleDateString("ru-RU", {
            year: "numeric",
            month: "long",
            day: "numeric",
        })
        : "неизвестно";


    const closeModalWindow = () => {
        setIsOpen(false);
    }
  
    return (
        <>
            <ModalMessage
                isOpen={isOpen}
                closeModalWindow={closeModalWindow}
                author={user.username}
                avatar={user.avatarUrl}
                recipient={serviceState.services[0].username}
                recipientId={serviceState.services[0].userid ? serviceState.services[0].userid : ''}
                authorId={user.id}
            />
            <div className={styles.serviceDetailPage}>

                <section className={styles.serviceHeader}>
                    <h1 className={styles.serviceTitle}>{serviceState.services[0].title}</h1>
                    {/*      <StarRating rating={serviceState.services[0].rating || 4.2} /> */}
                </section>

                <section className={styles.serviceContent}>
                    <div className={styles.serviceInfo}>
                        <h3>Описание</h3>
                        <p>{serviceState.services[0].description}</p>

                        <h3>Что нужно взамен</h3>
                        <p>{serviceState.services[0].needed || "Не указано"}</p>

                        <h3>Адрес</h3>
                        <p>{serviceState.services[0].address || "Не указан"}</p>

                        <h3>Создано</h3>
                        {createdAt}
                    </div>

                    <div className={styles.authorCard}>
                        <h3>Автор услуги</h3>
                        <div className={styles.authorInfo}>
                            <div className={styles.avatarPlaceholder}>
                                {/* По твоей логике: дефолтный аватар, если нет — PNG загружается позже */}
                                <span>👤</span>
                            </div>
                            <div>
                                <h4>{serviceState.services[0].username}</h4>
                                {/*  <StarRating rating={serviceState.services[0]?.userRating || 4.5} /> */}
                                <p className={styles.region}>
                                    {serviceState.services[0].address || "не указан"}
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                <section className={styles.actionButtons}>
                    <button className={styles.btnPrimary} onClick={() => setIsOpen(!isOpen)} >
                        Написать сообщение
                    </button>
                    <button className={styles.btnSecondary}>
                        Добавить в избранное
                    </button>
                    <button className={styles.btnOutline}>
                        Поделиться
                    </button>
                </section>

                <footer className={styles.footer}>
                    <Link href="/" className={styles.backLink}>← Вернуться к списку услуг</Link>
                </footer>
            </div >
        </>
    );
}

export default ServiceComponent;