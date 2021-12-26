import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
// import { useHistory } from "react-router-dom";
import { useNavigate, Link } from "react-router-dom";
// import "bootstrap/dist/css/bootstrap.min.css";


const RegistrationPage = () => {

    const [userRole, setUserRole] = useState('student');
    const navigate = useNavigate();
    // const history = useHistory();

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
            .min(8, 'Password must be at least 6 characters')
            .max(40, 'Password must not exceed 40 characters')
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
            .catch((err) => console.error(err))


    };

    return (
        <div className="my-4 mx-2 register-form bg-white px-4 py-3 rounded-lg d-flex align-items-center justify-content-center h-100">
            <form onSubmit={handleSubmit(onSubmit)}>

                <div className="form-group">
                    <label>Username</label>
                    <input
                        name="username"
                        type="text"
                        {...register('username')}
                        className={`form-control ${errors.username ? 'is-invalid' : ''}`}
                    />
                    <div className="invalid-feedback">{errors.username?.message}</div>
                </div>

                <div className="form-group">
                    <label>Email</label>
                    <input
                        name="email"
                        type="text"
                        {...register('email')}
                        className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                    />
                    <div className="invalid-feedback">{errors.email?.message}</div>
                </div>

                <div className="form-group">
                    <label>Password</label>
                    <input
                        name="password"
                        type="password"
                        {...register('password')}
                        className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                    />
                    <div className="invalid-feedback">{errors.password?.message}</div>
                </div>

                <div className="form-group">
                    <label>role</label>
                    <select name="role" id="role"
                        value="student"
                        {...register('role')}
                        className={`form-control ${errors.role ? 'is-invalid' : ''}`}
                        value={userRole}
                        onChange={(e) => setUserRole(e.target.value)}
                    >
                        <option value="student" >Student</option>
                        <option value="teacher">Teacher</option>
                        <option value="schoolAdmin">SchoolAdmin</option>
                        <option value="superAdmin">SuperAdmin</option>
                    </select>
                    <div className="invalid-feedback">{errors.role?.message}</div>
                </div>

                <div className="form-group">
                    <label>Your Age</label>
                    <input
                        name="age"
                        type="number"
                        {...register('age')}
                        className={`form-control ${errors.age ? 'is-invalid' : ''}`}
                    />
                    <div className="invalid-feedback">{errors.conatct?.message}</div>
                </div>

                <div className="form-group">
                    <label>Your address</label>
                    <input
                        name="address"
                        type="text"
                        min={4}
                        {...register('address')}
                        className={`form-control ${errors.address ? 'is-invalid' : ''}`}
                    />
                    <div className="invalid-feedback">{errors.address?.message}</div>
                </div>

                {
                    userRole !== "schoolAdmin" &&
                    <div className="form-group">
                        <label>School Id</label>
                        <input
                            name="schoolId"
                            type="text"
                            {...register('schoolId')}
                            className={`form-control ${errors.schoolId ? 'is-invalid' : ''}`}
                        />
                        <div className="invalid-feedback">{errors.schoolId?.message}</div>
                    </div>
                }


                {
                    userRole === "student" &&
                    <div className="form-group">
                        <label>Parent Name</label>
                        <input
                            name="parentName"
                            type="text"
                            min={4}
                            {...register('parentName')}
                            className={`form-control ${errors.parentName ? 'is-invalid' : ''}`}
                        />
                        <div className="invalid-feedback">{errors.parentName?.message}</div>
                    </div>
                }

                <div className="form-group">
                    {
                        userRole === "student"
                            ? <label>Parent's conatct no.</label>
                            : <label>Your conatct no.</label>
                    }
                    <input
                        name="contactNo"
                        type="tel"
                        {...register('contactNo')}
                        className={`form-control ${errors.contactNo ? 'is-invalid' : ''}`}
                    />
                    <div className="invalid-feedback">{errors.contactNo?.message}</div>
                </div>

                {
                    userRole === "student" &&
                    <div className="form-group">
                        <label>Class</label>
                        <input
                            name="className"
                            type="text"
                            {...register('className')}
                            className={`form-control ${errors.className ? 'is-invalid' : ''}`}
                        />
                        <div className="invalid-feedback">{errors.className?.message}</div>
                    </div>
                }

                <div className="form-group">
                    <button type="submit" className="btn btn-primary">
                        Register
                    </button>
                    <button
                        type="button"
                        onClick={reset}
                        className="btn btn-warning float-right"
                    >
                        Reset
                    </button>
                </div>
                <div className='text-center '>
                    <h4>
                        <Link to="/login">
                            Login
                        </Link>
                    </h4>
                </div>
            </form>

        </div>
    )
}

export default RegistrationPage
