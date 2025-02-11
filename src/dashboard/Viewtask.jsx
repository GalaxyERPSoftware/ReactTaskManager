import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaUserFriends, FaUserAlt } from "react-icons/fa";
import Forminfo from "./Edit";
import { ToastContainer } from "react-toastify";
import { LuNotebookPen } from "react-icons/lu";
import { AiOutlineFundView } from "react-icons/ai";
import { RiDashboardHorizontalFill } from "react-icons/ri";
import { BiWallet } from "react-icons/bi";
import { MdOutlineLogout } from "react-icons/md";
import 'react-toastify/dist/ReactToastify.css';
import './deshboard.css';
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import config from "./Config";
// import { AiOutlineFundView } from "react-icons/ai";

const Viewtask = () => {
    const [userData, setUserData] = useState(null);
    const [userFirstName, setUserFirstName] = useState("");
    const [userLastName, setUserLastName] = useState("");
    const [userRole, setUserRole] = useState(""); // State for role
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedTask, setSelectedTask] = useState(null);
    const [selectedTaskIds, setSelectedTaskIds] = useState([]);
        // const [userRole, setUserRole] = useState(""); // State for role
    
    const [status, setStatus] = useState(null);
    const [filteredTasks, setFilteredTasks] = useState([]);
    const [taskFilter, setTaskFilter] = useState('1');
    const [showActionColumns, setShowActionColumns] = useState(true);
    const [todayDate, setTodayDate] = useState(""); // Added for today's date
    const [startDate, setStartDate] = useState(''); // New state for start date
    const [endDate, setEndDate] = useState(''); // New state for end date
    const [fromDate, setFromDate] = useState(() => {
        const today = new Date().toISOString().split("T")[0];
        return today;
    });
    const [toDate, setToDate] = useState(() => {
        const today = new Date().toISOString().split("T")[0];
        return today;
    });
