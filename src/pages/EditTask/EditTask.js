import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useLoaderData, useNavigate } from 'react-router-dom';
import { CirclePicker } from 'react-color';
import { FaTimes } from "react-icons/fa";
import { BiImageAdd } from "react-icons/bi";

const EditTask = () => {
    const task = useLoaderData(); // bgColor, details, title, _id, completed
    // console.log(task);
    const navigate = useNavigate();
    const [bgColor, setBgColor] = useState(task.bgColor);
    const [imagePathValue, setImagePathValue] = useState(null);
    const [dbImage, setDbImage] = useState(task?.imageUrl ? task?.imageUrl : null);

    const handleSubmit = (event) => {
        event.preventDefault();
        const form = event.target;
        const title = form.title.value;
        const details = form.details.value;
        const image = form.image.files[0];
        let taskData = {
            _id: task._id,
            title,
            details,
            bgColor,
            completed: false,
            imageUrl: dbImage
        }

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
                        EditDBTask(taskData, navigate, form);
                    }
                });
        }
        else {
            //databse save api
            EditDBTask(taskData, navigate, form);
        }

    }

    const colorPalette = ['#F7F7F7', '#FAD0C3', '#FEF3BD', '#C1E1C5', '#C4DEF6', '#E6E0F4']
    const handleColorChange = (color, event) => {
        setBgColor(color.hex);
    }


    return (
        <div className='my-5'>
            <h2 className='text-center text-2xl font-semibold mb-5 dark:text-white'>Edit Task</h2>
            <div className='mx-auto flex justify-center mb-5'>
                <CirclePicker
                    colors={colorPalette}
                    onChange={handleColorChange}
                />
            </div>
            <form onSubmit={handleSubmit} className='flex flex-col items-center'>
                {/* title */}
                <input
                    type="text"
                    name="title"
                    placeholder='Task Title'
                    defaultValue={task.title}
                    className='border-2  focus:outline-none focus:border-sky-500 w-full lg:w-1/2 p-2 rounded mb-5'
                    style={{ backgroundColor: bgColor }}
                    required />
                {/* details */}
                <input
                    className='border-2  focus:outline-none focus:border-sky-500 w-full lg:w-1/2 p-2 rounded'
                    name="details"
                    placeholder='Task Details'
                    style={{ backgroundColor: bgColor }}
                    defaultValue={task.details}
                    required
                />
                <div className="relative h-40 w-full lg:w-1/2 rounded-lg border-dashed border-2  mt-5 flex justify-center items-center" style={{ backgroundColor: bgColor }} >
                    <div className="absolute">
                        <div className="flex flex-col items-center text-gray-400 text-5xl">
                            {
                                !imagePathValue
                                    ?
                                    <div>
                                        {
                                            dbImage
                                                ?
                                                <div className='relative'>
                                                    <img src={dbImage} alt="" className='h-28' />
                                                    <FaTimes className='absolute text-red-500 bg-white rounded-md text-base top-0 right-0 z-10 cursor-pointer hover:scale-150' onClick={() => setDbImage(null)} />
                                                </div>
                                                :
                                                <BiImageAdd />
                                        }
                                    </div>
                                    :
                                    <BiImageAdd />
                            }
                            <span className="block text-gray-400 font-normal text-base">{dbImage ? 'Change image' : 'Add image here'}</span>
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
                    value="Edit Task"
                    className='w-full lg:w-1/2 mt-5 p-2 rounded cursor-pointer bg-orange-400 dark:bg-orange-800 text-white'
                />
            </form >

        </div >
    );
};

export default EditTask;


const EditDBTask = (taskData, navigate, form) => {

    fetch('https://g-task-server.vercel.app/edit', {
        method: 'PUT',
        headers: {
            'content-type': 'application/json'
        },
        body: JSON.stringify(taskData)
    })
        .then(res => res.json())
        .then(data => {
            // console.log(data);
            if (data.acknowledged && data.modifiedCount === 1) {
                toast.success('Task Updated')
                form.reset();
                navigate('/');
            }
        });
}