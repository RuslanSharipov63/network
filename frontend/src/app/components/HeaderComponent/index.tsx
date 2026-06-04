"use client";
import { useEffect, useState, useLayoutEffect } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import styles from "./styles.module.css";
import { useRouter, usePathname } from "next/navigation";
import { useAppSelector, useAppDispatch } from "@/app/redux/hooks";
import { authUser, logoutUser } from "@/app/redux/slice/auth";
import { checkUrlParam } from "@/app/helpers/checkUrlParam";


const HeaderComponent = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const pathname = usePathname();

  const [checkUrl, setCheckUrl] = useState(false)
  const [isAdmin, setIsadmin] = useState(false)

  useEffect(() => {
    const currentUrl = checkUrlParam('admin');
    setIsadmin(currentUrl)
  }, [])



  useLayoutEffect(() => {

    const pathUrl = ["login", "register", "admin", 'adminpanel'];

    const checkAuth = async () => {
      const result = pathname.split("/");

      if (result.includes('admin')) {
        setIsadmin(true)
      } else {
        setIsadmin(false)
      }

      if (pathUrl.includes(result[result.length - 1]) || pathname == "/") return;

      try {
        const res = await fetch("http://localhost:5000/api/me", {
          method: "GET",
          credentials: "include", // ← обязательно!
        });

        const data = await res.json();

        if (data.success) {
          dispatch(
            authUser({
              success: true,
              message: "Авторизован",
              user: data.user,
            })
          );
          setCheckUrl(false)
          return
        } 
        if (data.success == false) {
          setCheckUrl(true);
          return;
        }
      } catch (err) {
        console.error("Ошибка проверки авторизации:", err);
      }
    };

    checkAuth();
  }, [dispatch, pathname]);

  useEffect(() => {
    if (checkUrl) {
      redirect("/");
    }
  }, [checkUrl])

  const { user } = useAppSelector((state) => state.authUserReducer);

  const handleLogout = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/logout", {
        method: "POST",
        credentials: "include",
      });

      const data = await res.json();

      if (res.ok && data.success) {
        // 1. Очистка Redux
        dispatch(logoutUser());

        // 2. Редирект на главную или /login
        router.push("/");
      } else {
        console.error("Ошибка выхода:", data.message);
      }
    } catch (err) {
      console.error("Сетевая ошибка при выходе:", err);
    }
  };

  return (
    <>
      {isAdmin == false && <header className={styles.headerLayout}>
        <h1>
          <Link href="/">Ты мне, я тебе</Link>
        </h1>
        <nav className={styles.navLayout}>
          <ul>
            <li>
              <Link href="/" className={styles.linkLayout}>
                Главная
              </Link>
            </li>
            <li>
              <Link href="#" className={styles.linkLayout}>
                Услуги
              </Link>
            </li>
            <li>
              <Link href="/profile" className={styles.linkLayout}>
                Профиль
              </Link>
            </li>
            <li>
              <Link href="/login" className={styles.linkLayout}>
                {user.username != "" ? user.username : "Войти"}
              </Link>
            </li>
            {user.username != "" && (
              <li>
                <Link href="#" className={styles.linkLayout} onClick={handleLogout}>
                  Выход
                </Link>
              </li>
            )}
          </ul>
        </nav>
      </header>}
    </>

  );
};

export default HeaderComponent;
