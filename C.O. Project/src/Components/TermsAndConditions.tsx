import './styles/Components.css'
import React, { useState } from "react";

interface TermsCheckboxProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  companyName?: string;
}

export default function TermsAndConditions(
    {checked, onChange, companyName = "Collectia S.A.",}: TermsCheckboxProps) {
    const [isChecked, setIsChecked] = useState(checked ?? false);
    const handleToggle = () => {
        const next = !isChecked;
        setIsChecked(next);
        onChange?.(next);
    };

    return (
    <button
        type="button"
        onClick={handleToggle}
        className='terms-wrapper'
        aria-pressed={isChecked}
    >
        <span
            className='terms-checkbox'
            style={{
            borderColor: isChecked ? "#7865a3" : "#ccc",
            backgroundColor: isChecked ? "#7865a3" : "#fff",
            }}
        >
            {isChecked && (
                <svg
                    width="10"
                    height="8"
                    viewBox="0 0 10 8"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                    d="M1 3.5L3.8 6.5L9 1"
                    stroke="#fff"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    />
                </svg>
            )}
        </span>
        <span className='terms-text'>
            Aceptó los términos y condiciones, y políticas de privacidad de{" "}
            <span className='terms-company'>{companyName}</span>
        </span>
    </button>
    )
}