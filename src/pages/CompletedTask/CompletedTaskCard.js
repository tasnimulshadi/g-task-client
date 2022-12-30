import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { FaRedoAlt, FaTimes, FaCommentDots } from "react-icons/fa";
import { useLocation, useNavigate } from 'react-router-dom';
import LoadingSpinner from '../../component/LoadingSpinner/LoadingSpinner';
import CommentDiv from './CommentDiv';

const CompletedTaskCard = ({ task, handleTaskDelete, refetch }) => {
    const { bgColor, details, title, _id, completed } = task;
    const location = useLocation();
    const navigate = useNavigate();
    const [showComment, setShowComment] = useState(false);

    // get commetnts
    const { data: comments, isLoading, refetch: commentRefetch } = useQuery({
        queryKey: ['comments', task], queryFn: async () => {
            const response = await fetch(`https://g-task-server.vercel.app/comments?taskid=${_id}`);
            return response.json()
        }
    })
    if (isLoading) return <LoadingSpinner></LoadingSpinner>;

    // delete task
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

    //add comment
    const handlePostComment = (event) => {
        event.preventDefault();
        const comment = event.target.comment.value;
        const commentData = { task_id: _id, comment };

        fetch('https://g-task-server.vercel.app/addcomment', {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify(commentData)
        })
            .then(res => res.json())
            .then(data => {
                // console.log(data);
                if (data.acknowledged) {
                    toast.success('Comment Added')
                    event.target.reset();
                    commentRefetch();
                    setShowComment(false);
                }
            });
    }


    return (
        <div className='h-fit shadow-lg rounded-lg' style={{ backgroundColor: bgColor }} >
            <div className='flex justify-evenly items-center'>
                <button
                    className='p-2 bg-green-400 text-white w-1/3 flex justify-center rounded-tl-lg'
                    title='Add to Not Completed'
                    onClick={() => handlecompletion(_id)}
                ><FaRedoAlt /></button>

                <button
                    className='p-2 bg-blue-400 text-white w-1/3 flex justify-center'
                    title='Add Comment'
                    onClick={() => setShowComment(!showComment)}
                >
                    <FaCommentDots />
                </button>

                <button
                    className='p-2 bg-red-400 text-white w-1/3 flex justify-center rounded-tr-lg'
                    title='Delete Task'
                    onClick={handledelete}
                ><FaTimes /></button>
            </div>
            {
                showComment &&
                <form onSubmit={handlePostComment} className='flex justify-evenly items-center mt-5'>
                    <input type="text" name="comment" className='shadow-md rounded-md p-2 w-[60%]' placeholder='Comment Here' required />
                    <input type="submit" value="Comment" className='shadow-md rounded-md bg-orange-400 dark:bg-orange-800 text-white p-2 cursor-pointer hover:scale-105 w-[30%]' />
                </form>
            }
            <div className='p-2'>
                <h3 className='text-2xl mb-5 font-semibold'>{title}</h3>
                {
                    task?.imageUrl &&
                    <img src={task?.imageUrl} alt="" className='w-full' />
                }
                <p className='mt-4'>{details}</p>
            </div>

            {
                (comments.length > 0) &&
                <div className='border-t-2 border-black p-2'>
                    Comments
                    {
                        comments.map(comment => <CommentDiv
                            key={comment._id}
                            comment={comment}
                            commentRefetch={commentRefetch}
                        ></CommentDiv>)
                    }
                </div >
            }
        </div>

    );
};

export default CompletedTaskCard;