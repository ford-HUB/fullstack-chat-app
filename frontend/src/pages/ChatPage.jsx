import React from 'react'
import { MessageSquare } from 'lucide-react'
import { chatStore } from '../store/chatStore';
import { useUser } from '../context/userContext';
import { authStore } from '../store/authStore';


const ChatPage = () => {
    const { user, updateUser } = useUser()
    const { userAuth, onlineUsers } = authStore()
    const { historyMessages, checkMessages, sendMessage, socketListener } = chatStore()

    const autoScrollRef = React.useRef(null)
    const [message, setMessage] = React.useState('')


    React.useEffect(() => {
        checkMessages();
        const cleanup = socketListener()
        return () => {
            if (cleanup) cleanup()
        }
    }, [checkMessages, socketListener]);

    React.useEffect(() => {
        updateUser(userAuth)
    }, [updateUser, userAuth])

    React.useEffect(() => {
        autoScrollRef.current.scrollIntoView({ behavior: "smooth" })
    }, [historyMessages])


    const handleSubmit = (e) => {
        e.preventDefault()
        try {
            sendMessage(message)
            setMessage('')
        } catch (error) {
            console.log('sent message fails', error.message)
        }
    }


    return (
        <>
            <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
                <div className="space-y-4">
                    {historyMessages.map(message => (
                        <div key={message._id} className={`flex ${message.sender?._id === user?._id ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-3/4 ${message.isSystem ? 'mx-auto' : ''}`}>
                                {message.isSystem ? (
                                    <div className="bg-gray-200 text-gray-600 text-xs rounded-lg py-1 px-3 text-center">
                                        {
                                            onlineUsers === user?._id ? `${user?.username} is online` : ''
                                        }
                                    </div>
                                ) : (
                                    <div className={`flex ${message.sender?._id === user?._id ? 'flex-row-reverse' : 'flex-row'}`}>
                                        {message.sender?._id !== user?._id && (
                                            <img src={message.sender?.avatar?.url || 'https://via.placeholder.com/5x5.png'} className="w-8 h-8 rounded-full" alt={message.sender?.username || 'no username'} />
                                        )}
                                        <div className={`mx-2 ${message.sender?._id === user?._id ? 'text-right' : ''}`}>
                                            <div className="text-xs text-gray-500 mb-1">
                                                {message.sender?._id === user?._id ? 'You' : message.sender?.username}
                                            </div>
                                            <div className={`py-2 px-4 rounded-lg ${message.sender?._id === user?._id ? 'bg-blue-600 text-white' : 'bg-white border'}`}>
                                                {message.message}
                                            </div>
                                            <span className='text-[10px] text-slate-500'>{new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                    <div ref={autoScrollRef}></div>
                </div>
            </div>

            {/* Message Input */}
            <form className="bg-white p-4 border-t flex items-center" onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Message everyone..."
                />
                <button
                    type="submit"
                    className="ml-2 bg-blue-600 text-white rounded-lg p-2 hover:bg-blue-700"
                >
                    <MessageSquare size={20} />
                </button>
            </form>
        </>
    )
}

export default ChatPage
