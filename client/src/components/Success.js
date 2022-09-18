import React, { useEffect } from "react"

const Success = ({message})=>{
    useEffect(()=>{
        const error = document.querySelector('.success-component')
        setTimeout(()=>{
            error.style.visibility = 'hidden'
            error.style.opacity = '0'
        }, 3000)
    }, [message])
    return (
        <div className="success-component">
            <p>&#10004; {message}</p>
        </div>
    )
}

export default Success