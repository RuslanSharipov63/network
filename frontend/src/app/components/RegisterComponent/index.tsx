"use client";
import { redirect } from "next/navigation";
import InpAddressDadataComponent from "../InpAddressDadataComponent";
import Image from "next/image";
import { useEffect, useState } from "react";
import { EMAIL_REGEXP } from "@/app/const";
import styles from "./styles.module.css";

interface FormData {
  username: string;
  email: string;
  message?: string;
  password: string;
  address: string;
}

const RegisterComponent = () => {

  const [formData, setFormData] = useState<FormData>({
    username: "",
    email: "",
    message: "",
    password: "",
    address: "",
  });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    success: boolean;
    text: string;
  } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event?.preventDefault();
    setLoading(true);
    setMessage(null);
    if (formData.username === "") {
      setFormData({ ...formData, message: "Заполните все поля" });
      return;
    }
    if (!EMAIL_REGEXP.test(formData.email)) {
      setFormData({ ...formData, message: "Не валидный email" });
      return;
    }
    if (formData.password.length < 8) {
      setFormData({ ...formData, message: "Пароль - меньше 8 символов" });
      return;
    }

    const payload = new FormData();
    payload.append("email", formData.email);
    payload.append("password", formData.password);
    payload.append("username", formData.username);
    if (formData.address) payload.append("address", formData.address);
    if (avatarFile) payload.append("avatar", avatarFile);

    try {
      const res = await fetch("http://localhost:5000/api/register", {
        method: "POST",
        body: payload,
      });

      const data = await res.json();
      setMessage({ ...message, success: data.success, text: data.message });
      setLoading(false);
    } catch (err) {
      console.log(err);
      setMessage({ ...message, success: false, text: "Ошибка сервера" });
      setLoading(false);
    }
 
  };

useEffect(()=>{
   if(message != null && message.success) {
       redirect("/login");
    }
},[message])

  useEffect(() => {
    if (message != null) {
      alert(message.text);
    }
  }, [message]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (!file) return;

    // проверка типа и размера
    if (!file.type.startsWith("image/")) {
      alert("Пожалуйста, выберите изображение (png, jpg, jpeg и т.д.)");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      // 5 МБ
      alert("Файл слишком большой. Максимум — 5 МБ.");
      return;
    }

    setAvatarFile(file);

    // Предпросмотр аватарки
    const reader = new FileReader();
    reader.onload = () => {
      setAvatarPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
    /*  setAvatarPreview(URL.createObjectURL(file)); */
  };


const addAddress = (item: string) => {
setFormData({ ...formData, address: item});
}

  return (
    <section className={styles.registerForm}>
      <h2>Регистрация</h2>
      <form className={styles.registerForm}>
        <label htmlFor="name">Имя</label>
        <input
          type="text"
          id="name"
          name="username"
          placeholder="Введите ваше имя"
          required
          onChange={handleChange}
        />

        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          placeholder="Введите ваш email"
          required
          onChange={handleChange}
        />

        <label htmlFor="password">Пароль</label>
        <input
          type="password"
          id="password"
          name="password"
          placeholder="Введите пароль"
          required
          onChange={handleChange}
        />

        <label htmlFor="address">Адрес</label>
      {/*   <input
          type="text"
          id="address"
          name="address"
          placeholder="Введите ваш адрес"
          required
          onChange={handleChange}
        /> */}
        <InpAddressDadataComponent addAddress={addAddress}/>

        <label htmlFor="avatar">Аватар</label>
        <input
          type="file"
          id="avatar"
          name="avatar"
          accept="image/*"
          onChange={handleAvatarChange}
        />

        {avatarPreview && (
          <div className={styles.avatarPreview}>
            <Image
              src={avatarPreview}
              alt="Предпросмотр аватара"
              width={150}
              height={150}
              style={{ objectFit: "cover" }}
            />
          </div>
        )}
        {loading ? (
          <button className={styles.btnDisabled}>Зарегистрироваться</button>
        ) : (
          <button onClick={handleSubmit}>Зарегистрироваться</button>
        )}
      </form>
    </section>
  );
};

export default RegisterComponent;
