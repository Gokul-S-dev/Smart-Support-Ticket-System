import { useEffect, useMemo, useState } from 'react'
import axios from 'axios'
<<<<<<< HEAD
import { AnimatePresence } from 'framer-motion'
=======
import { AnimatePresence, motion } from 'framer-motion'
>>>>>>> 34813ff1c86d296cab8ea910a904fe74cdc202ad
import './App.css'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'
const STORAGE_KEY = 'ssts_auth_token'
const USER_STORAGE_KEY = 'ssts_auth_user'
const STATUS_OPTIONS = ['Open', 'In Progress', 'Closed']

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 12000,
})

function App() {
  const [authMode, setAuthMode] = useState('login')
  const [authForm, setAuthForm] = useState({
    name: '',
    email: 'authtest@example.com',
    password: 'Pass@123',
  })
  const [ticketForm, setTicketForm] = useState({
    title: '',
    description: '',
    status: 'Open',
  })
  const [token, setToken] = useState(localStorage.getItem(STORAGE_KEY) || '')
  const [currentUser, setCurrentUser] = useState(() => {
    const savedUser = localStorage.getItem(USER_STORAGE_KEY)
    return savedUser ? JSON.parse(savedUser) : null
  })
  const [tickets, setTickets] = useState([])
  const [isAuthLoading, setIsAuthLoading] = useState(false)
  const [isTicketLoading, setIsTicketLoading] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [banner, setBanner] = useState({ type: '', text: '' })

  useEffect(() => {
    if (!token) {
      setTickets([])
      setCurrentUser(null)
      return
    }

<<<<<<< HEAD
    const hydrateSession = async () => {
      try {
        const headers = { headers: { Authorization: `Bearer ${token}` } }
        const [profileResponse, ticketsResponse] = await Promise.all([
          api.get('/auth/me', headers),
          api.get('/tickets', headers),
        ])

        setCurrentUser(profileResponse.data.user)
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(profileResponse.data.user))
        setTickets(ticketsResponse.data)
      } catch (error) {
        const message = error.response?.data?.message || 'Could not load session.'
        setError(message)
      } finally {
        setIsTicketLoading(false)
      }
    }

    setIsTicketLoading(true)
    hydrateSession()
=======
    initializeSession(token)
>>>>>>> 34813ff1c86d296cab8ea910a904fe74cdc202ad
  }, [token])

  const isAdmin = currentUser?.role === 'admin'

  const stats = useMemo(() => {
    const open = tickets.filter((ticket) => ticket.status === 'Open').length
    const inProgress = tickets.filter((ticket) => ticket.status === 'In Progress').length
    const closed = tickets.filter((ticket) => ticket.status === 'Closed').length
    return { total: tickets.length, open, inProgress, closed }
  }, [tickets])

  const authHeaders = (activeToken) => ({
    headers: { Authorization: `Bearer ${activeToken}` },
  })

  const setSuccess = (text) => setBanner({ type: 'success', text })
  const setError = (text) => setBanner({ type: 'error', text })

  const loadTickets = async (activeToken) => {
    setIsTicketLoading(true)
    try {
      const response = await api.get('/tickets', authHeaders(activeToken))
      setTickets(response.data)
    } catch (error) {
      const message = error.response?.data?.message || 'Could not fetch tickets.'
      setError(message)
    } finally {
      setIsTicketLoading(false)
    }
  }

<<<<<<< HEAD
=======
  const initializeSession = async (activeToken) => {
    await Promise.all([loadCurrentUser(activeToken), loadTickets(activeToken)])
  }

  const loadCurrentUser = async (activeToken) => {
    try {
      const response = await api.get('/auth/me', authHeaders(activeToken))
      setCurrentUser(response.data.user)
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(response.data.user))
    } catch (error) {
      const message = error.response?.data?.message || 'Could not load profile.'
      setError(message)
    }
  }

