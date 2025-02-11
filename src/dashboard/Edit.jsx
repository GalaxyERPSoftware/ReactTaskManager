

// import React, { useState, useEffect } from 'react';
// import { DatePicker, Select, Modal } from 'antd';
// import moment from 'moment';
// import axios from 'axios';
// import './edit.css';
// import { toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// const Edit = ({ task, status, onClose, onUpdate }) => {
//     const [loading, setLoading] = useState(false);
//     const [client, setClient] = useState(task?.ClientName || "");
//     const [attend, setAttend] = useState(task?.AttendByFirstName + " " + task?.AttendByLastName || "");
//     const [assign, setAssign] = useState(""); // Will be set to logged-in user's name
//     const [date, setDate] = useState(null);
//     const [description, setDescription] = useState(task?.Description || "");
//     const [taskStatus, setTaskStatus] = useState(status);
//     const [isModalVisible, setIsModalVisible] = useState(true);
//     const [users, setUsers] = useState([]);

//     useEffect(() => {
//         if (task?.Date) {
//             setDate(moment(task.Date, 'MM/DD/YYYY'));
//         }

//         const storedUser = localStorage.getItem('user');
//         const token = localStorage.getItem('accesstoken');
//         console.log("accesstoken key : " + token);


//         if (storedUser && token) {
//             const userData = JSON.parse(storedUser);
//             const companyid = userData.User.CompanyId;

//             // Set default "Assign To" value to the logged-in user's name
//             const loggedInUser = {
//                 UserLoginId: userData.User.UserLoginId,
//                 ul_FirstName: userData.User.ul_FirstName,
//                 ul_LastName: userData.User.ul_LastName,
//             };
//             const loggedInUserName = `${loggedInUser.ul_FirstName} ${loggedInUser.ul_LastName}`;
//             setAssign(loggedInUser.UserLoginId); // Set the logged-in user's ID as default
//             console.log("Logged-in user name:", loggedInUserName);

//             // Fetch users for the dropdown
//             const params = new FormData();
//             params.set("companyid", companyid);

//             axios.post('http://192.168.10.10:8082/api/UserLogin/getuserbycompanyid', params, {
//             // axios.post('http://52.172.202.180:8085/api/UserLogin/getuserbycompanyid', params, {

//                 headers: {
//                     "Content-Type": "application/json",
//                     accesstokenkey: token,

//                 }
//             })
//                 .then((response) => {
//                     if (response.data && response.data.Users) {
//                         const filteredUsers = response.data.Users.filter(user =>
//                             user.ul_Role === 'user' && user.ul_IsActive
//                         );

//                         // Ensure the logged-in user is included in the dropdown options
//                         const updatedUsers = [
//                             loggedInUser,
//                             ...filteredUsers.filter(user => user.UserLoginId !== loggedInUser.UserLoginId)
//                         ];

//                         setUsers(updatedUsers);
//                     }
//                 })
//                 .catch((error) => {
//                     console.error("Error fetching users:", error);
//                 });
//         }
//     }, [task]);

//     const handleCancel = () => {
//         setIsModalVisible(false);
//         onClose();
//     };

//     const handleSubmit = () => {
//         setLoading(true);

//         // Retrieve user data and token from localStorage
//         const storedUser = localStorage.getItem("user");
//         const token = localStorage.getItem("accesstoken");

//         if (!storedUser || !token) {
//             toast.error("User is not authenticated.");
//             setLoading(false);
//             return;
//         }

//         // Parse user data from localStorage
//         const userData = JSON.parse(storedUser);
//         const userLoginId = userData.User.UserLoginId; // Get userLoginId from stored user data
//         const companyId = userData.User.CompanyId; // Get companyId from stored user data

//         const dateString = date && date.isValid() ? date.format('YYYY-MM-DD') : task?.Date || "";
//         if (!dateString || !description || !assign) {
//             toast.error("Please fill all the required fields!");
//             setLoading(false);
//             return;
//         }

//         // Prepare update data payload
//         const updateData = {
//             updatetask: [
//                 {
//                     dailytaskid: (task?.DailyTaskId || "").toString(),
//                     userloginid: userLoginId.toString(),  // Use userLoginId from localStorage
//                     companyid: companyId.toString(),  // Use companyId from localStorage
//                     date: dateString,
//                     description: description || task?.Description || "",
//                     status: taskStatus || task?.Status || "",
//                     companyclientid: (task?.CompanyClientId || "").toString(),
//                     attendbyid: (task?.AttendById || "").toString(),
//                     assigntoid: (assign || "").toString(),
//                     sourceid: (task?.SourceId || 0).toString(),
//                     taskid: (task?.TaskId || 0).toString(),
//                     mode: task?.Mode || "GEN",
//                 },
//             ],
//         };

