import { useState } from 'react'
import LoginForm from '../components/LoginForm'
import SignupForm from '../components/SignupForm'
import '../styles/AuthPage.css'

function LoginPage() {
  const [isLogin, setIsLogin] = useState(true)

  return (
    <div className="auth-page">
      {isLogin ? (
        <LoginForm onSwitchToSignup={() => setIsLogin(false)} />
      ) : (
        <SignupForm onSwitchToLogin={() => setIsLogin(true)} />
      )}
    </div>
  )
}

export default LoginPage