>>>>>>> 34813ff1c86d296cab8ea910a904fe74cdc202ad
  const login = async (email, password) => {
    const response = await api.post('/auth/login', { email, password })
    const nextToken = response.data.token
    const nextUser = response.data.user
    localStorage.setItem(STORAGE_KEY, nextToken)
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(nextUser))
    setToken(nextToken)
    setCurrentUser(nextUser)
  }

  const handleAuthSubmit = async (event) => {
    event.preventDefault()
    setIsAuthLoading(true)
    setBanner({ type: '', text: '' })

    try {
      if (authMode === 'register') {
        await api.post('/auth/register', {
          name: authForm.name,
          email: authForm.email,
          password: authForm.password,
        })
        setSuccess('Account created. You are now signed in.')
      }

      await login(authForm.email, authForm.password)
      setSuccess('Welcome back. Authentication is active.')
    } catch (error) {
      const message =
        error.response?.data?.msg ||
        error.response?.data?.message ||
        'Authentication failed.'
      setError(message)
    } finally {
      setIsAuthLoading(false)
    }
  }

  const handleCreateTicket = async (event) => {
    event.preventDefault()
    if (!token) return

    setIsCreating(true)
    setBanner({ type: '', text: '' })

    try {
      await api.post('/tickets', ticketForm, authHeaders(token))
      setTicketForm({ title: '', description: '', status: 'Open' })
      await loadTickets(token)
      setSuccess('Ticket created successfully.')
    } catch (error) {
      const message = error.response?.data?.message || 'Could not create ticket.'
      setError(message)
    } finally {
      setIsCreating(false)
    }
  }

  const handleStatusChange = async (ticketId, status) => {
    if (!token) return

    try {
      await api.put(`/tickets/${ticketId}`, { status }, authHeaders(token))
      setTickets((current) =>
        current.map((ticket) =>
          ticket._id === ticketId ? { ...ticket, status } : ticket,
        ),
      )
      setSuccess('Ticket status updated.')
    } catch (error) {
      const message = error.response?.data?.message || 'Could not update status.'
      setError(message)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem(STORAGE_KEY)
    localStorage.removeItem(USER_STORAGE_KEY)
    setToken('')
    setCurrentUser(null)
    setBanner({ type: '', text: '' })
  }

  return (
    <div className="app-shell">
      <div className="bg-orb orb-a" aria-hidden="true" />
      <div className="bg-orb orb-b" aria-hidden="true" />
      <main className="layout">
<<<<<<< HEAD
        <section className="hero-panel">
=======
        <motion.section
          className="hero-panel"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
>>>>>>> 34813ff1c86d296cab8ea910a904fe74cdc202ad
          <p className="eyebrow">Smart Support Ticket System</p>
          <h1>Support operations, beautifully organized.</h1>
          <p className="lead">
            A vibrant control center for customer issues. Authenticate securely,
            create tickets instantly, and move work across stages with zero friction.
          </p>
          <div className="chip-row">
            <span className="chip">API: {API_BASE_URL}</span>
            <span className="chip">JWT Protected Routes</span>
            {currentUser ? <span className="chip">Role: {currentUser.role}</span> : null}
          </div>
<<<<<<< HEAD
        </section>

        <AnimatePresence mode="wait">
          {!token ? (
            <section
              key="auth"
              className="card auth-card"
=======
        </motion.section>

        <AnimatePresence mode="wait">
          {!token ? (
            <motion.section
              key="auth"
              className="card auth-card"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.35 }}
>>>>>>> 34813ff1c86d296cab8ea910a904fe74cdc202ad
            >
              <div className="card-head">
                <h2>{authMode === 'login' ? 'Sign In' : 'Create Account'}</h2>
                <button
                  className="ghost"
                  type="button"
                  onClick={() =>
                    setAuthMode((current) =>
                      current === 'login' ? 'register' : 'login',
                    )
                  }
                >
                  {authMode === 'login'
                    ? 'Need an account?'
                    : 'Already have an account?'}
                </button>
              </div>

              <form className="stack" onSubmit={handleAuthSubmit}>
                {authMode === 'register' ? (
                  <label>
                    Name
                    <input
                      required
                      value={authForm.name}
                      onChange={(event) =>
                        setAuthForm((current) => ({
                          ...current,
                          name: event.target.value,
                        }))
                      }
                      placeholder="Alex Carter"
                    />
                  </label>
                ) : null}

                <label>
                  Email
                  <input
                    required
                    type="email"
                    value={authForm.email}
                    onChange={(event) =>
                      setAuthForm((current) => ({
                        ...current,
                        email: event.target.value,
                      }))
                    }
                    placeholder="authtest@example.com"
                  />
                </label>

                <label>
                  Password
                  <input
                    required
                    type="password"
                    value={authForm.password}
                    onChange={(event) =>
                      setAuthForm((current) => ({
                        ...current,
                        password: event.target.value,
                      }))
                    }
                    placeholder="Pass@123"
                  />
                </label>

                <button className="primary" type="submit" disabled={isAuthLoading}>
                  {isAuthLoading
                    ? 'Please wait...'
                    : authMode === 'login'
                      ? 'Sign In'
                      : 'Register and Sign In'}
                </button>
              </form>
<<<<<<< HEAD
            </section>
          ) : (
            <section
              key="dashboard"
              className="dashboard-grid"
=======
            </motion.section>
          ) : (
            <motion.section
              key="dashboard"
              className="dashboard-grid"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.35 }}
>>>>>>> 34813ff1c86d296cab8ea910a904fe74cdc202ad
            >
              <article className="card">
                <div className="card-head">
                  <h2>Ticket Composer</h2>
                  <button className="ghost" type="button" onClick={handleLogout}>
                    Log Out
                  </button>
                </div>
                <form className="stack" onSubmit={handleCreateTicket}>
                  <label>
                    Title
                    <input
                      required
                      value={ticketForm.title}
                      onChange={(event) =>
                        setTicketForm((current) => ({
                          ...current,
                          title: event.target.value,
                        }))
                      }
                      placeholder="Payment not reflected"
                    />
                  </label>
                  <label>
                    Description
                    <textarea
                      required
                      rows="4"
                      value={ticketForm.description}
                      onChange={(event) =>
                        setTicketForm((current) => ({
                          ...current,
                          description: event.target.value,
                        }))
                      }
                      placeholder="Describe the issue with key details for faster resolution."
                    />
                  </label>
                  <button className="primary" type="submit" disabled={isCreating}>
                    {isCreating ? 'Creating...' : 'Create Ticket'}
                  </button>
                </form>
              </article>

              <article className="card">
                <h2>Live Overview</h2>
                <div className="stats-grid">
                  <div className="stat-box">
                    <strong>{stats.total}</strong>
                    <span>Total</span>
                  </div>
                  <div className="stat-box">
                    <strong>{stats.open}</strong>
                    <span>Open</span>
                  </div>
                  <div className="stat-box">
                    <strong>{stats.inProgress}</strong>
                    <span>In Progress</span>
                  </div>
                  <div className="stat-box">
                    <strong>{stats.closed}</strong>
                    <span>Closed</span>
                  </div>
                </div>

                {isTicketLoading ? (
                  <p className="muted">Loading tickets...</p>
                ) : tickets.length === 0 ? (
                  <p className="muted">No tickets yet. Create your first ticket now.</p>
                ) : (
                  <ul className="ticket-list">
                    {tickets.map((ticket, index) => (
<<<<<<< HEAD
                      <li
                        key={ticket._id}
=======
                      <motion.li
                        key={ticket._id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
>>>>>>> 34813ff1c86d296cab8ea910a904fe74cdc202ad
                      >
                        <header>
                          <h3>{ticket.title}</h3>
                          <time>
                            {new Date(ticket.createdAt).toLocaleDateString()}
                          </time>
                        </header>
                        <p>{ticket.description}</p>
                        <div className="ticket-foot">
                          <span className={`status-pill ${ticket.status.replace(' ', '-').toLowerCase()}`}>
                            {ticket.status}
                          </span>
                          {isAdmin ? (
                            <select
                              value={ticket.status}
                              onChange={(event) =>
                                handleStatusChange(ticket._id, event.target.value)
                              }
                            >
                              {STATUS_OPTIONS.map((option) => (
                                <option key={option} value={option}>
                                  {option}
                                </option>
                              ))}
                            </select>
                          ) : null}
                        </div>
<<<<<<< HEAD
                      </li>
=======
                      </motion.li>
>>>>>>> 34813ff1c86d296cab8ea910a904fe74cdc202ad
                    ))}
                  </ul>
                )}
              </article>
<<<<<<< HEAD
            </section>
=======
            </motion.section>
>>>>>>> 34813ff1c86d296cab8ea910a904fe74cdc202ad
          )}
        </AnimatePresence>

        <AnimatePresence>
          {banner.text ? (
<<<<<<< HEAD
            <div className={`banner ${banner.type}`}>
              {banner.text}
            </div>
=======
            <motion.div
              className={`banner ${banner.type}`}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 16 }}
            >
              {banner.text}
            </motion.div>
>>>>>>> 34813ff1c86d296cab8ea910a904fe74cdc202ad
          ) : null}
        </AnimatePresence>
      </main>
    </div>
  )
}

export default App
