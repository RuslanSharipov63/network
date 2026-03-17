"use client";
import { FC, useEffect } from "react";
import { useState } from "react";
import styles from "./styles.module.css";
import AlertComponent from "../AlertComponent";
import { ServiceCard } from "@/types";

type Service = {
  userId: number;
  title: string;
  description: string;
  needed: string;
  status: string;
};

const validatorAddService = (formData: Service): boolean => {
  for (const [key, value] of Object.entries(formData)) {
    if (key === "status") continue;
    if (typeof value === "string" && value.length < 10) {
      return false;
    }
  }
  return true;
};

interface AddServiceModalProps {
  updateService?: ServiceCard | null,
  method: string,
  userId: number;
  isOpen: boolean;
  onClose: () => void;
  onAddService?: (service: Service) => void;
}

const AddServiceModalComponent: FC<AddServiceModalProps> = ({
  isOpen,
  onClose,
  onAddService,
  userId,
  method,
  updateService,
}) => {
  const [formData, setFormData] = useState({
    id: 0,
    userId: userId,
    title: "",
    description: "",
    needed: "",
    status: "модерация",
  });

  const [checkModalWindow, setCheckModalWindow] = useState<boolean>(false);

  useEffect(() => {
    if (method == "PUT" && updateService) {
      setFormData({
        ...formData, id: updateService.id, title: updateService.title, description: updateService.description,
        needed: updateService.needed,
      })
    }

    if(method == "POST") {
       setFormData({
        ...formData, id: 0, title: '', description: '',
        needed: '',
      })
    }

  }, [method, updateService])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setCheckModalWindow(false);
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validatorAddService(formData) != true) {
      setCheckModalWindow(true);
      return;
    }

    if (onAddService) {
      onAddService(formData);
      setCheckModalWindow(false);
    }

    setFormData({
      id: 0,
      userId,
      title: "",
      description: "",
      needed: "",
      status: "модерация",
    });
    onClose();
  };
  const actionAfterClose = () => {
    setCheckModalWindow(false);
  };

  if (!isOpen) return null;

  return (
    <>
      <div className={styles.modalBackdrop} onClick={onClose}>
        <div
          className={styles.modalContent}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            className={styles.modalCloseButton}
            onClick={onClose}
            aria-label="Закрыть"
          >
            ✕
          </button>
          <h3 className={styles.modalTitle}>Добавить новую услугу</h3>
          {checkModalWindow ? (
            <AlertComponent
              alertType={"warning"}
              title={"Ошибка"}
              description={"Заполните все поля"}
              actionAfterClose={actionAfterClose}
            />
          ) : null}
          <form className={styles.modalForm} onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label htmlFor="modal-title">Название услуги</label>
              <input
                id="modal-title"
                name="title"
                type="text"
                value={formData.title}
                onChange={handleChange}
                required
                placeholder="Например: Ремонт сантехники"
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="modal-desc">Описание</label>
              <textarea
                id="modal-desc"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                required
                placeholder="Расскажите подробнее о том, что вы предлагаете"
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="modal-needed">Что нужно взамен</label>
              <input
                id="modal-needed"
                name="needed"
                type="text"
                value={formData.needed}
                onChange={handleChange}
                required
                placeholder="Например: Помощь в саду"
              />
            </div>

            <button type="submit" className={styles.saveButton}>
              {method == "PUT" ? "Обновить услугу" : "Добавить услугу"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default AddServiceModalComponent;
