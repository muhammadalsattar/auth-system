import React, { useEffect } from "react"

const Error = ({message})=>{
    useEffect(()=>{
        const error = document.querySelector('.error-component')
        setTimeout(()=>{
            error.style.visibility = 'hidden'
            error.style.opacity = '0'
        }, 3000)
    }, [message])
    return (
        <div className="error-component">
            <p>&#x26A0; {message}</p>
        </div>
    )
}

export default Error