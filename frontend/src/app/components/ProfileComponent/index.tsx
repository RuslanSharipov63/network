"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import styles from "./styles.module.css";
import { useAppSelector, useAppDispatch } from "@/app/redux/hooks";
import { fetchCreateService } from "@/app/redux/slice/service";
import AddServiceModalComponent from "../AddServiceModalComponent";
import CardServiceComponent from "../CardServiceComponent";
import AlertComponent from "../AlertComponent";
import { fetchGetUserServices, fetchUpdateService } from "@/app/redux/slice/service";
import { clearMessageAndSuccess, updateStateService } from "@/app/redux/slice/service";
import InpAddressDadataComponent from "../InpAddressDadataComponent";
import { updateAddress, updateDataUser } from "@/app/redux/slice/auth";
import { ServiceCard } from "@/types";
import { UpdatableUserField } from "@/app/redux/slice/auth";

const validFields: Record<string, UpdatableUserField> = {
  email: 'email',
  username: 'username',
};

const ProfileComponent = () => {
  const dispatch = useAppDispatch();
  const serviceSlice = useAppSelector((state) => state.serviceReducer);
  const [isModalOpen, setIsModalOpen] = useState({ status: false, method: 'POST' });
  const [oneService, setOneService] = useState<ServiceCard | null>(null)

  const dataUser = useAppSelector((state) => state.authUserReducer);
  const { services, success } = useAppSelector((state) => state.serviceReducer)

  useEffect(() => {
    if (dataUser.user.id) {
      dispatch(fetchGetUserServices({ id: dataUser.user.id }))
    }

  }, [dispatch, dataUser])

  const [isEditing, setIsEditing] = useState(false);

  const handleEdit = () => {
    setIsEditing(!isEditing);
  };
  const handleAddService = (service: {
    id?: number,
    userId: number;
    title: string;
    description: string;
    needed: string;
    status: string
  }) => {
    service.userId = dataUser.user.id;
    if (isModalOpen.method === 'POST') {
      dispatch(clearMessageAndSuccess())
      dispatch(fetchCreateService(service));
    }
    if (isModalOpen.method === 'PUT') {
      dispatch(clearMessageAndSuccess())
      dispatch(fetchUpdateService(service));
      if (service.id) {
        dispatch(updateStateService(service))
      }

    }
  };

  if (dataUser.success != true) return null;
  const updateService = (el: ServiceCard) => {
    setIsModalOpen({ ...isModalOpen, status: true, method: 'PUT' })
    setOneService(el)
  }

  const closeModal = () => {
    setIsModalOpen({ ...isModalOpen, status: false, method: 'POST' })
    setOneService(null)
    dispatch(clearMessageAndSuccess())
  }
  const addAddress = (param: string) => {
    dispatch(updateAddress(param))
  }
  const closeEditingForm = () => {
    setIsEditing(false)
  }


  const updateUserValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const field = validFields[name];
    if (field) {
      dispatch(updateDataUser({ valuename: field, param: value }));
    }
  }

  const updateProfile = () => { }

  return (
    <div className={styles.page}>

      <div className={styles.profileHeader}>
        {dataUser.user.avatarUrl != "" ? (
          <Image
            src={dataUser.user.avatarUrl}
            alt="Аватар"
            className={styles.avatar}
            width={150}
            height={150}
            style={{ objectFit: "cover" }}
          />
        ) : null}
        <div>
          <h2>
            <strong>Имя:</strong> {dataUser.user.username}
          </h2>
          <p>
            <strong>Email:</strong> {dataUser.user.email}
          </p>
          <p style={{ overflow: "hidden" }}>
            <strong>Адрес:</strong>{" "}
            {dataUser.user.address ? dataUser.user.address : "не указан"}
          </p>
        </div>
      </div>
      <div className={styles.btnContainer}>
        <button onClick={handleEdit} className={styles.editButton}>
          {isEditing ? "Отменить редактирование" : "Редактировать профиль"}
        </button>
        <button
          onClick={() => setIsModalOpen({ ...isModalOpen, status: true })}
          className={styles.editButton}
        >
          + Добавить услугу
        </button>
      </div>
      <AddServiceModalComponent
        isOpen={isModalOpen.status}
        onClose={closeModal}
        onAddService={handleAddService}
        userId={dataUser.user.id}
        method={isModalOpen.method}
        updateService={oneService}
      />
      {isEditing && (
        <div className={styles.editForm}>
          <h3>Редактировать профиль</h3>
          <label htmlFor="edit-name">Имя</label>
          <input
            id="edit-name"
            type="text"
            value={dataUser.user.username}
            name="username"
            onChange={updateUserValue}
          />
          <label htmlFor="edit-email">Email</label>
          <input
            id="edit-email"
            type="email"
            value={dataUser.user.email}
            name="email"
            onChange={updateUserValue}
          />
          <label htmlFor="edit-address">Адрес</label>
          {/* <input
            id="edit-address"
            type="text"
            defaultValue={dataUser.user.address}
          /> */}
          <InpAddressDadataComponent
            addAddress={addAddress}
            currentAddress={dataUser.user.address}
          />
          <button className={styles.saveButton} onClick={updateProfile}>Сохранить изменения</button>
          <br />
          <button className={styles.closeButton} onClick={closeEditingForm}>Закрыть</button>
        </div>
      )}
      {serviceSlice.message != '' ? (
        <AlertComponent
          title={serviceSlice.success == true ? "Отлично!" : "Что-то пошло не так"}
          alertType={serviceSlice.success == true ? "success" : "error"}
          description={serviceSlice.message}
        />
      ) : null}


      <h3 className={styles.sectionTitle}>Предложенные услуги</h3>
      <section className={styles.profileCard}>

        {services.length > 0 ? <CardServiceComponent services={services} updateService={updateService} /> : "Вы пока не опубликовали ни одной услуги"}

      </section>

    </div>
  );
};

export default ProfileComponent;
