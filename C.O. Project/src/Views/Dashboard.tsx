import { useState } from 'react'
import styles from './CSS/Dashboard.module.css'

// ── Types ──────────────────────────────────────────────────
interface Contact {
    id: number
    name: string
    initials: string
    avatarColor: string
    phone: string
    platform: 'WhatsApp' | 'Facebook' | 'Instagram' | 'Web'
    agent: string
}

// ── Mock data ──────────────────────────────────────────────
const contacts: Contact[] = [
    { id: 1, name: 'María González',   initials: 'MG', avatarColor: '#7865a3', phone: '+52 55 1234 5678', platform: 'WhatsApp',  agent: 'Consultivo' },
    { id: 2, name: 'Carlos Ramírez',   initials: 'CR', avatarColor: '#c1a3cd', phone: '+52 55 2345 6789', platform: 'Facebook',  agent: 'Relacional' },
    { id: 3, name: 'Laura Sánchez',    initials: 'LS', avatarColor: '#5a4a82', phone: '+52 55 3456 7890', platform: 'Instagram', agent: 'Outbound'   },
    { id: 4, name: 'Andrés Herrera',   initials: 'AH', avatarColor: '#9880be', phone: '+52 55 4567 8901', platform: 'WhatsApp',  agent: 'Consultivo' },
    { id: 5, name: 'Sofía Mendoza',    initials: 'SM', avatarColor: '#c1a3cd', phone: '+52 55 5678 9012', platform: 'Web',       agent: 'Relacional' },
    { id: 6, name: 'Diego Torres',     initials: 'DT', avatarColor: '#7865a3', phone: '+52 55 6789 0123', platform: 'Facebook',  agent: 'Outbound'   },
    { id: 7, name: 'Valentina Cruz',   initials: 'VC', avatarColor: '#5a4a82', phone: '+52 55 7890 1234', platform: 'WhatsApp',  agent: 'Consultivo' },
    { id: 8, name: 'Roberto Jiménez',  initials: 'RJ', avatarColor: '#9880be', phone: '+52 55 8901 2345', platform: 'Instagram', agent: 'Relacional' },
]

const platformStyles: Record<string, { bg: string; color: string; icon: string }> = {
    WhatsApp:  { bg: '#e6f9f1', color: '#16a34a', icon: '💬' },
    Facebook:  { bg: '#e8f0fe', color: '#1d4ed8', icon: '📘' },
    Instagram: { bg: '#fdf2f8', color: '#9333ea', icon: '📸' },
    Web:       { bg: '#fef9e7', color: '#b45309', icon: '🌐' },
}

const stats = [
    { label: 'Contactos totales', value: '248',  icon: '👥', iconBg: '#ede9f8', iconColor: '#7865a3' },
    { label: 'Activos hoy',       value: '37',   icon: '⚡', iconBg: '#fef9c3', iconColor: '#a16207' },
    { label: 'Conversaciones',    value: '1,204', icon: '💬', iconBg: '#e6f9f1', iconColor: '#16a34a' },
    { label: 'Cierres del mes',   value: '89',   icon: '🏆', iconBg: '#fce7f3', iconColor: '#be185d' },
]

const navItems = [
    { id: 'dashboard', label: 'Dashboard Principal', icon: '⊞' },
    { id: 'reportes',  label: 'Reportes',            icon: '📊' },
    { id: 'config',    label: 'Configuraciones',     icon: '⚙' },
]