//         console.log("Final JSON Payload:", JSON.stringify(updateData, null, 2));

//         // Send the update request to the API
//         axios
//             .post("http://192.168.10.20:8082/api/Task/updatetask", updateData, {
//             // .post("http://52.172.202.180:8085/api/Task/updatetask", updateData, {

//                 headers: {
//                     accesstokenkey: token,
//                 },
//             })
//             .then((response) => {
//                 setLoading(false);
//                 console.log("API Response:", response.data);
//                 if (response.data && response.data.message === "Success") {
//                     toast.success("Task updated successfully!");
//                     onUpdate();
//                     onClose();
//                 } else {
//                     toast.error("Failed to update the task.");
//                 }
//             })
//             .catch((error) => {
//                 setLoading(false);
//                 console.error("Error updating task:", error);
//                 toast.error("An error occurred while updating the task.");
//             });
//     };

//     return (
//         <Modal
//             title="Edit Task"
//             open={isModalVisible}
//             onCancel={handleCancel}
//             footer={null}
//             destroyOnClose={true}
//         >
//             <div className="task-form">
//                 <div className="main-page-date">
//                     <DatePicker
//                         value={date}
//                         onChange={(date) => setDate(date)}
//                     />
//                 </div>

//                 <p>Client Name:</p>
//                 <Select
//                     value={client}
//                     disabled={true}
//                     options={[{ value: client, label: client }]}
//                 />
//                 <p>Client-user name</p>

//                 <p>Attend By:</p>
//                 <Select
//                     value={attend}
//                     disabled={true}
//                     options={users.map((user) => ({
//                         value: user.UserLoginId,
//                         label: `${user.ul_FirstName} ${user.ul_LastName}`,
//                     }))}
//                 />
//                 <p>Assign To:</p>
//                 <Select
//                     value={assign}
//                     onChange={(value) => setAssign(value)}
//                     options={users.map((user) => ({
//                         value: user.UserLoginId,
//                         label: `${user.ul_FirstName} ${user.ul_LastName}`,
//                     }))}
//                 />
//                 <p>Status:</p>
//                 <Select
//                     value={taskStatus}
//                     onChange={(value) => setTaskStatus(value)}
//                     options={[
//                         { value: "P", label: "Pending" },
//                         { value: "I", label: "Inprogress" },
//                         { value: "C", label: "Complate" },
//                     ]}
//                 />
//                 <p>Description:</p>
//                 <textarea
//                     value={description}
//                     onChange={(e) => setDescription(e.target.value)}
//                 ></textarea>

//                 <button onClick={handleSubmit} className='login-btn'>Save</button>
//             </div>
//         </Modal>
//     );
// };

// export default Edit;




// import React, { useState, useEffect } from 'react';
// import { DatePicker, Select, Modal } from 'antd';
// import moment from 'moment';
// import axios from 'axios';
// import './edit.css';
// import { toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// const Edit = ({ task, status, onClose, onUpdate }) => {
//     const [loading, setLoading] = useState(false);
//     const [client, setClient] = useState(task?.ClientName || "");
//     const [attend, setAttend] = useState(task?.AttendByFirstName + " " + task?.AttendByLastName || "");
//     const [assign, setAssign] = useState(""); // Will be set to logged-in user's name
//     const [date, setDate] = useState(null);
//     const [description, setDescription] = useState(task?.Description || "");
//     const [clientusername, setClientusername] = useState(task?.ClientUserName ?? "");
//     const [remark, setRemark] = useState(task?.Remark ?? "");
//     const [priority, setPriority] = useState(task?.TaskPriorityName || ""); // Initial state for priority
//     const [taskStatus, setTaskStatus] = useState(status);
//     const [isModalVisible, setIsModalVisible] = useState(true);
//     const [users, setUsers] = useState([]);
//     const [priorityOptions, setPriorityOptions] = useState([]); // New state to hold priority options
//     const [categoryOptions, setCategoryOptions] = useState([]); // New state to hold category options
//     const [category, setCategory] = useState(""); // State for selected category

