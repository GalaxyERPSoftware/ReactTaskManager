
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { RiDashboardHorizontalFill } from "react-icons/ri";
import { LuNotebookPen } from "react-icons/lu";
import { FaUserAlt } from "react-icons/fa";
import { FaAngleRight } from "react-icons/fa6";
import { AiOutlineFundView, AiOutlineUsergroupAdd } from "react-icons/ai";
import { BiWallet } from "react-icons/bi";
import { FaUserFriends, FaTasks } from "react-icons/fa";
import { MdOutlineLogout, MdPendingActions, MdOutlineMoreTime } from "react-icons/md";
import { LuUserRoundCheck } from "react-icons/lu";
import { ToastContainer } from "react-toastify";
import { MdOutlineGrid4X4 } from "react-icons/md";
import { RiUserSearchFill } from "react-icons/ri";
import { FaMobileScreenButton  } from "react-icons/fa6";
import { PiUserListBold } from "react-icons/pi";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

import { CiMobile3 } from "react-icons/ci";
import config from "./Config";
// import axios from "axios";
// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { RiDashboardHorizontalFill } from "react-icons/ri";
// import { LuNotebookPen } from "react-icons/lu";
// import { FaUserAlt } from "react-icons/fa";
// import { AiOutlineFundView, AiOutlineUsergroupAdd } from "react-icons/ai";
// import { BiWallet } from "react-icons/bi";
// import { FaUserFriends } from "react-icons/fa";
// import { MdOutlineLogout } from "react-icons/md";
// import axios from "axios";
// import { ToastContainer } from "react-toastify";

const Profile = () => {
    const [userFirstName, setUserFirstName] = useState("");
    const [userLastName, setUserLastName] = useState("");
    const [userData, setUserData] = useState(null);
    const [profileImage, setProfileImage] = useState(null); // State to store the profile image URL

    const navigate = useNavigate();

    useEffect(() => {

        // const storedUser = localStorage.getItem("user");
        const token = localStorage.getItem("accesstoken");

        if ( !token) {
            console.error("Missing user data or token in localStorage.");
            setTimeout(() => {
                navigate('/');
            }, 0);
            return;
        }
        

        const storedUser = JSON.parse(localStorage.getItem("user"));
        
        if (storedUser && storedUser.User) {
            const storedCompanyId = storedUser.User.CompanyId; // Access CompanyId from user data directly

            setUserFirstName(storedUser.User.ul_FirstName);
            setUserLastName(storedUser.User.ul_LastName);
            setUserData(storedUser.User);

            if (storedCompanyId) {
                // Fetch profile image from the API using CompanyId from user data
                axios
                    // .get(`http://192.168.10.20:8082/api/UserLogin/getimage?CompanyId=${storedCompanyId}&UserLoginId=${storedUser.User.UserLoginId}`, {
                    .get(`${config.BASE_URL}/UserLogin/getimage?CompanyId=${storedCompanyId}&UserLoginId=${storedUser.User.UserLoginId}`, {
                        responseType: 'blob', // Set the response type to 'blob' for image data
                    })
                    .then(response => {
                        const imageUrl = URL.createObjectURL(response.data);
                        setProfileImage(imageUrl);
                    })
                    .catch(error => {
                        console.error("Error fetching profile image:", error);
                    });
            } else {
                console.error("CompanyId not found in user data.");
            }
        } else {
            console.error("User data is missing or invalid.");
        }

        
    }, []);

    useEffect(() => {

        // const storedUser = localStorage.getItem("user");
        const token = localStorage.getItem("accesstoken");

        if ( !token) {
            console.error("Missing user data or token in localStorage.");
            navigate('/');
            return;
        }
        

        const storedUser = JSON.parse(localStorage.getItem("user"));
        
        if (storedUser && storedUser.User) {
            const storedCompanyId = storedUser.User.CompanyId; // Access CompanyId from user data directly

            setUserFirstName(storedUser.User.ul_FirstName);
            setUserLastName(storedUser.User.ul_LastName);
            setUserData(storedUser.User);

            if (storedCompanyId) {

                // const userData = JSON.parse(storedUser);
            const params = new FormData();
            params.set("userloginid", "0");
                // Fetch profile image from the API using CompanyId from user data
                axios
                    // .post('http://192.168.10.20:8082/api/UserLogin/verifytokenkey', params, {
                    .post(`${config.BASE_URL}/UserLogin/verifytokenkey`, params, {
                        headers: {
                            accesstokenkey: token,
                            "Content-Type": "application/json",
                        },
                    })
                    .then(response => {
                        const imageUrl = URL.createObjectURL(response.data);
                        setProfileImage(imageUrl);
                    })
                    .catch(error => {
                        // console.error("Error fetching profile image:", error);
                        if (error.response) {
                            
                            setTimeout(() => {
                                localStorage.clear();
                                navigate('/');
                            }, 0);
                        }
                        else { }
                    });
            } else {
                console.error("CompanyId not found in user data.");
                
            }
        } else {
            console.error("User data is missing or invalid.");
            
        }

        
    }, []);

    const addTask = () => navigate('/addtask');
    const viewTask = () => navigate('/viewtask');
    const dashboard = () => navigate('/dashboard');
    const ondailyview = () => navigate('/dailytask');
    const onuserview = () => navigate('/userview');
    const handleprofile = () => navigate('/profile');
    
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
                                    <button onClick={addTask}><LuNotebookPen className="icon-task" /><span className="dash-task">Add Task</span></button>
                                </div>
                                <div className="desh-btn">
                                    <button className='viewtaskbtn' onClick={viewTask}><AiOutlineFundView className="icon-task" /><span className="dash-task">View Task</span></button>
                                </div>
                                <div className="desh-btn">
                                    <button className='dailytaskbtn' onClick={ondailyview}><BiWallet className="icon-task" /><span className="dash-task">Daily Task</span></button>
                                </div>
                                <div className="desh-btn">
                                    <button className='dailytaskbtn' onClick={onuserview}><FaUserFriends className="icon-task" /><span className="dash-task">User</span></button>
                                </div>
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
                            <div className="profile-container">
                                <div className="profile-card">
                                    {/* Display the profile image if it's available */}
                                    <img src={profileImage || "/assets/img/user.jpg"} alt="User Profile" className="img-profile"/>
                                    <div className="profile-details">
                                             <div className="detail-item">
                                                 <label><MdOutlineGrid4X4 className="icon-profile"/></label>
                                                 <span>{userData?.UserLoginId || "N/A"}</span>
                                             </div>
                                             <div className="detail-item">
                                                 <label><PiUserListBold className="icon-profile"/></label>
                                                 <span>{userData?.ul_FirstName || "N/A"}</span>
                                             </div>
                                             <div className="detail-item">
                                                 <label><PiUserListBold className="icon-profile"/></label>
                                                 <span>{userData?.ul_LastName || "N/A"}</span>
                                             </div>
                                             <div className="detail-item">
                                                 <label><RiUserSearchFill className="icon-profile"/></label>
                                                 <span>{userData?.ul_Role || "N/A"}</span>
                                             </div>
                                             <div className="detail-item">
                                                 <label><FaMobileScreenButton  className="icon-profile"/></label>
                                                 <span>{userData?.ul_PhoneNo || "N/A"}</span>
                                             </div>
                                             <div className="detail-item">
                                                 <label><FaMobileScreenButton  className="icon-profile"/></label>
                                                 <span>Change By Kishan Parmar 2</span>
                                             </div>
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
}

