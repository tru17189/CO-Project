import './styles/Components.css'

export default function NextButton({text, isWhiteStyle}:{text:string, isWhiteStyle:boolean}) {
    const styles: Record<string, React.CSSProperties> = {
        colors1: {
            background: "var(--primary-purple)",
            color:" var(--white)"
        },
        colors2: {
            background: "var(--white)",
            color:" var(--primary-purple)"
        }
    }
    return (
        <>
            <button style={isWhiteStyle ? styles.colors2 : styles.colors1} className='next-button'>{text}</button>
        </>
    )
}