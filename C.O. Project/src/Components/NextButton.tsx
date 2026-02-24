import './styles/Components.css'

export default function NextButton({text}:{text:string}) {
    return (
        <>
            <button className='next-button'>{text}</button>
        </>
    )
}