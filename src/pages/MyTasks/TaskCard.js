import React from 'react';
import toast from 'react-hot-toast';
import { FaCheck, FaTimes, FaPenSquare } from "react-icons/fa";
import { Link, useLocation, useNavigate } from 'react-router-dom';

const TaskCard = ({ task, handleTaskDelete, refetch }) => {
    const { bgColor, details, title, _id, completed } = task;
    const location = useLocation();
    // console.log(location.pathname);
    const navigate = useNavigate();


    const handledelete = () => {
        toast((t) => (
            <span>
                <p>Do you want to delete the task?</p>
                <div className='flex justify-evenly mt-3'>
                    <button onClick={() => {
                        handleTaskDelete(_id)
                        toast.dismiss(t.id)
                    }} className='text-green-400'>
                        Yes
                    </button>
                    <button onClick={() => toast.dismiss(t.id)} className='text-red-400'>
                        No
                    </button>
                </div>
            </span>
        ));

    }

    //completed api update
    const handlecompletion = (_id) => {
        fetch(`https://g-task-server.vercel.app/taskcompletion?id=${_id}`, {
            method: "PATCH",
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({ completed: !completed })
        })
            .then(res => res.json())
            .then(data => {
                if (data.acknowledged && data.modifiedCount === 1) {
                    if (location.pathname === '/completed') {
                        toast.success('Task Not Completed');
                        navigate('/');
                    }
                    else {
                        toast.success('Task Completed');
                        navigate('/completed');
                    }
                }
            })
    }


    return (
        <div className='h-fit shadow-lg rounded-lg' style={{ backgroundColor: bgColor }} >
            <div className='flex justify-evenly items-center'>
                <button
                    className='p-2 bg-green-400 text-white w-1/3 flex justify-center rounded-tl-lg'
                    title='Add to Completed'
                    onClick={() => handlecompletion(_id)}
                ><FaCheck /></button>

                <Link
                    to={`/edit/${_id}`}
                    className='p-2 bg-blue-400 text-white w-1/3 flex justify-center'
                    title='Edit Task'
                ><FaPenSquare /></Link>

                <button
                    className='p-2 bg-red-400 text-white w-1/3 flex justify-center rounded-tr-lg'
                    title='Delete Task'
                    onClick={handledelete}
                ><FaTimes /></button>
            </div>
            <div className='p-2'>
                <h3 className='text-2xl mb-5 font-semibold'>{title}</h3>
                {
                    task?.imageUrl &&
                    <img src={task?.imageUrl} alt="" className='w-full' />
                }
                <p className='mt-4'>{details}</p>
            </div>
        </div >
    );
};

export default TaskCard;