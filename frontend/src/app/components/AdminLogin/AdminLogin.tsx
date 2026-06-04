"use client";
import { useEffect, useState, useLayoutEffect } from "react";
import { authUser } from "@/app/redux/slice/auth";
import { redirect } from "next/navigation";
import { useRouter, usePathname } from "next/navigation";
import { useAppSelector, useAppDispatch } from '@/app/redux/hooks';
import type { FormProps } from 'antd';
import { Button, Checkbox, Form, Input } from 'antd';
import AlertComponent from "@/app/components/AlertComponent";
import AdminProgress from "../../admin/admincomponents/Progress";

type FieldType = {
  email?: string;
  password?: string;
  remember?: string;
};

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

const AdminLogin = () => {
  const dispatch = useAppDispatch();

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState(false)

  const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/admin/authadmin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // ← важно для передачи cookie!
        body: JSON.stringify(values),
      });

      const data: LoginResponse = await res.json();

      if (!res.ok || !data.success) {
        setError(data.message || "Неизвестная ошибка");
        return;
      }
      setSuccess(data.success)
      dispatch(authUser({ message: data.message, success: data.success, user: data.user }))
    } catch (err) {
      console.error("[Ошибка сети или парсинга]", err);
      setError("Не удалось подключиться к серверу");
    } finally {
      setLoading(false);
    }
  };

  const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  useEffect(() => {
     if (success) {
      redirect("/admin");
    } 
  }, [success])

  const actionAfterClose = () => {
    setError(null)
  }
  return (

    <>

      {error !== null && <div style={{ marginBottom: '10px' }}>
        <AlertComponent
          title="Ошибка"
          description={error}
          alertType="error"
          actionAfterClose={actionAfterClose} />
      </div>}

      {loading && <div style={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: "10px"
      }}>
        <AdminProgress loading={loading} />
      </div>}

      <Form
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        style={{ maxWidth: 600 }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >

        <Form.Item<FieldType>
          label="Email"
          name="email"
          rules={[{ required: true, message: 'Пожалуйста введите  email' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item<FieldType>
          label="Password"
          name="password"
          rules={[{ required: true, message: 'Пожалуйста введите пароль' }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item<FieldType> name="remember" valuePropName="checked" label={null}>
          <Checkbox>Remember me</Checkbox>
        </Form.Item>

        <Form.Item label={null}>
          <Button type="primary" htmlType="submit">
            Отправить
          </Button>
        </Form.Item>
      </Form>
    </>

  );
}

export default AdminLogin;