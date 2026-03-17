"use client";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/app/redux/hooks";
import { fetchGetservice } from "@/app/redux/slice/service";
import { useParams } from 'next/navigation';

const ServiceComponent = () => {
    const dispatch = useAppDispatch();
    const params = useParams();
    const { id } = params;

    useEffect(() => {
        if (id && typeof id != "object") { dispatch(fetchGetservice(id)) }

    }, []);


    return (<></>);
}

export default ServiceComponent;