import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import '../styles/Dashboard.css'

const PAGE_SIZE = 5

function TaskModal({ task, onClose, onSave, dark }) {
  const [form, setForm] = useState(
    task || { title: '', description: '', priority: 'Medium', dueDate: '', status: 'Pending' }
  )
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const handle = e => setForm({ ...form, [e.target.name]: e.target.value })

  const submit = async e => {
    e.preventDefault()
    if (!form.title.trim()) { setError('Title is required'); return }
    setSaving(true)
    await onSave(form)
    setSaving(false)
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className={`modal ${dark ? 'dark' : ''}`} onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{task ? 'Edit Task' : 'Create Task'}</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        {error && <div className="modal-error">{error}</div>}
        <form onSubmit={submit} className="modal-form">
          <div>
            <label>Title <span className="req">*</span></label>
            <input name="title" value={form.title} onChange={handle} placeholder="Task title" maxLength={200} />
          </div>
          <div>
            <label>Description</label>
            <textarea name="description" value={form.description} onChange={handle} placeholder="Optional description" rows={3} maxLength={1000} />
          </div>
          <div className="modal-row">
            <div>
              <label>Priority</label>
              <select name="priority" value={form.priority} onChange={handle}>
                <option>Low</option><option>Medium</option><option>High</option>
              </select>
            </div>
            <div>
              <label>Due Date</label>
              <input name="dueDate" type="date" value={form.dueDate} onChange={handle} />
            </div>
            <div>
              <label>Status</label>
              <select name="status" value={form.status} onChange={handle}>
                <option>Pending</option><option>Completed</option>
              </select>
            </div>
          </div>
          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose} disabled={saving}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={saving}>
              {saving ? 'Saving...' : task ? 'Save Changes' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function DeleteModal({ task, onClose, onConfirm, dark }) {
  const [deleting, setDeleting] = useState(false)
  const confirm = async () => { setDeleting(true); await onConfirm(); setDeleting(false) }
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className={`modal modal-sm ${dark ? 'dark' : ''}`} onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Delete Task</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <p className="delete-msg">Delete <strong>"{task.title}"</strong>? This cannot be undone.</p>
        <div className="modal-actions">
          <button className="btn-secondary" onClick={onClose} disabled={deleting}>Cancel</button>
          <button className="btn-danger" onClick={confirm} disabled={deleting}>{deleting ? 'Deleting...' : 'Delete'}</button>
        </div>
      </div>
    </div>
  )
}

function ProfileView({ user, token, dark, onUpdated }) {
  const [form, setForm] = useState({ name: user?.name || '', currentPassword: '', newPassword: '' })
  const [msg, setMsg] = useState({ text: '', type: '' })
  const [saving, setSaving] = useState(false)

  const handle = e => setForm({ ...form, [e.target.name]: e.target.value })

  const submit = async e => {
    e.preventDefault()
    setMsg({ text: '', type: '' })
    if (!form.name.trim()) { setMsg({ text: 'Name cannot be empty', type: 'error' }); return }
    if (form.newPassword && form.newPassword.length < 6) {
      setMsg({ text: 'New password must be at least 6 characters', type: 'error' }); return
    }
    setSaving(true)
    try {
      const payload = { name: form.name }
      if (form.newPassword) { payload.currentPassword = form.currentPassword; payload.newPassword = form.newPassword }
      const { data } = await axios.put('/api/auth/profile', payload, { headers: { Authorization: `Bearer ${token}` } })
      onUpdated(data.user)
      setMsg({ text: 'Profile updated successfully', type: 'success' })
      setForm(f => ({ ...f, currentPassword: '', newPassword: '' }))
    } catch (err) {
      setMsg({ text: err.response?.data?.message || 'Update failed', type: 'error' })
    } finally { setSaving(false) }
  }

  return (
    <div className="profile-view">
      <h2 className="section-title">User Profile</h2>
      <div className={`profile-card ${dark ? 'dark' : ''}`}>
        <div className="profile-avatar">{(user?.name || user?.email || 'U').slice(0, 2).toUpperCase()}</div>
        <div className="profile-info">
          <div className="profile-email">{user?.email}</div>
          <div className="profile-label">Logged-in account</div>
        </div>
      </div>

      <div className={`db-card ${dark ? 'dark' : ''}`} style={{ marginTop: 16 }}>
        <div className="db-card-header"><h2>Update Profile</h2></div>
        {msg.text && <div className={msg.type === 'error' ? 'modal-error' : 'modal-success'}>{msg.text}</div>}
        <form onSubmit={submit} className="modal-form" style={{ padding: '16px 0 0' }}>
          <div>
            <label>Display Name</label>
            <input name="name" value={form.name} onChange={handle} placeholder="Your name" />
          </div>
          <div><label>Email</label><input value={user?.email || ''} disabled style={{ opacity: 0.5 }} /></div>
          <hr style={{ borderColor: 'var(--border)' }} />
          <div><label>Current Password <span style={{ fontWeight: 400, textTransform: 'none', fontSize: '0.75rem', color: 'var(--text-muted)' }}>(only if changing password)</span></label>
            <input name="currentPassword" type="password" value={form.currentPassword} onChange={handle} placeholder="••••••••" />
          </div>
          <div><label>New Password</label>
            <input name="newPassword" type="password" value={form.newPassword} onChange={handle} placeholder="Min 6 characters" />
          </div>
          <div className="modal-actions" style={{ padding: '12px 0 0', borderTop: 'none' }}>
            <button type="submit" className="btn-primary" disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</button>
          </div>
        </form>
      </div>
    </div>
  )
}

function ActivityView({ logs, loading, dark }) {
  const fmt = iso => {
    const d = new Date(iso)
    return d.toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })
  }
  return (
    <div>
      <h2 className="section-title">Activity Log</h2>
      <div className={`db-card ${dark ? 'dark' : ''}`}>
        {loading ? <div className="db-empty">Loading...</div>
        : logs.length === 0 ? <div className="db-empty">No activity yet.</div>
        : <ul className="activity-list">
            {logs.map((l, i) => (
              <li key={i} className="activity-item">
                <span className="activity-dot" />
                <div>
                  <div className="activity-text">{l.action}</div>
                  <div className="activity-time">{fmt(l.createdAt)}</div>
                </div>
              </li>
            ))}
          </ul>}
      </div>
    </div>
  )
}

