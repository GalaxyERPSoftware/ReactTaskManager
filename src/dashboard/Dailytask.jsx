import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LuNotebookPen } from "react-icons/lu";
import { AiOutlineFundView } from "react-icons/ai";
import { MdOutlineLogout } from "react-icons/md";
import { RiDashboardHorizontalFill } from "react-icons/ri";
import { BiWallet } from "react-icons/bi";
import { FaUserFriends, FaUserAlt } from "react-icons/fa";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import config from "./Config";

const Dailytask = () => {
    const [userFirstName, setUserFirstName] = useState("");
    const [userLastName, setUserLastName] = useState("");
    const [attendByUsers, setAttendByUsers] = useState([]);
        const [userRole, setUserRole] = useState(""); // State for role
    
    const [clients, setClients] = useState([]);
    const [selectedCompany, setSelectedCompany] = useState("");
    const [selectedCreatedBy, setSelectedCreatedBy] = useState("");
    const [tasks, setTasks] = useState([]);
    const [filteredTasks, setFilteredTasks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [fromDate, setFromDate] = useState(() => {
        const today = new Date().toISOString().split("T")[0];
        return today;
    });
    const [toDate, setToDate] = useState(() => {
        const today = new Date().toISOString().split("T")[0];
        return today;
    });
    const [selectedAttendBy, setSelectedAttendBy] = useState("");
    const [selectedStatus, setSelectedStatus] = useState("1");
    const navigate = useNavigate();

    const handleStatusChange = (value) => {
        setSelectedStatus(value);
        filterTasks(value, selectedAttendBy, selectedCreatedBy); // Re-filter with the new status
    };

    // Handle "Assign To" change
    const handleAttendByChange = (value) => {
        setSelectedAttendBy(value);
        filterTasks(selectedStatus, value, selectedCreatedBy); // Re-filter with the new "Assign To"
    };

    // Handle "Created By" change
    const handleCreatedByChange = (value) => {
        setSelectedCreatedBy(value);
        filterTasks(selectedStatus, selectedAttendBy, value); // Re-filter with the new "Create By"
    };


    const filterTasks = (status, assignTo, createdBy) => {

        let filtered = [...tasks];

        // Filter by status
        if (status !== "1") {
            filtered = filtered.filter((task) => task.Status.toLowerCase() === status.toLowerCase());
        }
        // Filter by assignTo
        if (assignTo) {
            filtered = filtered.filter((task) => {
                const attendByName = `${task.AssignToFirstName.toUpperCase()} ${task.AssignToLastName.toUpperCase()}`;
                return attendByName === assignTo;
            });
        }
        // Filter by createdBy
        if (createdBy) {
            filtered = filtered.filter((task) => {
                const createdByName = `${task.CreatedByFirstName.toUpperCase()} ${task.CreatedByLastName.toUpperCase()}`;
                return createdByName === createdBy;
            });
        }
        setFilteredTasks(filtered);
    };

    const formatDate = (date) => {
        if (date) {
            const d = new Date(date);
            return d.toISOString().split("T")[0];
        }
        return "";
    };

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

            if (fromDate && toDate) {
                params.set("fromdate", formatDate(fromDate));
                params.set("todate", formatDate(toDate));
            } else {
                console.error("Both 'fromdate' and 'todate' are required.");
                return;
            }
            setLoading(true);

            axios
                // .post("http://192.168.10.20:8082/api/Report/dailytaskreport", params, {
                .post(`${config.BASE_URL}/Report/dailytaskreport`, params, {
                    headers: {
                        accesstokenkey: token,
                        "Content-Type": "application/json",
                    },
                })
                .then((response) => {
                    console.log("Fetched tasks:", response.data);
                    if (response.data && response.data.DailyTask) {
                        setTasks(response.data.DailyTask);
                        setFilteredTasks(response.data.DailyTask);
                    } else {
                        console.error("No tasks found:", response?.data?.message || "Unknown error");
                    }
                })
                .catch((error) => {
                    // console.error("Error fetching tasks:", error.response ? error.response.data : error.message);
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

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        const token = localStorage.getItem("accesstoken");
        if (storedUser && token) {
            const params = {
                companyid: "1002"
            };

            // axios.post("http://192.168.10.20:8082/api/Task/getclient", params, {
            axios.post(`${config.BASE_URL}/Task/getclient`, params, {
                headers: {
                    accesstokenkey: token,
                    "Content-Type": "application/json",
                },
            })
                .then((response) => {
                    if (response.data && response.data.Clients) {
                        setClients(response.data.Clients);
                    } else {
                        console.error("No clients found:", response?.data?.message || "Unknown error");
                    }
                })
                .catch((error) => {
                    console.error("Error fetching clients:", error.response ? error.response.data : error.message);
                });
        }
    }, []);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const token = localStorage.getItem('accesstoken');
        if (storedUser && token) {
            const companyid = JSON.parse(storedUser).User.CompanyId;
            const params = new FormData();
            params.set("companyid", companyid);
            // axios.post('http://192.168.10.20:8082/api/UserLogin/getuserbycompanyid', params, {
            axios.post(`${config.BASE_URL}/UserLogin/getuserbycompanyid`, params, {
                headers: {
                    accesstokenkey: token,
                    "Content-Type": "application/json"
                }
            })
                .then((response) => {
                    if (response.data && response.data.Users) {
                        const filteredUsers = response.data.Users.filter(user =>
                            user.ul_Role === 'user' && user.ul_IsActive
                        );
                        setAttendByUsers(filteredUsers);
                    }
                })
                .catch((error) => {
                    console.error("Error fetching users:", error);
                });
        }
    }, []);

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
    

    useEffect(() => {
        if (fromDate && toDate) {
            fetchTasks();
        }
    }, [fromDate, toDate]);

    const addtask = () => {
        navigate('/addtask');
    };
    const viewtask = () => {
        navigate('/viewtask');
    };
    const dailytask = () => {
        navigate('/dailytask');
    };
    const userview = () => {
        navigate('/userview');
    };

    const dashboard = () => {
        navigate('/dashboard');
    };
    const handleprofile = () => {
        navigate('/profile');
    };
    const leaveview = () => {
        navigate('/leave');
    }
    const handleLogout = () => {
        localStorage.removeItem("firstname");
        localStorage.removeItem("lastname");
        localStorage.removeItem("accesstoken");
        localStorage.removeItem("user");

        setTimeout(() => {
            navigate("/");
        }, 500);
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
                                    {userFirstName && userLastName? (
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
                            <p  style={{marginBottom:'20px',fontWeight:'600',fontSize:'22px'}} data-discover="true">Daily Task</p>

                                <div className="viewtask-main-page">
                                    <div className="view-task-main-inner">
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
                                            <div className="inner" id="main1">
                                                <label htmlFor="status-select-1">Status:</label>
                                                <select
                                                    id="status-select-1"
                                                    className="custom-select"
                                                    value={selectedStatus}
                                                    onChange={(e) => handleStatusChange(e.target.value)}
                                                >
                                                    <option value="1">All</option>
                                                    <option value="P">Pending</option>
                                                    <option value="I">In Progress</option>
                                                    <option value="C">Complete</option>
                                                </select>
                                            </div>
                                            <div className="inner">
                                                <label htmlFor="createdby-select">Created By:</label>
                                                <select
                                                    id="createdby-select"
                                                    className="custom-select"
                                                    value={selectedCreatedBy}
                                                    onChange={(e) => handleCreatedByChange(e.target.value)}
                                                >
                                                    <option value="">All</option>
                                                    {attendByUsers.length > 0 ? (
                                                        attendByUsers.map((user) => (
                                                            <option key={user.UserLoginId} value={`${user.ul_FirstName?.toUpperCase()} ${user.ul_LastName?.toUpperCase()}`}>
                                                                {user.ul_FirstName?.toUpperCase()} {user.ul_LastName?.toUpperCase()}
                                                            </option>
                                                        ))
                                                    ) : (
                                                        <option value="">No users available</option>
                                                    )}
                                                </select>
                                            </div>
                                            <div className="inner">
                                                <label htmlFor="attendby-select">Assign To:</label>
                                                <select
                                                    id="attendby-select"
                                                    className="custom-select"
                                                    value={selectedAttendBy}
                                                    onChange={(e) => handleAttendByChange(e.target.value)}
                                                >
                                                    <option value="">All</option>
                                                    {attendByUsers.length > 0 ? (
                                                        attendByUsers.map((user) => (
                                                            <option key={user.UserLoginId} value={`${user.ul_FirstName?.toUpperCase()} ${user.ul_LastName?.toUpperCase()}`}>
                                                                {user.ul_FirstName?.toUpperCase()} {user.ul_LastName?.toUpperCase()}
                                                            </option>
                                                        ))
                                                    ) : (
                                                        <option value="">No users available</option>
                                                    )}
                                                </select>
                                            </div>
                                        </div>
                                        <div className="main-div-table">
                                            <div className="main-table-inner">
                                                {loading ? (
                                                    <p>Loading tasks...</p>
                                                ) : (
                                                    <table border={1}>
                                                        <thead>
                                                            <tr>
                                                                <th className="text-d">Task Id</th>
                                                                <th className="text-d">Task Created On</th>
                                                                <th className="text-d">Create By</th>
                                                                <th className="text-d">Assign To</th>
                                                                <th className="text-d">Company Name</th>
                                                                <th className="text-d">Description</th>
                                                                <th className="text-d">Status</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {filteredTasks.length > 0 ? (
                                                                filteredTasks.map((task, index) => (
                                                                    <tr key={index}>
                                                                        <td className="text-d">{task.DailyTaskId}</td>
                                                                        <td className="text-d">{task.Date}</td>
                                                                        <td>{task.CreatedByFirstName?.toUpperCase()} {task.CreatedByLastName?.toUpperCase()}</td>
                                                                        <td className="text-d">{`${task.AssignToFirstName?.toUpperCase()} ${task.AssignToLastName?.toUpperCase()}`}</td>
                                                                        <td className="text-d">{task.ClientName}</td>
                                                                        <td className="text-d">{task.Description}</td>
                                                                        <td className="text-d">
                                                                            {task.Status === "P" ? (
                                                                                <p className="status-pending">Pending</p>
                                                                            ) : task.Status === "I" ? (
                                                                                <p className="status-in-progress">In Progress</p>
                                                                            ) : (
                                                                                <p className="status-complete">Complete</p>
                                                                            )}
                                                                        </td>
                                                                    </tr>
                                                                ))
                                                            ) : (
                                                                <tr>
                                                                    <td colSpan="6">No tasks found.</td>
                                                                </tr>
                                                            )}
                                                        </tbody>
                                                    </table>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Dailytask;












{/* <div className="inner">
                                                <label htmlFor="">From Date:</label>
                                                <input 
                                                    type="date" 
                                                    value={fromDate} 
                                                    onChange={handleFromDateChange} 
                                                />
                                            </div>
                                            <div className="inner">
                                               <label htmlFor="">To Date:</label>
                                                <input 
                                                    type="date" 
                                                    value={toDate} 
                                                    onChange={handleToDateChange} 
                                                />
                                            </div> */}



        //                                      Filter tasks by date range (fromDate and toDate)
        //     filtered = filtered.filter((task) => {
        //         const taskDate = new Date(task.Date);
        //         const from = new Date(fromDate);
        //         const to = new Date(toDate);
        //         return taskDate >= from && taskDate <= to;
        // });


        // const handleFromDateChange = (e) => {
        //     setFromDate(e.target.value);
        // };
        
        // const handleToDateChange = (e) => {
        //     setToDate(e.target.value);
        // };