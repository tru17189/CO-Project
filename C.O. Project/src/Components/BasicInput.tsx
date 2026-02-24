import './styles/Components.css'

export default function BasicInput({label, value, type, onChange}:{label:string, value:string, 
    type:string, onChange:(e: any) => void}) {
    
    return (
        <div className='field-group'>
            <label className='label'>{label}</label>
            <input
                type={type}
                value={value}
                onChange={onChange}
                className='input'
            />
        </div>
    )
}