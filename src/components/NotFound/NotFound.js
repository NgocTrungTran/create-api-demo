import React from "react"
import notFound from '../../asset/images/notFound.png'

function NotFound(){
    return (
        <div className="d-flex align-items-center justify-content-center">
            <img className="loading" src={notFound} alt="" />
        </div>
    )
}

export default NotFound;