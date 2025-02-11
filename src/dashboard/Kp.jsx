// import React from "react";

// const Kp = () =>{
//     return(
//         <>
//             hiii
//         </>
//     )
// }

// export default Kp

// import axios from "axios";
// import React, { useState, useEffect } from "react";
// import { LuNotebookPen } from "react-icons/lu";
// import { AiOutlineFundView } from "react-icons/ai";
// import { RiDashboardHorizontalFill } from "react-icons/ri";
// import { BiWallet } from "react-icons/bi";
// import { FaUserAlt } from "react-icons/fa";
// import { FaUserFriends } from "react-icons/fa";
// import { toast, ToastContainer } from "react-toastify";
// import 'react-toastify/dist/ReactToastify.css';
// import { MdOutlineLogout } from "react-icons/md";
// import { useNavigate } from "react-router-dom";
// import config from "./Config";
// import {
//   AppstoreOutlined,
//   ContainerOutlined,
//   DesktopOutlined,
//   MailOutlined,
//   MenuFoldOutlined,
//   MenuUnfoldOutlined,
//   PieChartOutlined,
// } from '@ant-design/icons';
// import { Button, Menu } from 'antd';

// const User = () => {
//     const [loading, setLoading] = useState(false);
//     const [users, setUsers] = useState([]);
//     const [userFirstName, setUserFirstName] = useState("");
//     const [userLastName, setUserLastName] = useState("");
//     const [collapsed, setCollapsed] = useState(false);

//     const navigate = useNavigate();

//     const fetchUsers = () => {
//         const storedUser  = localStorage.getItem("user");
//         const token = localStorage.getItem("accesstoken");

//         if (!token) {
//             console.error("Missing user data or token in localStorage.");
//             setTimeout(() => {
//                 navigate('/');
//             }, 0);
//             return;
//         }

//         if (storedUser ) {
//             const userData = JSON.parse(storedUser );

//             if (!userData?.User ?.CompanyId) {
//                 console.error("Company ID is missing in user data.");
//                 return;
//             }

//             const requestData = {
//                 companyid: String(userData.User.CompanyId),
//             };

//             console.log("Request data being sent:", requestData);

//             setLoading(true);

//             axios
//                 .post(`${config.BASE_URL}/User Login/getuserbycompanyid`, requestData, {
//                     headers: {
//                         accesstokenkey: token,
//                         "Content-Type": "application/json",
//                     },
//                 })
//                 .then((response) => {
//                     console.log("Response data:", response.data);
//                     if (response.data && response.data.Users) {
//                         setUsers(response.data.Users);
//                     } else {
//                         console.error("No users found:", response?.data?.message || "Unknown error");
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
//         } else {
//             console.error("No user data found in localStorage");
//         }
//     };

//     useEffect(() => {
//         const userData = JSON.parse(localStorage.getItem("user"));
//         if (userData && userData.User) {
//             setUserFirstName(userData.User.ul_FirstName);
//             setUserLastName(userData.User.ul_LastName);
//         } else {
//             console.error("User  data is missing or invalid.");
//         }
//     }, []);

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
//     };
//     const handleprofile = () => {
//         navigate('/profile');
//     };

//     const handleLogout = () => {
//         localStorage.clear();
//         navigate('/');
//     };

//     useEffect(() => {
//         fetchUsers();
//     }, []);

//     const toggleCollapsed = () => {
//         setCollapsed(!collapsed);
//     };

//     const items = [
//         { key: '1', icon: <PieChartOutlined />, label: 'Option 1' },
//         { key: '2', icon: <DesktopOutlined />, label: 'Option 2' },
//         { key: '3', icon: <ContainerOutlined />, label: 'Option 3' },
//         {
//             key: 'sub1',
//             label: 'Navigation One',
//             icon: <MailOutlined />,
//             children: [
//                 { key: '5', label: 'Option 5' },
//                 { key: '6', label: 'Option 6' },
//                 { key: '7', label: 'Option 7' },
//                 { key: '8', label: 'Option 8' },
//             ],
//         },
//         {
//             key: 'sub2',
//             label: 'Navigation Two',
//             icon: <AppstoreOutlined />,
//             children: [
//                 { key: '9', label: 'Option 9' },
//                 { key: '10', label: 'Option 10' },
//                 {
//                     key: 'sub3',
//                     label: 'Submenu',
//                     children: [
//                         { key: '11', label: 'Option 11' },
//                         { key: '12', label: 'Option 12' },
//                     ],
//                 },
//             ],
//         },
//     ];

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
//                                     <button className='dailytaskbtn' onClick={userview}><FaUserFriends className="icon-task" /><span className="dash-task">User </span></button>
//                                 </div>
//                             </div>
//                             <p className="version-main">V 1.0.2</p>
//                             <div className="log-out-new">
//                                 <button className="btn-profile" onClick={handleprofile}><FaUserAlt className="icon-pro" /></button>
//                                 <button onClick={handleLogout} className="btn-3" title="logout"><MdOutlineLogout className="log-out-icon" /></button>
//                             </div>
//                         </div>
//                     </div>

