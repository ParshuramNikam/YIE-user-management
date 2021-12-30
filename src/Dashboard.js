import { useEffect, useState } from "react"
import { useCookies } from 'react-cookie'
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
    const [cookie] = useCookies(['yie_access_token']);
    const [isVerified, setIsVerified] = useState(false);
    const [userDetails, setUserDetails] = useState({});
    const [userDetailsKeys, setUserDetailsKeys] = useState([]);
    const [isUpdating, setIsUpdating] = useState(false);
    const [exclude] = useState(["email", "id", "role"])

    const navigate = useNavigate()

    useEffect(() => {
        console.log(cookie.yie_access_token);
        if (!cookie.yie_access_token || cookie.yie_access_token.length === 0) {
            navigate('/login');
        } else {
            fetch('http://localhost:5000/auth',
                {
                    method: "POST",
                    credentials: "include"
                }
            )
                .then(res => res.json())
                .then(async (result) => {
                    console.log(result);
                    if (result.status !== 'success') {
                        navigate('/login');
                    } else {
                        setIsVerified(true);
                        setUserDetails(result.user);
                        const myKeys = Object.keys(result.user);
                        myKeys[myKeys.indexOf("createdAt")] = null;
                        myKeys[myKeys.indexOf("updatedAt")] = null;
                        myKeys[myKeys.indexOf("password")] = null;
                        console.log(myKeys);
                        setUserDetailsKeys(myKeys);
                    }
                })
        }
    }, [])

    const onSubmitHandler = (e) => {
        e.preventDefault();
        console.log(userDetails);
    }

    const setValueToInput = (e) => {
        if (isUpdating) {
            console.log(e.target.id);
            if (exclude.includes(e.target.id)) {
                return;
            }
            setUserDetails({ ...userDetails, [e.target.id]: e.target.value })
        }
    }

    const updateDetailsHandler = (e) => {
        fetch(`http://localhost:5000/user/${userDetails.id}`, {
            method: "PATCH",
            body: JSON.stringify(userDetails),
            credentials: "include",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }).then(res => res.json())
            .then(result => {
                console.log(result);
            })
    }


    return (
        isVerified && <>
            <div>
                <h1 className="text-5xl text-indigo-500 text-center my-3">Dashboard</h1>
                <form onSubmit={onSubmitHandler}
                    className="max-w-7xl border-2 border-gray-400 m-2 p-2 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-4 bg-blue-50"
                >
                    {
                        userDetailsKeys && userDetailsKeys.map((keyName, index) => {
                            return (
                                keyName !== null
                                    ? <div key={index} className="mb-4 max-w-md">
                                        <label className="block text-gray-700 text-sm font-bold mb-2 capitalize" htmlFor="email">{keyName === "className" ? "Class" : keyName}</label>
                                        <input
                                            className="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                            id={keyName}
                                            name="email"
                                            type="email"
                                            placeholder="email"
                                            value={userDetails[keyName]}
                                            onChange={setValueToInput}
                                            disabled={exclude.includes(keyName) ? true : !isUpdating}
                                        />
                                    </div>
                                    : null
                            )
                        })
                    }
                </form>
                {
                    isUpdating ?
                        <div>
                            <button type="button" className="m-2 px-5 py-2 bg-indigo-500 rounded text-white"
                                onClick={(e) => { setIsUpdating(!isUpdating); updateDetailsHandler(e) }}
                            >
                                Save Details
                            </button>
                        </div>
                        : <div>
                            <button type="submit" className="m-2 px-5 py-2 bg-indigo-500 rounded text-white"
                                onClick={(e) => setIsUpdating(!isUpdating)}
                            >
                                Update Details
                            </button>
                        </div>
                }
            </div>
        </>
    )
}

export default Dashboard
