import './styles/Components.css'

interface basicInputProps {
    label: string,
    value: string | number | undefined,
    type: string,
    onChange: (e: any) => void
}

export default function BasicInput({label, value, type, onChange}:basicInputProps) {
    
    return (
        <div className='field-group'>
            <label className='label'>{label}</label>
            <input
                type={type}
                value={value}
                onChange={onChange}
                className='input'
                required
            />
        </div>
    )
}