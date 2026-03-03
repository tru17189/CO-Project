import './styles/Components.css'
import React, { useState } from "react";

type GenderOption = "Hombre" | "Mujer" | "No Binario";
const options: GenderOption[] = ["Hombre", "Mujer", "No Binario"];

interface GenderInputProps {
  value?: GenderOption | string | null;
  onChange?: (value: GenderOption) => void;
}

export default function GenderInput({ value, onChange }: GenderInputProps) {
    const [selected, setSelected] = useState<string | null>(value ?? null);
    const handleSelect = (option: GenderOption) => {
        setSelected(option);
        onChange?.(option);
    };

    return (
        <div className='gender-wrapper'>
            <label className='gender-label'>Género</label>
            <div className='gender-options-row'>
                {options.map((option) => {
                const isSelected = selected === option;
                return (
                    <button
                        key={option}
                        type="button"
                        onClick={() => handleSelect(option)}
                        className='gender-optionbtn'
                        aria-pressed={isSelected}
                    >
                    <span
                        className='gender-radio'
                        style={{
                        borderColor: isSelected ? "#7865a3" : "#ccc",
                        backgroundColor: "#fff",
                        }}
                    >
                        {isSelected && <span className='gender-radioDot'/>}
                    </span>
                    <span className='gender-optionLbael'>{option}</span>
                    </button>
                );
                })}
            </div>
        </div>
    )
}