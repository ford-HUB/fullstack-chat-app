import { User } from '../models/User.models.js'
import bcrypt from 'bcrypt'
import { generateToken } from '../helper/generateToken.js'
import cloudinary from '../config/cloudinary.js'

export const signup = async (req, res) => {
    try {
        const { username, email, password } = req.body

        if (!username || !email || !password) { return res.json({ success: false, error: 'field is all required' }) }

        if (password < 6) { res.json({ success: false, message: 'password must above 6 letters combination' }) }

        const isUsernameExist = await User.findOne({ username })
        if (isUsernameExist) { return res.json({ success: false, error: 'username is already exist' }) }

        const isEmailExist = await User.findOne({ email })
        if (isEmailExist) { return res.json({ success: false, error: 'email is already exist' }) }

        let salt = await bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hash(password, salt)

        const newUser = await User({
            username,
            email,
            password: hashPassword, // store the hashPassword Correctly
            isSystem: true
        })

        if (newUser) {
            await newUser.save()
            generateToken(newUser._id, res)

            res.json({ success: true, message: 'User Successfully Registred' })
        }


    } catch (error) {
        res.json({ success: false, InternalError: 'Internal Server Error' })
        console.log('signup controller catch: ', error.message)
    }
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body

        if (!email || !password) { return res.json({ success: false, error: 'field is required' }) }

        const isEmailValid = await User.findOne({ email })
        if (!isEmailValid) { return res.json({ success: false, error: 'Invalid Credentials' }) }

        const isPasswordValid = await bcrypt.compare(password, isEmailValid.password)
        if (!isPasswordValid) { return res.json({ success: false, error: 'Invalid Credentials' }) }

        generateToken(isEmailValid._id, res) // generate a token after access granted

        return res.json({ success: true, message: 'account successfully loggedIn' })
    } catch (error) {
        console.log('login fails: ', error.message)
        res.json({ success: false, InternalError: error.message })
    }
}

export const logout = async (req, res) => {
    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV !== 'development',
            sameSite: 'Strict',
            path: '/'
        })
        res.json({ success: true, user: null, message: 'logout successfully' })
    } catch (error) {
        console.log('logout fails: ', error.message)
        res.json({ success: false, error: error.message })
    }
}

export const updateProfile = async (req, res) => {
    try {
        const { username, email, password, confirmPassword } = req.body;
        const avatar = req.file;

        console.log('Uploaded file:', avatar);

        const user = await User.findOne({ email });
        if (!user) {
            return res.json({ success: false, error: 'User not found' });
        }

        const updateUser = {};

        if (username && username !== user.username) {
            updateUser.username = username;
        }

        if (email && email !== user.email) {
            updateUser.email = email;
        }

        if (password && confirmPassword && password === confirmPassword) {
            const salt = await bcrypt.genSalt(10);
            const hashPassword = await bcrypt.hash(confirmPassword, salt);
            updateUser.password = hashPassword;
        }

        if (password && confirmPassword && password !== confirmPassword) { res.json({ success: false, error: 'password and the confirmation is not match' }) }

        // Upload avatar to Cloudinary if provided
        if (avatar && avatar.path) {
            try {
                const uploadedAvatar = await cloudinary.uploader.upload(avatar.path, {
                    folder: 'UserProfile',
                    resource_type: 'auto'
                });

                updateUser.avatar = {
                    public_id: uploadedAvatar.public_id,
                    url: uploadedAvatar.secure_url
                };

                console.log('Image successfully uploaded to Cloudinary');
            } catch (uploadError) {
                console.error('Cloudinary upload error:', uploadError);
                return res.json({
                    success: false,
                    error: 'Failed to upload image to Cloudinary'
                });
            }
        }

        if (Object.keys(updateUser).length === 0) {
            return res.json({ success: true, message: 'No changes detected' });
        }

        // Update user
        const updatedUser = await User.findOneAndUpdate(
            { email },
            { $set: updateUser },
            { new: true }
        );

        if (!updatedUser) {
            return res.json({ success: false, error: 'Failed to update user' });
        }

        return res.json({
            success: true,
            message: 'Profile successfully updated',
            user: updatedUser
        });

    } catch (error) {
        console.error('Update profile failed:', error.message);
        return res.json({
            success: false,
            error: 'Internal Server Error',
            message: error.message
        });
    }
};

export const checkAuth = (req, res) => {
    try {
        res.json(req.user)
    } catch (error) {
        console.log('checkAuth fails: ', error.message)
        res.json({ success: false, InternalError: 'Internal Server Error' })
    }
}