export default Profile;



// // import React, { useEffect, useState } from "react";
// // import { useNavigate } from "react-router-dom";
// // import { RiDashboardHorizontalFill } from "react-icons/ri";
// // import { LuNotebookPen } from "react-icons/lu";
// // import { FaUserAlt } from "react-icons/fa";
// // import { FaAngleRight } from "react-icons/fa6";
// // import { AiOutlineFundView, AiOutlineUsergroupAdd } from "react-icons/ai";
// // import { BiWallet } from "react-icons/bi";
// // import { FaUserFriends, FaTasks } from "react-icons/fa";
// // import { MdOutlineLogout, MdPendingActions, MdOutlineMoreTime } from "react-icons/md";
// // import { LuUserRoundCheck } from "react-icons/lu";
// // import { ToastContainer } from "react-toastify";
// // import { MdOutlineGrid4X4 } from "react-icons/md";
// // import { RiUserSearchFill } from "react-icons/ri";
// // import { FaMobileScreenButton  } from "react-icons/fa6";
// // import { PiUserListBold } from "react-icons/pi";
// // import { CiMobile3 } from "react-icons/ci";
// // import axios from "axios";

// // const Profile = () => {
// //     const [userFirstName, setUserFirstName] = useState("");
// //     const [userLastName, setUserLastName] = useState("");
// //     const [userData, setUserData] = useState(null);

// //     const navigate = useNavigate();

// //     useEffect(() => {
// //         const storedUser = JSON.parse(localStorage.getItem("user"));
// //         if (storedUser && storedUser.User) {
// //             setUserFirstName(storedUser.User.ul_FirstName);
// //             setUserLastName(storedUser.User.ul_LastName);
// //             setUserData(storedUser.User);
// //         } else {
// //             console.error("User data is missing or invalid.");
// //         }
// //     }, []);

// //     const addTask = () => navigate('/addtask');
// //     const viewTask = () => navigate('/viewtask');
// //     const dashboard = () => navigate('/dashboard');
// //     const ondailyview = () => navigate('/dailytask');
// //     const onuserview = () => navigate('/user');
// //     const handleprofile = () => navigate('/profile');
    

