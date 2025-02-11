import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import config from "./Config";

const Client = () => {
    const [loading, setLoading] = useState(false);
    const [users, setUsers] = useState([]);

    const navigate = useNavigate();

    const fetchUsers = () => {
        const storedUser = localStorage.getItem("user");
        const token = localStorage.getItem("accesstoken");

        if (!token) {
            console.error("Missing access token.");
            navigate('/');
            return;
        }

        if (storedUser) {
            // const userData = JSON.parse(storedUser);

            // if (!userData?.User?.companyid) {
            //     console.error("Company ID is missing in user data.");
            //     return;
            // }
            const companyid = JSON.parse(storedUser).User.CompanyId;


            const params = new FormData();
            params.set("companyid", companyid);

            setLoading(true);
            axios
                .post(`${config.BASE_URL}/Task/getclient`, params, {
                    headers: {
                        accesstokenkey: token,
                        "Content-Type": "application/json",
                    },
                })
                .then((response) => {
                    console.log("API Response:", response.data); // Debugging line
                    if (response.data && response.data.Clients) {
                        setUsers(response.data.Clients);
                        console.log("Clients Data:", response.data.Clients); // Log client data here
                    } else {
                        console.error("No clients found or invalid response structure:", response?.data?.message || "Unknown error");
                    }
                })
                .catch((error) => {
                    console.error("API Error:", error.response ? error.response.data : error.message);
                })
                .finally(() => {
                    setLoading(false);
                });
        } else {
            console.error("No user data found in localStorage");
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    return (
        <div className="hello-child">
            <div className="desh-inner-child">
                <div className="all-man-">
                    <div className="task-list">
                        <div className="main-div-table">
                            <div className="main-table-inner">
                                {loading ? (
                                    <p>Loading...</p>
                                ) : (
                                    <table className="user-table" border={1}>
                                        <thead>
                                            <tr>
                                                <th className="text-d">Id</th>
                                                <th className="text-d">ClientName</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {users.length > 0 ? (
                                                users.map((user) => (
                                                    <tr key={user.CompanyClientId}>
                                                        <td className="text-d">{user.CompanyClientId}</td>
                                                        <td className="text-d">{user.ClientName}</td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="2">No clients found</td>
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
    );
};

export default Client;
