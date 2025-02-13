import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaSearchengin } from "react-icons/fa6";
import { RiDashboardHorizontalFill } from "react-icons/ri";
import { LuNotebookPen } from "react-icons/lu";
import { AiOutlineFundView } from "react-icons/ai";
import { BiWallet } from "react-icons/bi";
import { FaUserFriends, FaUserAlt } from "react-icons/fa";
import { MdOutlineLogout } from "react-icons/md";
import config from "./Config";
import { toast, ToastContainer } from 'react-toastify';

const Search = () => {
    const [userFirstName, setUserFirstName] = useState("");
    const [userLastName, setUserLastName] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [userRole, setUserRole] = useState("");
    const [value, setValue] = useState('');
    const [remark, setRemark] = useState('');
    const [tasks, setTasks] = useState([]);
    const [isDataFetched, setIsDataFetched] = useState(false);  // Track if data is fetched
    const [showContributeButton, setShowContributeButton] = useState(false);  // State to control visibility of "Contribute" button
    const [loading, setLoading] = useState(false); // Loading state
    const navigate = useNavigate();

    // Fetch user info from localStorage
    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem("user"));
        if (userData && userData.User) {
            setUserFirstName(userData.User.ul_FirstName);
            setUserLastName(userData.User.ul_LastName);
            setUserRole(userData.User.ul_Role);
        } else {
            console.error("User data is missing or invalid.");
        }
    }, []);
    const fetchTasks = () => {
        const storedUser = localStorage.getItem("user");
        const token = localStorage.getItem("accesstoken");

        if (!token) {
            console.error("Missing token in localStorage.");
            setTimeout(() => {
                navigate('/search');
            }, 0);
            return;
        }
        if (storedUser) {
            const userData = JSON.parse(storedUser);

            const bodyData = {
                dailytaskid: value.toString(),
                companyid: userData.User.CompanyId.toString(),
                userloginid: userData.User.UserLoginId.toString(),
            };

            setLoading(true); // Start loading

            axios.post(`${config.BASE_URL}/Task/searchtask`, bodyData, {
                headers: {
                    accesstokenkey: token,
                    "Content-Type": "application/json",
                },
            })
                .then((response) => {
                    setLoading(false); // End loading
                    if (response.data && response.data.Tasks) {
                        setTasks(response.data.Tasks);
                        setIsDataFetched(true);  // Set data fetched to true
                        setShowContributeButton(true); // Show the "Contribute" button
                    } else {
                        console.error("No tasks found:", response?.data?.message || "Unknown error");
                        setIsDataFetched(false);  // Reset if no tasks found
                        setShowContributeButton(false); // Hide the "Contribute" button if no tasks
                    }
                })
                .catch((error) => {
                    setLoading(false); // End loading
                    console.error("Error fetching tasks:", error.message);
                    setIsDataFetched(false);  // Reset if error occurs
                    setShowContributeButton(false); // Hide the "Contribute" button in case of error
                    if (error.response) {
                        setTimeout(() => {
                            localStorage.clear();
                            navigate('/search');
                        }, 0);
                    }
                });
        }
    };
    const handleChange = (event) => {
        const newValue = event.target.value;
        if (/^\d*$/.test(newValue)) {
            setValue(newValue);
        }
    };
    const handleSearch = () => {
        if (value.trim() === "") {
            toast.error("Please enter a task ID to search.");
            setShowContributeButton(false); // Hide the "Contribute" button if search is triggered with no input
            return;
        }
        fetchTasks();
    };
    const handleLogout = () => {
        localStorage.clear();
        navigate("/");
    };
    const handleProfile = () => {
        navigate("/profile");
    };
    // Modal Handling
    const openModal = () => {
        setIsModalOpen(true); // Open the modal
    };
    const closeModal = () => {
        setIsModalOpen(false); // Close the modal
    };
    // New function to handle contributing to the task
    const contributeTask = () => {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        const token = localStorage.getItem("accesstoken");
        const remark = document.getElementById('remark').value.trim(); // Get the remark from textarea
        // Check if the remark is empty
        if (!remark) {
            // Show the alert box if the remark is empty
            toast.error("Please enter a remark.");
            return;
        }
        if (!storedUser || !token) {
            toast.error("Missing necessary data.");
            return;
        }
        const taskData = {
            dailytaskid: value.toString(),
            companyid: storedUser.User.CompanyId.toString(),
            userloginid: storedUser.User.UserLoginId.toString(),
            remark: remark,  // Add the remark from the modal
        };
        // Log the data to console to check it properly
        console.log("Contributing with data:", taskData);
        // Send the data to the API
        axios.post(`${config.BASE_URL}/Task/contributetask`, taskData, {
            headers: {
                accesstokenkey: token,
                "Content-Type": "application/json",
            },
        })
            .then((response) => {
                console.log("Response from contribute task:", response.data);
                toast.success("Task contributed successfully!");
                setIsModalOpen(false); // Close the modal after contribution

                // Option 1: Refresh the page
                // window.location.reload(); // This will refresh the page
            })
            .catch((error) => {
                console.error("Error contributing to task:", error.message);
                toast.error("Error contributing to task: " + error.message);
            });
            setRemark('');
            setValue('');
            setTasks('');
    };
    return (
        <>
            <ToastContainer />
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
                                    <button className='dailytaskbtn' onClick={() => navigate("/dashboard")}><RiDashboardHorizontalFill className="icon-task" /><span className="dash-task">Dashboard</span></button>
                                </div>
                                <div className="desh-btn">
                                    <button className='dailytaskbtn' onClick={() => navigate("/search")}><FaSearchengin className="icon-task" /><span className="dash-task">Search</span></button>
                                </div>
                                <div className="desh-btn">
                                    <button className='dailytaskbtn' onClick={() => navigate("/addtask")}><LuNotebookPen className="icon-task" /><span className="dash-task">Add Task</span></button>
                                </div>
                                <div className="desh-btn">
                                    <button className='viewtaskbtn' onClick={() => navigate("/viewtask")}><AiOutlineFundView className="icon-task" /><span className="dash-task">View Task</span></button>
                                </div>
                                <div className="desh-btn">
                                    <button className='dailytaskbtn' onClick={() => navigate("/dailytask")}><BiWallet className="icon-task" /><span className="dash-task">Daily Task</span></button>
                                </div>
                                <div className="desh-btn">
                                    <button className='dailytaskbtn' onClick={() => navigate("/userview")}><FaUserFriends className="icon-task" /><span className="dash-task">User</span></button>
                                </div>
                                {userRole === "admin" && (
                                    <div className="desh-btn">
                                        <button className='dailytaskbtn' onClick={() => navigate("/leaveview")}><FaUserFriends className="icon-task" /><span className="dash-task">LeaveRequest</span></button>
                                    </div>
                                )}
                            </div>
                            <p className="version-main">V 1.0.5</p>
                            <div className="log-out-new">
                                <button className="btn-profile" onClick={handleProfile}><FaUserAlt className="icon-pro" /></button>
                                <button onClick={handleLogout} className="btn-3" title="logout"><MdOutlineLogout className="log-out-icon" /></button>
                            </div>
                        </div>
                    </div>
                    <div className="desh-child">
                        <div className="desh-inner-child">
                            <div className="all-divs">
                                <div className="main-search">
                                    <div className="inner-search">
                                        <input type="text" name="search" id="text-box" className="select-search" value={value} onChange={handleChange}
                                            placeholder="Search DailyTaskId" title="only add numeric value." />
                                        <button style={{ marginLeft: "7px" }} className="forminfo-btn-search" onClick={handleSearch}
                                            disabled={value.trim() === "" || loading} >
                                            <FaSearchengin />
                                        </button>
                                        {/* Show "Contribute" button only after data is fetched */}
                                        {showContributeButton && tasks.length > 0 && (
                                            <button className="forminfo-btn-search" style={{ marginLeft: '25px', backgroundColor: 'green' }} onClick={openModal}>
                                                Contribute</button>
                                        )}
                                    </div>
                                </div>
                                <div className="task-list">
                                    {loading ? (
                                        <p>Loading tasks...</p>
                                    ) : tasks.length > 0 ? (
                                        tasks.map((task) => (
                                            <div key={task.TaskId} className="task-item">
                                                <div className="task-details">
                                                    <div className="main-flex">
                                                        {task.DailyTaskId && (
                                                            <div className="search-flex">
                                                                <p><strong>ID:</strong> {task.DailyTaskId}</p>
                                                            </div>
                                                        )}
                                                        {task.Date && (
                                                            <div className="search-flex">
                                                                <p><strong>Date:</strong> {task.Date}</p>
                                                            </div>
                                                        )}
                                                        {task.Status && (
                                                            <div className="search-flex">
                                                                <p><strong>Status:</strong> {task.Status === "P" ? "Pending" :
                                                                    task.Status === "I" ? "In Progress" :
                                                                        task.Status === "C" ? "Complete" :
                                                                            task.Status === "F" ? "Forward" : task.Status}</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="main-flex">
                                                        {task.ClientName && (
                                                            <div className="search-flex">
                                                                <p><strong>Client Name:</strong> {task.ClientName}</p>
                                                            </div>
                                                        )}
                                                        {task.ClientUserName && (
                                                            <div className="search-flex">
                                                                <p><strong>Client Username:</strong> {task.ClientUserName}</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="main-flex">
                                                        {task.CreatedByFirstName && task.CreatedByLastName && (
                                                            <div className="search-flex">
                                                                <p><strong>Created By:</strong> {task.CreatedByFirstName} {task.CreatedByLastName}</p>
                                                            </div>
                                                        )}
                                                        {task.AssignToFirstName && task.AssignToLastName && (
                                                            <div className="search-flex">
                                                                <p><strong>Assign To:</strong> {task.AssignToFirstName} {task.AssignToLastName}</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="main-flex">
                                                        {task.TaskCategoryName && (
                                                            <div className="search-flex">
                                                                <p><strong>Category:</strong> {task.TaskCategoryName}</p>
                                                            </div>
                                                        )}
                                                        {task.TaskPriorityName && (
                                                            <div className="search-flex">
                                                                <p><strong>Priority:</strong> {task.TaskPriorityName}</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                    {task.Description && (
                                                        <p><strong>Description:</strong> {task.Description}</p>
                                                    )}
                                                    {task.Remark && (
                                                        <p><strong>Remark:</strong> {task.Remark}</p>
                                                    )}

                                                    <div className="main-flex">
                                                        {task.CreatedOn && (
                                                            <div className="search-flex">
                                                                <p><strong>Created On:</strong> {task.CreatedOn}</p>
                                                            </div>
                                                        )}
                                                        {task.UpdatedOn && (
                                                            <div className="search-flex">
                                                                <p><strong>Updated On:</strong> {task.UpdatedOn}</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                    {task.ContributerOneFirstName && task.ContributerOneLastName && (
                                                        <div className="search-flex">
                                                            <p><strong>Contributer One:</strong> {task.ContributerOneFirstName} {task.ContributerOneLastName}</p>
                                                        </div>
                                                    )}
                                                    {task.ContributerOneRemark && (
                                                        <div className="search-flex">
                                                            <p><strong>Contributer One Remark:</strong> {task.ContributerOneRemark}</p>
                                                        </div>
                                                    )}

                                                    {task.ContributerTwoFirstName && task.ContributerTwoLastName && (
                                                        <div className="search-flex">
                                                            <p><strong>Contributer Two:</strong> {task.ContributerTwoFirstName} {task.ContributerTwoLastName}</p>
                                                        </div>
                                                    )}
                                                    {task.ContributerTwoRemark && (
                                                        <div className="search-flex">
                                                            <p><strong>Contributer Two Remark:</strong> {task.ContributerTwoRemark}</p>
                                                        </div>
                                                    )}
                                                    {task.ContributerThreeFirstName && task.ContributerThreeLastName && (
                                                        <div className="search-flex">
                                                            <p><strong>Contributer Three:</strong> {task.ContributerThreeFirstName} {task.ContributerThreeLastName}</p>
                                                        </div>
                                                    )}
                                                    {task.ContributerThreeRemark && (
                                                        <div className="search-flex">
                                                            <p><strong>Contributer Three Remark:</strong> {task.ContributerThreeRemark}</p>
                                                        </div>
                                                    )}
                                                    {task.ContributerFourFirstName && task.ContributerFourLastName && (
                                                        <div className="search-flex">
                                                            <p><strong>Contributer Four:</strong> {task.ContributerFourFirstName} {task.ContributerFourLastName}</p>
                                                        </div>
                                                    )}
                                                    {task.ContributerFourRemark && (
                                                        <div className="search-flex">
                                                            <p><strong>Contributer Four Remark:</strong> {task.ContributerFourRemark}</p>
                                                        </div>
                                                    )}
                                                    {task.ContributerFiveFirstName && task.ContributerFiveLastName && (
                                                        <div className="search-flex">
                                                            <p><strong>Contributer Five:</strong> {task.ContributerFiveFirstName} {task.ContributerFiveLastName}</p>
                                                        </div>
                                                    )}
                                                    {task.ContributerFiveRemark && (
                                                        <div className="search-flex">
                                                            <p><strong>Contributer Five Remark:</strong> {task.ContributerFiveRemark}</p>
                                                        </div>
                                                    )}
                                                </div>

                                            </div>
                                        ))
                                    ) : (
                                        <p>No tasks found</p>
                                    )}
                                </div>
                                {isModalOpen && (
                                    <div className="modal-overlay">
                                        <div className="modal-content">
                                            <button className="close-btn" onClick={closeModal}>X</button>
                                            <form action="">
                                                <div className="remark-div">
                                                    <label htmlFor="remark">Remark:</label>
                                                    <textarea name="remark" id="remark" placeholder="Enter your remark" value={remark} onChange={(e) => setRemark(e.target.value)} />
                                                    <button type="button" className="submit-search" onClick={contributeTask}> Submit</button>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
export default Search;
