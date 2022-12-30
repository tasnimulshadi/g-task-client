import { useQuery } from '@tanstack/react-query';
import React, { useContext } from 'react';
import toast from 'react-hot-toast';
import LoadingSpinner from '../../component/LoadingSpinner/LoadingSpinner';
import { AuthContext } from '../../context/AuthProvider';
import TaskCard from './TaskCard';

const MyTasks = () => {
    const { user } = useContext(AuthContext);

    const { data: tasks, isLoading, refetch } = useQuery({
        queryKey: ['tasks'], queryFn: async () => {
            const response = await fetch(`https://g-task-server.vercel.app/tasks?userid=${user.uid}`);
            return response.json()
        }
    })
    if (isLoading) return <LoadingSpinner></LoadingSpinner>;


    //delete api
    const handleTaskDelete = (_id) => {
        fetch(`https://g-task-server.vercel.app/task?id=${_id}`, {
            method: "DELETE"
        })
            .then(res => res.json())
            .then(data => {
                // console.log(data);
                if (data.acknowledged && data.deletedCount === 1) {
                    refetch();
                    toast.success('Task Deleted')
                }
            })
    }




    //unequal heights
    let tasks_column_1 = [];
    let tasks_column_2 = [];
    let tasks_column_3 = [];
    let tasks_count_row_1 = 0;
    let tasks_count_row_2 = 0;
    let tasks_count_row_3 = 0;
    for (let i = 0; i < tasks.length; i++) {
        if (tasks_count_row_2 < tasks_count_row_1) {
            tasks_column_2.push(tasks[i]);
            tasks_count_row_2++;
            continue;
        }
        if (tasks_count_row_3 < tasks_count_row_2) {
            tasks_column_3.push(tasks[i]);
            tasks_count_row_3++;
            continue;
        }
        tasks_column_1.push(tasks[i]);
        tasks_count_row_1++;
    }


    return (
        <div className='my-5'>
            <h2 className='text-center text-2xl font-semibold mb-5 dark:text-white'>My Tasks</h2>

            {/* <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5'>
                {
                    tasks.map(task => <TaskCard
                        key={task._id}
                        task={task}
                        handleTaskDelete={handleTaskDelete}
                    ></TaskCard>)
                }
            </div> */}

            {/* unequal heights*/}
            <div className='flex flex-wrap gap-y-5'>
                <div className='w-full md:w-1/2 lg:w-1/3 flex flex-col gap-5 px-2'>
                    {
                        tasks_column_1.map(task => <TaskCard
                            key={task._id}
                            task={task}
                            handleTaskDelete={handleTaskDelete}
                            refetch={refetch}
                        ></TaskCard>)
                    }
                </div>
                <div className='w-full md:w-1/2 lg:w-1/3 flex flex-col gap-5 px-2'>
                    {
                        tasks_column_2.map(task => <TaskCard
                            key={task._id}
                            task={task}
                            handleTaskDelete={handleTaskDelete}
                            refetch={refetch}
                        ></TaskCard>)
                    }
                </div>
                <div className='w-full md:w-1/2 lg:w-1/3 flex flex-col gap-5 px-2'>
                    {
                        tasks_column_3.map(task => <TaskCard
                            key={task._id}
                            task={task}
                            handleTaskDelete={handleTaskDelete}
                            refetch={refetch}
                        ></TaskCard>)
                    }
                </div>
            </div>

        </div >
    );
};

export default MyTasks;