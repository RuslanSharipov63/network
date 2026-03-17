import React, { FC } from "react";
import { Alert } from "antd";

type AlertComponentProps = {
  title: string;
  description: string;
  actionAfterClose?: () => void;
  alertType: "success" | "info" | "warning" | "error" | undefined;
};

const AlertComponent: FC<AlertComponentProps> = ({
  title,
  description,
  actionAfterClose,
  alertType,
}) => {
  const handleClose = () => {
    if (actionAfterClose) {
      actionAfterClose();
    }
  };

  return (
    <>
      <Alert
        title={title}
        description={description}
        type={alertType}
        showIcon
        closable={{ closeIcon: true, afterClose: handleClose }}
      />
    </>
  );
};

export default AlertComponent;
