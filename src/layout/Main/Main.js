import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../../component/Header/Header';

const Main = () => {
    return (
        <div className='dark:bg-slate-800 min-h-screen pb-10'>
            <Header></Header>
            <div className='max-w-7xl mx-auto px-3'>
                <Outlet></Outlet>
            </div>
        </div>
    );
};

export default Main;