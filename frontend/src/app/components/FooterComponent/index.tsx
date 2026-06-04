"use client";
import { useState, useEffect } from 'react';
import styles from './styles.module.css';
import { checkUrlParam } from '@/app/helpers/checkUrlParam';

const FooterComponent = () => {

    const [isAdmin, setIsadmin] = useState(false)

    useEffect(() => {
        const currentUrl = checkUrlParam('admin');
        setIsadmin(currentUrl)
    }, [])

    const now = new Date();
    const year = now.getFullYear();
    return (
        <>
            {isAdmin && <footer className={styles.footerLayout}>
                <p>&copy; {year} Взаимопомощь. Все права защищены.</p>
            </footer> }
        </> 
    );
}

export default FooterComponent;