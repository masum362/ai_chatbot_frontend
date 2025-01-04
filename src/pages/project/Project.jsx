import React, { useState, useEffect, useContext } from 'react'
import { UserContext } from '../../context/user.context'
import { useNavigate, useLocation } from 'react-router-dom'
import useAxiosInstance from '../../config/useAxiosInstance'
import { initializeSocket, sendMessage } from '../../config/socket'





const Project = () => {
const axios = useAxiosInstance();
    const location = useLocation()

    const [isSidePanelOpen, setIsSidePanelOpen] = useState(false)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [selectedUserId, setSelectedUserId] = useState(new Set()) // Initialized as Set
    const [project, setProject] = useState(location.state.project)
    const [message, setMessage] = useState('')
    const { user } = useContext(UserContext)
    const [users, setUsers] = useState([])
    const [filteredUsers, setFilteredUsers] = useState([])

    const addCollaborators = async () => {
        try {
            const { data } = await axios.post(`/api/project/add-users`, { projectId: project._id, users: Array.from(selectedUserId) })
            console.log(data);
            setProject(data)
            setIsModalOpen(false)
        } catch (error) {
            console.log(error)
        }
    }

    const filteredUsersFunc = function () {
        const usersNotInProject = users.filter(user =>
            !project.users.some(projUser => projUser._id === user._id)
        );
        setFilteredUsers(usersNotInProject)

    }


    useEffect(() => {

        const getAllUsers = async (req, res) => {
            try {
                const { data: users } = await axios.get('/api/users/all')
                setUsers(users)
                filteredUsersFunc()
                return;
            } catch (error) {
                console.log(error)
            }
        }

        const fetchProject = async () => {
            try {
                const { data } = await axios.get(`/api/project/get-project/${project._id}`)
                setProject(data)
                // setSelectedUserId(new Set(data.users.map(user => user._id)))
                getAllUsers();
            } catch (error) {
                console.log(error)
            }
        }

        initializeSocket();
        fetchProject()
    }, [])


    const handleUserClick = (userId) => {
        console.log(userId);
        if (selectedUserId.has(userId)) {
            selectedUserId.delete(userId)
        } else {
            selectedUserId.add(userId)
        }
        setSelectedUserId(new Set(selectedUserId))
    }

    const send = () => {
        sendMessage('message', message);
    }



    return (
        <main className='h-screen w-screen flex'>
            <section className="left relative flex flex-col h-screen min-w-96 bg-slate-300">
                <header className='flex justify-between items-center p-2 px-4 w-full bg-slate-100 absolute z-10 top-0'>
                    <button className='flex gap-2' onClick={() => setIsModalOpen(true)}>
                        <i className="ri-add-fill mr-1"></i>
                        <p>Add collaborator</p>
                    </button>
                    <button onClick={() => setIsSidePanelOpen(!isSidePanelOpen)} className='p-2'>
                        <i className="ri-group-fill"></i>
                    </button>
                </header>
                <div className="conversation-area pt-14 pb-10 flex-grow flex flex-col h-full relative">


                    <div className="inputField w-full flex absolute bottom-0">
                        <input
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            className='p-2 px-4 border-none outline-none flex-grow' type="text" placeholder='Enter message' />
                        <button
                            onClick={send}
                            className='px-5 bg-slate-950 text-white'><i className="ri-send-plane-fill"></i></button>
                    </div>
                </div>
                <div className={`sidePanel w-full h-full flex flex-col gap-2 bg-slate-50 absolute transition-all ${isSidePanelOpen ? 'translate-x-0' : '-translate-x-full'} top-0`}>
                    <header className='flex justify-between items-center px-4 p-2 bg-slate-200'>

                        <h1
                            className='font-semibold text-lg'
                        >Collaborators</h1>

                        <button onClick={() => setIsSidePanelOpen(!isSidePanelOpen)} className='p-2'>
                            <i className="ri-close-fill"></i>
                        </button>
                    </header>
                    <div className="users flex flex-col gap-2">

                        {project.users && project.users.map(user => {


                            return (
                                <div className="user cursor-pointer hover:bg-slate-200 p-2 flex gap-2 items-center" key={user._id}>
                                    <div className='aspect-square rounded-full w-fit h-fit flex items-center justify-center p-5 text-white bg-slate-600'>
                                        <i className="ri-user-fill absolute"></i>
                                    </div>
                                    <h1 className='font-semibold text-lg'>{user.email}</h1>
                                </div>
                            )


                        })}
                    </div>
                </div>
            </section>

            <section className="right  bg-red-50 flex-grow h-full flex">

                <div className="explorer h-full max-w-64 min-w-52 bg-slate-200">
                    <div className="file-tree w-full">

                    </div>

                </div>


                <div className="code-editor flex flex-col flex-grow h-full shrink">

                    <div className="top flex justify-between w-full">

                        <div className="files flex">

                        </div>

                        <div className="actions flex gap-2">


                        </div>
                    </div>
                    <div className="bottom flex flex-grow max-w-full shrink overflow-auto">

                    </div>

                </div>




            </section>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-4 rounded-md w-96 max-w-full relative">
                        <header className='flex justify-between items-center mb-4'>
                            <h2 className='text-xl font-semibold'>Select User</h2>
                            <button onClick={() => setIsModalOpen(false)} className='p-2'>
                                <i className="ri-close-fill"></i>
                            </button>
                        </header>
                        <div className="users-list flex flex-col gap-2 mb-16 max-h-96 overflow-auto">
                            {


                                filteredUsers.map(user => (

                                    <div
                                        onClick={() => {
                                            handleUserClick(user._id)
                                        }}
                                        key={user._id}
                                        className={`user cursor-pointer p-2 flex gap-2 items-center ${selectedUserId.has(user._id) ? 'bg-slate-200' : ''}`}>
                                        <div className='aspect-square rounded-full w-fit h-fit flex items-center justify-center p-5 text-white bg-slate-600'>
                                            <i className="ri-user-fill absolute"></i>
                                        </div>
                                        <h1 className='font-semibold text-lg'>{user.email}</h1>
                                    </div>
                                ))
                            }
                        </div>
                        <button
                            onClick={addCollaborators}
                            className='absolute bottom-4 left-1/2 transform -translate-x-1/2 px-4 py-2 bg-blue-600 text-white rounded-md'>
                            Add Collaborators
                        </button>
                    </div>
                </div>
            )}
        </main>
    )
}

export default Project