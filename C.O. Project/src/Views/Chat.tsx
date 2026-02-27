import React, { useState, useRef, useEffect } from 'react'
import styles from './CSS/Chat.module.css'
import chatsData from '../Data/Chats.js'
import initialMessagesData from '../Data/InitialMessages.js'

// ── Types ──────────────────────────────────────────
interface Chat {
    id: number
    name: string
    preview: string
    time: string
    unread?: number
    gradient: string
    initials: string
    online?: boolean
}
interface Message {
    id: number
    text: string
    time: string
    isOut: boolean
    sender?: string
    reply?: { sender: string; text: string }
    dateDivider?: string
}
// ── Mock data ──────────────────────────────────────
const chats: Chat[] = chatsData
const initialMessages: Message[] = initialMessagesData

export default function Chat() {
    // ── Sidebar Varibles ──────────────────────────────────────
    const [activeFilter, setActiveFilter] = useState('All')
    const [activeChat, setActiveChat] = useState<number>(1)
    const activeContact = chats.find(c => c.id === activeChat)

    // ── Main Chat Varibles ──────────────────────────────────────
    const [messages, setMessages] = useState<Message[]>(initialMessages)
    /* scroll down refenrence */
    const messagesEndRef = useRef<HTMLDivElement>(null)
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    // ── Input Varibles ──────────────────────────────────────
    const [inputValue, setInputValue] = useState('')


    // ── Functions ──────────────────────────────────────
    const sendMessage = () => {
        if(!inputValue.trim()) return
        const newMsg: Message = {
            id: messages.length +1,
            text: inputValue.trim(),
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isOut: true,
        }
        setMessages(prev => [...prev, newMsg])
        setInputValue('')
    }
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            sendMessage()
        }
    }

    return (
        <div className={styles.chatApp}>
            {/*--SIDEBAR--*/}
            <aside className={styles.sidebar}>
                <div className={styles.sidebarHeader}>
                    <div className={styles.sidebarAvatar}>Y</div>
                    <div className={styles.sidebarIcons}>
                        <button className={styles.iconBtn} title="Communities">⊕</button>
                        <button className={styles.iconBtn} title="New chat">✎</button>
                        <button className={styles.iconBtn} title="Menu">⋮</button>
                    </div>
                </div>
                <div className={styles.searchBar}>
                    <div className={styles.searchWrapper}>
                        <span className={styles.searchIcon}>🔍</span>
                        <input
                            className={styles.searchInput}
                            placeholder="Search or start new chat"
                            type="text"
                        />
                    </div>
                </div>
                <div className={styles.filterTabs}>
                    {['All', 'Unread', 'Favorites', 'Groups'].map(tab => (
                        <button
                            key={tab}
                            className={`${styles.filterTab} ${activeFilter === tab ? styles.filterTabActive : ''}`}
                            onClick={() => setActiveFilter(tab)}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
                <div className={styles.chatList}>
                    {chats.map(chat => (
                        <div
                            key={chat.id}
                            className={`${styles.chatItem} ${activeChat === chat.id ? styles.chatItemActive : ''}`}
                            onClick={() => setActiveChat(chat.id)}
                        >
                            <div className={styles.chatAvatar} style={{ background: chat.gradient }}>
                                {chat.initials}
                            </div>
                            <div className={styles.chatItemInfo}>
                                <div className={styles.chatItemTop}>
                                    <span className={styles.chatItemName}>{chat.name}</span>
                                    <span className={styles.chatItemTime}>{chat.time}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span className={styles.chatItemPreview}>{chat.preview}</span>
                                    {chat.unread && (
                                        <span className={styles.chatItemUnread}>{chat.unread}</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </aside>
            {/* ── MAIN CHAT ── */}
            <main className={styles.chatMain}>
                {/* Header */}
                <div className={styles.chatHeader}>
                    <div className={styles.chatHeaderLeft}>
                        <div 
                            className={styles.chatHeaderAvatar} 
                            style={{ background: activeContact?.gradient }}>
                                {activeContact?.initials}
                        </div>
                        <div>
                            <div className={styles.chatHeaderName}>{activeContact?.name}</div>
                            <div className={styles.chatHeaderStatus}>
                                {activeContact?.online ? 'online' : 'click here for group info'}
                            </div>
                        </div>
                    </div>
                    <div className={styles.chatHeaderRight}>
                        <button className={styles.iconBtn}>🔍</button>
                        <button className={styles.iconBtn}>📹</button>
                        <button className={styles.iconBtn}>⋮</button>
                    </div>
                </div>
                {/* Messages */}
                <div className={styles.messagesArea}>
                    {
                        messages.map(msg => (
                            <div key={msg.id}>
                                {msg.dateDivider && (
                                    <div className={styles.dateDivider}>
                                        <span className={styles.dateDividerLabel}>{msg.dateDivider}</span>
                                    </div>
                                )}
                                <div className={`${styles.bubble} ${msg.isOut ? styles.bubbleOut : styles.bubbleIn}`}>
                                    {!msg.isOut && msg.sender && (
                                        <div className={styles.bubbleSender}>{msg.sender}</div>
                                    )}
                                    {msg.reply && (
                                        <div className={styles.replyBlock}>
                                            <strong>{msg.reply.sender}</strong>
                                            <br />{msg.reply.text}
                                        </div>
                                    )}
                                    {msg.text}
                                    <div className={styles.bubbleMeta}>
                                        <span className={styles.bubbleTime}>{msg.time}</span>
                                        <span className={styles.bubbleTime}>{msg.time}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                </div>
                {/* Input */}
                <div className={styles.inputBar}>
                    <button className={styles.iconBtn}>＋</button>
                    <button className={styles.iconBtn}>😊</button>
                    <input
                        className={styles.inputField}
                        placeholder="Type a message"
                        value={inputValue}
                        onChange={e => setInputValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                    />
                    <button className={styles.sendBtn} onClick={sendMessage}>
                        ➤
                    </button>
                </div>
            </main>
        </div>
    )
}