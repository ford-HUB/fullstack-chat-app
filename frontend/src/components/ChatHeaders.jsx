import React from 'react'
import { Link } from 'react-router-dom'
import { authStore } from '../store/authStore.js'
import { useUser } from '../context/userContext.jsx'
import { Globe, User } from 'lucide-react'
import { useLocation } from 'react-router-dom'

const ChatHeaders = ({ children }) => {
    const { pathname } = useLocation()

    const { userAuth, logout, onlineUsers } = authStore()
    const { user, updateUser } = useUser()

    React.useEffect(() => {
        updateUser(userAuth)
    }, [updateUser, userAuth])

    const [isOnline, setOnline] = React.useState(true)
    const [showUserMenu, setShowUserMenu] = React.useState(false)

    const toggleUserMenu = () => {
        setShowUserMenu(hide => !hide)
    }

    const handleToggleLogout = () => {
        logout()
    }

    return (
        <>
            <div className="flex-1 flex flex-col">
                {/* Chat Header - Modified with justify-between */}
                <div className="bg-white p-4 border-b flex items-center justify-between">
                    {pathname === '/global-chat' ? (
                        <div className="flex items-center">
                            <Globe size={24} className="text-gray-700 mr-2" />
                            <div>
                                <h2 className="font-bold">Global Chat</h2>
                            </div>
                        </div>
                    ) : <div className="flex items-center"></div>}

                    {/* User Section - Moved to same level as chat info */}
                    <div className="relative">
                        <div className="flex items-center space-x-3 cursor-pointer" onClick={toggleUserMenu}>
                            <div className="flex flex-col items-end">
                                <span className="font-medium">{user?.username || 'unauthorize access'}</span>
                                <span className="text-xs flex items-center">
                                    <span className={`w-2 h-2 rounded-full mr-1 ${isOnline ? 'bg-green-400' : 'bg-gray-400'}`}></span>
                                    {isOnline ? 'Online' : 'Offline'}
                                </span>
                            </div>
                            <div className="relative">
                                <img
                                    src={user?.avatar?.url || 'no avatar'}
                                    alt="User Avatar"
                                    className="w-10 h-10 rounded-full border-2 border-white"
                                />
                            </div>
                        </div>

                        {/* User dropdown menu */}
                        {showUserMenu && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                                <Link to={'/u/profile'} className="block px-4 py-2 text-gray-800 hover:bg-blue-100">
                                    <button className="flex items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                        </svg>
                                        My Profile
                                    </button>
                                </Link>
                                <a href="#settings" className="block px-4 py-2 text-gray-800 hover:bg-blue-100">
                                    <div className="flex items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                                        </svg>
                                        Settings
                                    </div>
                                </a>
                                <a href="#status" className="block px-4 py-2 text-gray-800 hover:bg-blue-100">
                                    <div className="flex items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                                        </svg>
                                        Status
                                    </div>
                                </a>
                                <div className="border-t border-gray-200 my-1"></div>
                                <Link to={'/login'} className="block px-4 py-2 text-red-600 hover:bg-red-100">
                                    <button type='button' className="flex items-center" onClick={handleToggleLogout}>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
                                        </svg>
                                        Logout
                                    </button>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
                {children}
            </div>
        </>
    )
}

export default ChatHeaders