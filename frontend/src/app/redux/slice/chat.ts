import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { lastMessageDataType } from "@/types";

export type CreateMessageType = {
    text: string,
    from_user_id: number,
    to_user_id: number | string,
}
export const fetchCreateMessage = createAsyncThunk(
    'name/fetchCreateMessage',
    async (list: CreateMessageType) => {
        const response = await fetch('http://localhost:5000/api/chat/create', {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(list)
        });
        const data = await response.json();
        return data;

    }
)

export const fetchGetMessage = createAsyncThunk(
    'name/fetchGetMessage',
    async (list: {
        authorId: number,
        recipientId: number | string,
    }) => {
        const response = await fetch('http://localhost:5000/api/chat/get',
            {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(list)
            }
        )
        const data = await response.json();
        return data;
    }
)

export const fetchGetLastmessage = createAsyncThunk(
    'name/fetchGetLastmessage',
    async (lastMessageData: lastMessageDataType) => {
        const response = await fetch('http://localhost:5000/api/chat/lastmessage',
            {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(lastMessageData)
            }
        )
        const data = await response.json();
        return data;
    }
)

export type Message = {
    id: number;
    from_user_id: number;
    to_user_id: number;
    text: string;
    created_at: Date;
    is_read: boolean;
    read_at: Date | null;  // read_at может быть null если не прочитано
};

export type ChatState = {
    success: boolean;
    alertmessage: string;
    messages: Message[];
    loading: boolean;
};

export const initialState: ChatState = {
    success: false,
    alertmessage: '',
    messages: [],
    loading: false
};

const chat = createSlice({
    name: "chat",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchCreateMessage.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchCreateMessage.fulfilled, (state, action) => {
                state.success = action.payload.success;
                state.alertmessage = action.payload.alertMessage;
                state.messages = [...state.messages, action.payload.messageChat]

                state.loading = false;
            })
            .addCase(fetchCreateMessage.rejected, (state) => {
                state.alertmessage = 'Сообщение не отправлено';
                state.loading = false;
            })
            .addCase(fetchGetMessage.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchGetMessage.fulfilled, (state, action) => {
                state.loading = false;

                state.messages = action.payload.messages;
            })
            .addCase(fetchGetMessage.rejected, (state) => {
                state.loading = false;
                state.alertmessage = "Ошибка загрузки сообщений"
            })
            .addCase(fetchGetLastmessage.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchGetLastmessage.fulfilled, (state, action) => {
                state.success = action.payload.success;
                if (action.payload.alertMessage) {
                    state.alertmessage = action.payload.alertMessage;
                }
               
                if (action.payload.lastMessage) {
                        let checkLastMessage = state.messages.some(el =>  el.id === action.payload.lastMessage.id )
            
                        if (checkLastMessage == false) {
                            state.messages = [...state.messages, action.payload.lastMessage]
                        }
                    
                }
                state.loading = false;
            })
            .addCase(fetchGetLastmessage.rejected, (state) => {
                state.loading = false;
            })

    }
})

export default chat.reducer;