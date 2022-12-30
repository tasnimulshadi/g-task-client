import React, { useContext, useState } from 'react';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthProvider';
import { FaAlignRight, FaLightbulb, FaRegLightbulb } from "react-icons/fa";

const Header = () => {
    const { user, signOutUser } = useContext(AuthContext);
    const [navbarOpen, setNavbarOpen] = useState(false);
    const [darkMode, setDarkMode] = useState(false);

    const handleLogout = () => {
        signOutUser()
            .then(() => {
                toast.success('User Logged Out Successfully');
            }).catch((error) => {
                toast.error(error.message);
            });
    }

    const toggleDarkMode = () => {
        setDarkMode(!darkMode)
        if (darkMode) {
            document.documentElement.classList.add('dark')
        } else {
            document.documentElement.classList.remove('dark')
        }
    }


    return (
        <header className='bg-orange-400 dark:bg-orange-800 dark:bg-orange-900'>
            <nav className="max-w-7xl mx-auto px-3 relative flex flex-wrap items-center justify-between py-3  mb-3">
                <div className="container px-4 mx-auto flex flex-wrap items-center justify-between">
                    <div className="w-full relative flex flex-row-reverse justify-between lg:w-auto lg:static lg:block lg:justify-start">
                        <button
                            className="text-white cursor-pointer text-xl leading-none px-3 py-1 border border-solid border-transparent rounded bg-transparent block lg:hidden outline-none focus:outline-none"
                            type="button"
                            onClick={() => setNavbarOpen(!navbarOpen)}
                        >
                            <FaAlignRight></FaAlignRight>
                        </button>
                        <button className='p-2 text-white'>
                            {
                                darkMode
                                    ?
                                    <FaLightbulb onClick={toggleDarkMode} title='Dark Mode Off'></FaLightbulb>
                                    :
                                    <FaRegLightbulb onClick={toggleDarkMode} title='Dark Mode On'></FaRegLightbulb>

                            }
                        </button>

                    </div>
                    <div
                        className={
                            "lg:flex flex-grow items-center" +
                            (navbarOpen ? " flex" : " hidden")
                        }
                        id="example-navbar-danger"
                    >
                        <ul className="flex flex-col lg:flex-row list-none lg:ml-auto">
                            <li className="nav-item">
                                <Link
                                    className="px-3 py-2 flex items-center font-bold leading-snug text-white hover:opacity-75"
                                    to='/'
                                >My Tasks
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link
                                    className="px-3 py-2 flex items-center font-bold leading-snug text-white hover:opacity-75"
                                    to='/completed'
                                >Completed Tasks
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link
                                    className="px-3 py-2 flex items-center font-bold leading-snug text-white hover:opacity-75"
                                    to='/add'
                                >Add Task
                                </Link>
                            </li>
                            <li className="nav-item">
                                {
                                    user
                                        ?
                                        <button
                                            className="px-3 py-2 flex items-center font-bold leading-snug text-white hover:opacity-75"
                                            onClick={handleLogout}
                                        >
                                            Logout
                                        </button>
                                        :
                                        <Link
                                            className='className="px-3 py-2 flex items-center font-bold leading-snug text-white hover:opacity-75"'
                                            to='/login'
                                        >Login</Link>
                                }
                            </li>
                        </ul>
                    </div>
                </div>
            </nav >
        </header >
    );
};

export default Header;