import React from 'react'
import { Routes, Route } from 'react-router-dom'
import SignupPage from './pages/SignupPage'
import LoginPage from './pages/LoginPage'
import HomePage from './pages/HomePage.jsx'
import ProtectedRoute from './utils/ProtectedRoute.jsx'
import FallbackPage from './pages/FallbackPage.jsx'
import Profile from './pages/Profile.jsx'
import ChatPage from './pages/ChatPage.jsx'
import SideBar from './components/SideBar.jsx'
import ChatHeaders from './components/ChatHeaders.jsx'
import FriendList from './components/FriendList.jsx'
// import Navbar from './components/Navbar.jsx'

const App = () => {

  return (
    <>
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/global-chat' element={
          <ProtectedRoute>
            {/* <Navbar /> */}
            <SideBar>
              <ChatHeaders>
                <ChatPage />
              </ChatHeaders>
            </SideBar>
          </ProtectedRoute>
        } />

        <Route path='/friends-list' element={
          <ProtectedRoute>
            <SideBar>
              <ChatHeaders>
                <FriendList />
              </ChatHeaders>
            </SideBar>
          </ProtectedRoute>
        } />

        <Route path='/u/profile' element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>} />




        <Route path='/signup' element={<SignupPage />} />
        <Route path='/login' element={<LoginPage />} />

        <Route path='*' element={<FallbackPage />} />
      </Routes>
    </>
  )
}

export default App