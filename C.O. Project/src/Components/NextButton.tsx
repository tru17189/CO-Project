import './styles/Components.css'

interface NextButtonType {
    text: string,
    onClick: () => void
}

export default function NextButton({text, onClick}:NextButtonType) {
    return (
        <>
            <button 
                className='next-button'
                onClick={onClick}>{text}</button>
        </>
    )
}