//     useEffect(() => {
//         if (task?.Date) {
//             setDate(moment(task.Date, 'MM/DD/YYYY'));
//         }

//         const storedUser = localStorage.getItem('user');
//         const token = localStorage.getItem('accesstoken');
//         console.log("accesstoken key : " + token);

//         if (storedUser && token) {
//             const userData = JSON.parse(storedUser);
//             const companyid = userData.User.CompanyId;

//             // Set default "Assign To" value to the logged-in user's name
//             const loggedInUser = {
//                 UserLoginId: userData.User.UserLoginId,
//                 ul_FirstName: userData.User.ul_FirstName,
//                 ul_LastName: userData.User.ul_LastName,
//             };
//             const loggedInUserName = `${loggedInUser.ul_FirstName} ${loggedInUser.ul_LastName}`;
//             setAssign(loggedInUser.UserLoginId); // Set the logged-in user's ID as default
//             console.log("Logged-in user name:", loggedInUserName);

//             // Fetch users for the dropdown
//             const params = new FormData();
//             params.set("companyid", companyid);

//             axios.post('http://192.168.10.20:8082/api/UserLogin/getuserbycompanyid', params, {
//                 headers: {
//                     "Content-Type": "application/json",
//                     accesstokenkey: token,
//                 }
//             })
//             .then((response) => {
//                 if (response.data && response.data.Users) {
//                     const filteredUsers = response.data.Users.filter(user =>
//                         user.ul_Role === 'user' && user.ul_IsActive
//                     );

//                     // Ensure the logged-in user is included in the dropdown options
//                     const updatedUsers = [
//                         loggedInUser,
//                         ...filteredUsers.filter(user => user.UserLoginId !== loggedInUser.UserLoginId)
//                     ];

//                     setUsers(updatedUsers);
//                 }
//             })
//             .catch((error) => {
//                 console.error("Error fetching users:", error);
//             });

//             // Fetch priority options from the 'getmiscellaneous' API
//             const miscParams = new FormData();
//             miscParams.set("trantype", "Priority");

//             axios.post('http://192.168.10.20:8082/api/Task/getmiscellaneous', miscParams, {
//                 headers: {
//                     "Content-Type": "application/json",
//                     accesstokenkey: token,
//                 }
//             })
//             .then((response) => {
//                 if (response.data && response.data.Miscellaneous) {
//                     const priorityOptions = response.data.Miscellaneous.map(priority => ({
//                         value: priority.MiscellaneousMstId, // Assuming MiscellaneousMstId is the ID
//                         label: priority.Name, // Assuming Name is the display text
//                     }));
//                     setPriorityOptions(priorityOptions); // Set priority options
//                 }
//             })
//             .catch((error) => {
//                 console.error("Error fetching priority options:", error);
//             });

//             // Fetch category options from the 'getmiscellaneous' API
//             const categoryParams = new FormData();
//             categoryParams.set("trantype", "TaskCat");

//             axios.post('http://192.168.10.20:8082/api/Task/getmiscellaneous', categoryParams, {
//                 headers: {
//                     "Content-Type": "application/json",
//                     accesstokenkey: token,
//                 }
//             })
//             .then((response) => {
//                 if (response.data && response.data.Miscellaneous) {
//                     const categoryOptions = response.data.Miscellaneous.map(category => ({
//                         value: category.MiscellaneousMstId, // Assuming MiscellaneousMstId is the ID
//                         label: category.Name, // Assuming Name is the display text
//                     }));
//                     setCategoryOptions(categoryOptions); // Set category options
//                 }
//             })
//             .catch((error) => {
//                 console.error("Error fetching category options:", error);
//             });
//         }
//     }, [task]);

//     const handleCancel = () => {
//         setIsModalVisible(false);
//         onClose();
//     };

//     const handleSubmit = () => {
//         setLoading(true);

//         const storedUser = localStorage.getItem("user");
//         const token = localStorage.getItem("accesstoken");

//         if (!storedUser || !token) {
//             toast.error("User is not authenticated.");
//             setLoading(false);
//             return;
//         }

//         const userData = JSON.parse(storedUser);
//         const userLoginId = userData.User.UserLoginId;
//         const companyId = userData.User.CompanyId;

//         const dateString = date && date.isValid() ? date.format('YYYY-MM-DD') : task?.Date || "";
//         if (!dateString || !description || !assign) {
//             toast.error("Please fill all the required fields!");
//             setLoading(false);
//             return;
//         }

