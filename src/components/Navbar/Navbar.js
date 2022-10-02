import React from "react";
import { Link } from 'react-router-dom';

function Navbar() {
    return (
        <nav className="navbar navbar-dark bg-dark">
            <div className="container">
                <Link className="navbar-brand" to={"/user-address"} >
                    <i className="fa-solid fa-users text-success"></i>
                    <span className="text-warning fw-bolder mx-2">User</span>
                    Address
                </Link>
            </div>
        </nav>
    )
}

export default Navbar;