import './styles/Components.css'
import React, { useState, useMemo } from 'react';
import { zxcvbn, zxcvbnOptions } from '@zxcvbn-ts/core';
import * as common from '@zxcvbn-ts/language-common';
import * as en from '@zxcvbn-ts/language-en';

// Configurar con diccionarios de idioma
zxcvbnOptions.setOptions({
  dictionary: { ...common.dictionary, ...en.dictionary },
  translations: en.translations,
});

interface passwordInputProps {
    label: string,
    value: string,
    onChange: (e: any) => void
}

export default function PasswordInput({label, value, onChange}:passwordInputProps) {
    const result = useMemo(() => zxcvbn(value), [value]);

    const strengthLabels = ['Muy Débil', 'Débil', 'Media', 'Fuerte', 'Muy Fuerte'];

    return (
        <div className='field-group'>
            <label className='label'>{label}</label>
            <input
                type='password'
                value={value}
                onChange={onChange}
                className='input'
                required
            />
            {value && (
                <>
                    <meter max="4" value={result.score} />
                    <span>{strengthLabels[result.score]}</span>
                    <ul>
                        {result.feedback.suggestions.map((s, i) => <li key={i}>{s}</li>)}
                    </ul>
                </>
            )}
        </div>
    )
}