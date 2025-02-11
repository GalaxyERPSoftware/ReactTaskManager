import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { RiDashboardHorizontalFill } from "react-icons/ri";
import { LuNotebookPen } from "react-icons/lu";
import { FaUserAlt } from "react-icons/fa";
import { FaAngleRight } from "react-icons/fa6";
import { AiOutlineFundView, AiOutlineUsergroupAdd } from "react-icons/ai";
import { BiWallet } from "react-icons/bi";
import { FaUserFriends, FaTasks } from "react-icons/fa";
import { MdOutlineLogout, MdPendingActions, MdOutlineMoreTime } from "react-icons/md";
import { LuUserRoundCheck } from "react-icons/lu";
import { Link, useNavigate } from "react-router-dom";
import config from "./Config";

const Dashboard = () => {
    const [dashboardData, setDashboardData] = useState({});
    const [userRole, setUserRole] = useState(""); // State for role
    const [leave, setLeave] = useState(null);  // State to store the 'leave' value
    // const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [userFirstName, setUserFirstName] = useState("");
    const [userLastName, setUserLastName] = useState("");
    const [loading, setLoading] = useState(false);
    const [attendanceData, setAttendanceData] = useState(null); // State to store the fetched data
    const navigate = useNavigate();
    const [counts, setCounts] = useState({});
    // const navigate = useNavigate();

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

    const fetchDashboardData = () => {
        const storedUser = localStorage.getItem("user");
        const token = localStorage.getItem("accesstoken");

        if (!token) {
            console.error("Missing user data or token in localStorage.");
            setTimeout(() => {
                navigate('/');
            }, 0);
            return;
        }
        const userData = JSON.parse(storedUser);
        const requestBody = {
            companyid: String(userData.User.CompanyId),
            userloginid: String(userData.User.UserLoginId),
        };
        setLoading(true);
        setError(null);
        axios.post(`${config.BASE_URL}/Task/taskadmindashboard`, requestBody, {
            headers: {
                accesstokenkey: token,
                "Content-Type": "application/json",
            },
        })
            .then((response) => {
                setDashboardData(response.data);
                console.log(response.data);
            })
            .catch((error) => {
                if (error.response) {
                    setTimeout(() => {
                        navigate('/');
                    }, 0);
                } else {
                    setError("An unexpected error occurred. Please try again.");
                }
            })
            .finally(() => {
                setLoading(false);
            });
    };
    useEffect(() => {
        if (Object.keys(dashboardData).length > 0) {
            const keys = [
                "TotalUser",
                "TotalActiveUser",
                "TodayLoginUser",
                "TotalTodayUserTask",
                "TotalTodayUserPendingTask",
                "TotalUserPendingTask",
                "TotalTodayTask",
                "TotalTodayPendingTask",
                "TotalPendingTask",
                "leave",
                "pendingleave"  // Add leave to the keys array
            ];

            const initialCounts = keys.reduce((acc, key) => {
                acc[key] = 0;
                return acc;
            }, {});
            setCounts(initialCounts);

            keys.forEach((key) => {
                let currentCount = 0;
                const target = dashboardData[key] || 0;
                const increment = Math.ceil(target / 100);
                const interval = setInterval(() => {
                    currentCount += increment;
                    if (currentCount >= target) {
                        currentCount = target;
                        clearInterval(interval);
                    }
                    setCounts((prev) => ({ ...prev, [key]: currentCount }));
                }, 40);
            });
        }
    }, [dashboardData]);
    useEffect(() => {
        fetchDashboardData();
        // fetchDashboardDataLogin(); // Call this when component mounts
    }, []);

    useEffect(() => {
        fetchTasks(); // Call the function when the component mounts
    }, []);

    const fetchTasks = () => {
        const storedUser = localStorage.getItem("user");
        const token = localStorage.getItem("accesstoken");

        if (!token || !storedUser) {
            console.error("Missing user data or token in localStorage.");
            setTimeout(() => {
                navigate('/');
            }, 0);
            return;
        }

        const userData = JSON.parse(storedUser);
        const params = new FormData();
        params.set("companyid", userData.User.CompanyId);
        params.set("userloginid", userData.User.UserLoginId);

        setLoading(true);

        axios
            // .post("http:///Selfie/attendanceadmindashboard", params, {
            .post(`${config.BASE_URL}/Selfie/attendanceadmindashboard`, params, {
                headers: {
                    accesstokenkey: token,
                    "Content-Type": "application/json",
                },
            })
            .then((response) => {
                console.log("Fetched data:", response.data); // Log data to check if it's being set
                if (response.data) {
                    setAttendanceData(response.data);
                } else {
                    console.error("No data found:", response?.data?.message || "Unknown error");
                }
            })
            .catch((error) => {
                if (error.response) {
                    setTimeout(() => {
                        localStorage.clear();
                        navigate('/');
                    }, 0);
                } else {
                    console.error("Error fetching data:", error);
                }
            })
            .finally(() => {
                setLoading(false);
            });
    };


    const handleLogout = () => {
        localStorage.clear();
        setTimeout(() => {
            navigate("/");
        }, 0);
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
    const addTask = () => navigate('/addtask');
    const viewTask = () => navigate('/viewtask');
    const dailyTask = () => navigate('/dailytask');
    const userView = () => navigate('/userview');
    const dashboard = () => navigate('/dashboard');
    const ondailyview = () => navigate('/viewtask');
    const ondailyview1 = () => navigate('/dailytask');
    const onuserview = () => navigate('/userview');
    const handleprofile = () => navigate('/profile');
    const leaveview = () => navigate('/leave');
    return (
        <div className="desh-main">
            <div className="desh-inner-main">
                <div className="desh-child">
                    <div className="desh-inner-child">
                        <div className="desh-logo">
                            <img src="/assets/img/galaxy.png" alt="Galaxy Logo" />
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
                                <button onClick={dashboard}><RiDashboardHorizontalFill className="icon-task" /><span className="dash-task">Dashboard</span></button>
                            </div>
                            <div className="desh-btn">
                                <button onClick={addTask}><LuNotebookPen className="icon-task" /><span className="dash-task">Add Task</span></button>
                            </div>
                            <div className="desh-btn">
                                <button onClick={viewTask}><AiOutlineFundView className="icon-task" /><span className="dash-task taskk">View Task</span></button>
                            </div>
                            <div className="desh-btn">
                                <button onClick={dailyTask}><BiWallet className="icon-task" /><span className="dash-task">Daily Task</span></button>
                            </div>
                            <div className="desh-btn">
                                <button onClick={userView}><FaUserFriends className="icon-task" /><span className="dash-task">User</span></button>
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
                            <button className="btn-3" title="logout" onClick={handleLogout}><MdOutlineLogout className="log-out-icon" /></button>
                        </div>
                    </div>
                </div>
                <div className="desh-child">
                    <div className="desh-inner-child">
                        <div className="all-divs">
                        {/* <p  style={{marginBottom:'20px',fontWeight:'600',fontSize:'22px'}} data-discover="true">Dashboard</p> */}

                            {loading ? (
                                <p>Loading...</p>
                            ) : error ? (
                                <p className="error-message">{error}</p>
                            ) : (
                                <div className="dashbord-inner" style={{ display: 'block' }}>
                                    <div className="Dash-title" style={{ marginBottom: '30px' }}>
                                        <p>
                                            <Link to='/dashboard' className="mini-title" style={{ marginBottom: '20px' }}>
                                                {userRole === "admin" ? "Admin Dashboard" : "User Dashboard"}
                                            </Link>
                                            <span style={{ display: 'block', marginLeft: '10px' }}>
                                                Welcome <span>, {userFirstName} {userLastName}</span>
                                            </span>
                                        </p>
                                    </div>
                                    
                                    <div className="dashbord-inner-child" style={{ display: 'flex', flexWrap:'wrap' }} >
                                        <div className="item-d" style={{ borderColor: '#4fb054' }}>
                                            <div className="item-inner">
                                                <p className="title">Total Users</p><AiOutlineUsergroupAdd className="dashboard-icon" />
                                            </div>
                                            <p className="data-dash">{counts.TotalUser}</p>
                                            <div className="icon-inner" onClick={onuserview}>
                                                <span style={{ display: 'flex', color: '#4CAF50', border: '2px solid #4CAF50', opacity: '0.3', padding: '5px 10px', borderRadius: '7px' }}><p className="view-dashboard" style={{ marginRight: '3.5px' }}>view</p>
                                                    <FaAngleRight className="icon-dash-view" /></span>
                                            </div>
                                        </div>
                                        <div className="item-d">
                                            <div className="item-inner">
                                                <p className="title">Total Active Users</p><LuUserRoundCheck className="dashboard-icon-2" />
                                            </div>
                                            <p className="data-dash">{counts.TotalActiveUser}</p>
                                            <div className="icon-inner" onClick={onuserview}>
                                                <span style={{ display: 'flex', color: '#4CAF50', border: '2px solid #20b2f4', opacity: '0.3', padding: '5px 10px', borderRadius: '7px' }}><p className="view-dashboard" style={{ marginRight: '3.5px', color: '#20b2f4' }}>view</p>
                                                    <FaAngleRight className="icon-dash-view" style={{ color: '#20b2f4' }} /></span>
                                            </div>
                                        </div>
                                        {userRole === "admin" && (
                                            <div className="item-d">
                                                <div className="item-inner">
                                                    <p className="title">Total Login Users</p><LuUserRoundCheck className="dashboard-icon-2" style={{ color: '#fba01c' }} />
                                                </div>
                                                <p className="data-dash">{counts.TodayLoginUser}</p>
                                                <div className="icon-inner" onClick={onuserview}>
                                                    <span style={{ display: 'flex', color: '#fba01c', border: '2px solid #fba01c', opacity: '0.3', padding: '5px 10px', borderRadius: '7px' }}><p className="view-dashboard" style={{ marginRight: '3.5px', color: '#fba01c' }}>view</p>
                                                        <FaAngleRight className="icon-dash-view-3" style={{ color: '#fba01c' }} /></span>
                                                </div>
                                            </div>
                                        )}
                                        {userRole === "admin" && (
                                        
                                        <div className="item-d">
                                            <div className="item-inner">
                                                <p className="title">Employee On Leave</p>
                                                <LuUserRoundCheck className="dashboard-icon-2" style={{ color: '#fba01c', marginLeft:'109px'}} />
                                            </div>
                                            <p className="data-dash">{attendanceData?.leave?.toLocaleString() || "N/A"}</p>  {/* Use the 'leave' state here instead of dashboardData.leave */}
                                            <div className="icon-inner" onClick={onuserview}>
                                                <span style={{ display: 'flex', color: '#fba01c', border: '2px solid #fba01c', opacity: '0.3', padding: '5px 10px', borderRadius: '7px' }}>
                                                    <p className="view-dashboard" style={{ marginRight: '3.5px', color: '#fba01c' }}>view</p>
                                                    <FaAngleRight className="icon-dash-view-3" style={{ color: '#fba01c' }} />
                                                </span>
                                            </div>
                                        </div>
                                        
                                        )}
                                        {userRole === "admin" && (
                                        
                                        <div className="item-d">
                                            <div className="item-inner">
                                                <p className="title">Pending Leave Request:</p>
                                                <LuUserRoundCheck className="dashboard-icon-2" style={{ color: '#fba01c', marginLeft:'69px'}} />
                                            </div>
                                            <p className="data-dash">{attendanceData?.pendingleave?.toLocaleString() || "N/A"   }</p>  {/* Use the 'leave' state here instead of dashboardData.leave */}
                                            <div className="icon-inner" onClick={onuserview}>
                                                <span style={{ display: 'flex', color: '#fba01c', border: '2px solid #fba01c', opacity: '0.3', padding: '5px 10px', borderRadius: '7px' }}>
                                                    <p className="view-dashboard" style={{ marginRight: '3.5px', color: '#fba01c' }}>view</p>
                                                    <FaAngleRight className="icon-dash-view-3" style={{ color: '#fba01c' }} />
                                                </span>
                                            </div>
                                        </div>
                                        
                                        )}


                                    </div>
                                    <div className="Dash-title" style={{ margin: '30px 0px' }}>
                                        <p>
                                            <Link to='/dashboard' className="mini-title"> DailyTask</Link>
                                        </p>
                                    </div>
                                    <div className="dashbord-inner-child" style={{ display: 'flex' }}>

                                        <div className="item-d" style={{ borderColor: '#f9ba5d' }}>
                                            <div className="item-inner">
                                                <p className="title"> Today Tasks</p><FaTasks className="dashboard-icon-3" />
                                            </div>
                                            <p className="data-dash">{counts.TotalTodayUserTask}</p>
                                            <div className="icon-inner" onClick={ondailyview}>
                                                <span style={{ display: 'flex', color: '#4CAF50', border: '2px solid #fda31f', opacity: '0.3', padding: '5px 10px', borderRadius: '7px' }}><p className="view-dashboard" style={{ marginRight: '3.5px', color: '#fda31f' }}>view</p>
                                                    <FaAngleRight className="icon-dash-view" style={{ color: '#fda31f' }} /></span>
                                            </div>
                                        </div>

                                        <div className="item-d" style={{ borderColor: '#f2857e' }}>
                                            <div className="item-inner">
                                                <p className="title"> Today Pending Tasks</p><MdPendingActions className="dashboard-icon-4" />
                                            </div>
                                            <p className="data-dash">{counts.TotalTodayUserPendingTask}</p>
                                            <div className="icon-inner" onClick={ondailyview}>
                                                <span style={{ display: 'flex', color: '#4CAF50', border: '2px solid #f3594e', opacity: '0.3', padding: '5px 10px', borderRadius: '7px' }}><p className="view-dashboard" style={{ marginRight: '3.5px', color: '#f3594e' }}>view</p>
                                                    <FaAngleRight className="icon-dash-view" style={{ color: '#f3594e' }} /></span>
                                            </div>
                                        </div>

                                        <div className="item-d" style={{
                                            borderColor:
                                                '#c181d0'
                                        }}>
                                            <div className="item-inner">
                                                <p className="title">All Pending Tasks</p><MdOutlineMoreTime className="dashboard-icon-5" />
                                            </div>
                                            <p className="data-dash">{counts.TotalUserPendingTask}</p>
                                            <div className="icon-inner" onClick={ondailyview1}>
                                                <span style={{ display: 'flex', color: '#4CAF50', border: '2px solid #a640b9', opacity: '0.3', padding: '5px 10px', borderRadius: '7px' }}><p className="view-dashboard" style={{ marginRight: '3.5px', color: '#a640b9' }}>view</p>
                                                    <FaAngleRight className="icon-dash-view" style={{ color: '#a640b9' }} /></span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Conditional rendering for GALAXY ERP */}
                                    {userRole === "admin" && (
                                        <>
                                            <div className="Dash-title" style={{ margin: '30px 0px' }}>
                                                <p>
                                                    <Link to='/dashboard' className="mini-title">Overall </Link>
                                                </p>
                                            </div>
                                            <div className="dashbord-inner-child" style={{ display: 'flex' }}>
                                                <div className="item-d" style={{ borderColor: '#f9ba5d' }}>
                                                    <div className="item-inner">
                                                        <p className="title">Total Today Task</p><FaTasks className="dashboard-icon-3" />
                                                    </div>
                                                    <p className="data-dash">{counts.TotalTodayTask}</p>
                                                    <div className="icon-inner" onClick={ondailyview1}>
                                                        <span style={{ display: 'flex', color: '#4CAF50', border: '2px solid #fda31f', opacity: '0.3', padding: '5px 10px', borderRadius: '7px' }}><p className="view-dashboard" style={{ marginRight: '3.5px', color: '#fda31f' }}>view</p>
                                                            <FaAngleRight className="icon-dash-view" style={{ color: '#fda31f' }} /></span>
                                                    </div>
                                                </div>

                                                <div className="item-d" style={{ borderColor: '#f2857e' }}>
                                                    <div className="item-inner">
                                                        <p className="title">Total Today Pending Task</p><MdPendingActions className="dashboard-icon-4" />
                                                    </div>
                                                    <p className="data-dash">{counts.TotalTodayPendingTask}</p>
                                                    <div className="icon-inner" onClick={ondailyview1}>
                                                        <span style={{ display: 'flex', color: '#4CAF50', border: '2px solid #f3594e', opacity: '0.3', padding: '5px 10px', borderRadius: '7px' }}><p className="view-dashboard" style={{ marginRight: '3.5px', color: '#f3594e' }}>view</p>
                                                            <FaAngleRight className="icon-dash-view" style={{ color: '#f3594e' }} /></span>
                                                    </div>
                                                </div>

                                                <div className="item-d" style={{
                                                    borderColor:
                                                        '#c181d0'
                                                }}>
                                                    <div className="item-inner">
                                                        <p className="title">Total Pending Task</p><MdOutlineMoreTime className="dashboard-icon-5" />
                                                    </div>
                                                    <p className="data-dash">{counts.TotalPendingTask}</p>
                                                    <div className="icon-inner" onClick={ondailyview1}>
                                                        <span style={{ display: 'flex', color: '#4CAF50', border: '2px solid #a640b9', opacity: '0.3', padding: '5px 10px', borderRadius: '7px' }}><p className="view-dashboard" style={{ marginRight: '3.5px', color: '#a640b9' }}>view</p>
                                                            <FaAngleRight className="icon-dash-view" style={{ color: '#a640b9' }} /></span>
                                                    </div>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <ToastContainer />
        </div>
    );
}

export default Dashboard;











// const fetchDashboardDataLogin = () => {
//     const storedUser = localStorage.getItem("user");
//     const token = localStorage.getItem("accesstoken");
//     if (!token) {
//         console.error("Missing user data or token in localStorage.");
//         setTimeout(() => {
//             navigate('/');
//         }, 0);
//         return;
//     }

//     const userData = JSON.parse(storedUser);
//     const requestBody = {
//         companyid: String(userData.User.CompanyId),
//         userloginid: String(userData.User.UserLoginId),
//     };

//     setLoading(true);
//     setError(null);
//     axios
//         .post("http://192.168.10.20:8082/api/Selfie/attendanceadmindashboard", requestBody, {
//             headers: {
//                 accesstokenkey: token,
//                 "Content-Type": "application/json",
//             },
//         })
//         .then((response) => {
//             // Extract the 'leave' value from the response data
//             setLeave(response.data.leave);  // Store the 'leave' value
//             console.log(response.data);
//         })
//         .catch((error) => {
//             if (error.response) {
//                 setTimeout(() => {
//                     navigate('/');
//                 }, 0);
//             } else {
//                 setError("An unexpected error occurred. Please try again.");
//             }
//         })
//         .finally(() => {
//             setLoading(false);
//         });
// };




// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { toast, ToastContainer } from "react-toastify";
// import 'react-toastify/dist/ReactToastify.css';
// import { RiDashboardHorizontalFill } from "react-icons/ri";
// import { LuNotebookPen } from "react-icons/lu";
// import { FaUserAlt } from "react-icons/fa";
// import { FaAngleRight } from "react-icons/fa6";
// import { AiOutlineFundView, AiOutlineUsergroupAdd } from "react-icons/ai";
// import { BiWallet } from "react-icons/bi";
// import { FaUserFriends, FaTasks } from "react-icons/fa";
// import { MdOutlineLogout, MdPendingActions, MdOutlineMoreTime } from "react-icons/md";
// import { LuUserRoundCheck } from "react-icons/lu";
// import { Link, useNavigate } from "react-router-dom";
// import config from "./Config";

// const Dashboard = () => {

//     const [dashboardData, setDashboardData] = useState({});
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState(null);
//     const [userFirstName, setUserFirstName] = useState("");
//     const [userLastName, setUserLastName] = useState("");
//     const [counts, setCounts] = useState({});
//     const navigate = useNavigate();



//     useEffect(() => {
//         const userData = JSON.parse(localStorage.getItem("user"));
//         if (userData && userData.User) {
//             setUserFirstName(userData.User.ul_FirstName);
//             setUserLastName(userData.User.ul_LastName);
//         } else {
//             console.error("User data is missing or invalid.");
//         }
//     }, []);

//     const fetchDashboardData = () => {
//         const storedUser = localStorage.getItem("user");
//         const token = localStorage.getItem("accesstoken");

//         if (!token) {
//             console.error("Missing user data or token in localStorage.");
//             setTimeout(() => {
//                 navigate('/');
//             }, 0);
//             return;
//         }

//         const userData = JSON.parse(storedUser);

//         const requestBody = {
//             companyid: String(userData.User.CompanyId),
//             userloginid: String(userData.User.UserLoginId),
//         };

//         setLoading(true);
//         setError(null);

//         axios
//             // .post("http://192.168.10.20:8082/api/Task/taskadmindashboard", requestBody, {
//             .post(`${config.BASE_URL}/Task/taskadmindashboard`, requestBody, {

//                 headers: {
//                     accesstokenkey: token,
//                     "Content-Type": "application/json",
//                 },
//             })
//             .then((response) => {
//                 setDashboardData(response.data);
//                 console.log(response.data);

//             })
//             .catch((error) => {
//                 if (error.response) {

//                     setTimeout(() => {
//                         navigate('/');
//                     }, 0);
//                 } else {
//                     setError("An unexpected error occurred. Please try again.");
//                 }
//             })
//             .finally(() => {
//                 setLoading(false);
//             });
//     };

//     useEffect(() => {
//         fetchDashboardData();
//     }, []);

//     useEffect(() => {
//         if (Object.keys(dashboardData).length > 0) {
//             const keys = [
//                 "TotalUser",
//                 "TotalActiveUser",
//                 "TotalTodayUserTask",
//                 "TotalTodayUserPendingTask",
//                 "TotalUserPendingTask",
//                 "TotalTodayTask",
//                 "TotalTodayPendingTask",
//                 "TotalPendingTask"
//             ];

//             const initialCounts = keys.reduce((acc, key) => {
//                 acc[key] = 0;
//                 return acc;
//             }, {});

//             setCounts(initialCounts);

//             keys.forEach((key) => {
//                 let currentCount = 0;
//                 const target = dashboardData[key] || 0;
//                 const increment = Math.ceil(target / 100);
//                 const interval = setInterval(() => {
//                     currentCount += increment;
//                     if (currentCount >= target) {
//                         currentCount = target;
//                         clearInterval(interval);
//                     }
//                     setCounts((prev) => ({ ...prev, [key]: currentCount }));
//                 }, 40);
//             });
//         }
//     }, [dashboardData]);

//     const handleLogout = () => {
//         // localStorage.removeItem("firstname");
//         // localStorage.removeItem("lastname");
//         // localStorage.removeItem("accesstoken");
//         // localStorage.removeItem("user");
//         localStorage.clear();
//         setTimeout(() => {
//             navigate("/");
//         }, 0);
//     };

//     const addTask = () => navigate('/addtask');
//     const viewTask = () => navigate('/viewtask');
//     const dailyTask = () => navigate('/dailytask');
//     const userView = () => navigate('/user');
//     const dashboard = () => navigate('/dashboard');
//     const ondailyview = () => navigate('/dailytask')
//     const onuserview = () => navigate('/user');
//     const handleprofile = () => navigate('/profile');

//     return (
//         <div className="desh-main">
//             <div className="desh-inner-main">
//                 <div className="desh-child">
//                     <div className="desh-inner-child">
//                         <div className="desh-logo">
//                             <img src="/assets/img/galaxy.png" alt="Galaxy Logo" />
//                             <div className="user-info">
//                                 {userFirstName && userLastName ? (
//                                     <span>{userFirstName} {userLastName}</span>
//                                 ) : (
//                                     <p>No user data found.</p>
//                                 )}
//                             </div>
//                         </div>
//                         <div className="desh-btns">
//                             <div className="desh-btn">
//                                 <button onClick={dashboard}><RiDashboardHorizontalFill className="icon-task" /><span className="dash-task">Dashboard</span></button>
//                             </div>
//                             <div className="desh-btn">
//                                 <button onClick={addTask}><LuNotebookPen className="icon-task" /><span className="dash-task">Add Task</span></button>
//                             </div>
//                             <div className="desh-btn">
//                                 <button onClick={viewTask}><AiOutlineFundView className="icon-task" /><span className="dash-task taskk">View Task</span></button>
//                             </div>
//                             <div className="desh-btn">
//                                 <button onClick={dailyTask}><BiWallet className="icon-task" /><span className="dash-task">Daily Task</span></button>
//                             </div>
//                             <div className="desh-btn">
//                                 <button onClick={userView}><FaUserFriends className="icon-task" /><span className="dash-task">User</span></button>
//                             </div>
//                         </div>
//                         <p className="version-main">V 1.0.2</p>
//                         <div className="log-out-new">
//                             <button className="btn-profile" onClick={handleprofile}><FaUserAlt className="icon-pro" /></button>
//                             <button className="btn-3" title="logout" onClick={handleLogout}><MdOutlineLogout className="log-out-icon" /></button>
//                         </div>
//                     </div>
//                 </div>
//                 <div className="desh-child">
//                     <div className="desh-inner-child">
//                         <div className="all-divs">

//                             {loading ? (
//                                 <p>Loading...</p>
//                             ) : error ? (
//                                 <p className="error-message">{error}</p>
//                             ) : (

//                                 <div className="dashbord-inner" style={{ display: 'block' }}>
//                                     <div className="Dash-title" style={{ marginBottom: '30px' }}>
//                                         <p>
//                                             <Link to='/dashboard' className="mini-title"> Dashboard</Link>
//                                             <span style={{ display: 'block', marginLeft: '10px' }}>Welcome <span >,
//                                                 {userFirstName} {userLastName}
//                                             </span></span>
//                                         </p>
//                                     </div>
//                                     <div className="dashbord-inner-child" style={{ display: 'flex' }} >

//                                         <div className="item-d" style={{ borderColor: '#4fb054' }}>
//                                             <div className="item-inner">
//                                                 <p className="title">Total Users</p><AiOutlineUsergroupAdd className="dashboard-icon" />
//                                             </div>
//                                             <p className="data-dash">{counts.TotalUser}</p>
//                                             <div className="icon-inner" onClick={onuserview}>
//                                                 <span style={{ display: 'flex', color: '#4CAF50', border: '2px solid #4CAF50', opacity: '0.3', padding: '5px 10px', borderRadius: '7px' }}><p className="view-dashboard" style={{ marginRight: '3.5px' }}>view</p>
//                                                     <FaAngleRight className="icon-dash-view" /></span>
//                                             </div>
//                                         </div>

//                                         <div className="item-d">
//                                             <div className="item-inner">
//                                                 <p className="title">Total Active Users</p><LuUserRoundCheck className="dashboard-icon-2" />
//                                             </div>
//                                             <p className="data-dash">{counts.TotalActiveUser}</p>
//                                             <div className="icon-inner" onClick={onuserview}>
//                                                 <span style={{ display: 'flex', color: '#4CAF50', border: '2px solid #20b2f4', opacity: '0.3', padding: '5px 10px', borderRadius: '7px' }}><p className="view-dashboard" style={{ marginRight: '3.5px', color: '#20b2f4' }}>view</p>
//                                                     <FaAngleRight className="icon-dash-view" style={{ color: '#20b2f4' }} /></span>
//                                             </div>
//                                         </div>
//                                     </div>
//                                     <div className="Dash-title" style={{ margin: '30px 0px' }}>
//                                         <p>
//                                             <Link to='/dashboard' className="mini-title"> DailyTask</Link>
//                                         </p>
//                                     </div>
//                                     <div className="dashbord-inner-child" style={{ display: 'flex' }}>

//                                         <div className="item-d" style={{ borderColor: '#f9ba5d' }}>
//                                             <div className="item-inner">
//                                                 <p className="title"> Today Tasks</p><FaTasks className="dashboard-icon-3" />
//                                             </div>
//                                             <p className="data-dash">{counts.TotalTodayUserTask}</p>
//                                             <div className="icon-inner" onClick={ondailyview}>
//                                                 <span style={{ display: 'flex', color: '#4CAF50', border: '2px solid #fda31f', opacity: '0.3', padding: '5px 10px', borderRadius: '7px' }}><p className="view-dashboard" style={{ marginRight: '3.5px', color: '#fda31f' }}>view</p>
//                                                     <FaAngleRight className="icon-dash-view" style={{ color: '#fda31f' }} /></span>
//                                             </div>
//                                         </div>

//                                         <div className="item-d" style={{ borderColor: '#f2857e' }}>
//                                             <div className="item-inner">
//                                                 <p className="title"> Today Pending Tasks</p><MdPendingActions className="dashboard-icon-4" />
//                                             </div>
//                                             <p className="data-dash">{counts.TotalTodayUserPendingTask}</p>
//                                             <div className="icon-inner" onClick={ondailyview}>
//                                                 <span style={{ display: 'flex', color: '#4CAF50', border: '2px solid #f3594e', opacity: '0.3', padding: '5px 10px', borderRadius: '7px' }}><p className="view-dashboard" style={{ marginRight: '3.5px', color: '#f3594e' }}>view</p>
//                                                     <FaAngleRight className="icon-dash-view" style={{ color: '#f3594e' }} /></span>
//                                             </div>
//                                         </div>

//                                         <div className="item-d" style={{
//                                             borderColor:
//                                                 '#c181d0'
//                                         }}>
//                                             <div className="item-inner">
//                                                 <p className="title">All Pending Tasks</p><MdOutlineMoreTime className="dashboard-icon-5" />
//                                             </div>
//                                             <p className="data-dash">{counts.TotalUserPendingTask}</p>
//                                             <div className="icon-inner" onClick={ondailyview}>
//                                                 <span style={{ display: 'flex', color: '#4CAF50', border: '2px solid #a640b9', opacity: '0.3', padding: '5px 10px', borderRadius: '7px' }}><p className="view-dashboard" style={{ marginRight: '3.5px', color: '#a640b9' }}>view</p>
//                                                     <FaAngleRight className="icon-dash-view" style={{ color: '#a640b9' }} /></span>
//                                             </div>
//                                         </div>
//                                     </div>
//                                     <div className="Dash-title" style={{ margin: '30px 0px' }}>
//                                         <p>
//                                             <Link to='/dashboard' className="mini-title">Total DailyTask</Link>
//                                         </p>
//                                     </div>
//                                     <div className="dashbord-inner-child" style={{ display: 'flex' }}>

//                                         <div className="item-d" style={{ borderColor: '#f9ba5d' }}>
//                                             <div className="item-inner">
//                                                 <p className="title">TotalTodayTask</p><FaTasks className="dashboard-icon-3" />
//                                             </div>
//                                             <p className="data-dash">{counts.TotalTodayTask}</p>
//                                             <div className="icon-inner" onClick={ondailyview}>
//                                                 <span style={{ display: 'flex', color: '#4CAF50', border: '2px solid #fda31f', opacity: '0.3', padding: '5px 10px', borderRadius: '7px' }}><p className="view-dashboard" style={{ marginRight: '3.5px', color: '#fda31f' }}>view</p>
//                                                     <FaAngleRight className="icon-dash-view" style={{ color: '#fda31f' }} /></span>
//                                             </div>
//                                         </div>

//                                         <div className="item-d" style={{ borderColor: '#f2857e' }}>
//                                             <div className="item-inner">
//                                                 <p className="title">TotalTodayPendingTask</p><MdPendingActions className="dashboard-icon-4" />
//                                             </div>
//                                             <p className="data-dash">{counts.TotalTodayPendingTask}</p>
//                                             <div className="icon-inner" onClick={ondailyview}>
//                                                 <span style={{ display: 'flex', color: '#4CAF50', border: '2px solid #f3594e', opacity: '0.3', padding: '5px 10px', borderRadius: '7px' }}><p className="view-dashboard" style={{ marginRight: '3.5px', color: '#f3594e' }}>view</p>
//                                                     <FaAngleRight className="icon-dash-view" style={{ color: '#f3594e' }} /></span>
//                                             </div>
//                                         </div>

//                                         <div className="item-d" style={{
//                                             borderColor:
//                                                 '#c181d0'
//                                         }}>
//                                             <div className="item-inner">
//                                                 <p className="title">TotalPendingTask</p><MdOutlineMoreTime className="dashboard-icon-5" />
//                                             </div>
//                                             <p className="data-dash">{counts.TotalPendingTask}</p>
//                                             <div className="icon-inner" onClick={ondailyview}>
//                                                 <span style={{ display: 'flex', color: '#4CAF50', border: '2px solid #a640b9', opacity: '0.3', padding: '5px 10px', borderRadius: '7px' }}><p className="view-dashboard" style={{ marginRight: '3.5px', color: '#a640b9' }}>view</p>
//                                                     <FaAngleRight className="icon-dash-view" style={{ color: '#a640b9' }} /></span>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </div>
//                             )}
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };
// export default Dashboard;
















// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { toast, ToastContainer } from "react-toastify";
// import 'react-toastify/dist/ReactToastify.css';
// import { RiDashboardHorizontalFill } from "react-icons/ri";
// import { LuNotebookPen } from "react-icons/lu";
// import { FaUserAlt } from "react-icons/fa";
// import { FaAngleRight } from "react-icons/fa6";
// import { AiOutlineFundView, AiOutlineUsergroupAdd } from "react-icons/ai";
// import { BiWallet } from "react-icons/bi";
// import { FaUserFriends, FaTasks } from "react-icons/fa";
// import { MdOutlineLogout, MdPendingActions, MdOutlineMoreTime } from "react-icons/md";
// import { LuUserRoundCheck } from "react-icons/lu";
// import { Link, useNavigate } from "react-router-dom";
// import config from "./Config";

// const Dashboard = () => {
//     const [dashboardData, setDashboardData] = useState({});
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState(null);
//     const [userFirstName, setUserFirstName] = useState("");
//     const [userLastName, setUserLastName] = useState("");
//     const [counts, setCounts] = useState({});
//     const navigate = useNavigate();

//     useEffect(() => {
//         const userData = JSON.parse(localStorage.getItem("user"));
//         if (userData && userData.User) {
//             setUserFirstName(userData.User.ul_FirstName);
//             setUserLastName(userData.User.ul_LastName);
//         } else {
//             console.error("User data is missing or invalid.");
//         }
//     }, []);

//     const fetchDashboardData = () => {
//         const storedUser = localStorage.getItem("user");
//         const token = localStorage.getItem("accesstoken");

//         if (!token) {
//             console.error("Missing user data or token in localStorage.");
//             setTimeout(() => {
//                 navigate('/');
//             }, 0);
//             return;
//         }

//         const userData = JSON.parse(storedUser);

//         const requestBody = {
//             companyid: String(userData.User.CompanyId),
//             userloginid: String(userData.User.UserLoginId),
//         };

//         setLoading(true);
//         setError(null);

//         axios
//             .post(`${config.BASE_URL}/Task/taskadmindashboard`, requestBody, {
//                 headers: {
//                     accesstokenkey: token,
//                     "Content-Type": "application/json",
//                 },
//             })
//             .then((response) => {
//                 setDashboardData(response.data);
//                 console.log(response.data);
//             })
//             .catch((error) => {
//                 if (error.response) {
//                     setTimeout(() => {
//                         navigate('/');
//                     }, 0);
//                 } else {
//                     setError("An unexpected error occurred. Please try again.");
//                 }
//             })
//             .finally(() => {
//                 setLoading(false);
//             });
//     };

//     useEffect(() => {
//         fetchDashboardData();
//     }, []);

//     useEffect(() => {
//         if (Object.keys(dashboardData).length > 0) {
//             const keys = [
//                 "TotalUser",
//                 "TotalActiveUser",
//                 "TotalTodayUserTask",
//                 "TotalTodayUserPendingTask",
//                 "TotalUserPendingTask",
//                 "TotalTodayTask",
//                 "TotalTodayPendingTask",
//                 "TotalPendingTask"
//             ];

//             const initialCounts = keys.reduce((acc, key) => {
//                 acc[key] = 0;
//                 return acc;
//             }, {});

//             setCounts(initialCounts);

//             keys.forEach((key) => {
//                 let currentCount = 0;
//                 const target = dashboardData[key] || 0;
//                 const increment = Math.ceil(target / 100);
//                 const interval = setInterval(() => {
//                     currentCount += increment;
//                     if (currentCount >= target) {
//                         currentCount = target;
//                         clearInterval(interval);
//                     }
//                     setCounts((prev) => ({ ...prev, [key]: currentCount }));
//                 }, 40);
//             });
//         }
//     }, [dashboardData]);

//     const handleLogout = () => {
//         localStorage.clear();
//         setTimeout(() => {
//             navigate("/");
//         }, 0);
//     };

//     const addTask = () => navigate('/addtask');
//     const viewTask = () => navigate('/viewtask');
//     const dailyTask = () => navigate('/dailytask');
//     const userView = () => navigate('/user');
//     const dashboard = () => navigate('/dashboard');
//     const ondailyview = () => navigate('/dailytask')
//     const onuserview = () => navigate('/user');
//     const handleprofile = () => navigate('/profile');

//     return (
//         <div className="desh-main">
//             <div className="desh-inner-main">
//                 <div className="desh-child">
//                     <div className="desh-inner-child">
//                         <div className="desh-logo">
//                             <img src="/assets/img/galaxy.png" alt="Galaxy Logo" />
//                             <div className="user-info">
//                                 {userFirstName && userLastName ? (
//                                     <span>{userFirstName} {userLastName}</span>
//                                 ) : (
//                                     <p>No user data found.</p>
//                                 )}
//                             </div>
//                         </div>
//                         <div className="desh-btns">
//                             <div className="desh-btn">
//                                 <button onClick={dashboard}><RiDashboardHorizontalFill className="icon-task" /><span className="dash-task">Dashboard</span></button>
//                             </div>
//                             <div className="desh-btn">
//                                 <button onClick={addTask}><LuNotebookPen className="icon-task" /><span className="dash-task">Add Task</span></button>
//                             </div>
//                             <div className="desh-btn">
//                                 <button onClick={viewTask}><AiOutlineFundView className="icon-task" /><span className="dash-task taskk">View Task</span></button>
//                             </div>
//                             <div className="desh-btn">
//                                 <button onClick={dailyTask}><BiWallet className="icon-task" /><span className="dash-task">Daily Task</span></button>
//                             </div>
//                             <div className="desh-btn">
//                                 <button onClick={userView}><FaUserFriends className="icon-task" /><span className="dash-task">User</span></button>
//                             </div>
//                         </div>
//                         <p className="version-main">V 1.0.2</p>
//                         <div className="log-out-new">
//                             <button className="btn-profile" onClick={handleprofile}><FaUserAlt className="icon-pro" /></button>
//                             <button className="btn-3" title="logout" onClick={handleLogout}><MdOutlineLogout className="log-out-icon" /></button>
//                         </div>
//                     </div>
//                 </div>
//                 <div className="desh-child">
//                     <div className="desh-inner-child">
//                         <div className="all-divs">
//                             {loading ? (
//                                 <p>Loading...</p>
//                             ) : error ? (
//                                 <p className="error-message">{error}</p>
//                             ) : (
//                                 <div className="dashbord-inner" style={{ display: 'block' }}>
//                                     <div className="Dash-title" style={{ marginBottom: '30px' }}>
//                                         <p>
//                                             <Link to='/dashboard' className="mini-title"> Dashboard</Link>
//                                             <span style={{ display: 'block', marginLeft: '10px' }}>Welcome <span >,
//                                                 {userFirstName} {userLastName}
//                                             </span></span>
//                                         </p>
//                                     </div>
//                                     {/* Conditional rendering based on user name */}
//                                     {(userFirstName === "GALAXY" && userLastName === "ERP") && (
//                                         <>
//                                             <div className="Dash-title" style={{ margin: '30px 0px' }}>
//                                                 <p>
//                                                     <Link to='/dashboard' className="mini-title"> Total DailyTask</Link>
//                                                 </p>
//                                             </div>
//                                             <div className="dashbord-inner-child" style={{ display: 'flex' }}>
//                                                 <div className="item-d" style={{ borderColor: '#f9ba5d' }}>
//                                                     <div className="item-inner">
//                                                         <p className="title">TotalTodayTask</p><FaTasks className="dashboard-icon-3" />
//                                                     </div>
//                                                     <p className="data-dash">{counts.TotalTodayTask}</p>
//                                                     <div className="icon-inner" onClick={ondailyview}>
//                                                         <span style={{ display: 'flex', color: '#4CAF50', border: '2px solid #fda31f', opacity: '0.3', padding: '5px 10px', borderRadius: '7px' }}><p className="view-dashboard" style={{ marginRight: '3.5px', color: '#fda31f' }}>view</p>
//                                                             <FaAngleRight className="icon-dash-view" style={{ color: '#fda31f' }} /></span>
//                                                     </div>
//                                                 </div>

//                                                 <div className="item-d" style={{ borderColor: '#f2857e' }}>
//                                                     <div className="item-inner">
//                                                         <p className="title">TotalTodayPendingTask</p><MdPendingActions className="dashboard-icon-4" />
//                                                     </div>
//                                                     <p className="data-dash">{counts.TotalTodayPendingTask}</p>
//                                                     <div className="icon-inner" onClick={ondailyview}>
//                                                         <span style={{ display: 'flex', color: '#4CAF50', border: '2px solid #f3594e', opacity: '0.3', padding: '5px 10px', borderRadius: '7px' }}><p className="view-dashboard" style={{ marginRight: '3.5px', color: '#f3594e' }}>view</p>
//                                                             <FaAngleRight className="icon-dash-view" style={{ color: '#f3594e' }} /></span>
//                                                     </div>
//                                                 </div>

//                                                 <div className="item-d" style={{ borderColor: '#c181d0' }}>
//                                                     <div className="item-inner">
//                                                         <p className="title">TotalPendingTask</p><MdOutlineMoreTime className="dashboard-icon-5" />
//                                                     </div>
//                                                     <p className="data-dash">{counts.TotalPendingTask}</p>
//                                                     <div className="icon-inner" onClick={ondailyview}>
//                                                         <span style={{ display: 'flex', color: '#4CAF50', border: '2px solid #a640b9', opacity: '0.3', padding: '5px 10px', borderRadius: '7px' }}><p className="view-dashboard" style={{ marginRight: '3.5px', color: '#a640b9' }}>view</p>
//                                                             <FaAngleRight className="icon-dash-view" style={{ color: '#a640b9' }} /></span>
//                                                     </div>
//                                                 </div>
//                                             </div>
//                                         </>
//                                     )}
//                                 </div>
//                             )}
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default Dashboard;

























// <div className="dashbord-inner">
//     <div className="item-d">
//         <div className="item-inner">
//             <p className="title">Total Users</p><AiOutlineUsergroupAdd className="dashboard-icon" />
//         </div>
//         <p className="data-dash">{counts.TotalUser}</p>
//         <div className="icon-inner" onClick={onuserview}>
//             <span style={{ display: 'flex', color: '#4CAF50', border: '2px solid #4CAF50', opacity: '0.3', padding: '5px 10px', borderRadius: '7px' }}><p className="view-dashboard" style={{ marginRight: '3.5px' }}>view</p>
//                 <FaAngleRight className="icon-dash-view" /></span>
//         </div>

//     </div>
//     <div className="item-d">
//         <div className="item-inner">
//             <p className="title">Total Active Users</p><LuUserRoundCheck className="dashboard-icon-2" />
//         </div>
//         <p className="data-dash">{counts.TotalActiveUser}</p>
//         <div className="icon-inner" onClick={onuserview}>
//             <span style={{ display: 'flex', color: '#4CAF50', border: '2px solid #20b2f4', opacity: '0.3', padding: '5px 10px', borderRadius: '7px' }}><p className="view-dashboard" style={{ marginRight: '3.5px', color: '#20b2f4' }}>view</p>
//                 <FaAngleRight className="icon-dash-view" style={{ color: '#20b2f4' }} /></span>
//         </div>
//     </div>
//     <div className="item-d">
//         <div className="item-inner">
//             <p className="title">Total Tasks Today</p><FaTasks className="dashboard-icon-3" />
//         </div>
//         <p className="data-dash">{counts.TotalTodayTask}</p>
//         <div className="icon-inner" onClick={ondailyview}>
//             <span style={{ display: 'flex', color: '#4CAF50', border: '2px solid #fda31f', opacity: '0.3', padding: '5px 10px', borderRadius: '7px' }}><p className="view-dashboard" style={{ marginRight: '3.5px', color: '#fda31f' }}>view</p>
//                 <FaAngleRight className="icon-dash-view" style={{ color: '#fda31f' }} /></span>
//         </div>

//     </div>
//     <div className="item-d">
//         <div className="item-inner">
//             <p className="title">Pending Tasks Today</p><MdPendingActions className="dashboard-icon-4" />
//         </div>
//         <p className="data-dash">{counts.TotalTodayPendingTask}</p>
//         <div className="icon-inner" onClick={ondailyview}>
//             <span style={{ display: 'flex', color: '#4CAF50', border: '2px solid #f3594e', opacity: '0.3', padding: '5px 10px', borderRadius: '7px' }}><p className="view-dashboard" style={{ marginRight: '3.5px', color: '#f3594e' }}>view</p>
//                 <FaAngleRight className="icon-dash-view" style={{ color: '#f3594e' }} /></span>
//         </div>

//     </div>
//     <div className="item-d">
//         <div className="item-inner">
//             <p className="title">Total Pending Tasks</p><MdOutlineMoreTime className="dashboard-icon-5" />
//         </div>

//         <p className="data-dash">{counts.TotalPendingTask}</p>
//         <div className="icon-inner" onClick={ondailyview}>
//             <span style={{ display: 'flex', color: '#4CAF50', border: '2px solid #a640b9', opacity: '0.3', padding: '5px 10px', borderRadius: '7px' }}><p className="view-dashboard" style={{ marginRight: '3.5px', color: '#a640b9' }}>view</p>
//                 <FaAngleRight className="icon-dash-view" style={{ color: '#a640b9' }} /></span>
//         </div>
//     </div>
// </div>