// //     const handleLogout = () => {
// //         localStorage.removeItem("firstname");
// //         localStorage.removeItem("lastname");
// //         localStorage.removeItem("accesstoken");
// //         localStorage.removeItem("user");
// //         setTimeout(() => {
// //             navigate("/");
// //         }, 500);
// //     };

// //     return (
// //         <>
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
//                                 <div className="desh-btn">
//                                     <button onClick={addTask}><LuNotebookPen className="icon-task" /><span className="dash-task">Add Task</span></button>
//                                 </div>
//                                 <div className="desh-btn">
//                                     <button className='viewtaskbtn' onClick={viewTask}><AiOutlineFundView className="icon-task" /><span className="dash-task">View Task</span></button>
//                                 </div>
//                                 <div className="desh-btn">
//                                     <button className='dailytaskbtn' onClick={ondailyview}><BiWallet className="icon-task" /><span className="dash-task">Daily-task</span></button>
//                                 </div>
//                                 <div className="desh-btn">
//                                     <button className='dailytaskbtn' onClick={onuserview}><FaUserFriends className="icon-task" /><span className="dash-task">User</span></button>
//                                 </div>
//                             </div>
//                             <p className="version-main">V- 1.0.1</p>
//                             <div className="log-out-new">
//                                 <button className="btn-profile" onClick={handleprofile}><FaUserAlt className="icon-pro" /></button>
//                                 <button onClick={handleLogout} className="btn-3" title="logout"><MdOutlineLogout className="log-out-icon" /></button>
//                             </div>
//                         </div>
//                     </div>
//                     <div className="desh-child">
//                         <div className="desh-inner-child">
//                             <div className="all-divs">
//                                 {/* <div className="user-details-form">
//                                     <h2 className="form-heading">User Profile</h2>
//                                     <div className="form-group">
//                                         <label htmlFor="UserLoginId">User Login ID</label>
//                                         <input
//                                             type="text"
//                                             id="UserLoginId"
//                                             value={userData?.UserLoginId || "N/A"}
//                                             readOnly
//                                         />
//                                     </div>
//                                     <div className="form-group">
//                                         <label htmlFor="FirstName">First Name</label>
//                                         <input
//                                             type="text"
//                                             id="FirstName"
//                                             value={userData?.ul_FirstName || "N/A"}
//                                             readOnly
//                                         />
//                                     </div>
//                                     <div className="form-group">
//                                         <label htmlFor="LastName">Last Name</label>
//                                         <input
//                                             type="text"
//                                             id="LastName"
//                                             value={userData?.ul_LastName || "N/A"}
//                                             readOnly
//                                         />
//                                     </div>
//                                     <div className="form-group">
//                                         <label htmlFor="Role">Role</label>
//                                         <input
//                                             type="text"
//                                             id="Role"
//                                             value={userData?.ul_Role || "N/A"}
//                                             readOnly
//                                         />
//                                     </div>
//                                     <div className="form-group">
//                                         <label htmlFor="PhoneNo">Phone Number</label>
//                                         <input
//                                             type="text"
//                                             id="PhoneNo"
//                                             value={userData?.ul_PhoneNo || "N/A"}
//                                             readOnly
//                                         />
//                                     </div>
//                                 </div> */}
//                                 <div className="profile-container">
//                                     <div className="profile-card">
//                                         {/* <h2 className="profile-heading">User Profile</h2> */}
//                                         <img src="/assets/img/user.jpg" alt="" className="img-profile"/>

//                                         <div className="profile-details">
//                                             <div className="detail-item">
//                                                 <label><MdOutlineGrid4X4 className="icon-profile"/></label>
//                                                 <span>{userData?.UserLoginId || "N/A"}</span>
//                                             </div>
//                                             <div className="detail-item">
//                                                 <label><PiUserListBold className="icon-profile"/></label>
//                                                 <span>{userData?.ul_FirstName || "N/A"}</span>
//                                             </div>
//                                             <div className="detail-item">
//                                                 <label><PiUserListBold className="icon-profile"/></label>
//                                                 <span>{userData?.ul_LastName || "N/A"}</span>
//                                             </div>
//                                             <div className="detail-item">
//                                                 <label><RiUserSearchFill className="icon-profile"/></label>
//                                                 <span>{userData?.ul_Role || "N/A"}</span>
//                                             </div>
//                                             <div className="detail-item">
//                                                 <label><FaMobileScreenButton  className="icon-profile"/></label>
//                                                 <span>{userData?.ul_PhoneNo || "N/A"}</span>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </div>

//                             </div>

//                             <ToastContainer />
//                         </div>
//                     </div>
//                 </div>
//             </div>
// //         </>
// //     );
// // }

// // export default Profile;
