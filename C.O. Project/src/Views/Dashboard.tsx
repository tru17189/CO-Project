import { useState } from 'react'
import styles from './CSS/Dashboard.module.css'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'

// ── Types ──────────────────────────────────────────────────
interface Contact {
    contacto_id: number
    negocio_id: number
    primer_nombre: string
    apellidos: string
    es_negocio: boolean
    telefono: string
    plataforma: 'WhatsApp' | 'Facebook' | 'Instagram' | 'Web'
}

// ── Mock data ──────────────────────────────────────────────
const platformStyles: Record<string, { bg: string; color: string; icon: string }> = {
    WhatsApp:  { bg: '#e6f9f1', color: '#16a34a', icon: '💬' },
    Facebook:  { bg: '#e8f0fe', color: '#1d4ed8', icon: '📘' },
    Instagram: { bg: '#fdf2f8', color: '#9333ea', icon: '📸' },
    Web:       { bg: '#fef9e7', color: '#b45309', icon: '🌐' },
}

// Borrar en el futuro cuando stats este completo con los datos reales
const defaultStats = [
    { label: 'Número de agentes disponibles',   value: '?',   icon: '⚙️', iconBg: '#aab9c3', iconColor: '#be185d' },
]

const navItems = [
    { id: 'dashboard', label: 'Dashboard Principal', icon: '⊞' },
    { id: 'reportes',  label: 'Reportes',            icon: '📊' },
    { id: 'config',    label: 'Configuraciones',     icon: '⚙' },
]

// ── Component ──────────────────────────────────────────────
export default function Dashboard() {
    const { user, logout, clients } = useAuth() // <-- Se invoca al usuario con su informacion y los clientes del negocio
    const [enlacesEnviados, setEnlacesEnviados] = useState(
        user?.negocio?.enlaces_enviados ?? 0
    )

    // Stats que se encuentran en la parte superior del dashboard. 
    const stats = [
        { label: 'Contactos totales', value: String(user?.negocio?.total_contactos), icon: '👥', iconBg: '#ede9f8', iconColor: '#7865a3' },
        { label: 'Ventas cerradas', value: String(user?.negocio?.total_compradores), icon: '💵', iconBg: '#dcfec3', iconColor: '#07a109' },
        { label: 'Enlaces enviados este mes', value: String(enlacesEnviados), icon: '🔗', iconBg: '#e6f9f1', iconColor: '#16a34a' },
        ...defaultStats,
    ]

    const [collapsed, setCollapsed]     = useState(false)
    const [activeNav, setActiveNav]     = useState('dashboard')
    const [search, setSearch]           = useState('')
    const [agents, setAgents]           = useState<Record<number, string>>(
        Object.fromEntries(clients.map(c => [c.contacto_id, 'Relacional'])) // <--- Remplazar despues
    )

    const handleAgentChange = (id: number, value: string) => {
        setAgents(prev => ({ ...prev, [id]: value }))
    }

    const handleDownloadReport = (contact: Contact) => {
        // Placeholder — replace with real PDF generation
        alert(`Descargando reporte de ${contact.primer_nombre}...`)
    }

    const isEven = (number:number) => {
        return number % 2 === 0;
    }

    const handleGenerateLink = async () => {
        const link = `${window.location.origin}/signup/new-contact?negocio=${user?.negocio?.id}`
        navigator.clipboard.writeText(link)
        alert(`¡Enlace copiado! \n${link}`)
    }

    return (
        <div className={styles.app}>

            {/* ── SIDEBAR ── */}
            <aside className={`${styles.sidebar} ${collapsed ? styles.sidebarCollapsed : ''}`}>
                <div className={styles.sidebarBrand}>
                    <div className={styles.brandLogo}>O</div>
                    <span className={styles.brandName}>{user?.negocio?.nombre}</span>
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
                        <p>Bienvenido {user?.primer_nombre}, pongamos estos agentes a trabajar 💪</p>
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
                        <div className={styles.userChip} onClick={logout}>
                            <div className={styles.userChipAvatar}>{user?.primer_nombre.charAt(0)}</div>
                            <span className={styles.userChipName}>Cerrar sesión</span>
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
                            <p className={styles.tableSubtitle}>{clients.length} contactos encontrados</p>
                        </div>
                        <button className={styles.addBtn} onClick={handleGenerateLink}>＋ Nuevo contacto</button>
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
                                {clients.map((contact, index) => {
                                    const plt = platformStyles[contact.plataforma]
                                    return (
                                        <tr key={contact.contacto_id}>

                                            {/* Contact */}
                                            <td>
                                                <div className={styles.contactCell}>
                                                    <div
                                                        className={styles.contactAvatar}
                                                        style={isEven(index) ? {background: '#7865a3'} : {background: '#c1a3cd'}}
                                                    >
                                                        {contact.primer_nombre.charAt(0) + '' + contact.apellidos.charAt(0)}
                                                    </div>
                                                    <span className={styles.contactName}>{contact.primer_nombre + ' ' + contact.apellidos}</span>
                                                </div>
                                            </td>

                                            {/* Phone */}
                                            <td>
                                                <span className={styles.phoneText}>{contact.telefono}</span>
                                            </td>

                                            {/* Platform */}
                                            <td>
                                                <span
                                                    className={styles.platformBadge}
                                                    style={{ background: plt.bg, color: plt.color }}
                                                >
                                                    {plt.icon} {contact.plataforma}
                                                </span>
                                            </td>

                                            {/* Agent dropdown */}
                                            <td>
                                                <select
                                                    className={styles.agentSelect}
                                                    value={'Relacional' /*agents[contact.contacto_id]*/}
                                                    onChange={e => handleAgentChange(contact.contacto_id, e.target.value)}
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
                                                    onClick={() => alert(`Abriendo chat de ${contact.primer_nombre + ' ' + contact.apellidos}`)}
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
