import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Card } from 'primereact/card'
import { InputText } from 'primereact/inputtext'
import { Password } from 'primereact/password'
import { Button } from 'primereact/button'
import { Message } from 'primereact/message'
import { useAuth } from '../context/AuthContext'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function RegisterPage() {
  const { register } = useAuth()
  const navigate = useNavigate()

  const [displayName, setDisplayName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const [displayNameError, setDisplayNameError] = useState('')
  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [confirmPasswordError, setConfirmPasswordError] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  function validate(): boolean {
    let valid = true
    setDisplayNameError('')
    setEmailError('')
    setPasswordError('')
    setConfirmPasswordError('')

    if (!displayName.trim()) {
      setDisplayNameError('Display name is required')
      valid = false
    } else if (displayName.trim().length < 2) {
      setDisplayNameError('Display name must be at least 2 characters')
      valid = false
    }

    if (!email.trim()) {
      setEmailError('Email is required')
      valid = false
    } else if (!EMAIL_RE.test(email.trim())) {
      setEmailError('Enter a valid email address')
      valid = false
    }

    if (!password) {
      setPasswordError('Password is required')
      valid = false
    } else if (password.length < 8) {
      setPasswordError('Password must be at least 8 characters')
      valid = false
    }

    if (!confirmPassword) {
      setConfirmPasswordError('Please confirm your password')
      valid = false
    } else if (confirmPassword !== password) {
      setConfirmPasswordError('Passwords do not match')
      valid = false
    }

    return valid
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!validate()) return

    setIsSubmitting(true)
    try {
      await register(email.trim(), password, displayName.trim())
      navigate('/')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div
      className="flex justify-content-center align-items-center"
      style={{ minHeight: '100vh' }}
    >
      <Card className="w-full" style={{ maxWidth: 440 }}>
        <div className="text-center mb-5">
          <h1 className="text-3xl font-bold m-0 mb-2">GiftList</h1>
          <p className="text-color-secondary m-0">Create your account</p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="flex flex-column gap-4">
            <div className="flex flex-column gap-1">
              <label htmlFor="displayName" className="font-medium">
                Display Name
              </label>
              <InputText
                id="displayName"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className={displayNameError ? 'p-invalid' : ''}
                autoFocus
                autoComplete="name"
              />
              {displayNameError && (
                <small className="p-error">{displayNameError}</small>
              )}
            </div>

            <div className="flex flex-column gap-1">
              <label htmlFor="email" className="font-medium">
                Email
              </label>
              <InputText
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={emailError ? 'p-invalid' : ''}
                autoComplete="email"
              />
              {emailError && (
                <small className="p-error">{emailError}</small>
              )}
            </div>

            <div className="flex flex-column gap-1">
              <label htmlFor="password" className="font-medium">
                Password
              </label>
              <Password
                inputId="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                toggleMask
                className={passwordError ? 'p-invalid' : ''}
                inputClassName="w-full"
                pt={{ root: { className: 'w-full' } }}
                autoComplete="new-password"
              />
              {passwordError && (
                <small className="p-error">{passwordError}</small>
              )}
            </div>

            <div className="flex flex-column gap-1">
              <label htmlFor="confirmPassword" className="font-medium">
                Confirm Password
              </label>
              <Password
                inputId="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                feedback={false}
                toggleMask
                className={confirmPasswordError ? 'p-invalid' : ''}
                inputClassName="w-full"
                pt={{ root: { className: 'w-full' } }}
                autoComplete="new-password"
              />
              {confirmPasswordError && (
                <small className="p-error">{confirmPasswordError}</small>
              )}
            </div>

            {error && (
              <Message severity="error" text={error} className="w-full justify-content-start" />
            )}

            <Button
              type="submit"
              label="Create account"
              loading={isSubmitting}
              className="w-full"
            />
          </div>
        </form>

        <div className="text-center mt-4">
          <span className="text-color-secondary text-sm">
            Already have an account?{' '}
            <Link to="/login" className="text-primary font-medium">
              Sign in
            </Link>
          </span>
        </div>
      </Card>
    </div>
  )
}