//         const updateData = {
//             updatetask: [
//                 {
//                     dailytaskid: (task?.DailyTaskId || "").toString(),
//                     userloginid: userLoginId.toString(),
//                     companyid: companyId.toString(),
//                     date: dateString,
//                     description: description || task?.Description || "",
//                     status: taskStatus || task?.Status || "",
//                     companyclientid: (task?.CompanyClientId || "").toString(),
//                     attendbyid: (task?.AttendById || "").toString(),
//                     assigntoid: (assign || "").toString(),
//                     sourceid: (task?.SourceId || 0).toString(),
//                     taskid: (task?.TaskId || 0).toString(),
//                     mode: task?.Mode || "GEN",
//                     remark: remark || task?.Remark || "",
//                     clientusername: clientusername || task?.ClientUserName || "",
//                     taskcatid: (category || "").toString(), // Include the selected category
//                     priorityid: (priority || "").toString(),
//                 },
//             ],
//         };

//         console.log("Final JSON Payload:", JSON.stringify(updateData, null, 2));

//         axios
//             .post("http://192.168.10.20:8082/api/Task/updatetask", updateData, {
//                 headers: {
//                     accesstokenkey: token,
//                 },
//             })
//             .then((response) => {
//                 setLoading(false);
//                 console.log("API Response:", response.data);
//                 if (response.data && response.data.message === "Success") {
//                     toast.success("Task updated successfully!");
//                     onUpdate();
//                     onClose();
//                 } else {
//                     toast.error("Failed to update the task.");
//                 }
//             })
//             .catch((error) => {
//                 setLoading(false);
//                 console.error("Error updating task:", error);
//                 toast.error("An error occurred while updating the task.");
//             });
//     };

//     return (
//         <Modal
//             title="Edit Task"
//             open={isModalVisible}
//             onCancel={handleCancel}
//             footer={null}
//             destroyOnClose={true}
//         >
//             <div className="task-form">
//                 <div className="main-page-date">
//                     <DatePicker
//                         value={date}
//                         onChange={(date) => setDate(date)}
//                     />
//                 </div>

//                 <p>Client Name:</p>
//                 <Select
//                     value={client}
//                     disabled={true}
//                     options={[{ value: client, label: client }]}
//                 />
//                 <p>Client User Name:</p>
//                 <textarea
//                     value={clientusername}
//                     onChange={(e) => setClientusername(e.target.value)}
//                 ></textarea>
//                 <p>Attend By:</p>
//                 <Select
//                     value={attend}
//                     disabled={true}
//                     options={users.map((user) => ({
//                         value: user.UserLoginId,
//                         label: `${user.ul_FirstName} ${user.ul_LastName}`,
//                     }))}
//                 />
//                 <p>Assign To:</p>
//                 <Select
//                     value={assign}
//                     onChange={(value) => setAssign(value)}
//                     options={users.map((user) => ({
//                         value: user.UserLoginId,
//                         label: `${user.ul_FirstName} ${user.ul_LastName}`,
//                     }))}
//                 />
//                 <p>Status:</p>
//                 <Select
//                     value={taskStatus}
//                     onChange={(value) => setTaskStatus(value)}
//                     options={[
//                         { value: "P", label: "Pending" },
//                         { value: "I", label: "Inprogress" },
//                         { value: "C", label: "Complete" },
//                     ]}
//                 />
//                 <Select
// value={priority}
// onChange={setPriority}
// options={priorityOptions}
// />
// <p>Category:</p>
// <Select
// value={category}
// onChange={setCategory}
// options={categoryOptions}
// />
//                 <p>Description:</p>
//                 <textarea
//                     value={description}
//                     onChange={(e) => setDescription(e.target.value)}
//                 ></textarea>
//                 <p>Remark:</p>
//                 <textarea
//                     value={remark}
//                     onChange={(e) => setRemark(e.target.value)}
//                 ></textarea>

//                 <button onClick={handleSubmit} className='login-btn'>Save</button>
//             </div>
//         </Modal>
//     );
// };

// export default Edit;

import React, { useState, useEffect } from 'react';
import { DatePicker, Select, Modal } from 'antd';
import moment from 'moment';
import axios from 'axios';
import './edit.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import config from './Config';
import { MdDateRange } from "react-icons/md";

