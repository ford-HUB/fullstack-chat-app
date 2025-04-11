import React, { useState } from 'react';
import { Camera } from 'lucide-react';
import { useUser } from '../context/userContext';
import { authStore } from '../store/authStore';
import { useNavigate, Link } from 'react-router-dom'

const Profile = () => {
    const { user, updateUser } = useUser()
    const { userAuth, updateUserInfo } = authStore()

    React.useEffect(() => {
        updateUser(userAuth)
    }, [updateUser, userAuth])


    const [formData, setFormData] = React.useState({
        username: user ? user?.username : '',
        email: user ? user?.email : '',
        password: user ? user?.password : '',
        confirmPassword: '',
        avatar: user?.avatar?.url
    });

    const [avatarPreview, setAvatarPreview] = React.useState()
    const [isLoading, setLoading] = React.useState(false)
    const navigate = useNavigate()


    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormData(true)
        const form = new FormData();
        form.append('username', formData.username);
        form.append('email', formData.email);
        form.append('password', formData.password);
        form.append('confirmPassword', formData.confirmPassword);
        if (formData.avatar) {
            form.append('avatar', formData.avatar);
        }

        try {
            await updateUserInfo(form);
            setLoading(false)
            return navigate('/global-chat')

        } catch (err) {
            console.error("Failed to update profile:", err);
            setLoading(false)
        }
    };


    return (
        <>
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
                    <Link to={'/global-chat'} className="backHome flex justify-end cursor-pointer items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="size-4">
                            <path fillRule="evenodd" d="M12.5 9.75A2.75 2.75 0 0 0 9.75 7H4.56l2.22 2.22a.75.75 0 1 1-1.06 1.06l-3.5-3.5a.75.75 0 0 1 0-1.06l3.5-3.5a.75.75 0 0 1 1.06 1.06L4.56 5.5h5.19a4.25 4.25 0 0 1 0 8.5h-1a.75.75 0 0 1 0-1.5h1a2.75 2.75 0 0 0 2.75-2.75Z" clipRule="evenodd" />
                        </svg>
                    </Link>
                    <div className="text-center">
                        <h1 className="text-2xl font-bold text-gray-800">Update Profile</h1>
                        <p className="mt-2 text-sm text-gray-600">Change your profile information</p>
                    </div>

                    <form onSubmit={handleSubmit} className="mt-8 space-y-6" encType='multipart/form-data'>
                        <div className="flex flex-col items-center">
                            <div className="relative">

                                <div className="relative w-24 h-24 overflow-hidden bg-gray-200 rounded-full">
                                    <img
                                        src={avatarPreview || formData.avatar}
                                        alt=""
                                        className="object-cover w-full h-full"
                                    />
                                </div>


                                <label htmlFor="avatar-upload"
                                    className="absolute bottom-0 right-0 p-1 bg-blue-500 rounded-full cursor-pointer hover:bg-blue-600">
                                    <Camera size={20} className="text-white" />
                                    <input
                                        id="avatar-upload"
                                        type="file"
                                        name='avatar'
                                        onChange={(e) => { const file = e.target.files?.[0]; setFormData({ ...formData, avatar: file }); setAvatarPreview(URL.createObjectURL(file)) }}
                                        accept="image/*"
                                        className="hidden"
                                    />
                                </label>
                            </div>
                            <p className="mt-2 text-xs text-gray-500">Click the camera icon to update your photo</p>
                        </div>

                        {/* Username */}
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                                Username
                            </label>
                            <input
                                id="username"
                                name="username"
                                type="text"
                                value={formData.username}
                                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                required
                                className="block w-full px-4 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>

                        {/* Email */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Email
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                required
                                disabled={true}
                                className="block w-full text-slate-400 px-4 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-slate-100"
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                New Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                placeholder="Leave blank to keep current password"
                                className="block w-full px-4 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                                Confirm New Password
                            </label>
                            <input
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                value={formData.confirmPassword}
                                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                placeholder="Leave blank to keep current password"
                                className="block w-full px-4 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>

                        {/* Submit Button */}
                        <div>
                            <button disabled={isLoading}
                                type="submit"
                                className="flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                {
                                    isLoading ? (<span className='loader loading-spinner loading-md'></span>) : ('Update Profile')
                                }
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}

export default Profile