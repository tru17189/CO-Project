import './styles/Components.css'

interface basicDropDownProps {
    label: string,
    defaultElement?: string | number,
    optionsArray?: string[] | number[],
    onChange: (e: any) => void
}

export default function BasicDropDown({label, defaultElement, optionsArray, onChange}:basicDropDownProps) {

    return (
    <div className='field-group'>
      <label className='label'>
        {label}
        <select value={defaultElement} onChange={onChange} className='input'>
          {optionsArray?.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </label>
    </div>
    )
}