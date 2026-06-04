import { FC, useEffect, useState } from 'react';
import styles from './styles.module.css';
import Image from "next/image";
import AlertComponent from '../../AlertComponent';
import { fetchCreateMessage, fetchGetMessage, fetchGetLastmessage } from '@/app/redux/slice/chat';
import { useAppDispatch, useAppSelector } from '@/app/redux/hooks';
import { CreateMessageType } from '@/app/redux/slice/chat';
import { lastMessageDataType } from '@/types';
/* import { io } from 'socket.io-client';
const socket = io('http://localhost:5000');
socket.on('connect', () => {
    console.log('Соединение установлено, ID:', socket.id); */

// Здесь можно обновить UI, отобразив статус подключения

/* }); */

type ModalMessageProps = {
    isOpen: boolean;
    author: string;
    authorId: number;
    recipientId: number | string;
    avatar: string;
    recipient: string | undefined;
    closeModalWindow: () => void;
}

const ModalMessage: FC<ModalMessageProps> = ({ isOpen, closeModalWindow, author, authorId, avatar, recipient, recipientId }) => {
    const dispatch = useAppDispatch();
    const [messageChat, setMessage] = useState('');
    const [alert, setAlert] = useState<boolean>(false);
    const chat = useAppSelector(state => state.chatReducer)

    useEffect(() => {

        setInterval(() => {
            if (chat.messages.length > 0 && isOpen) {
                let to_user_id = authorId;
                let from_user_id = recipientId;
                let lastMessage = chat.messages.filter(el => el.to_user_id == authorId)
                let lastDate = lastMessage[lastMessage.length - 1].created_at;

                let lastMessageData: lastMessageDataType = { lastDate, to_user_id, from_user_id }
                dispatch(fetchGetLastmessage(lastMessageData))
            }
        }, 5000)

    }, [isOpen, chat.messages])





    useEffect(() => {
        if (authorId && recipientId) {
            dispatch(fetchGetMessage({ authorId, recipientId }))
        }
    }, [recipientId, authorId, dispatch])

    useEffect(() => {
        if (!isOpen) {
            setAlert(false)
        }
    }, [isOpen]);

    const validateMessage = () => {
        if (messageChat == '') {
            setAlert(true)
            return;
        }
        if (messageChat != '') {
            let list: CreateMessageType = {
                text: messageChat,
                from_user_id: authorId,
                to_user_id: recipientId ? recipientId : '',
            }
            dispatch(fetchCreateMessage(list))
        }

    }



const sendMessage = () => {
    validateMessage();
}



const actionAfterClose = () => {
    setAlert(false)
}

const handleKeyDown = (event: { key: string; }) => {
    if (event.key === 'Enter') {
        validateMessage();
    }
}


return (

    <div className={`${styles.modalContainer} ${isOpen && styles.modalOpen}`}>
        {alert && <AlertComponent
            title={'Сообщение не отправлено'}
            description={'Введите текст'}
            alertType={"error"}
            actionAfterClose={actionAfterClose}
        />}
        <div className={styles.chatContainer}>
            {/* Заголовок */}
            <div className={styles.chatHeader}>
                <div>
                    {avatar != "" ? (
                        <Image
                            src={avatar}
                            alt="Аватар"
                            className={styles.avatar}
                            width={150}
                            height={150}
                            style={{ objectFit: "cover" }}
                        />
                    ) : null}
                </div>

                <h3>Чат c {recipient}</h3>
                <button className={styles.btnClose} onClick={closeModalWindow}>X</button>
            </div>

            {/* Сообщения */}
            <div className={styles.messagesArea}>

                {chat.messages.length == 0 && 'У вас нет сообщений'}
                {chat.messages.length > 0 && chat.messages.map((el) => {

                    return <div className={`${styles.message} ${el.from_user_id == authorId ? styles.otherMessage : styles.myMessage}`} key={el.id}>
                        {el.text}
                    </div>
                })}



                {/* Ввод */}
                <div className={styles.inputArea}>
                    <input
                        type="text"
                        placeholder="Напишите сообщение..."
                        value={messageChat}
                        onChange={(e) => setMessage(e.target.value)}
                    />
                    <button aria-label="Отправить" onClick={sendMessage} onKeyDown={handleKeyDown}>➤</button>
                </div>
            </div>

        </div>
    </div>
);
}

export default ModalMessage;



/*   
для сокетов
function sendChatMessage() {
      
        const message =messageChat.trim();

        if (message) {
            socket.emit('chat message', {
                text: message,
                timestamp: Date.now()
            });
            setMessage('');
        } 
    }*/