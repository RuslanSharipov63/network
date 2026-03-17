import React, { useState, FC } from 'react';
import {  Modal } from 'antd';
import {DeleteOutlined,} from '@ant-design/icons';
type ModalWindowProps = {
    text: string;
    id?: number;
    title: string;
    okFunc?: (id: number) => void
}

const ModalWindow:FC<ModalWindowProps> = ({title, text, okFunc, id}) => {
 const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
    if(okFunc && id) {
      okFunc(id)
    }

  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };


    return (
        <>
       <DeleteOutlined style={{color: 'red', cursor: 'pointer'}} onClick={showModal}/>
      <Modal
        title={title}
        closable={{ 'aria-label': 'Custom Close Button' }}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        okButtonProps={{ style: { backgroundColor: 'red' } }}
        cancelText={"отменить"}
        cancelButtonProps={{ style: { backgroundColor: '#4caf50',  color: "white", fontSize: '14px' } }}
      >
    {text}
      </Modal>
      </>
    );
}

export default ModalWindow;