import { useState } from 'react'
import loginImg from '../assets/login.jpg'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import '../styles/AuthForm.css'

function SignupForm({ onSwitchToLogin }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    setLoading(true)

    try {
      const response = await axios.post('/api/auth/signup', { email, password })
      setSuccess('Account created successfully! Signing you in...')
      localStorage.setItem('token', response.data.token)
      localStorage.setItem('user', JSON.stringify(response.data.user))
      setTimeout(() => {
        navigate('/dashboard')
      }, 1500)
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed')
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
<h2 className="konekta-title">Create your account</h2>
          <p className="konekta-subtitle">Get started by creating your account below</p>

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
                  placeholder="Create a password"
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

            <div className="konekta-form-group">
              <label>Confirm Password</label>
              <div className="password-wrapper">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirm password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="konekta-input"
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? '👁️‍🗨️' : '👁️'}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="konekta-login-button"
              disabled={loading}
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <div className="konekta-footer">
            <p>Already have an account? <button type="button" className="konekta-signup-link" onClick={onSwitchToLogin}>Sign in</button></p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SignupForm
