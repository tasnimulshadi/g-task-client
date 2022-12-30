import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { CirclePicker } from 'react-color';

import { BiImageAdd } from "react-icons/bi";
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthProvider';


const AddTask = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [bgColor, setBgColor] = useState('#F7F7F7');
    const [imagePathValue, setImagePathValue] = useState();

    const handleSubmit = (event) => {
        event.preventDefault();
        const form = event.target;
        const title = form.title.value;
        const details = form.details.value;
        const image = form.image.files[0];
        let taskData = { title, details, bgColor, completed: false, userId: user.uid }

        if (image) {
            const formData_image = new FormData();
            formData_image.append('image', image);

            //imageBB upload api
            fetch(`https://api.imgbb.com/1/upload?expiration=600&key=${process.env.REACT_APP_imageBB_key}`, {
                method: "POST",
                body: formData_image
            })
                .then(res => res.json())
                .then(imagebbData => {
                    // console.log(imagebbData);
                    if (imagebbData.success) {
                        taskData.imageUrl = imagebbData.data.url;
                        //databse save api
                        AddTaskToDB(taskData, navigate, form);
                    }
                });
        }
        else {
            //databse save api
            AddTaskToDB(taskData, navigate, form);
        }

    }

    const colorPalette = ['#F7F7F7', '#FAD0C3', '#FEF3BD', '#C1E1C5', '#C4DEF6', '#E6E0F4']
    const handleColorChange = (color, event) => {
        setBgColor(color.hex);
    }


    return (
        <div className='my-5'>
            <h2 className='text-center text-2xl font-semibold mb-5 dark:text-white'>Add Task</h2>
            <div className='mx-auto flex justify-center mb-5'>
                <CirclePicker
                    colors={colorPalette}
                    onChange={handleColorChange}
                />
            </div>
            <form onSubmit={handleSubmit} className='flex flex-col items-center'>
                {/* title */}
                <input type="text" name="title" placeholder='Task Title' className='border-2  focus:outline-none focus:border-sky-500 w-full lg:w-1/2 p-2 rounded mb-5' style={{ backgroundColor: bgColor }} required />
                {/* details */}
                <input
                    className='border-2  focus:outline-none focus:border-sky-500 w-full lg:w-1/2 p-2 rounded'
                    name="details"
                    placeholder='Task Details'
                    style={{ backgroundColor: bgColor }}
                    required
                />
                <div className="relative h-28 w-full lg:w-1/2 rounded-lg border-dashed border-2  mt-5 flex justify-center items-center" style={{ backgroundColor: bgColor }} >
                    <div className="absolute">
                        <div className="flex flex-col items-center text-gray-400 text-5xl">
                            <BiImageAdd />
                            <span className="block text-gray-400 font-normal text-base">Add image here</span>
                            <span className="block text-gray-600 font-normal text-base">{imagePathValue}</span>
                        </div>
                    </div>
                    <input
                        type="file"
                        name="image"
                        className="h-full w-full opacity-0"
                        onChange={(event) => setImagePathValue(event.target.value)}
                    />
                </div>
                <input
                    type="submit"
                    value="Add Task"
                    className='w-full lg:w-1/2 mt-5 p-2 rounded cursor-pointer text-white bg-orange-400 dark:bg-orange-800'
                />
            </form >




        </div >
    );
};

export default AddTask;


const AddTaskToDB = (taskData, navigate, form) => {

    fetch('https://g-task-server.vercel.app/add', {
        method: 'POST',
        headers: {
            'content-type': 'application/json'
        },
        body: JSON.stringify(taskData)
    })
        .then(res => res.json())
        .then(data => {
            if (data.acknowledged) {
                toast.success('Task Added')
                form.reset();
                navigate('/');
            }
        });
}