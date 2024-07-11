import React from 'react'
import { useNavigate } from "react-router-dom"

const Navbar = () => {
    const navigate = useNavigate()
    return (
        <>
            <div className="navbar bg-base-100  shadow-lg">
                <div className="navbar-start">
                    <p className="btn btn-ghost text-xl">Gender Identifier</p>
                </div>
                <div className="navbar-center hidden lg:flex">
                    <ul className="menu menu-horizontal px-1">
                        <li onClick={() => {
                            navigate("/videofeed")
                        }}><a>Enable Video</a></li>

                        <li onClick={() => {
                            navigate("/")
                        }}><a>Upload Image</a></li>
                    </ul>
                </div>

            </div>
        </>
    )
}

export default Navbar