//     const [fromDate, setFromDate] = useState(todayDate); // Initialize with the current date
// const [toDate, setToDate] = useState(todayDate); // Initialize with the current date
    const navigate = useNavigate();
    // Fetch tasks from the API
    const fetchTasks = () => {
        const storedUser = localStorage.getItem("user");
        const token = localStorage.getItem("accesstoken");
        if (!token) {
            console.error("Missing user data or token in localStorage.");
            setTimeout(() => {
                navigate('/');
            }, 0);
            return;
        }
        if (storedUser) {
            const userData = JSON.parse(storedUser);
            const params = new FormData();
            params.set("companyid", userData.User.CompanyId);
            params.set("userloginid", userData.User.UserLoginId);
            // params.set("fromdate", userData.User.UserLoginId);
            // params.set("todate", userData.User.UserLoginId);
               // Add fromdate and todate to params
            // params.set("fromdate", "2025-02-05");
            // params.set("todate", "2025-02-05");
            if (fromDate && toDate) {
                params.set("fromdate", formatDate(fromDate));
                params.set("todate", formatDate(toDate));
            } else {
                console.error("Both 'fromdate' and 'todate' are required.");
                return;
            }
            setLoading(true);
             // Add date filter if startDate or endDate is set
             if (startDate) params.set("startDate", startDate);
             if (endDate) params.set("endDate", endDate);

            if (status) {
                params.set("status", status);
            }
            setLoading(true);
            axios.post(`${config.BASE_URL}/Task/gettask`, params, {
                    headers: {
                        accesstokenkey: token,
                        "Content-Type": "application/json",
                    },
                })
                .then((response) => {
                    if (response.data && response.data.Task) {
                        setTasks(response.data.Task);
                        setFilteredTasks(response.data.Task);
                        // console.log(response.data);
                        

                    } else {
                        console.error("No tasks found:", response?.data?.message || "Unknown error");

                    }
                })
                .catch((error) => {
                    if (error.response) {
                        setTimeout(() => {
                            localStorage.clear();
                            navigate('/');
                        }, 0);
                    }
                    else { }
                })
                .finally(() => {
                    setLoading(false);
                });
        }
    };
    const formatDate = (date) => {
        if (date) {
            const d = new Date(date);
            return d.toISOString().split("T")[0];
        }
        return "";
    };
    useEffect(() => {
        if (fromDate && toDate) {
            fetchTasks();
        }
    }, [fromDate, toDate]);
    useEffect(() => {
        fetchTasks();
    }, [startDate, endDate]);
        // Handle date changes
        const handleStartDateChange = (e) => {
            setStartDate(e.target.value);
        };
        const handleEndDateChange = (e) => {
            setEndDate(e.target.value);
        };
    // Effect to fetch user data from local storage
    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem("user"));
        // Check if user data exists and set states
        if (userData && userData.User) {
            setUserFirstName(userData.User.ul_FirstName);
            setUserLastName(userData.User.ul_LastName);
            setUserRole(userData.User.ul_Role); // Set role
        }
    }, []);
    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        const userData = storedUser ? JSON.parse(storedUser) : null;
        if (userData) {
            const userLoginId = userData.User.UserLoginId;
            // Set default to "My Task" (tasks assigned to the logged-in user)
            const myTasks = tasks.filter((task) => task.AssignToId === userLoginId);
            setFilteredTasks(myTasks); // Set initial filter state
            setShowActionColumns(true); // Show action columns for "My Task"
        }
    }, [tasks]); // Runs when tasks are fetched
    // Fetch tasks when the component mounts or filters change
    useEffect(() => {
        fetchTasks();
    }, [status]);
    // Handle status change
    const handleTaskChange = (value) => {
        const storedUser = localStorage.getItem("user");
        const userData = storedUser ? JSON.parse(storedUser) : null;
        if (userData) {
            const userLoginId = userData.User.UserLoginId;
            let taskFiltered = [];
            if (value === '1') {
                taskFiltered = tasks; // All tasks
                setShowActionColumns(false);
            } else if (value === '2') {
                taskFiltered = tasks.filter((task) => task.AssignToId === userLoginId); // Assigned tasks
                setShowActionColumns(true);
            } else if (value === '3') {
                taskFiltered = tasks.filter((task) => task.CreatedById === userLoginId); // Attended tasks
                setShowActionColumns(false); // Hide columns for value 3
            }
            setFilteredTasks(taskFiltered);
        }
    };
    // Apply both status and task filters to update the filtered tasks
    useEffect(() => {
        let filtered = tasks;
        // Filter by task type (assigned to user, created by user, etc.)
        if (taskFilter === '1') {
            filtered = tasks;
        } else if (taskFilter === '2') {
            const storedUser = localStorage.getItem("user");
            const userData = storedUser ? JSON.parse(storedUser) : null;
            if (userData) {
                const userLoginId = userData.User.UserLoginId;
                filtered = tasks.filter((task) => task.AssignToId === userLoginId);
            }
        } else if (taskFilter === '3') {
            const storedUser = localStorage.getItem("user");
            const userData = storedUser ? JSON.parse(storedUser) : null;
            if (userData) {
                const userLoginId = userData.User.UserLoginId;
                filtered = tasks.filter((task) => task.CreatedBy === userLoginId);
            }
        }
        // Filter by status (pending, in-progress, etc.)
    }, [status, taskFilter, tasks]);
    const handleCheckboxChange = (taskId) => {
        setSelectedTaskIds((prevSelected) => {
            if (prevSelected.includes(taskId)) {
                return prevSelected.filter((id) => id !== taskId);
            } else {
                return [...prevSelected, taskId];
            }
        });
    };
    // Handle task done logic
    const handleDone = (task) => {
        if (!selectedTaskIds.includes(task.DailyTaskId)) {
            toast.warning("Please select the checkbox for this task before marking it as complete.");
            return;
        }
        if (task.Status !== "I") {
            toast.warning("Only tasks that are Inprogress can be marked as complete.");
            return;
        }
        const storedUser = localStorage.getItem("user");
        const token = localStorage.getItem("accesstoken");

        if (!storedUser || !token) {
            alert("User is not authenticated.");
            return;
        }
        const updateData = {
            updatetask: [
                {
                    dailytaskid: (task.DailyTaskId || "").toString(),
                    userloginid: (task.UserLoginId || "").toString(),
                    companyid: (task.CompanyId || "").toString(),
                    date: task.Date,
                    description: task.Description,
                    status: "C", // Update the status to Complete
                    companyclientid: (task.CompanyClientId || "").toString(),
                    attendbyid: (task.AttendById || "").toString(),
                    assigntoid: (task.AssignedToId || "").toString(),
                    sourceid: (task.SourceId || 0).toString(),
                    taskid: (task.TaskId || 0).toString(),
                    mode: task.Mode || "GEN",
                    remark: task.Remark,
                    clientusername: task.ClientUserName,
                    taskcatid: (task.TaskCatId || "").toString(),
                    priorityid: (task.PriorityId || "").toString(),
                },
            ],
        };
        axios
            .post(`${config.BASE_URL}/Task/updatetask`, updateData, {
                headers: {
                    accesstokenkey: token,
                },
            })
            .then((response) => {
                if (response.data && response.data.message === "Success") {
                    toast.success("Task marked as complete!");
                    setSelectedTaskIds((prev) => prev.filter((id) => id !== task.DailyTaskId)); // Remove the task from selected list
                    fetchTasks(); // Refresh the task list
                } else {
                    toast.error("Failed to update the task.");
                }
            })
            .catch((error) => {
                toast.error("An error occurred while updating the task.");
            });
    };

    const handleDelete = (DailyTaskId) => {
        const token = localStorage.getItem("accesstoken");
        const storedUser  = localStorage.getItem('user');
        const userData = storedUser  ? JSON.parse(storedUser ) : null; // Retrieve userData from local storage
    
        if (!userData) {
            toast.error("User  data not found.");
            return; // Exit if userData is null
        }
    
        if (!token) {
            toast.error("User  not authenticated.");
            return;
        }
    
        // Confirm deletion
        if (window.confirm("Are you sure you want to delete this task?")) {
            const params = {
                tasks: [
                    {
                        companyid: userData.User.CompanyId.toString(),
                        userloginid: userData.User.UserLoginId.toString(),
                        dailytaskid: DailyTaskId.toString(), // Correctly set the task ID
                    },
                ],
            };
    
            axios
                .post(`${config.BASE_URL}/Task/deletetask`, params, {
                    headers: {
                        accesstokenkey: token,
                        "Content-Type": "application/json",
                    }
                })
                .then((response) => {
                    if (response.data && response.data.message === "Success") {
                        toast.success("Task deleted successfully!");
                        fetchTasks(); // Refresh task list after deletion
                    } else {
                        toast.error("Failed to delete the task.");
                    }
                })
                .catch((error) => {
                    toast.error("An error occurred while deleting the task.");
                });
        }
    };
    
    const handleEdit = (task) => {setSelectedTask(task);};
    const handleCloseModal = () => { setSelectedTask(null); };
    const addtask = () => { navigate('/addtask') }
    const viewtask = () => { navigate('/viewtask') }
    const dailytask = () => { navigate('/dailytask'); };
    const userview = () => { navigate('/userview'); };
    const dashboard = () => { navigate('/dashboard'); }
    const handleprofile = () => navigate('/profile');
    const leaveview = () => navigate('/leave'); 
    const handleLogout = () => {
        localStorage.clear();
        navigate('/');
    };
    const handleStatusChange = (value) => {
        let statusFiltered = [];
        // Filter tasks based on the selected status
        if (value === '1') {
            statusFiltered = tasks; // Show all tasks if "All" is selected
        } else if (value === '3') {
            statusFiltered = tasks.filter((task) => task.Status.toLowerCase() === 'p'); // Pending tasks
        } else if (value === '2') {
            statusFiltered = tasks.filter((task) => task.Status.toLowerCase() === 'i'); // In-progress tasks
        } else if (value === '4') {
            statusFiltered = tasks.filter((task) => task.Status.toLowerCase() === 'c'); // Completed tasks
        }
        // Update the filtered tasks state
        setFilteredTasks(statusFiltered);
    };
    return (
        <>
            <div className="desh-main">
                <div className="desh-inner-main">
                    <div className="desh-child">
                        <div className="desh-inner-child">
                            <div className="desh-logo">
                                <img src="/assets/img/Galaxy.png" alt="" />
                                <div className="user-info">
                                {userFirstName && userLastName ? (
                                <span>
                                    {userFirstName} {userLastName} 
                                </span>
                                ) : (
                                    <p>No user data found.</p>
                                )}
                                </div>
                            </div>
                            <div className="desh-btns">
                                <div className="desh-btn">
                                    <button className='dailytaskbtn' onClick={dashboard}><RiDashboardHorizontalFill className="icon-task" /><span className="dash-task">Dashboard</span></button>
                                </div>
                                <div className="desh-btn">
                                    <button onClick={addtask} ><LuNotebookPen className="icon-task" /><span className="dash-task">Add Task</span></button>
                                </div>
                                <div className="desh-btn">
                                    <button className='viewtaskbtn' onClick={viewtask}><AiOutlineFundView className="icon-task" /><span className="dash-task">View Task</span></button>
                                </div>
                                <div className="desh-btn">
                                    <button className='dailytaskbtn' onClick={dailytask}><BiWallet className="icon-task" /><span className="dash-task">Daily Task</span></button>
                                </div>
                                <div className="desh-btn">
                                    <button className='dailytaskbtn' onClick={userview}><FaUserFriends className="icon-task" /><span className="dash-task">User</span></button>
                                </div>
                                {userRole === "admin" && (
                                <div className="desh-btn">
                                    <button className='dailytaskbtn' onClick={leaveview}><FaUserFriends className="icon-task" /><span className="dash-task">LeaveRequest</span></button>
                                </div>
                                )}
                            </div>
                            <p className="version-main">V 1.0.4</p>
                            <div className="log-out-new">
                                <button className="btn-profile" onClick={handleprofile}><FaUserAlt className="icon-pro" /></button>
                                <button onClick={handleLogout} className="btn-3" title="logout"><MdOutlineLogout className="log-out-icon" /></button>
                            </div>
                        </div>
                    </div>

                    <div className="desh-child">
                        <div className="desh-inner-child">
                            <div className="all-divs">
                                <p  style={{marginBottom:'20px',fontWeight:'600',fontSize:'22px',display:'inline-block'}} data-discover="true">View Task</p>
                                <div className="viewtask-main-page">
                                    
                                    <div className="view-task-main-inner">
                                        
                                        <div className="main-div-date-info">
                                        <div className="main-div-date-info">
                                            <div className="inner">
                                                <label htmlFor="fromdate-input">From Date:</label>
                                                <input
                                                    type="date"
                                                    id="fromdate-input"
                                                    className="custom-date-input"
                                                    value={fromDate}
                                                    onChange={(e) => setFromDate(e.target.value)}
                                                />
                                            </div>
                                            <div className="inner">
                                                <label htmlFor="todate-input">To Date:</label>
                                                <input
                                                    type="date"
                                                    id="todate-input"
                                                    className="custom-date-input"
                                                    value={toDate}
                                                    onChange={(e) => setToDate(e.target.value)}
                                                />
                                            </div>
                                        </div>

                                            <div className="inner" id="last-inner">
                                                <label>Tasks</label>
                                                <select id="status-select-1" className="custom-select-view" onChange={(e) => handleTaskChange(e.target.value)} defaultValue="2">
                                                    <option value="1">All</option>
                                                    <option value="2">My Task</option>
                                                    <option value="3">Created By Me</option>
                                                </select>
                                            </div>
                                            <div className="inner" id="last-inner">
                                                <label>Status</label>
                                                <select id="status-select-1" className="custom-select-view" onChange={(e) => handleStatusChange(e.target.value)}>
                                                    <option value="1">All</option>
                                                    <option value="3">Pending</option>
                                                    <option value="2">In Progress</option>
                                                    <option value="4">Completed</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="main-div-table">
                                        <div className="main-table-inner">
                                            {loading ? (
                                                <p>Loading tasks...</p>
                                            ) : filteredTasks.length > 0 ? (
                                                <table border={3}>
                                                    <thead>
                                                        <tr>
                                                            <th>Index</th>
                                                            {showActionColumns && <th>Check</th>}
                                                            <th>Date</th>
                                                            <th>Status</th>
                                                            <th>Created By</th>
                                                            <th>Assign To</th>
                                                            <th>Client Name</th>
                                                            <th>Client-user name</th>
                                                            <th className="des-view">Description</th>
                                                            <th>Priority</th>
                                                            <th>Category</th>
                                                            <th>Remark</th>
                                                            {showActionColumns && <th>Action</th>}
                                                            {userRole === "admin" && (
                                                            <th>Delete</th> 
                                                            )}
                                                            {showActionColumns && <th>Done</th>} 
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {filteredTasks.map((task, index) => (
                                                            <tr key={task.DailyTaskId}>
                                                                <td>{index + 1}</td>
                                                                {showActionColumns && (
                                                                    <td><input type="checkbox" checked={selectedTaskIds.includes(task.DailyTaskId)} onChange={() => handleCheckboxChange(task.DailyTaskId)} disabled={task.Status !== "I"} /></td>
                                                                )}
                                                                <td>{task.Date}</td>
                                                                <td>
                                                                    {task.Status === "P"
                                                                        ? "Pending"
                                                                        : task.Status === "I"
                                                                            ? "In Progress"
                                                                            : task.Status}
                                                                </td>
                                                                <td>{task.CreatedByFirstName.toUpperCase()}  {task.CreatedByLastName.toUpperCase()}</td>
                                                                <td>{task.AssignToFirstName.toUpperCase()}  {task.AssignToLastName.toUpperCase()}</td>
                                                                <td>{task.ClientName}</td>
                                                                <td>{task.ClientUserName}</td>
                                                                <td>{task.Description}</td>
                                                                <td>{task.TaskPriorityName}</td>
                                                                <td>{task.TaskCategoryName}</td>
                                                                <td>{task.Remark}</td>
                                                                {showActionColumns && (
                                                                    <td><button onClick={() => handleEdit(task)} className="forminfo-btn">Edit</button></td>
                                                                )}
                                                                {userRole === "admin" &&(
                                                                <td> 
                                                                    <button className="forminfo-btn" onClick={() => handleDelete(task.DailyTaskId)} disabled={task.Status === "C"}> {/* Only enable delete for non-completed tasks */}
                                                                        Delete
                                                                    </button>
                                                                </td>
                                                                )}
                                                                {showActionColumns && (
                                                                    <td>
                                                                        <button className="forminfo-btn" onClick={() => handleDone(task)} disabled={task.Status !== "I"}> Done </button>
                                                                    </td>
                                                                )} 
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            ) : (
                                                <p>No tasks available to display.</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {selectedTask && (
                <Forminfo
                    task={selectedTask}
                    status={selectedTask.Status}
                    onClose={handleCloseModal}
                    onUpdate={fetchTasks}
                />
            )}
            <ToastContainer />
        </>
    );
};
export default Viewtask;













// --------------default today date--------------
// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import { FaUserFriends, FaUserAlt } from "react-icons/fa";
// import Forminfo from "./Edit";
// import { ToastContainer } from "react-toastify";
// import { LuNotebookPen } from "react-icons/lu";
// import { AiOutlineFundView } from "react-icons/ai";
// import { RiDashboardHorizontalFill } from "react-icons/ri";
// import { BiWallet } from "react-icons/bi";
// import { MdOutlineLogout } from "react-icons/md";
// import 'react-toastify/dist/ReactToastify.css';
// import './deshboard.css';
// import { toast } from "react-toastify";
// import 'react-toastify/dist/ReactToastify.css';
// import config from "./Config";

// const Viewtask = () => {
//     const [userFirstName, setUserFirstName] = useState("");
//     const [userLastName, setUserLastName] = useState("");
//     const [tasks, setTasks] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [selectedTask, setSelectedTask] = useState(null);
//     const [selectedTaskIds, setSelectedTaskIds] = useState([]);
//     const [status, setStatus] = useState(null);
//     const [filteredTasks, setFilteredTasks] = useState([]);
//     const [taskFilter, setTaskFilter] = useState('1');
//     const [showActionColumns, setShowActionColumns] = useState(true);
//     const [todayDate, setTodayDate] = useState(""); // Added for today's date
//     const navigate = useNavigate();

//     // Fetch tasks from the API
//     const fetchTasks = () => {
//         const storedUser = localStorage.getItem("user");
//         const token = localStorage.getItem("accesstoken");

//         if (!token) {
//             console.error("Missing user data or token in localStorage.");
//             setTimeout(() => {
//                 navigate('/');
//             }, 0);
//             return;
//         }
//         if (storedUser) {
//             const userData = JSON.parse(storedUser);
//             const params = new FormData();
//             params.set("companyid", userData.User.CompanyId);
//             params.set("userloginid", userData.User.UserLoginId);

//             if (status) {
//                 params.set("status", status);
//             }

//             setLoading(true);
//             axios
//                 .post(`${config.BASE_URL}/Task/gettask`, params, {
//                     headers: {
//                         accesstokenkey: token,
//                         "Content-Type": "application/json",
//                     },
//                 })
//                 .then((response) => {
//                     if (response.data && response.data.Task) {
//                         setTasks(response.data.Task);
//                         setFilteredTasks(response.data.Task);
//                     } else {
//                         console.error("No tasks found:", response?.data?.message || "Unknown error");

//                     }
//                 })
//                 .catch((error) => {
//                     if (error.response) {
//                         setTimeout(() => {
//                             localStorage.clear();
//                             navigate('/');
//                         }, 0);
//                     }
//                     else { }
//                 })
//                 .finally(() => {
//                     setLoading(false);
//                 });
//         }
//     };
  
//     const formatDate = (date) => {
//         if (date) {
//             const d = new Date(date);
//             return d.toISOString().split("T")[0];
//         }
//         return "";
//     };
//     useEffect(() => {
//         const today = new Date();
//         const formattedDate = today.toISOString().split('T')[0];  // Format as 'yyyy-mm-dd'
//         setTodayDate(formattedDate);
//     }, []);
//     // Effect to fetch user data
//     useEffect(() => {
//         const userData = JSON.parse(localStorage.getItem("user"));
//         if (userData && userData.User) {
//             setUserFirstName(userData.User.ul_FirstName);
//             setUserLastName(userData.User.ul_LastName);
//         }
//     }, []);
//     useEffect(() => {
//         const storedUser = localStorage.getItem("user");
//         const userData = storedUser ? JSON.parse(storedUser) : null;

//         if (userData) {
//             const userLoginId = userData.User.UserLoginId;

//             // Set default to "My Task" (tasks assigned to the logged-in user)
//             const myTasks = tasks.filter((task) => task.AssignToId === userLoginId);
//             setFilteredTasks(myTasks); // Set initial filter state
//             setShowActionColumns(true); // Show action columns for "My Task"
//         }
//     }, [tasks]); // Runs when tasks are fetched
//     // Fetch tasks when the component mounts or filters change
//     useEffect(() => {
//         fetchTasks();
//     }, [status]);
//     // Handle status change
//     const handleTaskChange = (value) => {
//         const storedUser = localStorage.getItem("user");
//         const userData = storedUser ? JSON.parse(storedUser) : null;

//         if (userData) {
//             const userLoginId = userData.User.UserLoginId;
//             let taskFiltered = [];
//             if (value === '1') {
//                 taskFiltered = tasks; // All tasks
//                 setShowActionColumns(false);
//             } else if (value === '2') {
//                 taskFiltered = tasks.filter((task) => task.AssignToId === userLoginId); // Assigned tasks
//                 setShowActionColumns(true);
//             } else if (value === '3') {
//                 taskFiltered = tasks.filter((task) => task.CreatedById === userLoginId); // Attended tasks
//                 setShowActionColumns(false); // Hide columns for value 3
//             }
//             setFilteredTasks(taskFiltered);
//         }
//     };
//     // Apply both status and task filters to update the filtered tasks
//     useEffect(() => {
//         let filtered = tasks;
//         // Filter by task type (assigned to user, created by user, etc.)
//         if (taskFilter === '1') {
//             filtered = tasks;
//         } else if (taskFilter === '2') {
//             const storedUser = localStorage.getItem("user");
//             const userData = storedUser ? JSON.parse(storedUser) : null;
//             if (userData) {
//                 const userLoginId = userData.User.UserLoginId;
//                 filtered = tasks.filter((task) => task.AssignToId === userLoginId);
//             }
//         } else if (taskFilter === '3') {
//             const storedUser = localStorage.getItem("user");
//             const userData = storedUser ? JSON.parse(storedUser) : null;
//             if (userData) {
//                 const userLoginId = userData.User.UserLoginId;
//                 filtered = tasks.filter((task) => task.CreatedBy === userLoginId);
//             }
//         }
//         // Filter by status (pending, in-progress, etc.)
//         if (status === "1") {
//             setFilteredTasks(filtered); // All tasks
//         } else if (status === "3") {
//             setFilteredTasks(filtered.filter((task) => task.Status.toLowerCase() === 'p')); // Pending tasks
//         } else if (status === "2") {
//             setFilteredTasks(filtered.filter((task) => task.Status.toLowerCase() === 'i')); // In-progress tasks
//         } else if (status === "4") {
//             setFilteredTasks(filtered.filter((task) => task.Status.toLowerCase() === 'c')); // Completed tasks
//         }

//     }, [status, taskFilter, tasks]);
//     // Handle selecting task checkboxes
//     const handleCheckboxChange = (taskId) => {
//         setSelectedTaskIds((prevSelected) => {
//             if (prevSelected.includes(taskId)) {
//                 return prevSelected.filter((id) => id !== taskId);
//             } else {
//                 return [...prevSelected, taskId];
//             }
//         });
//     };
//     // Handle task done logic
//     const handleDone = (task) => {
//         if (!selectedTaskIds.includes(task.DailyTaskId)) {
//             toast.warning("Please select the checkbox for this task before marking it as complete.");
//             return;
//         }
//         if (task.Status !== "I") {
//             toast.warning("Only tasks that are Inprogress can be marked as complete.");
//             return;
//         }
//         const storedUser = localStorage.getItem("user");
//         const token = localStorage.getItem("accesstoken");

//         if (!storedUser || !token) {
//             alert("User is not authenticated.");
//             return;
//         }
//         const updateData = {
//             updatetask: [
//                 {
//                     dailytaskid: (task.DailyTaskId || "").toString(),
//                     userloginid: (task.UserLoginId || "").toString(),
//                     companyid: (task.CompanyId || "").toString(),
//                     date: task.Date,
//                     description: task.Description,
//                     status: "C", // Update the status to Complete
//                     companyclientid: (task.CompanyClientId || "").toString(),
//                     attendbyid: (task.AttendById || "").toString(),
//                     assigntoid: (task.AssignedToId || "").toString(),
//                     sourceid: (task.SourceId || 0).toString(),
//                     taskid: (task.TaskId || 0).toString(),
//                     mode: task.Mode || "GEN",
//                     remark: task.Remark,
//                     clientusername: task.ClientUserName,
//                     taskcatid: (task.TaskCatId || "").toString(),
//                     priorityid: (task.PriorityId || "").toString(),
//                 },
//             ],
//         };
//         axios
//             .post(`${config.BASE_URL}/Task/updatetask`, updateData, {
//                 headers: {
//                     accesstokenkey: token,
//                 },
//             })
//             .then((response) => {
//                 if (response.data && response.data.message === "Success") {
//                     toast.success("Task marked as complete!");
//                     setSelectedTaskIds((prev) => prev.filter((id) => id !== task.DailyTaskId)); // Remove the task from selected list
//                     fetchTasks(); // Refresh the task list
//                 } else {
//                     toast.error("Failed to update the task.");
//                 }
//             })
//             .catch((error) => {
//                 toast.error("An error occurred while updating the task.");
//             });
//     };
//     const handleEdit = (task) => {setSelectedTask(task);};
//     const handleCloseModal = () => { setSelectedTask(null); };
//     const addtask = () => { navigate('/addtask') }
//     const viewtask = () => { navigate('/viewtask') }
//     const dailytask = () => { navigate('/dailytask'); };
//     const userview = () => { navigate('/user'); };
//     const dashboard = () => { navigate('/dashboard'); }
//     const handleprofile = () => navigate('/profile');
//     const handleLogout = () => {
//         localStorage.clear();
//         navigate('/');
//     };
//     return (
//         <>
//             <div className="desh-main">
//                 <div className="desh-inner-main">
//                     <div className="desh-child">
//                         <div className="desh-inner-child">
//                             <div className="desh-logo">
//                                 <img src="/assets/img/Galaxy.png" alt="" />
//                                 <div className="user-info">
//                                     {userFirstName && userLastName ? (
//                                         <span>
//                                             {userFirstName} {userLastName}
//                                         </span>
//                                     ) : (
//                                         <p>No user data found.</p>
//                                     )}
//                                 </div>
//                             </div>
//                             <div className="desh-btns">
//                                 <div className="desh-btn">
//                                     <button className='dailytaskbtn' onClick={dashboard}><RiDashboardHorizontalFill className="icon-task" /><span className="dash-task">Dashboard</span></button>
//                                 </div>
//                                 <div className="desh-btn">
//                                     <button onClick={addtask} ><LuNotebookPen className="icon-task" /><span className="dash-task">Add Task</span></button>
//                                 </div>
//                                 <div className="desh-btn">
//                                     <button className='viewtaskbtn' onClick={viewtask}><AiOutlineFundView className="icon-task" /><span className="dash-task">View Task</span></button>
//                                 </div>
//                                 <div className="desh-btn">
//                                     <button className='dailytaskbtn' onClick={dailytask}><BiWallet className="icon-task" /><span className="dash-task">Daily-task</span></button>
//                                 </div>
//                                 <div className="desh-btn">
//                                     <button className='dailytaskbtn' onClick={userview}><FaUserFriends className="icon-task" /><span className="dash-task">User</span></button>
//                                 </div>
//                             </div>
//                             <p className="version-main">V 1.0.2</p>
//                             <div className="log-out-new">
//                                 <button className="btn-profile" onClick={handleprofile}><FaUserAlt className="icon-pro" /></button>
//                                 <button onClick={handleLogout} className="btn-3" title="logout"><MdOutlineLogout className="log-out-icon" /></button>
//                             </div>
//                         </div>
//                     </div>

//                     <div className="desh-child">
//                         <div className="desh-inner-child">
//                             <div className="all-divs">
//                                 <div className="viewtask-main-page">
//                                     <div className="view-task-main-inner">
//                                         <div className="main-div-date-info">
//                                             <div className="inner">
//                                                 <label htmlFor="">From Date:</label>
//                                                 <input type="date" defaultValue={todayDate} />
//                                             </div>
//                                             <div className="inner">
//                                                 <label htmlFor="">To Date:</label>
//                                                 <input type="date" defaultValue={todayDate} />
//                                             </div>
//                                             <div className="inner" id="last-inner">
//                                                 <label>Tasks</label>
//                                                 <select id="status-select-1" className="custom-select-view" onChange={(e) => handleTaskChange(e.target.value)} defaultValue="2">
//                                                     <option value="1">All</option>
//                                                     <option value="2">My Task</option>
//                                                     <option value="3">Created By Me</option>
//                                                 </select>
//                                             </div>
//                                             <div className="inner" id="last-inner">
//                                                 <label>Status</label>
//                                                 <select id="status-select-1" className="custom-select-view" onChange={(e) => handleTaskChange(e.target.value)}>
//                                                     <option value="1">All</option>
//                                                     <option value="3">Pending</option>
//                                                     <option value="2">In Progress</option>
//                                                     <option value="4">Completed</option>
//                                                 </select>
//                                             </div>
//                                         </div>
//                                     </div>
//                                     <div className="main-div-table">
//                                         <div className="main-table-inner">
//                                             {loading ? (
//                                                 <p>Loading tasks...</p>
//                                             ) : filteredTasks.length > 0 ? (
//                                                 <table border={3}>
//                                                     <thead>
//                                                         <tr>
//                                                             <th>Index</th>
//                                                             {showActionColumns && <th>Check</th>}
//                                                             <th>Date</th>
//                                                             <th>Status</th>
//                                                             <th>Created By</th>
//                                                             <th>Assign To</th>
//                                                             <th>Client Name</th>
//                                                             <th>Client-user name</th>
//                                                             <th className="des-view">Description</th>
//                                                             <th>Priority</th>
//                                                             <th>Category</th>
//                                                             <th>Remark</th>
//                                                             {showActionColumns && <th>Action</th>}
//                                                             {showActionColumns && <th>Done</th>}
//                                                         </tr>
//                                                     </thead>
//                                                     <tbody>
//                                                         {filteredTasks.map((task, index) => (
//                                                             <tr key={task.DailyTaskId}>
//                                                                 <td>{index + 1}</td>
//                                                                 {showActionColumns && (
//                                                                     <td><input type="checkbox" checked={selectedTaskIds.includes(task.DailyTaskId)} onChange={() => handleCheckboxChange(task.DailyTaskId)} disabled={task.Status !== "I"} /></td>
//                                                                 )}
//                                                                 <td>{task.Date}</td>
//                                                                 <td>
//                                                                     {task.Status === "P"
//                                                                         ? "Pending"
//                                                                         : task.Status === "I"
//                                                                             ? "In Progress"
//                                                                             : task.Status}
//                                                                 </td>
//                                                                 <td>{task.CreatedByFirstName.toUpperCase()}  {task.CreatedByLastName.toUpperCase()}</td>
//                                                                 <td>{task.AssignToFirstName.toUpperCase()}  {task.AssignToLastName.toUpperCase()}</td>
//                                                                 <td>{task.ClientName}</td>
//                                                                 <td>{task.ClientUserName}</td>
//                                                                 <td>{task.Description}</td>
//                                                                 <td>{task.TaskPriorityName}</td>
//                                                                 <td>{task.TaskCategoryName}</td>
//                                                                 <td>{task.Remark}</td>
//                                                                 {showActionColumns && (
//                                                                     <td><button onClick={() => handleEdit(task)} className="forminfo-btn">Edit</button></td>
//                                                                 )}
//                                                                 {showActionColumns && (
//                                                                     <td>
//                                                                         <button className="forminfo-btn" onClick={() => handleDone(task)} disabled={task.Status !== "I"}> Done </button>
//                                                                     </td>
//                                                                 )}
//                                                             </tr>
//                                                         ))}
//                                                     </tbody>
//                                                 </table>
//                                             ) : (
//                                                 <p>No tasks available to display.</p>
//                                             )}
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//             {selectedTask && (
//                 <Forminfo
//                     task={selectedTask}
//                     status={selectedTask.Status}
//                     onClose={handleCloseModal}
//                     onUpdate={fetchTasks}
//                 />
//             )}
//             <ToastContainer />
//         </>
//     );
// };
// export default Viewtask;






// ---------------------invalid date----------
// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import { FaUserFriends, FaUserAlt } from "react-icons/fa";
// import Forminfo from "./Edit";
// import { ToastContainer } from "react-toastify";
// import { LuNotebookPen } from "react-icons/lu";
// import { AiOutlineFundView } from "react-icons/ai";
// import { RiDashboardHorizontalFill } from "react-icons/ri";
// import { BiWallet } from "react-icons/bi";
// import { MdOutlineLogout } from "react-icons/md";
// import 'react-toastify/dist/ReactToastify.css';
// import './deshboard.css';
// import { toast } from "react-toastify";
// import 'react-toastify/dist/ReactToastify.css';
// import config from "./Config";

// const Viewtask = () => {
//     const [userFirstName, setUserFirstName] = useState("");
//     const [userLastName, setUserLastName] = useState("");
//     const [tasks, setTasks] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [selectedTask, setSelectedTask] = useState(null);
//     const [selectedTaskIds, setSelectedTaskIds] = useState([]);
//     const [status, setStatus] = useState(null);
//     const [filteredTasks, setFilteredTasks] = useState([]);
//     const [taskFilter, setTaskFilter] = useState('1');
//     const [showActionColumns, setShowActionColumns] = useState(true);
//     const [todayDate, setTodayDate] = useState(""); 
//     const [fromDate, setFromDate] = useState(""); // From Date
//     const [toDate, setToDate] = useState(""); // To Date
//     const navigate = useNavigate();

//     const fetchTasks = () => {
//         const storedUser = localStorage.getItem("user");
//         const token = localStorage.getItem("accesstoken");

//         if (!token) {
//             console.error("Missing user data or token in localStorage.");
//             setTimeout(() => {
//                 navigate('/');
//             }, 0);
//             return;
//         }
//         if (storedUser) {
//             const userData = JSON.parse(storedUser);
//             const params = new FormData();
//             params.set("companyid", userData.User.CompanyId);
//             params.set("userloginid", userData.User.UserLoginId);

//             if (status) {
//                 params.set("status", status);
//             }

//             setLoading(true);
//             axios
//                 .post(`${config.BASE_URL}/Task/gettask`, params, {
//                     headers: {
//                         accesstokenkey: token,
//                         "Content-Type": "application/json",
//                     },
//                 })
//                 .then((response) => {
//                     if (response.data && response.data.Task) {
//                         setTasks(response.data.Task);
//                         setFilteredTasks(response.data.Task);
//                     } else {
//                         console.error("No tasks found:", response?.data?.message || "Unknown error");
//                     }
//                 })
//                 .catch((error) => {
//                     if (error.response) {
//                         setTimeout(() => {
//                             localStorage.clear();
//                             navigate('/');
//                         }, 0);
//                     }
//                 })
//                 .finally(() => {
//                     setLoading(false);
//                 });
//         }
//     };

//     const formatDate = (date) => {
//         if (date) {
//             const d = new Date(date);
//             return d.toISOString().split("T")[0];
//         }
//         return "";
//     };

//     useEffect(() => {
//         const today = new Date();
//         const formattedDate = today.toISOString().split('T')[0]; 
//         setTodayDate(formattedDate);
//         setFromDate(formattedDate);  // Set default from date
//         setToDate(formattedDate);    // Set default to date
//     }, []);

//     useEffect(() => {
//         const userData = JSON.parse(localStorage.getItem("user"));
//         if (userData && userData.User) {
//             setUserFirstName(userData.User.ul_FirstName);
//             setUserLastName(userData.User.ul_LastName);
//         }
//     }, []);

//     useEffect(() => {
//         fetchTasks();
//     }, [status]);

//     const handleTaskChange = (value) => {
//         const storedUser = localStorage.getItem("user");
//         const userData = storedUser ? JSON.parse(storedUser) : null;

//         if (userData) {
//             const userLoginId = userData.User.UserLoginId;
//             let taskFiltered = [];
//             if (value === '1') {
//                 taskFiltered = tasks; 
//                 setShowActionColumns(false);
//             } else if (value === '2') {
//                 taskFiltered = tasks.filter((task) => task.AssignToId === userLoginId); 
//                 setShowActionColumns(true);
//             } else if (value === '3') {
//                 taskFiltered = tasks.filter((task) => task.CreatedById === userLoginId); 
//                 setShowActionColumns(false); 
//             }
//             setFilteredTasks(taskFiltered);
//         }
//     };

//     const handleDateFilter = () => {
//         let filtered = tasks;
//         if (fromDate && toDate) {
//             filtered = tasks.filter((task) => {
//                 const taskDate = new Date(task.Date).toISOString().split("T")[0];
//                 return taskDate >= fromDate && taskDate <= toDate;
//             });
//         }
//         setFilteredTasks(filtered);
//     };

//     useEffect(() => {
//         handleDateFilter(); // Apply date filtering whenever fromDate or toDate changes
//     }, [fromDate, toDate, tasks]);

//     const handleCheckboxChange = (taskId) => {
//         setSelectedTaskIds((prevSelected) => {
//             if (prevSelected.includes(taskId)) {
//                 return prevSelected.filter((id) => id !== taskId);
//             } else {
//                 return [...prevSelected, taskId];
//             }
//         });
//     };

//     const handleDone = (task) => {
//         if (!selectedTaskIds.includes(task.DailyTaskId)) {
//             toast.warning("Please select the checkbox for this task before marking it as complete.");
//             return;
//         }
//         if (task.Status !== "I") {
//             toast.warning("Only tasks that are Inprogress can be marked as complete.");
//             return;
//         }
//         const storedUser = localStorage.getItem("user");
//         const token = localStorage.getItem("accesstoken");

//         if (!storedUser || !token) {
//             alert("User is not authenticated.");
//             return;
//         }
//         const updateData = {
//             updatetask: [
//                 {
//                     dailytaskid: (task.DailyTaskId || "").toString(),
//                     userloginid: (task.UserLoginId || "").toString(),
//                     companyid: (task.CompanyId || "").toString(),
//                     date: task.Date,
//                     description: task.Description,
//                     status: "C", 
//                     companyclientid: (task.CompanyClientId || "").toString(),
//                     attendbyid: (task.AttendById || "").toString(),
//                     assigntoid: (task.AssignedToId || "").toString(),
//                     sourceid: (task.SourceId || 0).toString(),
//                     taskid: (task.TaskId || 0).toString(),
//                     mode: task.Mode || "GEN",
//                     remark: task.Remark,
//                     clientusername: task.ClientUserName,
//                     taskcatid: (task.TaskCatId || "").toString(),
//                     priorityid: (task.PriorityId || "").toString(),
//                 },
//             ],
//         };
//         axios
//             .post(`${config.BASE_URL}/Task/updatetask`, updateData, {
//                 headers: {
//                     accesstokenkey: token,
//                 },
//             })
//             .then((response) => {
//                 if (response.data && response.data.message === "Success") {
//                     toast.success("Task marked as complete!");
//                     setSelectedTaskIds((prev) => prev.filter((id) => id !== task.DailyTaskId)); 
//                     fetchTasks();
//                 } else {
//                     toast.error("Failed to update the task.");
//                 }
//             })
//             .catch((error) => {
//                 toast.error("An error occurred while updating the task.");
//             });
//     };

//     const handleEdit = (task) => { setSelectedTask(task); };
//     const handleCloseModal = () => { setSelectedTask(null); };

//     const addtask = () => { navigate('/addtask') }
//     const viewtask = () => { navigate('/viewtask') }
//     const dailytask = () => { navigate('/dailytask'); };
//     const userview = () => { navigate('/user'); };
//     const dashboard = () => { navigate('/dashboard'); }
//     const handleprofile = () => navigate('/profile');
//     const handleLogout = () => {
//         localStorage.clear();
//         navigate('/');
//     };

//     return (
//         <>
//             <div className="desh-main">
//                 <div className="desh-inner-main">
//                     <div className="desh-child">
//                         <div className="desh-inner-child">
//                             <div className="desh-logo">
//                                 <img src="/assets/img/Galaxy.png" alt="" />
//                                 <div className="user-info">
//                                     {userFirstName && userLastName ? (
//                                         <span>
//                                             {userFirstName} {userLastName}
//                                         </span>
//                                     ) : (
//                                         <p>No user data found.</p>
//                                     )}
//                                 </div>
//                             </div>
//                             <div className="desh-btns">
//                                 <div className="desh-btn">
//                                     <button className='dailytaskbtn' onClick={dashboard}><RiDashboardHorizontalFill className="icon-task" /><span className="dash-task">Dashboard</span></button>
//                                 </div>
//                                 <div className="desh-btn">
//                                     <button onClick={addtask}><LuNotebookPen className="icon-task" /><span className="dash-task">Add Task</span></button>
//                                 </div>
//                                 <div className="desh-btn">
//                                     <button className='viewtaskbtn' onClick={viewtask}><AiOutlineFundView className="icon-task" /><span className="dash-task">View Task</span></button>
//                                 </div>
//                                 <div className="desh-btn">
//                                     <button className='dailytaskbtn' onClick={dailytask}><BiWallet className="icon-task" /><span className="dash-task">Daily-task</span></button>
//                                 </div>
//                                 <div className="desh-btn">
//                                     <button className='dailytaskbtn' onClick={userview}><FaUserFriends className="icon-task" /><span className="dash-task">User</span></button>
//                                 </div>
//                             </div>
//                             <p className="version-main">V 1.0.2</p>
//                             <div className="log-out-new">
//                                 <button className="btn-profile" onClick={handleprofile}><FaUserAlt className="icon-pro" /></button>
//                                 <button onClick={handleLogout} className="btn-3" title="logout"><MdOutlineLogout className="log-out-icon" /></button>
//                             </div>
//                         </div>
//                     </div>

//                     <div className="desh-child">
//                         <div className="desh-inner-child">
//                             <div className="all-divs">
//                                 <div className="viewtask-main-page">
//                                     <div className="view-task-main-inner">
//                                         <div className="main-div-date-info">
//                                             <div className="inner">
//                                                 <label htmlFor="">From Date:</label>
//                                                 <input 
//                                                     type="date" 
//                                                     value={fromDate} 
//                                                     onChange={(e) => setFromDate(e.target.value)} 
//                                                 />
//                                             </div>
//                                             <div className="inner">
//                                                 <label htmlFor="">To Date:</label>
//                                                 <input 
//                                                     type="date" 
//                                                     value={toDate} 
//                                                     onChange={(e) => setToDate(e.target.value)} 
//                                                 />
//                                             </div>
//                                             <div className="inner" id="last-inner">
//                                                 <label>Tasks</label>
//                                                 <select id="status-select-1" className="custom-select-view" onChange={(e) => handleTaskChange(e.target.value)} defaultValue="2">
//                                                     <option value="1">All</option>
//                                                     <option value="2">My Task</option>
//                                                     <option value="3">Created By Me</option>
//                                                 </select>
//                                             </div>
//                                             <div className="inner" id="last-inner">
//                                                 <label>Status</label>
//                                                 <select id="status-select-1" className="custom-select-view" onChange={(e) => handleTaskChange(e.target.value)}>
//                                                     <option value="1">All</option>
//                                                     <option value="3">Pending</option>
//                                                     <option value="2">In Progress</option>
//                                                     <option value="4">Completed</option>
//                                                 </select>
//                                             </div>
//                                         </div>
//                                     </div>
//                                     <div className="main-div-table">
//                                         <div className="main-table-inner">
//                                             {loading ? (
//                                                 <p>Loading tasks...</p>
//                                             ) : filteredTasks.length > 0 ? (
//                                                 <table border={3}>
//                                                     <thead>
//                                                         <tr>
//                                                             <th>Index</th>
//                                                             {showActionColumns && <th>Check</th>}
//                                                             <th>Date</th>
//                                                             <th>Status</th>
//                                                             <th>Created By</th>
//                                                             <th>Assign To</th>
//                                                             <th>Client Name</th>
//                                                             <th>Client-user name</th>
//                                                             <th className="des-view">Description</th>
//                                                             <th>Priority</th>
//                                                             <th>Action</th>
//                                                         </tr>
//                                                     </thead>
//                                                     <tbody>
//                                                         {filteredTasks.map((task, index) => (
//                                                             <tr key={task.DailyTaskId}>
//                                                                 <td>{index + 1}</td>
//                                                                 {showActionColumns && (
//                                                                     <td>
//                                                                         <input
//                                                                             type="checkbox"
//                                                                             checked={selectedTaskIds.includes(task.DailyTaskId)}
//                                                                             onChange={() => handleCheckboxChange(task.DailyTaskId)}
//                                                                         />
//                                                                     </td>
//                                                                 )}
//                                                                 <td>{task.Date}</td>
//                                                                 <td>{task.Status}</td>
//                                                                 <td>{task.CreatedBy}</td>
//                                                                 <td>{task.AssignedTo}</td>
//                                                                 <td>{task.ClientName}</td>
//                                                                 <td>{task.ClientUserName}</td>
//                                                                 <td>{task.Description}</td>
//                                                                 <td>{task.Priority}</td>
//                                                                 <td>
//                                                                     <button onClick={() => handleEdit(task)}>Edit</button>
//                                                                     <button onClick={() => handleDone(task)}>Mark as Done</button>
//                                                                 </td>
//                                                             </tr>
//                                                         ))}
//                                                     </tbody>
//                                                 </table>
//                                             ) : (
//                                                 <p>No tasks found for the selected filters.</p>
//                                             )}
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//             <ToastContainer />
//         </>
//     );
// };

// export default Viewtask;