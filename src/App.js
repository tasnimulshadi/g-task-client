import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import Main from './layout/Main/Main';
import MyTasks from './pages/MyTasks/MyTasks';
import AddTask from './pages/AddTask/AddTask';
import CompletedTask from './pages/CompletedTask/CompletedTask';
import EditTask from './pages/EditTask/EditTask';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import PrivateRoute from './route/PrivateRoute';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Main></Main>,
    children: [
      {
        path: '/',
        element: <PrivateRoute>
          <MyTasks></MyTasks>
        </PrivateRoute>,
      },
      {
        path: '/add',
        element: <PrivateRoute>
          <AddTask></AddTask>
        </PrivateRoute>,
      },
      {
        path: '/completed',
        element: <PrivateRoute>
          <CompletedTask></CompletedTask>
        </PrivateRoute>,
      },
      {
        path: '/edit/:id',
        element: <PrivateRoute>
          <EditTask></EditTask>
        </PrivateRoute>,
        loader: ({ params }) => fetch(`https://g-task-server.vercel.app/edit/${params.id}`)
      },
      {
        path: '/login',
        element: <Login></Login>,
      },
      {
        path: '/register',
        element: <Register></Register>,
      },
    ]
  }
])

function App() {
  return (
    <RouterProvider router={router}>
    </RouterProvider>
  );
}

export default App;
