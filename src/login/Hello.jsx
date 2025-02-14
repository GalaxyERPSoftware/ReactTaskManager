import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios";
import './login.css';
import config from "../dashboard/Config";

const Hello = () => {
    const phone = useRef();
    const password = useRef();
    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(false);

    const validatePhoneNumber = (phoneNumber) => {
        const phonePattern = /^[0-9]{10}$/;
        return phonePattern.test(phoneNumber);
    };

    const validateForm = () => {
        if (!phone.current.value) {
            toast.error('Phone number is required.', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });
            return false;
        }
        if (!validatePhoneNumber(phone.current.value)) {
            toast.error('Please enter a valid 10-digit phone number.', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });
            return false;
        }
        if (phone.current.value.length > 10) {
            toast.error('Phone number cannot exceed 10 digits.', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });
            return false;
        }
        if (!password.current.value) {
            toast.error('Password is required', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });
            return false;
        }
        if (password.current.value.length < 10) {
            toast.error('Password should be exactly 10 characters.', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });
            return false;
        }
        return true;
    };

    const signin = (e) => {

        e.preventDefault();

        axios.get('https://api.ipify.org/')
            .then(function (response) {
                // handle success
                console.log(response);
            })
            .catch(function (error) {
                // handle error
                console.log(error);
            });



        if (!validateForm()) {
            return;
        }

        setIsLoading(true);

        const params = new FormData();
        params.set("phoneno", phone.current.value);
        params.set("password", password.current.value);
        params.set("id", "");
        params.set("model", "");
        params.set("product", "");
        params.set("host", "");
        params.set("hardware", "");
        params.set("display", "");
        params.set("device", "web");
        params.set("ipaddress", "");
        params.set("galaxyappversion", "");


        // axios.post('http://192.168.10.20:8082/api/UserLogin/login', params, {
            axios.post(`${config.BASE_URL}/UserLogin/login`, params, {
            headers: {
                'Content-Type': 'application/json',
            }
        })
            .then(function (response) {
                setIsLoading(false);
                if (response.status === 200) {
                    if (response.data.AccessTokenKey) {
                        localStorage.setItem('accesstoken', response.data.AccessTokenKey);
                        toast.success('Login Sucessfully', {
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
                            navigate('/dashboard');
                        }, 1000);
                    } else {
                        toast.error('Invalid User Login',)
                        console.error('Access token not found in the response');
                    }
                } else {
                    toast.error('Invalid User Please Try Again', {
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
                        navigate('/');
                    }, 100);
                }

                toast.success(response.data);
                console.log(response.data);


                const userData = response.data;
                localStorage.setItem('user', JSON.stringify(userData));

                if (userData.firstname) {
                    localStorage.setItem('useris', userData.firstname);
                }
                if (userData.accesstoken) {
                    localStorage.setItem('accesstoken', userData.accesstoken);
                }
            })
            .catch((error) => {
                setIsLoading(false);
                toast.error("An error occurred. Please try again.");
                console.error("Login error:", error);
            });
    };

    return (
        <>
            <ToastContainer position="top-right" autoClose={3000} />
            <div className="login-main">
                <div className="wrapper fadeInDown">
                    <div id="formContent">
                        {/* Tabs Titles */}
                        {/* <h2 >
                            Admin Login
                        </h2> */}

                        {/* Icon */}
                        <div className="fadeIn first">
                            <img src="/assets/img/logo2.png" id="icon" alt="User Icon" />
                        </div>

                        {/* Login Form */}
                        <form onSubmit={signin}>
                            <input
                                type="text"
                                id="login"
                                className="box"
                                name="login"
                                placeholder="Phone Number"
                                ref={phone}
                                maxLength="10"
                            />
                            {/* <input
                                type="tel"  // Use 'tel' type for phone numbers
                                id="phone"
                                className="box"
                                name="phone"
                                placeholder="Phone Number"
                                ref={phone}
                                maxLength="10"  // Limit input to 10 characters
                                pattern="[0-9]{10}"  // Only allow 10 numeric digits
                                onInput={(e) => e.target.value = e.target.value.replace(/\D/g, '')} // Ensure only numbers are entered
                            /> */}
                            <input
                                type="password"
                                id="password"
                                className="box"
                                name="password"
                                placeholder="Password"
                                ref={password}
                                // maxLength="10"
                            />
                            {/* <input
                                type="password"
                                id="password"
                                className="box"
                                name="password"
                                placeholder="Password"
                                ref={password}
                                maxLength="10"  // Limit input to 10 characters
                                pattern="^[a-zA-Z0-9]{10}$"  // Only allow exactly 10 alphanumeric characters
                                required  // Make this field required
                                onInput={(e) => e.target.value = e.target.value.replace(/[^a-zA-Z0-9]/g, '')}  // Ensure only alphanumeric characters are entered
                            /> */}

                            <input
                                type="submit"
                                value="Login"
                                className="fadeIn fourth"
                            />
                        </form>

                        {/* Remind Password */}

                        <div id="formFooter">
                            <a className="underlineHover" href="#">
                                Forgot Password?
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Hello;
