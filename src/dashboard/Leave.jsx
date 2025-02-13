import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { LuNotebookPen } from "react-icons/lu";
import { AiOutlineFundView } from "react-icons/ai";
import { RiDashboardHorizontalFill } from "react-icons/ri";
import { BiWallet } from "react-icons/bi";
import { FaUserAlt } from "react-icons/fa";
import { FaUserFriends } from "react-icons/fa";
import { FaSearchengin } from "react-icons/fa6";
import { IoClose } from "react-icons/io5";
import config from "./Config";
import { MdOutlineLogout } from "react-icons/md";
import { toast } from "react-toastify";

const Leave = () => {
    const [loading, setLoading] = useState(true);
    const [leaveRequests, setLeaveRequests] = useState([]);
    const [userFirstName, setUserFirstName] = useState("");
    const [userLastName, setUserLastName] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedLeaveRequests, setSelectedLeaveRequests] = useState([]);
    const [approvalRemark, setApprovalRemark] = useState("");
    const [leaveType, setLeaveType] = useState("F"); // Default to 'Full Day'
    const [AppReg, setAppReg] = useState("2"); 
    const [NewAppReg, setNewAppReg] = useState(""); 

    const navigate = useNavigate();
    const taskRemarkRef = useRef();

    const fetchTasks = () => {
        const storedUser = localStorage.getItem("user");
        const token = localStorage.getItem("accesstoken");
        if (!token) {
            console.error("Missing user data or token in localStorage.");
            setTimeout(() => {
                navigate('/leave');
            }, 0);
            return;
        }

        if (storedUser) {
            const userData = JSON.parse(storedUser);
            const params = new FormData();
            params.set("companyid", userData.User.CompanyId);
            params.set("userloginid", userData.User.UserLoginId);
            params.set("role", userData.User.ul_Role);

            setLoading(true);
            axios.post(`${config.BASE_URL}/Leave/pendingleaverequest`, params, {
                headers: {
                    accesstokenkey: token,
                    "Content-Type": "application/json",
                },
            })
                .then((response) => {
                    console.log("Leave Request Response:", response);
                    if (response.data && response.data.LeaveRequest) {
                        setLeaveRequests(response.data.LeaveRequest);
                    } else {
                        console.error("No leave requests found:", response?.data?.message || "Unknown error");
                    }
                })
                .catch((error) => {
                    if (error.response) {
                        setTimeout(() => {
                            localStorage.clear();
                            navigate('/');
                        }, 0);
                    }
                })
                .finally(() => {
                    setLoading(false);
                });
        }
    };

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
        fetchTasks();
    }, []);

    const handleLogout = () => {
        localStorage.clear();
        setTimeout(() => {
            navigate("/");
        }, 0);
    };

    const addtask = () => { navigate('/addtask') }
    const viewtask = () => { navigate('/viewtask') }
    const dailytask = () => { navigate('/dailytask'); };
    const userview = () => { navigate('/userview'); };
    const dashboard = () => { navigate('/dashboard'); }
    const handleprofile = () => navigate('/profile');
    const leaveview = () => navigate('/leave');
    const  OnSearch = () => {
        navigate('/search');
    }

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const handleCheckboxChange = (index, isChecked) => {
        if (isChecked) {
            setSelectedLeaveRequests([...selectedLeaveRequests, index]);
        } else {
            setSelectedLeaveRequests(selectedLeaveRequests.filter(item => item !== index));
        }
    };

    const handleRemarkChange = (e) => {
        setApprovalRemark(e.target.value);
    };

    const handleLeaveTypeChange = (type) => {
        setLeaveType(type);
    };

    const handleAppReg = (ee) => {
        setAppReg(ee);
        console.log("ee: ", ee);
    };

    const handleLeaveRequestUpdate = (e) => {
        console.log("Button clicked:", e === '1' ? "Approve" : "Reject");

        setAppReg(e);

        const updateData = {
            LeaveRequest: selectedLeaveRequests.map(index => {
                const request = leaveRequests[index];
                return {
                    LeaveMasterId: request.LeaveMasterId.toString(),
                    UserLoginId: request.UserLoginId.toString(),
                    ForUserLoginId: request.ForUserLoginId.toString(),
                    CompanyId: request.CompanyId.toString(),
                    IsApproved: e === '1' ? '1' : '0', 
                    IsRejected: e === '0' ? '1' : '0',
                    ApprovalRemark: approvalRemark,
                    H_FDayAppr: leaveType, 
                };
            }),
        };

        console.log("Updating leave requests with the following data:");
        console.log(JSON.stringify(updateData, null, 2)); 

        const token = localStorage.getItem("accesstoken");

        axios
            .post(`${config.BASE_URL}/Leave/updateleaverequest`, updateData, {
                headers: {
                    accesstokenkey: token,
                    "Content-Type": "application/json",
                },
            })
            .then((response) => {
                console.log("Update Response:", response);
                if (response.data && response.data.message === "Success") {
                    // toast.success("Leave request updated successfully!");
                    setSelectedLeaveRequests([]); 
                    fetchTasks(); 
                    closeModal(); 
                    setApprovalRemark(""); 
                } else {
                    toast.error("Failed to update leave request.");
                }
            })
            .catch((error) => {
                toast.error("An error occurred while updating the leave request.");
            });
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
                                    <button className='dailytaskbtn' onClick={OnSearch}><FaSearchengin  className="icon-task" /><span className="dash-task">Search</span></button>
                                </div>
                                <div className="desh-btn">
                                    <button onClick={addtask}><LuNotebookPen className="icon-task" /><span className="dash-task">Add Task</span></button>
                                </div>
                                <div className="desh-btn">
                                    <button className='viewtaskbtn' onClick={viewtask}><AiOutlineFundView className="icon-task" /><span className="dash-task">View Task</span> </button>
                                </div>
                                <div className="desh-btn">
                                    <button className='dailytaskbtn' onClick={dailytask}><BiWallet className="icon-task" /><span className="dash-task">Daily-task</span></button>
                                </div>
                                <div className="desh-btn">
                                    <button className='dailytaskbtn' onClick={userview}><FaUserFriends className="icon-task" /><span className="dash-task">User</span></button>
                                </div>
                                <div className="desh-btn">
                                    <button className='dailytaskbtn' onClick={leaveview}><FaUserFriends className="icon-task" /><span className="dash-task">LeaveRequest</span></button>
                                </div>
                            </div>
                            <p className="version-main">V 1.0.5</p>
                            <div className="log-out-new">
                                <button className="btn-profile" onClick={handleprofile}><FaUserAlt className="icon-pro" /></button>
                                <button onClick={handleLogout} className="btn-3" title="logout"><MdOutlineLogout className="log-out-icon" /></button>
                            </div>
                        </div>
                    </div>

                    <div className="desh-child">
                        <div className="desh-inner-child">
                            <div className="all-man-">
                                <div className="all-divs">
                                    <div className="main-div-table">
                                        {selectedLeaveRequests.length > 0 && (
                                            <button style={{ padding: '8px 13px', backgroundColor: '#2e88f5', borderRadius: '5px', border: 'none',color:'white' }} id="button-popup" onClick={openModal}>
                                                Done
                                            </button>
                                        )}
                                        <div className="main-table-inner">
                                            {loading ? (
                                                <p>Loading...</p>
                                            ) : leaveRequests.length > 0 ? (
                                                <table border={3}>
                                                    <thead>
                                                        <tr>
                                                            <th>Index</th>
                                                            <th>Leave</th>
                                                            <th>Date</th>
                                                            <th>Name</th>
                                                            <th>Reason</th>
                                                            <th>Day</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {leaveRequests.map((request, index) => (
                                                            <tr key={index}>
                                                                <td>{index + 1}</td>
                                                                <td>
                                                                    <input
                                                                        type="checkbox"
                                                                        checked={selectedLeaveRequests.includes(index)}
                                                                        onChange={(e) => handleCheckboxChange(index, e.target.checked)}
                                                                    />
                                                                </td>
                                                                <td>{request.Date}</td>
                                                                <td>{request.ul_FirstName} {request.ul_LastName}</td>
                                                                <td>{request.Reason}</td>
                                                                <td>{request.H_FDay === "F"
                                                                        ? "Full Day"
                                                                        :request.H_FDay === "H"
                                                                        ?"Half Day"
                                                                        :request.H_FDay}</td>
                                                                
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            ) : (
                                                <p>No leave requests found.</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Modal Popup */}
                    {isModalOpen && (
                        <div className="modal">
                            <div className="modal-content">
                                <span className="close" onClick={closeModal}>&times;</span>

                                <form action="">
                                    <div className="remark-div">
                                        <label htmlFor="remark">Remark:</label><br /><br />
                                        <textarea
                                            ref={taskRemarkRef}
                                            type="text"
                                            className="leave-textarea"
                                            value={approvalRemark}
                                            onChange={handleRemarkChange}
                                        />
                                    </div>
                                    <div className="radio-btn-div">
                                        <div className="full">
                                            <input
                                                type="radio"
                                                name="leave"
                                                id="approve"
                                                checked={leaveType === 'F'}
                                                onChange={() => handleLeaveTypeChange('F')}
                                            />Full Day
                                        </div>
                                        <div className="half">
                                            <input
                                                type="radio"
                                                name="leave"
                                                id="reject"
                                                checked={leaveType === 'H'}
                                                onChange={() => handleLeaveTypeChange('H')}
                                            />Half Day
                                        </div>
                                    </div>
                                    <div className="div-btn-leave">
                                        <button type="button" className="approve" onClick={() => handleLeaveRequestUpdate('1')} >
                                            Approve
                                        </button>
                                        <button type="button" className="rejecte" onClick={() => handleLeaveRequestUpdate('0')}>
                                            Reject
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default Leave;
















// final-------------------------
// import axios from "axios";
// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { LuNotebookPen } from "react-icons/lu";
// import { AiOutlineFundView } from "react-icons/ai";
// import { RiDashboardHorizontalFill } from "react-icons/ri";
// import { BiWallet } from "react-icons/bi";
// import { FaUserAlt } from "react-icons/fa";
// import { FaUserFriends } from "react-icons/fa";
// import { IoClose } from "react-icons/io5";
// import config from "./Config";
// import { MdOutlineLogout } from "react-icons/md";
// import { toast } from "react-toastify";

// const Leave = () => {
//     const [loading, setLoading] = useState(true);
//     const [leaveRequests, setLeaveRequests] = useState([]);
//     const [userFirstName, setUserFirstName] = useState("");
//     const [userLastName, setUserLastName] = useState("");
//     const [isModalOpen, setIsModalOpen] = useState(false);
//     const [selectedLeaveRequests, setSelectedLeaveRequests] = useState([]);
//     const [approvalRemark, setApprovalRemark] = useState("");
//     const [leaveType, setLeaveType] = useState("F"); // Default to 'Full Day'
//     const [AppReg, setAppReg] = useState("2"); 
//     const [NewAppReg, setNewAppReg] = useState(""); 

//     const navigate = useNavigate();

//     const fetchTasks = () => {
//         const storedUser = localStorage.getItem("user");
//         const token = localStorage.getItem("accesstoken");
//         if (!token) {
//             console.error("Missing user data or token in localStorage.");
//             setTimeout(() => {
//                 navigate('/leave');
//             }, 0);
//             return;
//         }

//         if (storedUser) {
//             const userData = JSON.parse(storedUser);
//             const params = new FormData();
//             params.set("companyid", userData.User.CompanyId);
//             params.set("userloginid", userData.User.UserLoginId);
//             params.set("role", userData.User.ul_Role);

//             setLoading(true);
//             axios.post(`${config.BASE_URL}/Leave/pendingleaverequest`, params, {
//                 headers: {
//                     accesstokenkey: token,
//                     "Content-Type": "application/json",
//                 },
//             })
//                 .then((response) => {
//                     console.log("Leave Request Response:", response);
//                     if (response.data && response.data.LeaveRequest) {
//                         setLeaveRequests(response.data.LeaveRequest);
//                     } else {
//                         console.error("No leave requests found:", response?.data?.message || "Unknown error");
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

//     useEffect(() => {
//         const userData = JSON.parse(localStorage.getItem("user"));
//         if (userData && userData.User) {
//             setUserFirstName(userData.User.ul_FirstName);
//             setUserLastName(userData.User.ul_LastName);
//         } else {
//             console.error("User data is missing or invalid.");
//         }
//     }, []);

//     useEffect(() => {
//         fetchTasks();
//     }, []);

//     const handleLogout = () => {
//         localStorage.clear();
//         setTimeout(() => {
//             navigate("/");
//         }, 0);
//     };

//     const addtask = () => { navigate('/addtask') }
//     const viewtask = () => { navigate('/viewtask') }
//     const dailytask = () => { navigate('/dailytask'); };
//     const userview = () => { navigate('/userview'); };
//     const dashboard = () => { navigate('/dashboard'); }
//     const handleprofile = () => navigate('/profile');
//     const leaveview = () => navigate('/leave');

//     const openModal = () => {
//         setIsModalOpen(true);
//     };

//     const closeModal = () => {
//         setIsModalOpen(false);
//     };

//     const handleCheckboxChange = (index, isChecked) => {
//         if (isChecked) {
//             setSelectedLeaveRequests([...selectedLeaveRequests, index]);
//         } else {
//             setSelectedLeaveRequests(selectedLeaveRequests.filter(item => item !== index));
//         }
//     };

//     const handleRemarkChange = (e) => {
//         setApprovalRemark(e.target.value);
//     };

//     const handleLeaveTypeChange = (type) => {
//         setLeaveType(type);
//     };
    
//     const handleAppReg = (ee) => {
//         setAppReg(ee);
//         console.log("ee: ", ee);
//     };

//     const handleLeaveRequestUpdate = (e) => {
//         // Log the button clicked for approval/rejection
//         console.log("Button clicked:", e === '1' ? "Approve" : "Reject");

//         // Set the approval status based on button clicked
//         setAppReg(e);

//         // Prepare the data for updating leave requests
//         const updateData = {
//             LeaveRequest: selectedLeaveRequests.map(index => {
//                 const request = leaveRequests[index];
//                 return {
//                     LeaveMasterId: request.LeaveMasterId.toString(),
//                     UserLoginId: request.UserLoginId.toString(),
//                     ForUserLoginId: request.ForUserLoginId.toString(),
//                     CompanyId: request.CompanyId.toString(),
//                     IsApproved: e === '1' ? '1' : '0', // Approve if '1', Reject if '0'
//                     IsRejected: e === '0' ? '1' : '0', // Reject if '0'
//                     ApprovalRemark: approvalRemark,
//                     H_FDayAppr: leaveType, // Either 'F' or 'H'
//                 };
//             }),
//         };

//         // Log the data before making the API call (improved logging)
//         console.log("Updating leave requests with the following data:");
//         console.log(JSON.stringify(updateData, null, 2)); // Log in a pretty format for easy reading

//         const token = localStorage.getItem("accesstoken");

//         // Send the request to the API
//         axios
//             .post(`${config.BASE_URL}/Leave/updateleaverequest`, updateData, {
//                 headers: {
//                     accesstokenkey: token,
//                     "Content-Type": "application/json",
//                 },
//             })
//             .then((response) => {
//                 console.log("Update Response:", response);
//                 if (response.data && response.data.message === "Success") {
//                     toast.success("Leave request updated successfully!");
//                     setSelectedLeaveRequests([]); // Clear selected requests after update
//                     fetchTasks(); // Refresh the leave requests
//                     closeModal(); // Close the modal
//                     approvalRemark();
//                 } else {
//                     toast.error("Failed to update leave request.");
//                 }
//             })
//             .catch((error) => {
//                 // console.error("Error updating leave request:", error);
//                 toast.error("An error occurred while updating the leave request.");
//             });
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
//                                     <button className='viewtaskbtn' onClick={viewtask}><AiOutlineFundView className="icon-task" /><span className="dash-task">View Task</span> </button>
//                                 </div>
//                                 <div className="desh-btn">
//                                     <button className='dailytaskbtn' onClick={dailytask}><BiWallet className="icon-task" /><span className="dash-task">Daily-task</span></button>
//                                 </div>
//                                 <div className="desh-btn">
//                                     <button className='dailytaskbtn' onClick={userview}><FaUserFriends className="icon-task" /><span className="dash-task">User</span></button>
//                                 </div>
//                                 <div className="desh-btn">
//                                     <button className='dailytaskbtn' onClick={leaveview}><FaUserFriends className="icon-task" /><span className="dash-task">LeaveRequest</span></button>
//                                 </div>
//                             </div>
//                             <p className="version-main">V 1.0.3</p>
//                             <div className="log-out-new">
//                                 <button className="btn-profile" onClick={handleprofile}><FaUserAlt className="icon-pro" /></button>
//                                 <button onClick={handleLogout} className="btn-3" title="logout"><MdOutlineLogout className="log-out-icon" /></button>
//                             </div>
//                         </div>
//                     </div>

//                     <div className="desh-child">
//                         <div className="desh-inner-child">
//                             <div className="all-man-">
//                                 <div className="all-divs">
//                                     <div className="main-div-table">
//                                         {/* Button is conditionally rendered based on the selected checkbox */}
//                                         {selectedLeaveRequests.length > 0 && (
//                                             <button style={{ padding: '8px 13px', backgroundColor: '#2e88f5', borderRadius: '5px', border: 'none' }} id="button-popup" onClick={openModal}>
//                                                 Done
//                                             </button>
//                                         )}
//                                         <div className="main-table-inner">
//                                             {loading ? (
//                                                 <p>Loading...</p> // Show loading text while fetching data
//                                             ) : leaveRequests.length > 0 ? (
//                                                 <table border={3}>
//                                                     <thead>
//                                                         <tr>
//                                                             <th>Index</th>
//                                                             <th>Leave</th>
//                                                             <th>Date</th>
//                                                             <th>Name</th>
//                                                             <th>Reason</th>
//                                                             <th>Day</th>
//                                                         </tr>
//                                                     </thead>
//                                                     <tbody>
//                                                         {leaveRequests.map((request, index) => (
//                                                             <tr key={index}>
//                                                                 <td>{index + 1}</td>
//                                                                 <td>
//                                                                     <input
//                                                                         type="checkbox"
//                                                                         checked={selectedLeaveRequests.includes(index)}
//                                                                         onChange={(e) => handleCheckboxChange(index, e.target.checked)}
//                                                                     />
//                                                                 </td>
//                                                                 <td>{request.Date}</td>
//                                                                 <td>{request.ul_FirstName} {request.ul_LastName}</td>
//                                                                 <td>{request.Reason}</td>
//                                                                 <td>{request.H_FDay}</td>
//                                                             </tr>
//                                                         ))}
//                                                     </tbody>
//                                                 </table>
//                                             ) : (
//                                                 <p>No leave requests found.</p>
//                                             )}
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>

//                     {/* Modal Popup */}
//                     {isModalOpen && (
//                         <div className="modal">
//                             <div className="modal-content">
//                                 <span className="close" onClick={closeModal}>&times;</span>

//                                 <form action="">
//                                     <div className="remark-div">
//                                         <label htmlFor="remark">Remark:</label><br /><br />
//                                         <textarea
//                                             ref={taskRemarkRef}
//                                             type="text"
//                                             className="leave-textarea"
//                                             value={approvalRemark}
//                                             onChange={handleRemarkChange}
//                                         />
//                                     </div>
//                                     <div className="radio-btn-div">
//                                         <div className="full">
//                                             <input
//                                                 type="radio"
//                                                 name="leave"
//                                                 id="approve"
//                                                 checked={leaveType === 'F'}
//                                                 onChange={() => handleLeaveTypeChange('F')}
//                                             />Full Day
//                                         </div>
//                                         <div className="half">
//                                             <input
//                                                 type="radio"
//                                                 name="leave"
//                                                 id="reject"
//                                                 checked={leaveType === 'H'}
//                                                 onChange={() => handleLeaveTypeChange('H')}
//                                             />Half Day
//                                         </div>
//                                     </div>
//                                     <div className="div-btn-leave">
//                                         <button type="button" className="approve" onClick={() => handleLeaveRequestUpdate('1')} >
//                                             Approve
//                                         </button>
//                                         <button type="button" className="rejecte" onClick={() => handleLeaveRequestUpdate('0')}>
//                                             Reject
//                                         </button>
//                                     </div>
//                                 </form>
//                             </div>
//                         </div>
//                     )}
//                 </div>
//             </div>
//         </>
//     );
// };

// export default Leave;









