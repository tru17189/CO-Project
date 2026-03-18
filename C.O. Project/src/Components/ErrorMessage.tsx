interface ErrorMessageProps {
    message: string
}

export default function ErrorMessage({message}:ErrorMessageProps) {
    return (
        <div>
            <p style={{ color: 'red', fontSize: '13px' }}>{message}</p>
        </div>
    )
}