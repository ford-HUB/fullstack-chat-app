import { create } from 'zustand'
import { axiosInstance } from '../api/axiosInstance.js'
import toast from 'react-hot-toast'
import io from 'socket.io-client'

const BASE_URL = import.meta.env.MODE === "development" ? 'http://localhost:8000' : "/"

export const authStore = create((set, get) => ({
    userAuth: null,
    isLoggedIn: false,
    isSignUp: false,
    onlineUsers: [],
    socket: null,

    checkAuth: async () => {
        const response = await axiosInstance.get('/api/auth/checkAuth')
        set({ userAuth: response.data })
        get().connectSocket()
    },

    signup: async (formData) => {
        try {
            const response = await axiosInstance.post('/api/auth/signup', formData)
            if (response.data.message) {
                toast.success(response.data.message)
                set({ userAuth: response.data, isSignUp: true })
                get().connectSocket()
                return true
            } else {
                toast.error(response.data.error)
                return false
            }
        } catch (error) {
            console.log('sign up function fails: ', error)
        }
    },

    login: async (formData) => {
        try {
            const response = await axiosInstance.post('/api/auth/login', formData)
            if (response.data.message) {
                toast.success(response.data.message)
                set({ userAuth: response.data, isLoggedIn: true })
                get().connectSocket()
                return true

            } else {
                toast.error(response.data.error)
            }
        } catch (error) {
            console.log('login auth is fails', error.message)
            set({ isLoggedIn: false })
            return false
        }
    },

    logout: async () => {
        try {
            const response = await axiosInstance.post('/api/auth/logout')
            toast.success(response.data.message)
            set({ userAuth: response.data })
            get().disconnectSocket()
        } catch (error) {
            console.log('logout auth is fails: ', error.message)
        }
    },

    updateUserInfo: async (formData) => {
        try {
            const response = await axiosInstance.put('/api/auth/updateprofile', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            if (response.data.message) {
                toast.success(response.data.message)
                set({ userAuth: response.data })
                return true
            } else {
                toast.error(response.data.error)
                return false
            }
        } catch (error) {
            console.log('update User fails', error.message)
        }
    },

    connectSocket: () => {
        const { userAuth } = get()
        if (!userAuth || get().socket?.connected) return
        const newSocket = io(BASE_URL, {
            query: {
                userId: userAuth._id,
            }
        })
        newSocket.connect()

        newSocket.on('fireOnlineUsers', (users) => {
            set({ onlineUsers: [...get().onlineUsers, ...users] })
        })
        set({ socket: newSocket })
    },
    disconnectSocket: () => {
        if (get().socket?.connected) return get().socket.disconnect() // not finish
    }
}))