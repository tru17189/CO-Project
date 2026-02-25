import type React from 'react'
import './styles/Instructions.css'

export default function NewInstruction({text, insOrder, numberOfCLicks}:
    {text:React.ReactNode, insOrder:number, numberOfCLicks:number}) {
    const reveleInstruction = numberOfCLicks>=insOrder

    return (
        <div
            className="instruction-container"
            style={reveleInstruction ? 
            {opacity:"1", pointerEvents:"auto"} : {opacity:"0", pointerEvents:"none"}}>
            {text}
        </div>
    )
};