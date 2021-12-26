import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";


const LoginPage = () => {
    const [userData, setUserData] = useState({
        email: "",
        password: ""
    });

    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (userData.email === "" && !errors.email) return setErrors({ ...errors, email: "Enter valid email" })
        if (userData.password === "" && !errors.password) return setErrors({ ...errors, password: "Enter password" })
        // setInputText(data);
        // e.target.reset();

        let backendUrl = 'http://localhost:5000';
        await fetch(`${backendUrl}/auth/login`, {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData),
            credentials: "include"
        }).then((res) => res.json())
            .then(user => {
                console.log(">>>>", user)
                if (user.status && user.status === "failed") {
                    return alert(user.message);
                } else {
                    console.log("User added sucesfully!");
                    navigate('/dashboard');
                }
            })
            .catch((err) => console.error(err))

        console.log(userData)
        console.log("Submited")
    }

    const disAbleButton = (value) => {
        if (value === " ") return false;

        return true;
    }




    return (
        <div className="w-full max-w-xs">
            <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                <h1 className="block text-gray-700 text-center text-xl font-bold mb-2">Login Form</h1>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">Email</label>
                    <input
                        className="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="email"
                        name="email"
                        type="email"
                        placeholder="email"
                        value={userData.email}
                        onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                    />
                    <div className="mt-2 text-sm text-red-500 font-bold ">{errors.email ? errors.email : ""}</div>
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">Email</label>
                    <input
                        className="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="password"
                        name="password"
                        type="password"
                        placeholder="password"
                        value={userData.password}
                        onChange={(e) => setUserData({ ...userData, password: e.target.value })}
                    />
                    <div className="mt-2 text-sm text-red-500 font-bold ">{errors.password ? errors.password : ""}</div>
                </div>

                <div className="flex items-center justify-between mb-6">
                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                        Sign In
                    </button>
                    <Link className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800" to="">
                        Forgot Password?
                    </Link>
                </div>
                <p className="text-center  font-bold text-blue-500 text-xl">
                    <Link className=" " to="/signup">Register here</Link>
                </p>
            </form>
        </div>
    )
}

export default LoginPage;

{/* <p className="text-2xl">Notice</p> */ }