//                     {/* Add the Ant Design Menu here */}
//                     <div style={{ width: 256 }}>
//                         <Button type="primary" onClick={toggleCollapsed} style={{ marginBottom: 16 }}>
//                             {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
//                         </Button>
//                         <Menu
//                             defaultSelectedKeys={['1']}
//                             defaultOpenKeys={['sub1']}
//                             mode="inline"
//                             theme="dark"
//                             inlineCollapsed={collapsed}
//                             items={items}
//                         />
//                     </div>

//                     <div className="desh-child">
//                         <div className="desh-inner-child">
//                             <div className="all-man-">
//                                 <div className="all-divs">
//                                     <div className="task-list">
//                                         <div className="main-div-table">
//                                             <div className="main-table-inner">
//                                                 {loading ? (
//                                                     <p>Loading...</p>
//                                                 ) : (
//                                                     <table className="user-table" border={1}>
//                                                         <thead>
//                                                             <tr>
//                                                                 <th className="text-d">Id</th>
//                                                                 <th className="text-d">First Name</th>
//                                                                 <th className="text-d">Last Name</th>
//                                                                 <th className="text-d">Phone Number</th>
//                                                                 <th className="text-d">Is Active</th>
//                                                             </tr>
//                                                         </thead>
//                                                         <tbody>
//                                                             {users.map((user) => (
//                                                                 <tr key={user.UserLoginId}>
//                                                                     <td className="text-d">{user.UserLoginId}</td>
//                                                                     <td className="text-d">{user.ul_FirstName}</td>
//                                                                     <td className="text-d">{user.ul_LastName}</td>
//                                                                     <td className="text-d">{user.ul_PhoneNo}</td>
//                                                                     <td className="text-d">{user.ul_IsActive ? "Active" : "Block"}</td>
//                                                                 </tr>
//                                                             ))}
//                                                         </tbody>
//                                                     </table>
//                                                 )}
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </>
//     );
// };

// export default User;

import React, { useState } from 'react';
import {MailOutlined} from '@ant-design/icons';
import { RiDashboardHorizontalFill } from "react-icons/ri";
import { AiOutlineFundView } from "react-icons/ai";
import { FaUserFriends } from "react-icons/fa";
import { BiWallet } from "react-icons/bi";
import { IoSettingsOutline } from "react-icons/io5";
import { LuNotebookPen } from "react-icons/lu";
import { Button, Menu } from 'antd';
const items = [
  {
    key: '1',
    icon: <RiDashboardHorizontalFill/>,
    label: 'Dashboard',
  },
  {
    key: '2',
    icon: <FaUserFriends />,
    label: 'User',
  },
  {
    key: 'sub1',
    label: 'Task',
    icon: <MailOutlined />,
    children: [
      {
        key: '5',
        icon: <LuNotebookPen />,
        label: 'Add Task',
      },
      {
        key: '6',
        icon: <AiOutlineFundView />,
        label: 'View Task',
      },
      {
        key: '7',
        icon: <BiWallet />,
        label: 'Daily Task',
      },
    ],
  },
  {
    key: 'sub2',
    label: 'Setting',
    icon: <IoSettingsOutline  />,
    children: [
      {
        key: '9',
        label: 'Option 9',
      },
    ],
  },
];
const App = () => {
  const [collapsed, setCollapsed] = useState(false);
  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };
  return (
    <div
      style={{
        width: 220,
      }}
    >
      <Menu
        defaultSelectedKeys={['1']}
        defaultOpenKeys={['sub1']}
        mode="inline"
        theme="dark"
        inlineCollapsed={collapsed}
        items={items}
      />
    </div>
  );
};
export default App;