export default function Dashboard() {
  const [user, setUser] = useState(null)
  const [tasks, setTasks] = useState([])
  const [activity, setActivity] = useState([])
  const [loading, setLoading] = useState(true)
  const [actLoading, setActLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('All')
  const [filterPriority, setFilterPriority] = useState('All')
  const [sortDate, setSortDate] = useState('none')
  const [page, setPage] = useState(1)
  const [modal, setModal] = useState(null)
  const [view, setView] = useState('Dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth > 768)
  const [dark, setDark] = useState(() => localStorage.getItem('darkMode') === 'true')
  const navigate = useNavigate()

  const token = localStorage.getItem('token')
  const headers = { Authorization: `Bearer ${token}` }

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light')
    localStorage.setItem('darkMode', dark)
  }, [dark])

  useEffect(() => {
    const fn = () => setSidebarOpen(window.innerWidth > 768)
    window.addEventListener('resize', fn)
    return () => window.removeEventListener('resize', fn)
  }, [])

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true)
      const { data } = await axios.get('/api/tasks', { headers })
      setTasks(data)
    } catch {} finally { setLoading(false) }
  }, [])

  const fetchActivity = useCallback(async () => {
    try {
      setActLoading(true)
      const { data } = await axios.get('/api/activity', { headers })
      setActivity(data)
    } catch {} finally { setActLoading(false) }
  }, [])

  useEffect(() => {
    const u = localStorage.getItem('user')
    if (u) setUser(JSON.parse(u))
    fetchTasks()
    fetchActivity()
  }, [])

  const handleSave = async form => {
    try {
      if (modal.task) {
        const { data } = await axios.put(`/api/tasks/${modal.task._id}`, form, { headers })
        setTasks(t => t.map(x => x._id === data._id ? data : x))
      } else {
        const { data } = await axios.post('/api/tasks', form, { headers })
        setTasks(t => [data, ...t])
      }
      setModal(null)
      fetchActivity()
    } catch (err) { alert(err.response?.data?.message || 'Save failed') }
  }

  const handleDelete = async () => {
    try {
      await axios.delete(`/api/tasks/${modal.task._id}`, { headers })
      setTasks(t => t.filter(x => x._id !== modal.task._id))
      setModal(null)
      fetchActivity()
    } catch {}
  }

  const toggleStatus = async task => {
    const next = task.status === 'Pending' ? 'Completed' : 'Pending'
    const { data } = await axios.put(`/api/tasks/${task._id}`, { ...task, status: next }, { headers })
    setTasks(t => t.map(x => x._id === data._id ? data : x))
    fetchActivity()
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  const handleNav = key => {
    setView(key)
    setPage(1)
    if (key === 'Pending') { setFilterStatus('Pending'); setFilterPriority('All') }
    else if (key === 'Completed') { setFilterStatus('Completed'); setFilterPriority('All') }
    else if (key === 'High Priority') { setFilterPriority('High'); setFilterStatus('All') }
    else { setFilterStatus('All'); setFilterPriority('All') }
    if (window.innerWidth <= 768) setSidebarOpen(false)
  }

  const total = tasks.length
  const completed = tasks.filter(t => t.status === 'Completed').length
  const pending = tasks.filter(t => t.status === 'Pending').length
  const highPriority = tasks.filter(t => t.priority === 'High').length

  let visible = tasks
    .filter(t => t.title.toLowerCase().includes(search.toLowerCase()))
    .filter(t => filterStatus === 'All' || t.status === filterStatus)
    .filter(t => filterPriority === 'All' || t.priority === filterPriority)

  if (sortDate === 'asc') visible = [...visible].sort((a, b) => new Date(a.dueDate || '9999') - new Date(b.dueDate || '9999'))
  if (sortDate === 'desc') visible = [...visible].sort((a, b) => new Date(b.dueDate || '0') - new Date(a.dueDate || '0'))

  const totalPages = Math.ceil(visible.length / PAGE_SIZE)
  const paginated = visible.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const initials = (user?.name || user?.email || 'U').slice(0, 2).toUpperCase()

  const navItems = [
    { key: 'Dashboard', label: 'Dashboard' },
    { key: 'Pending', label: 'Pending' },
    { key: 'Completed', label: 'Completed' },
    { key: 'High Priority', label: 'High Priority' },
    { key: 'Activity', label: 'Activity Log' },
  ]

  const isTaskView = ['Dashboard', 'Pending', 'Completed', 'High Priority'].includes(view)

  return (
    <div className={`db-root ${dark ? 'dark' : ''}`}>
      {sidebarOpen && window.innerWidth <= 768 && (
        <div className="db-sidebar-overlay" onClick={() => setSidebarOpen(false)} />
      )}

      <aside className={`db-sidebar ${sidebarOpen ? '' : 'db-sidebar--collapsed'}`}>
        <div className="db-sidebar-logo">
          <span className="db-logo-icon">I</span>
          <span className="db-logo-text">Internship</span>
        </div>

        <nav className="db-nav">
          {navItems.map(item => (
            <button key={item.key} className={`db-nav-item ${view === item.key ? 'active' : ''}`} onClick={() => handleNav(item.key)}>
              {item.label}
            </button>
          ))}
        </nav>

        <div className="db-sidebar-bottom">
          <div className="db-darkmode-row">
            <span className="db-darkmode-label">{dark ? 'Dark' : 'Light'} Mode</span>
            <button className={`db-toggle ${dark ? 'on' : ''}`} onClick={() => setDark(d => !d)}>
              <span className="db-toggle-knob" />
            </button>
          </div>
          <button className="db-nav-item db-logout-btn" onClick={handleLogout}>Logout</button>
        </div>
      </aside>

      <div className="db-main">
        <header className="db-header">
          <div className="db-header-left">
            <button className="db-hamburger" onClick={() => setSidebarOpen(o => !o)}>
              <span /><span /><span />
            </button>
            <h1 className="db-header-title">{view === 'High Priority' ? 'High Priority' : view}</h1>
          </div>
          <div className="db-header-right">
            {isTaskView && (
              <button className="btn-primary btn-sm" onClick={() => setModal({ type: 'create' })}>+ New Task</button>
            )}
            <div className="db-user-btn" onClick={() => handleNav('Profile')}>
              <div className="db-avatar">{initials}</div>
              <span className="db-username">{user?.name || user?.email?.split('@')[0] || 'User'}</span>
            </div>
          </div>
        </header>

        <div className="db-content">
          {view === 'Profile' && (
            <ProfileView user={user} token={token} dark={dark} onUpdated={u => {
              setUser(u)
              localStorage.setItem('user', JSON.stringify(u))
            }} />
          )}

          {view === 'Activity' && <ActivityView logs={activity} loading={actLoading} dark={dark} />}

          {isTaskView && (<>
            <div className="db-stats">
              {[
                { label: 'Total Tasks', value: total, sub: 'All tasks' },
                { label: 'Completed', value: completed, sub: 'Done' },
                { label: 'Pending', value: pending, sub: 'In progress' },
                { label: 'High Priority', value: highPriority, sub: 'Urgent' },
              ].map(c => (
                <div key={c.label} className={`db-stat-card ${dark ? 'dark' : ''}`}>
                  <div className="db-stat-label">{c.label}</div>
                  <div className="db-stat-value">{c.value}</div>
                  <div className="db-stat-sub">{c.sub}</div>
                </div>
              ))}
            </div>

            <div className="db-toolbar">
              <input className="db-search" placeholder="Search tasks by title..." value={search}
                onChange={e => { setSearch(e.target.value); setPage(1) }} />
              <select className="db-select" value={filterStatus} onChange={e => { setFilterStatus(e.target.value); setPage(1) }}>
                <option value="All">All Status</option>
                <option value="Pending">Pending</option>
                <option value="Completed">Completed</option>
              </select>
              <select className="db-select" value={filterPriority} onChange={e => { setFilterPriority(e.target.value); setPage(1) }}>
                <option value="All">All Priority</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
              <select className="db-select" value={sortDate} onChange={e => { setSortDate(e.target.value); setPage(1) }}>
                <option value="none">Sort by Due Date</option>
                <option value="asc">Earliest First</option>
                <option value="desc">Latest First</option>
              </select>
            </div>

            <div className={`db-card ${dark ? 'dark' : ''}`}>
              <div className="db-card-header">
                <h2>Tasks ({visible.length})</h2>
                <button className="btn-primary btn-sm" onClick={() => setModal({ type: 'create' })}>+ New Task</button>
              </div>

              {loading ? (
                <div className="db-empty">Loading tasks...</div>
              ) : visible.length === 0 ? (
                <div className="db-empty">{tasks.length === 0 ? 'No tasks yet. Create your first task!' : 'No tasks match your filters.'}</div>
              ) : (
                <>
                  <div className="db-table-wrap">
                    <table className="db-table">
                      <thead>
                        <tr>
                          <th>Status</th><th>Title</th><th>Description</th>
                          <th>Priority</th><th>Due Date</th><th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {paginated.map(task => (
                          <tr key={task._id} className={task.status === 'Completed' ? 'row-done' : ''}>
                            <td>
                              <button className={`status-toggle ${task.status === 'Completed' ? 'done' : ''}`}
                                onClick={() => toggleStatus(task)}>
                                {task.status}
                              </button>
                            </td>
                            <td className="task-title">{task.title}</td>
                            <td className="task-desc">{task.description || '—'}</td>
                            <td><span className={`db-badge priority-${task.priority.toLowerCase()}`}>{task.priority}</span></td>
                            <td className="task-date">{task.dueDate || '—'}</td>
                            <td>
                              <div className="action-btns">
                                <button className="btn-edit" onClick={() => setModal({ type: 'edit', task })}>Edit</button>
                                <button className="btn-del" onClick={() => setModal({ type: 'delete', task })}>Delete</button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {totalPages > 1 && (
                    <div className="db-pagination">
                      <button className="pg-btn" disabled={page === 1} onClick={() => setPage(p => p - 1)}>← Prev</button>
                      <div className="pg-pages">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
                          <button key={n} className={`pg-num ${page === n ? 'active' : ''}`} onClick={() => setPage(n)}>{n}</button>
                        ))}
                      </div>
                      <button className="pg-btn" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>Next →</button>
                    </div>
                  )}
                </>
              )}
            </div>

            <div className={`db-card ${dark ? 'dark' : ''}`}>
              <div className="db-card-header">
                <h2>Recent Activity</h2>
                <button className="db-link" onClick={() => handleNav('Activity')}>View All →</button>
              </div>
              {activity.length === 0 ? (
                <div className="db-empty" style={{ padding: '20px' }}>No activity yet.</div>
              ) : (
                <ul className="activity-list">
                  {activity.slice(0, 5).map((l, i) => (
                    <li key={i} className="activity-item">
                      <span className="activity-dot" />
                      <div>
                        <div className="activity-text">{l.action}</div>
                        <div className="activity-time">{new Date(l.createdAt).toLocaleString()}</div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </>)}
        </div>

        <footer className="db-footer">2024 Internship Task Management System</footer>
      </div>

      {modal?.type === 'create' && <TaskModal onClose={() => setModal(null)} onSave={handleSave} dark={dark} />}
      {modal?.type === 'edit' && <TaskModal task={modal.task} onClose={() => setModal(null)} onSave={handleSave} dark={dark} />}
      {modal?.type === 'delete' && <DeleteModal task={modal.task} onClose={() => setModal(null)} onConfirm={handleDelete} dark={dark} />}
    </div>
  )
}
