import './styles/Components.css'

interface NextButtonType {
    text: string,
    type: "submit" | "reset" | "button"
}

export default function NextButton({text, type}:NextButtonType) {
    return (
        <>
            <button 
                className='next-button'
                type={type}
            >{text}</button>
        </>
    )
}