// ── Component ──────────────────────────────────────────────
export default function Dashboard() {
    const [collapsed, setCollapsed]     = useState(false)
    const [activeNav, setActiveNav]     = useState('dashboard')
    const [search, setSearch]           = useState('')
    const [agents, setAgents]           = useState<Record<number, string>>(
        Object.fromEntries(contacts.map(c => [c.id, c.agent]))
    )

    const filtered = contacts.filter(c =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.phone.includes(search) ||
        c.platform.toLowerCase().includes(search.toLowerCase())
    )

    const handleAgentChange = (id: number, value: string) => {
        setAgents(prev => ({ ...prev, [id]: value }))
    }

    const handleDownloadReport = (contact: Contact) => {
        // Placeholder — replace with real PDF generation
        alert(`Descargando reporte de ${contact.name}...`)
    }

    return (
        <div className={styles.app}>

            {/* ── SIDEBAR ── */}
            <aside className={`${styles.sidebar} ${collapsed ? styles.sidebarCollapsed : ''}`}>
                <div className={styles.sidebarBrand}>
                    <div className={styles.brandLogo}>O</div>
                    <span className={styles.brandName}>ONA</span>
                </div>

                <nav className={styles.sidebarNav}>
                    {navItems.map(item => (
                        <button
                            key={item.id}
                            className={`${styles.navItem} ${activeNav === item.id ? styles.navItemActive : ''}`}
                            onClick={() => setActiveNav(item.id)}
                            title={collapsed ? item.label : undefined}
                        >
                            <span className={styles.navIcon}>{item.icon}</span>
                            <span className={styles.navLabel}>{item.label}</span>
                        </button>
                    ))}
                </nav>

                <button className={styles.toggleBtn} onClick={() => setCollapsed(p => !p)}>
                    <span className={styles.toggleIcon}>◀</span>
                    <span className={styles.toggleLabel}>Colapsar</span>
                </button>
            </aside>

            {/* ── MAIN ── */}
            <div className={styles.main}>

                {/* Top bar */}
                <header className={styles.topbar}>
                    <div className={styles.topbarLeft}>
                        <h1>Dashboard Principal</h1>
                        <p>Gestiona tus contactos y agentes de IA</p>
                    </div>
                    <div className={styles.topbarRight}>
                        <div className={styles.searchBox}>
                            <span className={styles.searchIcon}>🔍</span>
                            <input
                                placeholder="Buscar contacto..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                            />
                        </div>
                        <div className={styles.userChip}>
                            <div className={styles.userChipAvatar}>A</div>
                            <span className={styles.userChipName}>Admin</span>
                        </div>
                    </div>
                </header>

                {/* Stats */}
                <div className={styles.statsRow}>
                    {stats.map(s => (
                        <div key={s.label} className={styles.statCard}>
                            <div className={styles.statIcon} style={{ background: s.iconBg }}>
                                {s.icon}
                            </div>
                            <div className={styles.statInfo}>
                                <p>{s.label}</p>
                                <h3>{s.value}</h3>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Table */}
                <section className={styles.tableSection}>
                    <div className={styles.tableHeader}>
                        <div>
                            <p className={styles.tableTitle}>Contactos</p>
                            <p className={styles.tableSubtitle}>{filtered.length} contactos encontrados</p>
                        </div>
                        <button className={styles.addBtn}>＋ Nuevo contacto</button>
                    </div>

                    <div className={styles.tableWrapper}>
                        <table>
                            <thead>
                                <tr>
                                    <th>Contacto</th>
                                    <th>Teléfono</th>
                                    <th>Plataforma</th>
                                    <th>Agente</th>
                                    <th>Ir al chat</th>
                                    <th>Reporte</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map(contact => {
                                    const plt = platformStyles[contact.platform]
                                    return (
                                        <tr key={contact.id}>

                                            {/* Contact */}
                                            <td>
                                                <div className={styles.contactCell}>
                                                    <div
                                                        className={styles.contactAvatar}
                                                        style={{ background: contact.avatarColor }}
                                                    >
                                                        {contact.initials}
                                                    </div>
                                                    <span className={styles.contactName}>{contact.name}</span>
                                                </div>
                                            </td>

                                            {/* Phone */}
                                            <td>
                                                <span className={styles.phoneText}>{contact.phone}</span>
                                            </td>

                                            {/* Platform */}
                                            <td>
                                                <span
                                                    className={styles.platformBadge}
                                                    style={{ background: plt.bg, color: plt.color }}
                                                >
                                                    {plt.icon} {contact.platform}
                                                </span>
                                            </td>

                                            {/* Agent dropdown */}
                                            <td>
                                                <select
                                                    className={styles.agentSelect}
                                                    value={agents[contact.id]}
                                                    onChange={e => handleAgentChange(contact.id, e.target.value)}
                                                >
                                                    <option value="Consultivo">Consultivo</option>
                                                    <option value="Relacional">Relacional</option>
                                                    <option value="Outbound">Outbound</option>
                                                </select>
                                            </td>

                                            {/* Go to chat */}
                                            <td>
                                                <button
                                                    className={styles.chatBtn}
                                                    title="Ir al chat"
                                                    onClick={() => alert(`Abriendo chat de ${contact.name}`)}
                                                >
                                                    →
                                                </button>
                                            </td>

                                            {/* Report */}
                                            <td>
                                                <button
                                                    className={styles.reportBtn}
                                                    onClick={() => handleDownloadReport(contact)}
                                                >
                                                    ↓ PDF
                                                </button>
                                            </td>

                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                </section>
            </div>
        </div>
    )
}
