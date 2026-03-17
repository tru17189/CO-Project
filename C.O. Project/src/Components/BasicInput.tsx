import './styles/Components.css'

interface basicInputProps {
    label: string,
    value: string | number | undefined,
    type: string,
    maxLegnth?: number,
    onChange: (e: any) => void
}

export default function BasicInput({label, value, type, maxLegnth, onChange}:basicInputProps) {
    
    return (
        <div className='field-group'>
            <label className='label'>{label}</label>
            <input
                type={type}
                value={value}
                onChange={onChange}
                className='input'
                maxLength={maxLegnth}
                required
            />
        </div>
    )
}