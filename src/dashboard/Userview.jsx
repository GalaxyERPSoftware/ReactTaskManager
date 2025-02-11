import axios from "axios";
import React, { useState, useEffect } from "react";
import { LuNotebookPen } from "react-icons/lu";
import { AiOutlineFundView } from "react-icons/ai";
import { RiDashboardHorizontalFill } from "react-icons/ri";
import { BiWallet } from "react-icons/bi";
import { FaUserAlt } from "react-icons/fa";
import { FaUserFriends } from "react-icons/fa";
import 'react-toastify/dist/ReactToastify.css';
import { MdOutlineLogout } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { Tabs } from 'antd';
import config from "./Config";
import User from "./User";
import Client from "./Client";

const onChange = (key) => {
    console.log(key);
};
const items = [
    {
        key: '1',
        label: 'User',
        children: < User />,
    },
    {
        key: '2',
        label: 'Clients',
        children: < Client />,
    },
];


const Userview = () => {
    const [userFirstName, setUserFirstName] = useState("");
    const [userLastName, setUserLastName] = useState("");
    const [userRole, setUserRole] = useState(""); // State for role

    const [alignValue, setAlignValue] = React.useState('center');

    const navigate = useNavigate();
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
                                    <button onClick={addtask}><LuNotebookPen className="icon-task" /><span className="dash-task">Add Task</span></button>
                                </div>
                                <div className="desh-btn">
                                    <button className='viewtaskbtn' onClick={viewtask}><AiOutlineFundView className="icon-task" /><span className="dash-task">View Task</span> </button>
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
                            <div className="all-man-">
                                <div className="all-divs">
                                    <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Userview;
