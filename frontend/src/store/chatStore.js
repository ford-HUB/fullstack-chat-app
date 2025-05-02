import { create } from "zustand"
import { axiosInstance } from "../api/axiosInstance"
import { authStore } from "./authStore"


export const chatStore = create((set) => ({
    historyMessages: [],
    isMessageSuccess: false,

    socketListener: () => {
        const socket = authStore.getState().socket
        if (!socket) return

        const messageHandler = (message) => {
            set((state) => ({
                historyMessages: [...state.historyMessages, message]
            }));
        };


        socket.on('chatMessage', messageHandler);
        // socket.on('welcomeMessage', welcomeMessageHandler)

        return () => {
            socket.off('chatMessage', messageHandler)
        }
    },

    checkMessages: async () => {
        try {
            const response = await axiosInstance.get('/chat/messages')
            set({ historyMessages: response.data.data })
        } catch (error) {
            console.log('checkMessages fails', error.message)
        }
    },
    sendMessage: async (formData) => {
        try {
            await axiosInstance.post('/chat/sendMessage', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
        } catch (error) {
            console.log('send message fails', error.message)
            return false
        }
    }
}))