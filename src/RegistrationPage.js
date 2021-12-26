import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useNavigate, Link } from "react-router-dom";
import { useCookies } from 'react-cookie'


const RegistrationPage = () => {

    const [userRole, setUserRole] = useState('student');
    const [cookie] = useCookies(['yie_access_token']);
    const [showForm, setShowForm] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        console.log(cookie.yie_access_token);
        if (!cookie.yie_access_token || cookie.yie_access_token.length === 0) {
            navigate('/signup');
        }

        fetch("http://localhost:5000/auth", {
            method: "POST",
            credentials: "include"
        }).then((res) => res.json())
            .then((data) => {
                if (data.status && data.status === "success") {
                    navigate('/dashboard')
                } else {
                    setShowForm(true);
                }
            }).catch((err) => {
                alert(err);
                setShowForm(true);
            })

    }, [])

    const validationSchema = Yup.object().shape({
        // fullname: Yup.string().required('Fullname is required'),
        username: Yup.string()
            .required('Username is required')
            .min(6, 'Username must be at least 6 characters')
            .max(20, 'Username must not exceed 20 characters'),
        email: Yup.string()
            .required('Email is required')
            .email('Email is invalid'),
        password: Yup.string()
            .required('Password is required')
            .min(8, 'Password must be at least 8 characters')
            .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9_])/, {
                message: "Password must include atleast [a-z] [A-Z] [0-9] and 1 symbol",
                excludeEmptyString: false,
            }),
        role: Yup.string()
            .required('Role is required'),
        contactNo: Yup.string()
            .required('10 digit conatact no required!')
            .matches(/^\d{10}$/, {
                message: "Invalid number - conatct no should be 10 digit.",
                excludeEmptyString: false,
            }),
        address: Yup.string(),
        // schoolId: Yup.string()
        //     .required('SchoolId is required'),
        parentName: Yup.string(),
        className: Yup.string(),


        // confirmPassword: Yup.string()
        //     .required('Confirm Password is required')
        //     .oneOf([Yup.ref('password'), null], 'Confirm Password does not match'),
        // acceptTerms: Yup.bool().oneOf([true], 'Accept Terms is required')
    });

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm({
        resolver: yupResolver(validationSchema)
    });

    const onSubmit = async (data, e) => {
        console.log(JSON.stringify(data, null, 2));

        if (data.age && data.age < 5) {
            alert("Age should be >= 5");
        }
        if (userRole === 'student') {
            if (!data.age || !data.address || !data.schoolId || !data.parentName || !data.className) {
                console.log("student");
                alert("All fileds required!");
                return
            }
        }
        if (userRole === 'teacher' || userRole === 'schoolAdmin') {
            console.log("teacher");
            if (!data.age || !data.address || !data.schoolId) {
                alert("All fileds required!");
                return
            }
        }

        let backendUrl = 'http://localhost:5000';
        await fetch(`${backendUrl}/auth/signup`, {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data),
            credentials: "include"
        }).then((res) => res.json())
            .then(user => {
                console.log(">>>>", user)
                if (user.status && user.status === "failed") {
                    return alert(user.message);
                } else {
                    console.log("User added sucesfully!");
                    navigate('/dashboard');
                    reset();
                }
            })
            .catch((err) => {
                console.error(err);
                alert(err);
            })
    };

    return (
        showForm && <div className="w-full max-w-md">
            <form onSubmit={handleSubmit(onSubmit)} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 mt-4">
                <h1 className="block text-gray-700 text-center text-xl font-bold mb-10">Registration Form</h1>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Username</label>
                    <input
                        name="username"
                        placeholder="Username"
                        type="text"
                        {...register('username')}
                        className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.username ? 'is-invalid' : ''}`}
                    />
                    <div className="text-sm text-red-500 font-bold ">{errors.username?.message}</div>
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
                    <input
                        name="email"
                        placeholder="Email"
                        type="text"
                        {...register('email')}
                        className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline form-control ${errors.email ? 'is-invalid' : ''}`}
                    />
                    <div className="text-sm text-red-500 font-bold ">{errors.email?.message}</div>
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Password</label>
                    <input
                        name="password"
                        placeholder="Password"
                        type="password"
                        {...register('password')}
                        className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline form-control ${errors.password ? 'is-invalid' : ''}`}
                    />
                    <div className="text-sm text-red-500 font-bold ">{errors.password?.message}</div>
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Select Role:</label>
                    <select name="role" id="role"
                        value="student"
                        {...register('role')}
                        className={`form-select shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline form-control ${errors.role ? 'is-invalid' : ''}`}
                        value={userRole}
                        onChange={(e) => setUserRole(e.target.value)}
                    >
                        <option value="student" >Student</option>
                        <option value="teacher">Teacher</option>
                        <option value="schoolAdmin">SchoolAdmin</option>
                        <option value="superAdmin">SuperAdmin</option>
                    </select>
                    <div className="text-sm text-red-500 font-bold ">{errors.role?.message}</div>
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Your Age</label>
                    <input
                        name="age"
                        placeholder="Age"
                        type="number"
                        {...register('age')}
                        className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline form-control ${errors.age ? 'is-invalid' : ''}`}
                    />
                    <div className="text-sm text-red-500 font-bold ">{errors.conatct?.message}</div>
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Your address</label>
                    <input
                        name="address"
                        placeholder="Address"
                        type="text"
                        min={4}
                        {...register('address')}
                        className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline form-control ${errors.address ? 'is-invalid' : ''}`}
                    />
                    <div className="text-sm text-red-500 font-bold ">{errors.address?.message}</div>
                </div>

                {
                    userRole !== "superAdmin" &&
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">School Id</label>
                        <input
                            name="schoolId"
                            placeholder="School Id"
                            type="text"
                            {...register('schoolId')}
                            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline form-control ${errors.schoolId ? 'is-invalid' : ''}`}
                        />
                        <div className="text-sm text-red-500 font-bold ">{errors.schoolId?.message}</div>
                    </div>
                }


                {
                    userRole === "student" &&
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Parent Name</label>
                        <input
                            name="parentName"
                            placeholder="Parent Name"
                            type="text"
                            min={4}
                            {...register('parentName')}
                            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.parentName ? 'is-invalid' : ''}`}
                        />
                        <div className="text-sm text-red-500 font-bold ">{errors.parentName?.message}</div>
                    </div>
                }

                <div className="mb-4">
                    {
                        userRole === "student"
                            ? <label className="block text-gray-700 text-sm font-bold mb-2">Parent's conatct no.</label>
                            : <label className="block text-gray-700 text-sm font-bold mb-2">Your conatct no.</label>
                    }
                    <input
                        name="contactNo"
                        placeholder="Contact Number"
                        type="tel"
                        {...register('contactNo')}
                        className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.contactNo ? 'is-invalid' : ''}`}
                    />
                    <div className="text-sm text-red-500 font-bold ">{errors.contactNo?.message}</div>
                </div>

                {
                    userRole === "student" &&
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Your Class</label>
                        <input
                            name="className"
                            placeholder="Class Name"
                            type="text"
                            {...register('className')}
                            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.className ? 'is-invalid' : ''}`}
                        />
                        <div className="text-sm text-red-500 font-bold ">{errors.className?.message}</div>
                    </div>
                }

                <div className="flex items-center justify-between mb-6">
                    <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                        Register
                    </button>
                    <button
                        type="button"
                        onClick={reset}
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                        Reset
                    </button>
                </div>
                <div className='text-center  font-bold text-blue-500 text-xl '>
                    <h4>
                        <Link to="/login">
                            Login Here
                        </Link>
                    </h4>
                </div>
            </form>

        </div>
    )
}

export default RegistrationPage
