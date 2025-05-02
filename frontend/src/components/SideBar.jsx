import React from 'react'
import { Globe, Bell, Users, Menu, User } from 'lucide-react'
import { useLocation } from 'react-router-dom'
import { authStore } from '../store/authStore'
import FriendList from './FriendList'
import { useNavigate } from 'react-router-dom'

const SideBar = ({ children }) => {
    const { onlineUsers } = authStore()
    const { pathname } = useLocation()

    const uniqueOnlineUsers = [...new Set(onlineUsers.map(user => user.userId))]; // to prevent doplication if ever man gani


    const navigate = useNavigate()

    return (
        <>
            <div className="flex h-screen bg-gray-100">
                <div className="w-16 bg-gray-800 flex flex-col items-center py-6">
                    <div className="relative mb-8">
                        <button
                            onClick={() => navigate('/global-chat')}
                            className={`p-3 rounded-xl hover:bg-gray-700 ${pathname === '/global-chat' ? 'bg-blue-600' : ''}`}
                        >
                            <Globe size={24} className="text-white" />
                        </button>
                        {onlineUsers.length > 0 && (
                            <span
                                className="absolute -top-1 -right-1 bg-green-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center"
                                onClick={null}
                            >
                                {uniqueOnlineUsers.length}
                            </span>
                        )}
                    </div>

                    <button
                        onClick={() => navigate('/friends-list')}
                        className={`p-3 rounded-xl hover:bg-gray-700 mb-8 ${pathname === '/friends-list' ? 'bg-blue-600' : ''}`}>
                        <Users size={24} className="text-white" />
                    </button>

                    <button className="p-3 rounded-xl hover:bg-gray-700 mb-8">
                        <Bell size={24} className="text-white" />
                    </button>

                    <button className="p-3 rounded-xl hover:bg-gray-700 mt-auto">
                        <Menu size={24} className="text-white" />
                    </button>
                </div>

                <div className="w-64 bg-gray-700 text-white overflow-y-auto">
                    {pathname === '/global-chat' ? (
                        <div className="p-4">
                            <h2 className="text-xl font-bold mb-4 flex items-center">
                                <Globe size={20} className="mr-2" />
                                Global Chat
                            </h2>
                            <div className="border-b border-gray-600 pb-2 mb-2">
                            </div>
                            <div className="text-sm text-gray-300">
                                <p>Enjoy sa inyong pagka chismosa and chismoso.</p>
                            </div>
                        </div>
                    ) : <div className="p-4">
                        <h2 className="text-xl font-bold mb-4 flex items-center">
                            <User size={20} className="mr-2" />
                            Friends List
                        </h2>
                        <div className="border-b border-gray-600 pb-2 mb-2">
                        </div>
                        <div className="text-sm text-gray-300">
                            <p>Check Your Friends Status</p>
                        </div>
                    </div>}
                </div>

                {children}

            </div >
        </>
    )
}

export default SideBar