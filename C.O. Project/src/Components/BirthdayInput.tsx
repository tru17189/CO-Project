import './styles/Components.css'

export default function BirthdayInput({dayValue, onChangeDay, yearValue, onChangeYear}:{
    dayValue:string, onChangeDay:(e: any) => void, yearValue:string, 
    onChangeYear:(e: any) => void}) {
    
    return (
        <div className='field-group'>
            <label className='label'>Fecha de Nacimiento</label>
            <div className='birthday-field-group'>
                <input
                    type="day"
                    value={dayValue}
                    onChange={onChangeDay}
                    className='birtday-input'
                    placeholder='Día'
                />
                <section>
                    <select id="form-birthday-month" className='birthday-select'
                    name='form-birthday-month' defaultValue="" required>
                        <option value="Enero">Enero</option>
                        <option value="Febrero">Febrero</option>
                        <option value="Marzo">Marzo</option>
                        <option value="Abril">Abril</option>
                        <option value="Mayo">Mayo</option>
                        <option value="Junio">Junio</option>
                        <option value="Julio">Julio</option>
                        <option value="Agosto">Agosto</option>
                        <option value="Septiembre">Septiembre</option>
                        <option value="Octubre">Octubre</option>
                        <option value="Noviembre">Noviembre</option>
                        <option value="Diciembre">Diciembre</option>
                    </select>
                </section>
                <input
                    type="year"
                    value={yearValue}
                    onChange={onChangeYear}
                    className='birtday-input'
                    placeholder='Año'
                />
            </div>
        </div>
    )
}