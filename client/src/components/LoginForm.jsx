import { useState } from 'react'
import loginImg from '../assets/login.jpg'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import '../styles/AuthForm.css'

function LoginForm({ onSwitchToSignup }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    try {
      const response = await axios.post('/api/auth/login', { email, password })
      setSuccess('Login successful! Redirecting...')
      localStorage.setItem('token', response.data.token)
      localStorage.setItem('user', JSON.stringify(response.data.user))

      if (rememberMe) {
        localStorage.setItem('rememberMe', email)
      }

      setTimeout(() => {
        navigate('/dashboard')
      }, 1500)
    } catch (err) {
      const status = err.response?.status
      const msg = err.response?.data?.message || 'Login failed'
      if (status === 404) {
        setError('No account found. Taking you to Sign Up...')
        setTimeout(() => onSwitchToSignup(), 1800)
      } else {
        setError(msg)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="konekta-container">
      <div className="konekta-left">
        <div className="image-placeholder">
          <img src={loginImg} alt="Login" className="login-image" />
        </div>
      </div>

      <div className="konekta-right">
        <div className="konekta-form-container">
<h2 className="konekta-title">Login to your account</h2>
          <p className="konekta-subtitle">Welcome back! Enter your details below to log in to your account</p>

          {error && <div className="konekta-error">{error}</div>}
          {success && <div className="konekta-success">{success}</div>}

          <form onSubmit={handleSubmit}>
            <div className="konekta-form-group">
              <label>Email</label>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="konekta-input"
              />
            </div>

            <div className="konekta-form-group">
              <label>Password</label>
              <div className="password-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="konekta-input"
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? '👁️‍🗨️' : '👁️'}
                </button>
              </div>
            </div>

            <div className="konekta-remember">
              <input
                type="checkbox"
                id="remember"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <label htmlFor="remember">Remember login</label>
              <a href="#forgot" className="konekta-forgot">Forgot Password?</a>
            </div>

            <button
              type="submit"
              className="konekta-login-button"
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <div className="konekta-footer">
            <p>New here? <button type="button" className="konekta-signup-link" onClick={onSwitchToSignup}>Create account</button></p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginForm
