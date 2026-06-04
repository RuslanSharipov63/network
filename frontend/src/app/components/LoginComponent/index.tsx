"use client"
import { useState, useEffect } from 'react';
import styles from './styles.module.css';
import Link from 'next/link';
import { redirect } from "next/navigation";
import { authUser } from '@/app/redux/slice/auth';
import { useAppDispatch } from '@/app/redux/hooks';

type FormType = {
    email: string;
    password: string;
}

type LoginResponse = {
  success: boolean;
  message: string;
  user: {
    id: number;
    email: string;
    username: string;
    avatarUrl: string;
    role: string;
  };
};

const LoginComponent = () => {
  const dispatch = useAppDispatch();

 const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState(false) 

const [formState, setForm] = useState<FormType>({
    email: '',
    password: ''
})
const handleChange = (e: React.ChangeEvent<HTMLInputElement> ) => {
    setForm({...formState, [e.target.name]: e.target.value})
     if (error) setError(null); // сбрасываем ошибку при изменении
}

const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // ← важно для передачи cookie!
        body: JSON.stringify(formState),
      });

      const data: LoginResponse = await res.json();

      if (!res.ok || !data.success) {
        setError(data.message || "Неизвестная ошибка");
        return;
      }
      setSuccess(data.success)
      dispatch(authUser({message: data.message, success: data.success, user: data.user}))
    } catch (err) {
      console.error("[Ошибка сети или парсинга]", err);
      setError("Не удалось подключиться к серверу");
    } finally {
      setLoading(false);
    }
  };


useEffect(()=>{
   if(success) {
       redirect("/profile");
    }
},[success])

    return ( 
        <div className={styles.loginBox}>
            <h2>Вход в аккаунт</h2>
              {error && <div className={styles.error}>{error}</div>}
            <form className={styles.loginForm} onSubmit={handleSubmit}>
                <input type="email" value={formState.email} name="email" placeholder="Email" required onChange={handleChange}/>
                <input type="password"onChange={handleChange} value={formState.password} name="password" placeholder="Пароль" required />
                <button type="submit" disabled={loading}>{loading ? "Вход..." : "Войти"}</button>
            </form>
            <div className={styles.loginLlink}>
                <Link href="#" className={styles.link}>Забыли пароль?</Link> | <Link href="/register">Зарегистрироваться</Link>
            </div>
        </div>
   )
}

export default LoginComponent;