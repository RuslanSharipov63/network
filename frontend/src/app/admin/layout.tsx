"use client"
import { QueryClientProvider,  QueryClient } from "@tanstack/react-query";
import { redirect } from "next/navigation";
import React, { useLayoutEffect, useState } from 'react';
import { Layout, Menu, theme, Typography } from 'antd';
const { Header, Content } = Layout;
import { useAppSelector, useAppDispatch } from "@/app/redux/hooks";
const { Text } = Typography;
import { authUser } from '../redux/slice/auth';

const queryClient = new QueryClient()

const items = Array.from({ length: 3 }).map((_, index) => ({
    key: index + 1,
    label: `nav ${index + 1}`,
}));

type Role = "user" | "admin";

export default function AdminLayout({ children, }: { children: React.ReactNode }) {

    const dispatch = useAppDispatch();
    const user = useAppSelector((state) => state.authUserReducer);
    const [checkRole, setCheckRole] = useState<Role>("user");
    const currentYear = new Date().getFullYear();

    useLayoutEffect(() => {

        const checkAuth = async () => {
            let checkRole: string = '';
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


                    if (data.user.role == 'admin') {
                        checkRole = "admin"
                        setCheckRole("admin")
                        return;
                    }

                }
                if (data.success == false) {
                    return;
                }
            } catch (err) {
                console.error("Ошибка проверки авторизации:", err);
            }

            if (checkRole !== 'admin') {
                redirect("/adminpanel")
            }
        };

        checkAuth();
    }, []);

    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    return (
        <>
            {checkRole != "admin" && <div style={{ margin: "10 auto" }}>"Загрузка..."</div>}
            {checkRole === "admin" && <Layout style={{
                maxWidth: "1200px",
                minWidth: "1200px",
                margin: "auto",
                flex: "1",
            }}>
                <Header style={{ display: 'flex', alignItems: 'center' }}>
                    <div className="demo-logo" />
                    <Menu
                        theme="dark"
                        mode="horizontal"
                        defaultSelectedKeys={['2']}
                        items={items}
                        style={{ flex: 1, minWidth: 0 }}
                    />
                </Header>
                <Text type="success" style={{ margin: '16px 5px' }}>Панель администратора</Text>
                <QueryClientProvider client={queryClient}>
                    <Content style={{ padding: '0 48px' }}>

                        <div
                            style={{
                                background: colorBgContainer,
                                minHeight: "100vh",
                                padding: 24,
                                borderRadius: borderRadiusLG,
                                boxSizing: "border-box",
                            }}
                        >
                            {children}
                        </div>
                    </Content>
                </QueryClientProvider>
                {/*      <Footer style={{ textAlign: 'center' }}>Ant Design ©{currentYear} Created by Ant UED</Footer> */}
            </Layout >}
        </>

    );

}

