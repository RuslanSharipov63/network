import { FC, useEffect, useState } from "react";
import styles from "./styles.module.css";
import { EditOutlined } from "@ant-design/icons";
import ModalWindow from "../ModalWindow";
import { useAppDispatch, useAppSelector } from "@/app/redux/hooks";
import { ServiceCard } from "@/types";
import {
  fetchDeleteService,
  deleteServiceAction,
} from "@/app/redux/slice/service";



type CardServiceComponentProps = {
  services: ServiceCard[];
  updateService: (el: ServiceCard) => void
};

const CardServiceComponent: FC<CardServiceComponentProps> = ({ services, updateService }) => {
  const dispatch = useAppDispatch();
  const [serviceId, setServiceId] = useState<number | null>(null)
  const { message } = useAppSelector((state) => state.serviceReducer);

  const formatDate = (iso: string) => {
    return new Date(iso).toLocaleDateString("ru-RU", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const deleteService = (id: number) => {
    setServiceId(id)
    dispatch(fetchDeleteService({ id: id }));
  };

  useEffect(() => {
    if (message == "Услуга удалена") {
      dispatch(deleteServiceAction({ id: serviceId }));
    }
  }, [dispatch, message, serviceId])

  const setDataUpdateService = (el: ServiceCard) => {
    updateService(el)
  }

  return (
    <>
      {services.map((el: ServiceCard, index: number) => {
        return (
          <div className={`${styles.card} ${el.status === "модерация" && styles.moderationCard}`} key={index}>
            <div className={styles.status}>{el.status}</div>
            <div className={styles.titleContainer}>
              <h2 className={styles.title}>{el.title.slice(0, 40)} {el.title.length > 40 && "..."}</h2>
            </div>
            <p className={styles.description}>{el.description.slice(0, 30)}{el.description.length > 30 && "..."}</p>
            <div className={styles.inReturn}>
              <div className={styles.inReturnLabel}>Взамен</div>
              <p className={styles.inReturnText}>{el.needed.slice(0, 30)}{el.needed.length > 30 && "..."}</p>
            </div>
            {el.updated_at && (
              <div className={styles.footer}>
                <time dateTime={String(el.updated_at)}>
                  {formatDate(String(el.updated_at))}
                </time>
              </div>
            )}
            <div className={styles.deleteEditContainer}>
              <ModalWindow
                text={"Подтвердите удаление."}
                id={el.id}
                okFunc={deleteService}
                title={"Удаление"}
              />
              <EditOutlined style={{ cursor: "pointer" }} onClick={() => setDataUpdateService(el)} />
            </div>
          </div>
        );
      })}
    </>
  );
};

export default CardServiceComponent;

