import React from 'react';
import toast from 'react-hot-toast';

const CommentDiv = ({ comment, commentRefetch }) => {

    const handleDeleteComment = () => {
        toast((t) => (
            <span>
                <p>Do you want to delete the task?</p>
                <div className='flex justify-evenly mt-3'>
                    <button onClick={() => {
                        deleteCommentFromDB(comment._id)
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

    //delete comment api
    const deleteCommentFromDB = (_id) => {
        fetch(`https://g-task-server.vercel.app/comment?id=${_id}`, {
            method: "DELETE"
        })
            .then(res => res.json())
            .then(data => {
                // console.log(data);
                if (data.acknowledged && data.deletedCount === 1) {
                    commentRefetch();
                    toast.success('Comment Deleted')
                }
            })
    }

    return (
        <div className='flex justify-between items-start mb-2'>
            < textarea
                className='shadow-md rounded-md p-2 w-[90%]'
                readOnly
                rows={1}
                defaultValue={comment.comment}
            ></textarea >
            <button
                className='shadow-md rounded-md bg-white text-red-500 px-2 cursor-pointer hover:scale-125'
                onClick={handleDeleteComment}
                title='Delete Comment'
            >X</button>
        </div >
    );
};

export default CommentDiv;