import PopupMessage from '../Components/PopUpMessage'
import styles from './CSS/PricingTiers.module.css'
import { useState } from 'react';
import { useAuth, type RegisterData }    from '../context/AuthContext'
import { useLocation, useNavigate } from 'react-router-dom';

interface PlanFeature {
    title: string
    description?: string
}

interface Plan {
    name: string
    price: number
    accentColor: string
    badgeColor: string
    features: PlanFeature[]
    highlighted?: boolean
}

const plans: Plan[] = [
    {
        name: "Básico",
        price: 25,
        accentColor: "#a78bda",
        badgeColor: "#c4a8e8",
        features: [
            { title: "5 Agentes IA" },
            { title: "Tablero de Contactos", description: "Adapta cómo venden tus agentes según el tipo de cliente:" },
            { title: "Consultative Selling", description: "Ayuda a clientes que buscan opciones cerca de su trabajo o escuela, encuentra alternativas dentro de su presupuesto." },
            { title: "Solution Selling", description: "Diseñado para clientes que buscan resultados rápidos, perfecto para ventas o rentas urgentes." },
        ],
    },
    {
        name: "Pro",
        price: 50,
        accentColor: "#7c3aed",
        badgeColor: "#8b5cf6",
        highlighted: true,
        features: [
            { title: "10 Agentes IA" },
            { title: "Tablero de Contactos", description: "Adapta cómo venden tus agentes según el tipo de cliente, con acceso a todos los estilos del plan básico más:" },
            { title: "Relationship Selling", description: "Se mantiene en contacto con un cliente durante años hasta llevarlo a su primera compra." },
            { title: "Outbound Selling", description: "Busca oportunidades: propiedades que vender o compradores potenciales." },
        ],
    },
    {
        name: "Premium",
        price: 100,
        accentColor: "#4c1d95",
        badgeColor: "#6d28d9",
        features: [
            { title: "15 Agentes IA" },
            { title: "Tablero de Contactos", description: "Adapta cómo venden tus agentes según el tipo de cliente, con acceso a todos los estilos de las demás categorías." },
            { title: "Base de datos ampliada", description: "Amplía tu base de usuarios a través de nuestra base de datos y ten más clientes que nunca." },
            { title: "Soporte prioritario", description: "Ten mayor prioridad con nuestro servicio técnico y consultoría." },
        ],
    },
]

function PlanCard({ plan, onSelect }: { plan: Plan, onSelect: (name: string) => void}) {
    return (
        <div className={`${styles.card} ${plan.highlighted ? styles.cardHighlighted : ''}`}>

            <div className={styles.badge} style={{ backgroundColor: plan.badgeColor }}>
                <span 
                    className={styles.badgeName}
                    style={{ backgroundColor: plan.badgeColor }}>{plan.name}</span>
            </div>

            <div className={styles.priceBlock} style={{ color: plan.accentColor }}>
                <span className={styles.priceCurrency}>$</span>
                <span className={styles.priceAmount}>{plan.price}</span>
                <span className={styles.pricePeriod}>/mes</span>
            </div>

            <div className={styles.divider} />

            <div className={styles.featureList}>
                {plan.features.map((feature, i) => (
                    <div key={i} className={styles.featureItem}>
                        <div className={styles.featureHeader}>
                            <span className={styles.featureArrow} style={{ color: plan.accentColor }}>»</span>
                            <span className={styles.featureTitle}>{feature.title}</span>
                        </div>
                        {feature.description && (
                            <p className={styles.featureDesc}>{feature.description}</p>
                        )}
                    </div>
                ))}
            </div>

            <button
                className={styles.ctaBtn}
                style={{
                    background: `linear-gradient(135deg, ${plan.badgeColor}, ${plan.accentColor})`,
                }}
                onClick={() => onSelect(plan.name)}
            >
                Elegir {plan.name}
            </button>
        </div>
    )
}

export default function PricingTiers() {
    const [plan, setPlan] = useState<'basico' | 'pro' | 'premium'>('basico')
    const [loading, setLoading]  = useState(false)
    const [error, setError] = useState("")
    const [selectedPlan, setSelectedPlan] = useState<string | null>(null)

    const navigate = useNavigate();
    const location = useLocation(); 
    const { register } = useAuth();

    const step1Data  = location.state?.step1Data
    const step2Data  = location.state?.step2Data

    const handleConfirm = async () => {
        if (!selectedPlan) return

        const fullData: RegisterData = {
            ...step1Data,
            ...step2Data,
            plan: selectedPlan.toLowerCase() as 'basico' | 'pro' | 'premium'
        }

        setLoading(true)
        try {
            await register(fullData)
            navigate('/login', { state: { message: '¡Cuenta creada! Inicia sesión.' } })
        } catch (err: any) {
            setError(err.response?.data?.message || 'Error al crear la cuenta')
            setSelectedPlan(null) // close popup so error is visible
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className={styles.wrapper}>
            <div className={styles.orb1} />
            <div className={styles.orb2} />

            <div className={styles.inner}>
                <p className={styles.eyebrow}>Planes & Precios</p>
                <h1 className={styles.heading}>Elige tu plan ideal</h1>
                <p className={styles.subheading}>
                    Potencia tu operación con agentes de IA que trabajan por ti, las 24 horas.
                </p>

                {error && (
                    <p style={{ color: '#ff6b6b', textAlign: 'center', marginBottom: '16px' }}>
                        {error}
                    </p>
                )}

                <div className={styles.grid}>
                    {plans.map((plan) => (
                        <PlanCard key={plan.name} plan={plan} onSelect={setSelectedPlan}/>
                    ))}
                </div>
            </div>
            {selectedPlan && (
                <PopupMessage
                    title={`Has elegido el plan ${selectedPlan}`}
                    message={`Has seleccionado el plan ${selectedPlan}. ¡Gracias por elegirnos!`}
                    onClose={() => setSelectedPlan(null)}
                    onConfirm={handleConfirm}
                />
            )}
            {loading && (
                <PopupMessage
                    title="Creando tu cuenta..."
                    message="Estamos configurando todo para ti. Esto puede tardar unos momentos."
                    onClose={() => setSelectedPlan(null)}
                    onConfirm={() => navigate('/login', { state: { message: '¡Cuenta creada! Inicia sesión.' } })}
                />
            )}
        </div>
    )
}