"use client";
import { useAppSelector } from "@/app/redux/hooks";

const AdminPanel = () => {

    const user = useAppSelector((state) => state.authUserReducer);

    return (

        <>gt</>

    );
}

export default AdminPanel;