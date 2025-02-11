import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { LuNotebookPen } from "react-icons/lu";
import { AiOutlineFundView } from "react-icons/ai";
import { BiWallet } from "react-icons/bi";
import { MdOutlineLogout } from "react-icons/md";
import { RiDashboardHorizontalFill } from "react-icons/ri";
import { FaUserAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { FaUserFriends } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
// import Dashboard from "./Dashboard";
import config from "./Config";

const Addtask = () => {
    const [userFirstName, setUserFirstName] = useState("");
    const [userLastName, setUserLastName] = useState("");
    const navigate = useNavigate();
    const today = new Date().toISOString().split('T')[0];
    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem("user"));
        if (userData && userData.User) {
            setUserFirstName(userData.User.ul_FirstName);
            setUserLastName(userData.User.ul_LastName);
        } else {
            console.error("User data is missing or invalid.");
        }
    }, []);

    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem("user"));
        if (userData && userData.User) {
            setUserRole(userData.User.ul_Role);  
        }
    }, []);
    const [userData, setUserData] = useState(null);
        const [userRole, setUserRole] = useState(""); // State for role
    
    const [accessToken, setAccessToken] = useState(null);
    const [clients, setClients] = useState([]);
    const [attendByUsers, setAttendByUsers] = useState([]);
    const [assignByUsers, setAssignByUsers] = useState([]);
    const [attendByUserLoginId, setAttendByUserLoginId] = useState(null); // New state
    const [assignByUserLoginId, setAssignByUserLoginId] = useState(null); // New state
    const [priorities, setPriorities] = useState([]); // State to store priorities
    const [taskCategories, setTaskCategories] = useState([]);// State for task categories

    const clientNameRef = useRef();
    const attendByRef = useRef();
    const assignToRef = useRef();
    const taskDateRef = useRef();
    const taskDescriptionRef = useRef();
    const taskRemarkRef = useRef();
    const clientUserRef = useRef();
    const taskPriorityRef = useRef();
    const taskCatagoryRef = useRef();
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const token = localStorage.getItem('accesstoken');
        if (!token) {
            console.error("Missing user data or token in localStorage.");
            setTimeout(() => {
                navigate('/');
            }, 0);
            return;
        }
        if (storedUser) {
            setUserData(JSON.parse(storedUser));
        }
        if (token) {
            setAccessToken(token);
        }
        if (storedUser) {
            const companyid = JSON.parse(storedUser).User.CompanyId;
            const params = new FormData();
            params.set("companyid", companyid);
            // Fetch clients data
            // axios.post('http://192.168.10.20:8082/api/Task/getclient', params, {
            axios.post(`${config.BASE_URL}/Task/getclient`, params, {
                headers: {
                    accesstokenkey: token,
                    "Content-Type": "application/json"
                }
            })
                .then((response) => {
                    if (response.data && response.data.Clients) {
                        setClients(response.data.Clients);
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
                });
            // Fetch Attend By users
            // axios.post('http://192.168.10.20:8082/api/UserLogin/getuserbycompanyid', params, {
            axios.post(`${config.BASE_URL}/UserLogin/getuserbycompanyid`, params, {
                headers: {
                    accesstokenkey: token,
                    "Content-Type": "application/json"
                }
            })
                .then((response) => {
                    if (response.data && response.data.Users ) {
                        const filteredUsers = response.data.Users.filter(user =>
                            user.ul_IsActive
                        );
                        setAttendByUsers(filteredUsers);
                        setAssignByUsers(filteredUsers);
                        const loggedInUserId = JSON.parse(storedUser).User.UserLoginId;
                        setAttendByUserLoginId(loggedInUserId);
                        setAssignByUserLoginId(loggedInUserId);
                    }
                })
                .catch((error) => {
                    console.error("Error fetching users:", error);
                });
            // Fetch priorities
            const miscParams = new FormData();
            // miscParams.set("companyid", companyid);
            miscParams.set("trantype", "Priority");
            const lowPriorityId = priorities.find(priority => priority.Name === "Low")?.MiscellaneousMstId;

            // axios.post('http://192.168.10.20:8082/api/Task/getmiscellaneous', miscParams, {
            axios.post(`${config.BASE_URL}/Task/getmiscellaneous`, miscParams, {
                headers: {
                    accesstokenkey: token,
                    "Content-Type": "application/json"
                }
            })
                .then((response) => {
                    if (response.data && response.data.Miscellaneous) {
                        setPriorities(response.data.Miscellaneous);
                    }
                })
                .catch((error) => {
                    console.error("Error fetching priorities:", error);
                });
            // Fetch task categories
            const taskCatParams = new FormData();
            // taskCatParams.set("companyid", companyid);
            taskCatParams.set("trantype", "TaskCat");
            // axios.post('http://192.168.10.20:8082/api/Task/getmiscellaneous', taskCatParams, {
            axios.post(`${config.BASE_URL}/Task/getmiscellaneous`, taskCatParams, {
                headers: {
                    accesstokenkey: token,
                    "Content-Type": "application/json"
                }
            })
                .then((response) => {
                    if (response.data && response.data.Miscellaneous) {
                        setTaskCategories(response.data.Miscellaneous);
                    }
                })
                .catch((error) => {
                    console.error("Error fetching task categories:", error);
                });
        }
    }, []);
    const handleSubmit = (e) => {
        e.preventDefault();
        const taskDateValue = taskDateRef.current.value;

        if (!taskDateValue) {
            toast.error("Please select a task date.");
            return;
        }

        const taskDate = new Date(taskDateValue);
        if (isNaN(taskDate.getTime())) {
            toast.error("Invalid task date.");
            return;
        }

        const formattedDate = new Date(taskDateRef.current.value).toISOString().split("T")[0];
        const clientId = clientNameRef.current.value;
        const attendById = attendByRef.current.value;
        const assignToId = assignToRef.current.value;
        const taskDesc = taskDescriptionRef.current.value;
        const taskRemark = taskRemarkRef.current.value;  // Not required
        const taskClient = clientUserRef.current.value; // Not required
        const taskPriority = taskPriorityRef.current.value;
        const taskCatagory = taskCatagoryRef.current.value;

        // Validate required fields
        if (!clientId || clientId === "") {
            toast.error("Please Select Client.");
            return;
        }
        if (!attendById || attendById === "") {
            toast.error("Please Select AttendBy.");
            return;
        }
        if (!assignToId || assignToId === "") {
            toast.error("Please Select AssignTo.");
            return;
        }
        if (!taskDesc || taskDesc === "") {
            toast.error("Please Enter Task Description.");
            return;
        }
        if (!taskPriority || taskPriority === "") {
            toast.error("Please Select Task Priority.");
            return;
        }
        if (!taskCatagory || taskCatagory === "") {
            toast.error("Please Select Task Category.");
            return;
        }
       
        const params = new FormData();
        params.set("companyid", userData.User.CompanyId);
        params.set("userloginid", userData.User.UserLoginId);
        params.set("date", formattedDate);
        params.set("clientid", clientId);
        params.set("attendbyid", attendById);
        params.set("assigntoid", assignToId);
        params.set("description", taskDesc);
        params.set("remark", taskRemark);  // Not required
        params.set("clientusername", taskClient);  // Not required
        params.set("priorityid", taskPriority);
        params.set("taskcatid", taskCatagory);

        const storedUser = localStorage.getItem('user');
        const token = localStorage.getItem('accesstoken');

        axios.post(`${config.BASE_URL}/Task/addtask`, params, {
            headers: {
                accesstokenkey: token,
                "Content-Type": "application/json",
            },
        })
            .then((response) => {
                if (response.data && response.data.success) {
                    toast.error("Task not added");
                    e.target.reset();
                } else {
                    toast.success("Task added successfully!"); // This is the success message
                    setAssignByUserLoginId(attendByUserLoginId);
                    clientNameRef.current.value = "";
                    attendByRef.current.value = "";
                    assignToRef.current.value = attendByUserLoginId;
                    taskDescriptionRef.current.value = "";
                    taskRemarkRef.current.value = "";
                    clientUserRef.current.value = "";
                    taskPriorityRef.current.value = "";
                    taskCatagoryRef.current.value = "";
                }
                setTimeout(() => {
                    navigate('/addtask');
                }, 500);
            })
            .catch((error) => {
                if (error.response) {
                    toast.error('Invalid Token', {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: false,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "dark",
                    });
                    setTimeout(() => {
                        localStorage.clear();
                        navigate('/');
                    }, 500);
                }
            });
    };

    

    const handleLogout = () => {
        localStorage.clear();
        navigate('/');
    };
    const addtask = () => { navigate('/addtask'); };
    const viewtask = () => { navigate('/viewtask'); };
    const dailytask = () => { navigate('/dailytask'); };
    const userview = () => { navigate('/userview'); };
    const dashboard = () => { navigate('/dashboard'); }
    const handleprofile = () => navigate('/profile');
    const leaveview = () => navigate('/leave');
    return (
        <>
            <div className="desh-main">
                <div className="desh-inner-main">
                    <div className="desh-child">
                        <div className="desh-inner-child">
                            <div className="desh-logo">
                                <img src="/assets/img/galaxy.png" alt="" />
                                <div className="user-info">
                                    {userFirstName && userLastName ? (
                                        <span>{userFirstName} {userLastName}</span>
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
                                    <button onClick={addtask}><LuNotebookPen className="icon-task" /><span className="dash-task">Add Task</span></button>
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
                                <div className="all-divs-main">
                                    <div className="form">
                                        <form onSubmit={handleSubmit} style={{ marginBottom: '30px' }}>
                                            <label htmlFor="taskDate">Task Date:</label>
                                            <input ref={taskDateRef} type="date" id="taskDate" name="taskDate" min={today} defaultValue={today} />
                                            <div className="one-parent">
                                                <div className="one-div">
                                                    <label htmlFor="clientName">Client Name:</label>
                                                    <select ref={clientNameRef} id="clientName" name="clientName">
                                                        <option value="">Select Client</option>
                                                        {clients.map((client) => (
                                                            <option key={client.CompanyClientId} value={client.CompanyClientId}>
                                                                {client.ClientName}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <div className="one-div">
                                                    <label htmlFor="clientUser">Client Username:</label>
                                                    <input type="text" ref={clientUserRef} spellCheck={"true"} id="clientUser" name="clientUser" placeholder="Enter Client User name" style={{ direction: 'left' }} className="select" />
                                                </div>
                                            </div>

                                            <div className="one-parent">
                                                <div className="one-div">
                                                    <label htmlFor="attendBy">Attend By:</label>
                                                    <select
                                                        ref={attendByRef}
                                                        id="attendBy"
                                                        name="attendBy"
                                                        value={attendByUserLoginId || ''}
                                                        disabled // This disables the dropdown
                                                    >
                                                        <option value={attendByUserLoginId}>
                                                            {userFirstName} {userLastName}
                                                        </option>
                                                    </select>
                                                </div>
                                                <div className="one-div">
                                                    {/* Assign By Dropdown */}
                                                    <label htmlFor="assignBy">Assign To:</label>
                                                    <select
                                                        ref={assignToRef}
                                                        id="assignBy"
                                                        name="assignBy"
                                                        value={assignByUserLoginId || ''} // Controlled value
                                                        onChange={(e) => setAssignByUserLoginId(e.target.value)} // Update state on change
                                                    >
                                                        <option value="">Select Assignee</option>
                                                        {assignByUsers.map((user) => (
                                                            <option key={user.UserLoginId} value={user.UserLoginId}>
                                                                {user.ul_FirstName} {user.ul_LastName}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>

                                            <div className="one-parent">
                                                <div className="one-div">
                                                    <label htmlFor="taskPriority">Priority:</label>
                                                    <select ref={taskPriorityRef} name="taskPriority" id="taskPriority">
                                                        <option value="">Select Priority</option>
                                                        {priorities.map((priority) => (
                                                            <option key={priority.MiscellaneousMstId} value={priority.MiscellaneousMstId}>
                                                                {priority.Name} {/* Showing priority name */}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>

                                                <div className="one-div">
                                                    <label htmlFor="taskCatagory">Task Category:</label>
                                                    <select ref={taskCatagoryRef}
                                                        name="taskCatagory"
                                                        id="taskCatagory">
                                                        <option value="">Select Category</option>
                                                        {taskCategories.map((category) => (
                                                            // <option key={category.TaskCatId} value={category.TaskCatId}>
                                                            <option key={category.MiscellaneousMstId} value={category.MiscellaneousMstId}>
                                                                {category.Name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>


                                            {/* Task Description with text direction set to left */}
                                            <label htmlFor="taskDescription">Task Description:</label>
                                            <textarea
                                                ref={taskDescriptionRef}
                                                id="taskDescription"
                                                name="taskDescription"
                                                rows="4"
                                                placeholder="Enter task details"
                                                style={{ direction: 'left' }}
                                            />

                                            {/* Remark with text direction set to left */}

                                            <label htmlFor="remark">Remark:</label>
                                            <textarea
                                                ref={taskRemarkRef}
                                                id="remark"
                                                name="reamrk"
                                                rows="4"
                                                placeholder="Enter remark details"
                                                style={{ direction: 'left' }}
                                            />
                                            <button type="submit" className="addtaskbtn" style={{ marginTop: "20px" }}>
                                                Add Task
                                            </button>

                                        </form>
                                    </div>
                                </div>
                            </div>
                            <ToastContainer />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Addtask;






// import React, { useEffect, useRef, useState } from "react";
// import axios from "axios";
// import { LuNotebookPen } from "react-icons/lu";
// import { AiOutlineFundView } from "react-icons/ai";
// import { BiWallet } from "react-icons/bi";
// import { MdOutlineLogout } from "react-icons/md";
// import { RiDashboardHorizontalFill } from "react-icons/ri";
// import { FaUserAlt } from "react-icons/fa";
// import { useNavigate } from "react-router-dom";
// import { FaUserFriends } from "react-icons/fa";
// import { ToastContainer, toast } from "react-toastify";
// import 'react-toastify/dist/ReactToastify.css';
// import Dashboard from "./Dashboard";

// const Addtask = () => {
//     const [userFirstName, setUserFirstName] = useState("");
//     const [userLastName, setUserLastName] = useState("");
//     const navigate = useNavigate();
//     const today = new Date().toISOString().split('T')[0];

//     useEffect(() => {
//         const userData = JSON.parse(localStorage.getItem("user"));
//         if (userData && userData.User) {
//             setUserFirstName(userData.User.ul_FirstName);
//             setUserLastName(userData.User.ul_LastName);
//         } else {
//             console.error("User data is missing or invalid.");
//         }
//     }, []);

//     const [userData, setUserData] = useState(null);
//     const [accessToken, setAccessToken] = useState(null);
//     const [clients, setClients] = useState([]);
//     const [attendByUsers, setAttendByUsers] = useState([]);
//     const [assignByUsers, setAssignByUsers] = useState([]);
//     const [attendByUserLoginId, setAttendByUserLoginId] = useState(null); // New state
//     const [assignByUserLoginId, setAssignByUserLoginId] = useState(null); // New state
//     // const [priorities, setPriorities] = useState([]); // State to store priorities
//     const [priorities, setPriorities] = useState([])
//     const [taskCategories, setTaskCategories] = useState([]);// State for task categories


//     const clientNameRef = useRef();
//     const attendByRef = useRef();
//     const assignToRef = useRef();
//     const taskDateRef = useRef();
//     const taskDescriptionRef = useRef();
//     const taskRemarkRef = useRef();
//     const clientUserRef = useRef();
//     const taskPriorityRef = useRef();
//     // const priorityRef = useRef();
//     const taskCatagoryRef = useRef();

//     useEffect(() => {
//         const storedUser = localStorage.getItem('user');
//         const token = localStorage.getItem('accesstoken');

//         if (storedUser) {
//             setUserData(JSON.parse(storedUser));
//         }
//         if (token) {
//             setAccessToken(token);
//         }

//         if (storedUser) {
//             const companyid = JSON.parse(storedUser).User.CompanyId;

//             const params = new FormData();
//             params.set("companyid", companyid);

//             // Fetch clients data
//             axios.post('http://192.168.10.20:8082/api/Task/getclient', params, {
//                 headers: {
//                     accesstokenkey: token,
//                     "Content-Type": "application/json"
//                 }
//             })
//                 .then((response) => {
//                     if (response.data && response.data.Clients) {
//                         setClients(response.data.Clients);
//                     }
//                 })
//                 .catch((error) => {
//                     console.error("Error fetching clients:", error);
//                 });

//             // Fetch Attend By users
//             axios.post('http://192.168.10.20:8082/api/UserLogin/getuserbycompanyid', params, {
//                 headers: {
//                     accesstokenkey: token,
//                     "Content-Type": "application/json"
//                 }
//             })
//                 .then((response) => {
//                     if (response.data && response.data.Users) {
//                         const filteredUsers = response.data.Users.filter(user =>
//                             user.ul_Role === 'user' && user.ul_IsActive
//                         );
//                         setAttendByUsers(filteredUsers);
//                         setAssignByUsers(filteredUsers);
//                         const loggedInUserId = JSON.parse(storedUser).User.UserLoginId;
//                         setAttendByUserLoginId(loggedInUserId);
//                         setAssignByUserLoginId(loggedInUserId);
//                     }
//                 })
//                 .catch((error) => {
//                     console.error("Error fetching users:", error);
//                 });

//             // Fetch priorities
//             const miscParams = new FormData();
//             // miscParams.set("companyid", companyid);
//             miscParams.set("trantype", "Priority");

//             axios.post('http://192.168.10.20:8082/api/Task/getmiscellaneous', miscParams, {
//                 headers: {
//                     accesstokenkey: token,
//                     "Content-Type": "application/json"
//                 }
//             })
//                 .then((response) => {
//                     if (response.data && response.data.Miscellaneous) {
//                         setPriorities(response.data.Miscellaneous);
//                     }
//                 })
//                 .catch((error) => {
//                     console.error("Error fetching priorities:", error);
//                 });

//             // Fetch task categories
//             const taskCatParams = new FormData();
//             // taskCatParams.set("companyid", companyid);
//             taskCatParams.set("trantype", "TaskCat");

//             axios.post('http://192.168.10.20:8082/api/Task/getmiscellaneous', taskCatParams, {
//                 headers: {
//                     accesstokenkey: token,
//                     "Content-Type": "application/json"
//                 }
//             })
//                 .then((response) => {
//                     if (response.data && response.data.Miscellaneous) {
//                         setTaskCategories(response.data.Miscellaneous);
//                     }
//                 })
//                 .catch((error) => {
//                     console.error("Error fetching task categories:", error);
//                 });
//         }
//     }, []);


//     const handleSubmit = (e) => {
//         e.preventDefault();
//         const taskDateValue = taskDateRef.current.value;

//         if (!taskDateValue) {
//             toast.error("Please select a task date.");
//             return;
//         }

//         const taskDate = new Date(taskDateValue);
//         if (isNaN(taskDate.getTime())) {
//             toast.error("Invalid task date.");
//             return;
//         }

//         const formattedDate = new Date(taskDateRef.current.value).toISOString().split("T")[0];
//         const clientId = clientNameRef.current.value;
//         const attendById = attendByRef.current.value;
//         const assignToId = assignToRef.current.value;
//         const taskDesc = taskDescriptionRef.current.value;
//         const taskRemark = taskRemarkRef.current.value;
//         const taskClient = clientUserRef.current.value;
//         const taskPriority = priorityRef.current.value;
//         const taskCatagory = taskCatagoryRef.current.value;


//         if (!clientId || clientId === "") {
//             toast.error("Please select a client.");
//             return;
//         }

//         if (!attendById || attendById === "") {
//             toast.error("Please select an attendee.");
//             return;
//         }

//         if (!assignToId || assignToId === "") {
//             toast.error("Please select an assigner.");
//             return;
//         }

//         if (!taskDesc || taskDesc === "") {
//             toast.error("Please enter a task description.");
//             return;
//         }

//         if (!taskRemark || taskRemark === "") {
//             toast.error("Please enter a task reamrk.");
//             return;
//         }

//         if (!taskClient || taskClient === "") {
//             toast.error("Please enter a task reamrk.");
//             return;
//         }

//         if (!taskPriority || taskPriority === "") {
//             toast.error("Please enter a task priority.");
//             return;
//         }

//         if (!taskCatagory || taskCatagory === "") {
//             toast.error("Please enter a task catagory.");
//             return;
//         }

//         const params = new FormData();
//         params.set("companyid", userData.User.CompanyId);
//         params.set("userloginid", userData.User.UserLoginId);
//         params.set("date", formattedDate);
//         params.set("clientid", clientId);
//         params.set("attendbyid", attendById);
//         params.set("assigntoid", assignToId);
//         params.set("description", taskDesc);
//         params.set("remark", taskRemark);
//         params.set("clientusername", taskClient);
//         params.set("priorityid", taskPriority);
//         params.set("taskcatid", taskCatagory);

//         // const params = new FormData();
//         // params.set("companyid", userData.User.CompanyId);
//         // params.set("userloginid", userData.User.UserLoginId);
//         // params.set("date", formattedDate);
//         // params.set("clientid", parseInt(clientId, 10));  // Convert to integer
//         // params.set("attendbyid", parseInt(attendById, 10));  // Convert to integer
//         // params.set("assigntoid", parseInt(assignToId, 10));  // Convert to integer
//         // params.set("description", taskDesc);
//         // params.set("remark", taskRemark);
//         // params.set("clientusername", taskClient);
//         // params.set("priorityid", parseInt(taskPriority, 10));  // Convert to integer
//         // params.set("taskcatid", parseInt(taskCatagory, 10));  // Convert to integer





//         const storedUser = localStorage.getItem('user');
//         const token = localStorage.getItem('accesstoken');

//         axios.post('http://192.168.10.20:8082/api/Task/addtask', params, {
//             // axios.post('http://52.172.202.180:8085/api/Task/addtask', params, {
//             headers: {
//                 accesstokenkey: token,
//                 "Content-Type": "application/json",
//             },
//         })
//             .then((response) => {
//                 if (response.data && response.data.success) {
//                     toast.error("Task not added");
//                     e.target.reset();
//                 } else {
//                     toast.success("Task added successfully!");
//                     clientNameRef.current.value = "";
//                     attendByRef.current.value = "";
//                     assignToRef.current.value = "";
//                     taskDescriptionRef.current.value = "";
//                     taskRemarkRef.current.value = "";
//                     clientUserRef.current.value = "";
//                     taskPriorityRef.current.value = "";
//                     taskCatagoryRef.current.value = "";

//                 }
//                 setTimeout(() => {
//                     navigate('/addtask');
//                 }, 500);
//             })
//             .catch((error) => {
//                 console.error("Error adding task:", error.response ? error.response.data : error.message);
//                 toast.error("An error occurred while adding the task.");
//             });
//     };

//     const handleLogout = () => {
//         localStorage.removeItem("firstname");
//         localStorage.removeItem("lastname");
//         localStorage.removeItem("accesstoken");
//         localStorage.removeItem("user");

//         setTimeout(() => {
//             navigate("/");
//         }, 500);
//     };

//     const addtask = () => {
//         navigate('/addtask');
//     };

//     const viewtask = () => {
//         navigate('/viewtask');
//     };

//     const dailytask = () => {
//         navigate('/dailytask');
//     };
//     const userview = () => {
//         navigate('/user');
//     };

//     const dashboard = () => {
//         navigate('/dashboard');
//     }
//     const handleprofile = () => navigate('/profile');

//     return (
//         <>
//             <div className="desh-main">
//                 <div className="desh-inner-main">
//                     <div className="desh-child">
//                         <div className="desh-inner-child">
//                             <div className="desh-logo">
//                                 <img src="/assets/img/galaxy.png" alt="" />
//                                 <div className="user-info">
//                                     {userFirstName && userLastName ? (
//                                         <span>{userFirstName} {userLastName}</span>
//                                     ) : (
//                                         <p>No user data found.</p>
//                                     )}
//                                 </div>
//                             </div>
//                             <div className="desh-btns">
//                                 <div className="desh-btn">
//                                     <button className='dailytaskbtn' onClick={dashboard}><RiDashboardHorizontalFill className="icon-task" /><span className="dash-task">Dashboard</span></button>
//                                 </div>
//                                 {/* <div className="desh-btn">
//                                     <button onClick={dashboard}><LuNotebookPen className="icon-task" /><span className="dash-task">Dashboard</span></button>
//                                 </div> */}
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
//                             <p className="version-main">V- 1.0.2</p>
//                             <div className="log-out-new">
//                                 <button className="btn-profile" onClick={handleprofile}><FaUserAlt className="icon-pro" /></button>
//                                 <button onClick={handleLogout} className="btn-3" title="logout"><MdOutlineLogout className="log-out-icon" /></button>
//                             </div>
//                         </div>
//                     </div>

//                     <div className="desh-child">
//                         <div className="desh-inner-child">
//                             <div className="all-divs">
//                                 <div className="all-divs-main">
//                                     <div className="form">
//                                         {/* <p className="all-divs-mini-title">Add Task</p> */}
//                                         <form onSubmit={handleSubmit} style={{ marginBottom: '30px' }}>
//                                             <label htmlFor="taskDate">Task Date:</label>
//                                             <input
//                                                 ref={taskDateRef}
//                                                 type="date"
//                                                 id="taskDate"
//                                                 name="taskDate"
//                                                 min={today}
//                                                 defaultValue={today}
//                                             />

//                                             <label htmlFor="clientName">Client Name:</label>
//                                             <select ref={clientNameRef} id="clientName" name="clientName">
//                                                 <option value="">Select Client</option>
//                                                 {clients.map((client) => (
//                                                     <option key={client.CompanyClientId} value={client.CompanyClientId}>
//                                                         {client.ClientName}
//                                                     </option>
//                                                 ))}
//                                             </select>

//                                             <label htmlFor="clientUser">Client-user name:</label>
//                                             <textarea
//                                                 ref={clientUserRef}
//                                                 id="clientUser"
//                                                 name="clientUser"
//                                                 rows="4"
//                                                 placeholder="Enter Client User name"
//                                                 style={{ direction: 'left' }}
//                                             />


//                                             {/* Attend By Dropdown (Disabled) */}
//                                             <label htmlFor="attendBy">Attend By:</label>
//                                             <select
//                                                 ref={attendByRef}
//                                                 id="attendBy"
//                                                 name="attendBy"
//                                                 value={attendByUserLoginId || ''}
//                                                 disabled // This disables the dropdown
//                                             >
//                                                 <option value={attendByUserLoginId}>
//                                                     {userFirstName} {userLastName}
//                                                 </option>
//                                             </select>

//                                             {/* Assign By Dropdown */}
//                                             <label htmlFor="assignBy">Assign To:</label>
//                                             <select
//                                                 ref={assignToRef}
//                                                 id="assignBy"
//                                                 name="assignBy"
//                                                 value={assignByUserLoginId || ''} // Controlled value
//                                                 onChange={(e) => setAssignByUserLoginId(e.target.value)} // Update state on change
//                                             >
//                                                 <option value="">Select Assignee</option>
//                                                 {assignByUsers.map((user) => (
//                                                     <option key={user.UserLoginId} value={user.UserLoginId}>
//                                                         {user.ul_FirstName} {user.ul_LastName}
//                                                     </option>
//                                                 ))}
//                                             </select>

//                                             {/* priority by dropdown */}
//                                             <label htmlFor="priority">Priority:</label>
//                                             <select ref={priorityRef} id="priority" name="priority">
//                                                 <option value="">Select Priority</option>
//                                                 {priorities.map((priority) => (
//                                                     <option key={priority.id} value={priority.id}>
//                                                         {priority.name} {/* Assuming name is the field for priority name */}
//                                                     </option>
//                                                 ))}
//                                             </select>


//                                             <label htmlFor="taskCatagory">Task Category:</label>
//                                             <select ref={taskCatagoryRef}
//                                                 name="taskCatagory"
//                                                 // value={taskCategories || ''}
//                                                 id="taskCatagory">
//                                                 <option value="">Select Task Category</option>
//                                                 {taskCategories.map((category) => (
//                                                     <option key={category.TaskCatId} value={category.TaskCatId}>
//                                                         {category.Name}
//                                                     </option>
//                                                 ))}
//                                             </select>


//                                             {/* <label htmlFor="clientName">Client Name:</label>
//                                             <select ref={clientNameRef} id="clientName" name="clientName">
//                                                 <option value="">Select Client</option>
//                                                 {clients.map((client) => (
//                                                     <option key={client.CompanyClientId} value={client.CompanyClientId}>
//                                                         {client.ClientName}
//                                                     </option>
//                                                 ))}
//                                             </select> */}


//                                             {/* Task Description with text direction set to left */}
//                                             <label htmlFor="taskDescription">Task Description:</label>
//                                             <textarea
//                                                 ref={taskDescriptionRef}
//                                                 id="taskDescription"
//                                                 name="taskDescription"
//                                                 rows="4"
//                                                 placeholder="Enter task details"
//                                                 style={{ direction: 'left' }}
//                                             />

//                                             {/* Remark with text direction set to left */}
//                                             <label htmlFor="remark">Remark:</label>
//                                             <textarea
//                                                 ref={taskRemarkRef}
//                                                 id="remark"
//                                                 name="reamrk"
//                                                 rows="4"
//                                                 placeholder="Enter remark details"
//                                                 style={{ direction: 'left' }}
//                                             />
//                                             <button type="submit" className="addtaskbtn" style={{ marginTop: "20px" }}>
//                                                 Add Task
//                                             </button>

//                                         </form>
//                                     </div>
//                                 </div>
//                             </div>
//                             <ToastContainer />
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </>
//     );
// };

// export default Addtask;










// import React, { useEffect, useRef, useState } from "react";
// import axios from "axios";
// import { LuNotebookPen } from "react-icons/lu";
// import { AiOutlineFundView } from "react-icons/ai";
// import { BiWallet } from "react-icons/bi";
// import { MdOutlineLogout } from "react-icons/md";
// import { RiDashboardHorizontalFill } from "react-icons/ri";
// import { FaUserAlt } from "react-icons/fa";
// import { useNavigate } from "react-router-dom";
// import { FaUserFriends } from "react-icons/fa";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// const AddTask = () => {
//   const [userFirstName, setUserFirstName] = useState("");
//   const [userLastName, setUserLastName] = useState("");
//   const [userData, setUserData] = useState(null);
//   const [accessToken, setAccessToken] = useState(null);
//   const [clients, setClients] = useState([]);
//   const [attendByUsers, setAttendByUsers] = useState([]);
//   const [assignByUsers, setAssignByUsers] = useState([]);
//   const [attendByUserLoginId, setAttendByUserLoginId] = useState(null);
//   const [assignByUserLoginId, setAssignByUserLoginId] = useState(null);

//   const clientNameRef = useRef();
//   const attendByRef = useRef();
//   const assignToRef = useRef();
//   const taskDateRef = useRef();
//   const taskDescriptionRef = useRef();
//   const taskRemarkRef = useRef();

//   const navigate = useNavigate();
//   const today = new Date().toISOString().split("T")[0];

//   useEffect(() => {
//     const userData = JSON.parse(localStorage.getItem("user"));
//     if (userData && userData.User) {
//       setUserFirstName(userData.User.ul_FirstName);
//       setUserLastName(userData.User.ul_LastName);
//     } else {
//       console.error("User data is missing or invalid.");
//     }
//   }, []);

//   useEffect(() => {
//     const storedUser = localStorage.getItem("user");
//     const token = localStorage.getItem("accesstoken");

//     if (storedUser) {
//       setUserData(JSON.parse(storedUser));
//     }
//     if (token) {
//       setAccessToken(token);
//     }

//     if (storedUser) {
//       const companyid = JSON.parse(storedUser).User.CompanyId;

//       const params = new FormData();
//       params.set("companyid", companyid);

//       // Fetch clients data
//       axios
//         .post("http://192.168.10.20:8082/api/Task/getclient", params, {
//           headers: {
//             accesstokenkey: token,
//             "Content-Type": "application/json",
//           },
//         })
//         .then((response) => {
//           if (response.data && response.data.Clients) {
//             setClients(response.data.Clients);
//           }
//         })
//         .catch((error) => {
//           console.error("Error fetching clients:", error);
//         });

//       // Fetch users for Attend By and Assign To
//       axios
//         .post("http://192.168.10.20:8082/api/UserLogin/getuserbycompanyid", params, {
//           headers: {
//             accesstokenkey: token,
//             "Content-Type": "application/json",
//           },
//         })
//         .then((response) => {
//           if (response.data && response.data.Users) {
//             const filteredUsers = response.data.Users.filter(
//               (user) => user.ul_Role === "user" && user.ul_IsActive
//             );

//             setAttendByUsers(filteredUsers);
//             setAssignByUsers(filteredUsers);

//             const loggedInUserId = JSON.parse(storedUser).User.UserLoginId;
//             setAttendByUserLoginId(loggedInUserId);
//             setAssignByUserLoginId(loggedInUserId);
//           }
//         })
//         .catch((error) => {
//           console.error("Error fetching users:", error);
//         });
//     }
//   }, []);

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     const formattedDate = new Date(taskDateRef.current.value).toISOString().split("T")[0];
//     const clientId = clientNameRef.current.value;
//     const attendById = attendByRef.current.value;
//     const assignToId = assignToRef.current.value;
//     const taskDesc = taskDescriptionRef.current.value;
//     const taskRemark = taskRemarkRef.current.value;

//     if (!clientId || !attendById || !assignToId || !taskDesc || !taskRemark) {
//       toast.error("Please fill in all required fields.");
//       return;
//     }

//     const params = {
//       companyid: userData.User.CompanyId,
//       userloginid: userData.User.UserLoginId,
//       date: formattedDate,
//       clientid: clientId,
//       attendbyid: attendById,
//       assigntoid: assignToId,
//       description: taskDesc,
//       remark: taskRemark,
//       clientusername: "1this is me",
//     };

//     const token = localStorage.getItem("accesstoken");

//     console.log("Submitting Data:", params);

//     axios
//       .post("http://192.168.10.20:8082/api/Task/addtask", params, {
//         headers: {
//           accesstokenkey: token,
//           "Content-Type": "application/json",
//         },
//       })
//       .then((response) => {
//         console.log("Response Data:", response.data);
//         if (response.data && response.data.message === "Success") {
//           toast.success("Task added successfully!");
//           e.target.reset();
//           setTimeout(() => {
//             navigate("/addtask");
//           }, 500);
//         } else {
//           toast.error("Task not added.");
//         }
//       })
//       .catch((error) => {
//         console.error("Error adding task:", error.response ? error.response.data : error.message);
//         toast.error("An error occurred while adding the task.");
//       });
//   };

//   const handleLogout = () => {
//     localStorage.removeItem("firstname");
//     localStorage.removeItem("lastname");
//     localStorage.removeItem("accesstoken");
//     localStorage.removeItem("user");

//     setTimeout(() => {
//       navigate("/");
//     }, 500);
//   };

//   return (
//     <>
//       <div className="desh-main">
//         <div className="desh-inner-main">
//           {/* Sidebar */}
//           <div className="desh-child">
//             <div className="desh-inner-child">
//               <div className="desh-logo">
//                 <img src="/assets/img/galaxy.png" alt="" />
//                 <div className="user-info">
//                   {userFirstName && userLastName ? (
//                     <span>{userFirstName} {userLastName}</span>
//                   ) : (
//                     <p>No user data found.</p>
//                   )}
//                 </div>
//               </div>
//               <div className="desh-btns">
//                 <button onClick={() => navigate('/dashboard')}>
//                   <RiDashboardHorizontalFill /> Dashboard
//                 </button>
//                 <button onClick={() => navigate('/addtask')}>
//                   <LuNotebookPen /> Add Task
//                 </button>
//                 <button onClick={() => navigate('/viewtask')}>
//                   <AiOutlineFundView /> View Task
//                 </button>
//               </div>
//               <div className="log-out-new">
//                 <button onClick={handleLogout}><MdOutlineLogout /> Logout</button>
//               </div>
//             </div>
//           </div>

//           {/* Form */}
//           <div className="desh-child">
//             <div className="desh-inner-child">
//               <form onSubmit={handleSubmit}>
//                 <label>Task Date:</label>
//                 <input ref={taskDateRef} type="date" min={today} defaultValue={today} />

//                 <label>Client Name:</label>
//                 <select ref={clientNameRef}>
//                   <option value="">Select Client</option>
//                   {clients.map(client => (
//                     <option key={client.CompanyClientId} value={client.CompanyClientId}>
//                       {client.ClientName}
//                     </option>
//                   ))}
//                 </select>

//                 <label>Attend By:</label>
//                 <select ref={attendByRef} value={attendByUserLoginId} disabled>
//                   <option>{userFirstName} {userLastName}</option>
//                 </select>

//                 <label>Assign To:</label>
//                 <select ref={assignToRef}>
//                   <option value="">Select Assignee</option>
//                   {assignByUsers.map(user => (
//                     <option key={user.UserLoginId} value={user.UserLoginId}>
//                       {user.ul_FirstName} {user.ul_LastName}
//                     </option>
//                   ))}
//                 </select>

//                 <label>Task Description:</label>
//                 <textarea ref={taskDescriptionRef} placeholder="Enter task details"></textarea>

//                 <label>Remark:</label>
//                 <textarea ref={taskRemarkRef} placeholder="Enter remark"></textarea>

//                 <button type="submit">Add Task</button>
//               </form>
//               <ToastContainer />
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default AddTask;





