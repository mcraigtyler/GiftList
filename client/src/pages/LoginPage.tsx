import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Card } from 'primereact/card'
import { InputText } from 'primereact/inputtext'
import { Password } from 'primereact/password'
import { Button } from 'primereact/button'
import { Message } from 'primereact/message'
import { useAuth } from '../context/AuthContext'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  function validate(): boolean {
    let valid = true
    setEmailError('')
    setPasswordError('')

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
    }

    return valid
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!validate()) return

    setIsSubmitting(true)
    try {
      await login(email.trim(), password)
      navigate('/')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed')
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
          <p className="text-color-secondary m-0">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="flex flex-column gap-4">
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
                autoFocus
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
                feedback={false}
                toggleMask
                className={passwordError ? 'p-invalid' : ''}
                inputClassName="w-full"
                pt={{ root: { className: 'w-full' } }}
                autoComplete="current-password"
              />
              {passwordError && (
                <small className="p-error">{passwordError}</small>
              )}
            </div>

            {error && (
              <Message severity="error" text={error} className="w-full justify-content-start" />
            )}

            <Button
              type="submit"
              label="Sign in"
              loading={isSubmitting}
              className="w-full"
            />
          </div>
        </form>

        <div className="text-center mt-4">
          <span className="text-color-secondary text-sm">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary font-medium">
              Create one
            </Link>
          </span>
        </div>
      </Card>
    </div>
  )
}
