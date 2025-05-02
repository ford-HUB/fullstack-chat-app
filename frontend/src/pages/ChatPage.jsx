import React from 'react'
import { ImagePlus, MessageSquare } from 'lucide-react'
import { chatStore } from '../store/chatStore';
import { useUser } from '../context/userContext';
import { authStore } from '../store/authStore';


const ChatPage = () => {
    const { user, updateUser } = useUser()
    const { userAuth, onlineUsers } = authStore()
    const { historyMessages, checkMessages, sendMessage, socketListener } = chatStore()

    const autoScrollRef = React.useRef(null)
    const [formData, setFormData] = React.useState({
        message: '',
        file: ''
    })
    const [previewImage, setPreviewImage] = React.useState()
    const [isPreview, setIsPreview] = React.useState(false)


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


    const handlePreviewImage = (e) => {
        const file = e.target.files[0]
        if (!file) return

        setFormData({ ...formData, file: file }) // hold image to pass into our backend
        setPreviewImage(URL.createObjectURL(file))
        setIsPreview(true)
    }


    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const form = new FormData()
            form.append('message', formData.message)
            if (formData.file) {
                form.append('file', formData.file)
            }

            await sendMessage(form)

            setFormData({
                message: '',
                file: ''
            })
        } catch (error) {
            console.log('sent message fails', error.message)
        }
    }

    const handleRemovePreview = () => {
        setPreviewImage(null)
        setIsPreview(false)
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
                                            <img src={message.sender?.avatar?.url || 'https://placehold.co/30x30'} className="w-8 h-8 rounded-full" alt={message.sender?.username || 'no username'} />
                                        )}
                                        <div className={`mx-2 ${message.sender?._id === user?._id ? 'text-right' : ''}`}>
                                            <div className="text-xs text-gray-500 mb-1">
                                                {message.sender?._id === user?._id ? 'You' : message.sender?.username}
                                            </div>
                                            <div className={`py-2 px-4 rounded-lg ${message.sender?._id === user?._id ? 'bg-blue-600 text-white' : 'bg-white border'}`}>
                                                {message.message}
                                                {
                                                    message.media?.url ? <img className='rounded-xl min-h-auto min-w-auto mt-4' src={message?.media?.url} alt={`${message?.media?.url} file sended`} /> : ''

                                                }
                                            </div>
                                            <span className='text-[10px] text-slate-500'>{new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                    <div ref={autoScrollRef}></div>

                    {
                        isPreview && <div className="previewImage absolute bottom-18 bg-white rounded-md max-w-[8rem] h-[auto] p-2 flex items-center justify-center">
                            <img className='rounded-xl pb-2'
                                src={previewImage} alt={`${previewImage} image`} />
                            <button onClick={handleRemovePreview} className='absolute right-0 bottom-0 cursor-pointer'>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="size-4">
                                    <path d="M5.28 4.22a.75.75 0 0 0-1.06 1.06L6.94 8l-2.72 2.72a.75.75 0 1 0 1.06 1.06L8 9.06l2.72 2.72a.75.75 0 1 0 1.06-1.06L9.06 8l2.72-2.72a.75.75 0 0 0-1.06-1.06L8 6.94 5.28 4.22Z" />
                                </svg>
                            </button>

                        </div>
                    }
                </div>
            </div>

            {/* Message Input */}
            <form className="bg-white p-4 border-t flex items-center" onSubmit={handleSubmit} encType='multipart/form-data'>
                <input
                    type="text"
                    name='message'
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Message everyone..."
                />

                {/* Image icon upload */}

                <div className="uploadImage mx-1 p-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    <label className="flex items-center cursor-pointer">
                        {isPreview ? '' : <ImagePlus />}
                        <input
                            type="file"
                            name='file'
                            accept="image/*"
                            onChange={handlePreviewImage}
                            className="hidden"
                        />
                    </label>
                </div>

                <button
                    type="submit"
                    className=" bg-blue-600 text-white rounded-lg p-2 hover:bg-blue-700"
                >
                    <MessageSquare size={20} />
                </button>
            </form>
        </>
    )
}

export default ChatPage