const Edit = ({ task, status, onClose, onUpdate }) => {
    const [loading, setLoading] = useState(false);
    const [client, setClient] = useState(task?.ClientName || "");
    const [attend, setAttend] = useState(task?.AttendByFirstName + " " + task?.AttendByLastName || "");
    const [assign, setAssign] = useState("");
    const [date, setDate] = useState(null);
    const [description, setDescription] = useState(task?.Description || "");
    const [clientusername, setClientusername] = useState(task?.ClientUserName ?? "");
    const [remark, setRemark] = useState(task?.Remark ?? "");
    const [priority, setPriority] = useState("");
    const [taskStatus, setTaskStatus] = useState(status);
    const [isModalVisible, setIsModalVisible] = useState(true);
    const [users, setUsers] = useState([]);
    const [priorityOptions, setPriorityOptions] = useState([]);
    const [categoryOptions, setCategoryOptions] = useState([]);
    const [category, setCategory] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        if (task?.Date) {
            setDate(moment(task.Date, 'YYYY-MM-DDTHH:mm:ss'));
        }

        const storedUser = localStorage.getItem('user');
        const token = localStorage.getItem('accesstoken');

        // const token = localStorage.getItem("accesstoken");

        if (!token) {
            console.error("Missing user data or token in localStorage.");
            setTimeout(() => {
                navigate('/');
            }, 0);
            return;
        }

        if (storedUser && token) {
            const userData = JSON.parse(storedUser);
            const companyid = userData.User.CompanyId;

            const loggedInUser = {
                UserLoginId: userData.User.UserLoginId,
                ul_FirstName: userData.User.ul_FirstName,
                ul_LastName: userData.User.ul_LastName,
            };
            setAssign(loggedInUser.UserLoginId);

            // Fetch users
            const params = new FormData();
            params.set("companyid", companyid);

            // axios.post('http://192.168.10.20:8082/api/UserLogin/getuserbycompanyid', params, {
            axios.post(`${config.BASE_URL}/UserLogin/getuserbycompanyid`, params, {
                headers: {
                    "Content-Type": "application/json",
                    accesstokenkey: token,
                }
            })
                .then((response) => {
                    if (response.data && response.data.Users) {
                        const filteredUsers = response.data.Users.filter(user =>
                            user.ul_Role === 'user' && user.ul_IsActive
                        );
                        setUsers([
                            loggedInUser,
                            ...filteredUsers.filter(user => user.UserLoginId !== loggedInUser.UserLoginId)
                        ]);
                    }
                })
                .catch((error) => {
                    console.error("Error fetching users:", error);
                });

            // Fetch priority options
            // axios.post('http://192.168.10.20:8082/api/Task/getmiscellaneous', { trantype: "Priority" }, {
            axios.post(`${config.BASE_URL}/Task/getmiscellaneous`, { trantype: "Priority" }, {
                headers: { accesstokenkey: token }
            })
                .then((response) => {
                    if (response.data && response.data.Miscellaneous) {
                        const priorityList = response.data.Miscellaneous.map(priority => ({
                            value: priority.MiscellaneousMstId,
                            label: priority.Name,
                        }));
                        setPriorityOptions(priorityList);
                        const selectedPriority = priorityList.find(opt => opt.label === task?.TaskPriorityName);
                        if (selectedPriority) setPriority(selectedPriority.value);
                    }
                })
                .catch((error) => {
                    console.error("Error fetching priority options:", error);
                });

            // Fetch category options
            // axios.post('http://192.168.10.20:8082/api/Task/getmiscellaneous', { trantype: "TaskCat" }, {
            axios.post(`${config.BASE_URL}/Task/getmiscellaneous`, { trantype: "TaskCat" }, {
                headers: { accesstokenkey: token }
            })
                .then((response) => {
                    if (response.data && response.data.Miscellaneous) {
                        const categoryList = response.data.Miscellaneous.map(category => ({
                            value: category.MiscellaneousMstId,
                            label: category.Name,
                        }));
                        setCategoryOptions(categoryList);
                        const selectedCategory = categoryList.find(opt => opt.value === task?.TaskCatId);
                        if (selectedCategory) setCategory(selectedCategory.value);
                    }
                })
                .catch((error) => {
                    console.error("Error fetching category options:", error);
                });
        }
    }, [task]);

    const handleCancel = () => {
        setIsModalVisible(false);
        onClose();
    };

    const handleSubmit = () => {
        setLoading(true);
        const storedUser = localStorage.getItem("user");
        const token = localStorage.getItem("accesstoken");

        if (!storedUser || !token) {
            toast.error("User is not authenticated.");
            setLoading(false);
            return;
        }

        const userData = JSON.parse(storedUser);
        const userLoginId = userData.User.UserLoginId;
        const companyId = userData.User.CompanyId;

        const dateString = date && date.isValid() ? date.format('YYYY-MM-DD') : task?.Date || "";
        if (!dateString || !description || !assign) {
            toast.error("Please fill all the required fields!");
            setLoading(false);
            return;
        }

        const updateData = {
            updatetask: [
                {
                    dailytaskid: (task?.DailyTaskId || "").toString(),
                    userloginid: userLoginId.toString(),
                    companyid: companyId.toString(),
                    date: dateString,
                    description: description || task?.Description || "",
                    status: taskStatus || task?.Status || "",
                    companyclientid: (task?.CompanyClientId || "").toString(),
                    attendbyid: (task?.AttendById || "").toString(),
                    assigntoid: (assign || "").toString(),
                    sourceid: (task?.SourceId || 0).toString(),
                    taskid: (task?.TaskId || 0).toString(),
                    mode: task?.Mode || "GEN",
                    remark: remark || task?.Remark || "",
                    clientusername: clientusername || task?.ClientUserName || "",
                    taskcatid: (category || "").toString(),
                    priorityid: priority.toString(),
                },
            ],
        };

        // axios.post("http://192.168.10.20:8082/api/Task/updatetask", updateData, {
        axios.post(`${config.BASE_URL}/Task/updatetask`, updateData, {
            headers: { accesstokenkey: token },
        })
            .then((response) => {
                setLoading(false);
                if (response.data && response.data.message === "Success") {
                    toast.success("Task updated successfully!");
                    onUpdate();
                    onClose();
                } else {
                    toast.error("Failed to update the task.");
                }
            })
            .catch((error) => {
                if (error.response) {

                    setTimeout(() => {
                        navigate('/');
                    }, 0);
                }
                else { }
                // setLoading(false);
                // console.error("Error updating task:", error);
                // toast.error("An error occurred while updating the task.");
            });
    };

    return (
        <Modal
            title="Edit Task"
            open={isModalVisible}
            onCancel={handleCancel}
            footer={null}
            destroyOnClose={true}
        >
            <div className="task-form">
            <div className="main-page-date">
                    <p>Date:</p>
                    <input type="text" value={task.Date} className='select' disabled={true} style={{width:'125px'}}  /><MdDateRange style={{position:'absolute',left:'125px',top:'94px',fontSize:"18px",opacity:'0.4'}} />

                </div>

                <p>Client Name:</p>
                <Select
                    value={client}
                    disabled={true}
                    options={[{ value: client, label: client }]}
                />
                <p>Client User Name:</p>
                <input className='select' type='text'
                    value={clientusername}
                    onChange={(e) => setClientusername(e.target.value)}
                />
                <p>Attend By:</p>
                <Select
                    value={attend}
                    disabled={true}
                    options={users.map((user) => ({
                        value: user.UserLoginId,
                        label: `${user.ul_FirstName} ${user.ul_LastName}`,
                    }))}
                />
                <p>Assign To:</p>
                <Select
                    value={assign}
                    onChange={(value) => setAssign(value)}
                    options={users.map((user) => ({
                        value: user.UserLoginId,
                        label: `${user.ul_FirstName} ${user.ul_LastName}`,
                    }))}
                />
                <p>Status:</p>
                <Select
                    value={taskStatus}
                    onChange={(value) => setTaskStatus(value)}
                    options={[
                        { value: "P", label: "Pending" },
                        { value: "I", label: "Inprogress" },
                        { value: "C", label: "Complete" },
                    ]}
                />
                <p>Priority:</p>
                <Select
                    value={priority}
                    onChange={setPriority}
                    options={priorityOptions}
                />
                <p>Category:</p>
                <Select
                    value={category}
                    onChange={setCategory}
                    options={categoryOptions}
                />
                <p>Description:</p>
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                ></textarea>
                <p>Remark:</p>
                <textarea
                    value={remark}
                    onChange={(e) => setRemark(e.target.value)}
                ></textarea>

                <button onClick={handleSubmit} className='login-btn'>Save</button>
            </div>
        </Modal>
    );
};

export default Edit;