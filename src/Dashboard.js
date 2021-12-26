import { useEffect, useState } from "react"
import { useCookies } from 'react-cookie'
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
    const [cookie, setCookie] = useCookies(['yie_access_token']);
    const [isVerified, setIsVerified] = useState(false);
    const navigate = useNavigate()

    useEffect(() => {
        console.log(cookie.yie_access_token);
        if (!cookie.yie_access_token || cookie.yie_access_token.length === 0) {
            navigate('/login');
        } else {
            setIsVerified(true);
        }
    }, [])


    return (
        isVerified && <>
            <div>
                <h1>Dashboard</h1>
                <p>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Labore laboriosam, aut assumenda a eveniet dicta praesentium nobis doloremque omnis? Animi vel id similique totam autem cum quaerat perferendis consequatur harum enim non numquam veniam minus quasi exercitationem in, culpa sapiente? Ipsa quos praesentium alias cum magnam ea laboriosam dolores saepe rem neque, doloremque eos, sunt quo dicta. Commodi recusandae unde porro quisquam magni similique! Eligendi numquam adipisci itaque pariatur ratione dolores hic! Cupiditate, dolorem fugit a tempore eveniet ipsam quo dolorum repudiandae? Ex similique quos suscipit dolorum cumque assumenda iste ut labore quod. Enim, atque ipsum ab rem quas natus ex sed distinctio numquam. Consectetur magnam rerum id minus facilis ipsa, culpa, corporis non illo eius harum, exercitationem ad ex explicabo cumque neque quos temporibus in voluptates molestiae architecto dolor. Quas libero commodi cum natus velit minima rem quos nam ea consequatur eligendi similique molestias, numquam at blanditiis voluptatem amet, perspiciatis, accusantium quisquam quibusdam ipsam nesciunt doloremque? Animi quas, distinctio suscipit dolor alias voluptatem nobis impedit provident aperiam eum deleniti ducimus iusto ipsam rerum nihil maiores. Beatae quisquam explicabo ipsa aperiam debitis? Vitae omnis atque voluptatum, provident architecto, harum laborum quia in cupiditate velit beatae voluptatem fuga aut. Voluptatibus quis asperiores quam corrupti adipisci explicabo itaque doloribus nemo minus a aut mollitia repudiandae quibusdam excepturi cupiditate veniam nulla quos vitae, velit optio nisi eos maiores incidunt! Quis autem nisi, aspernatur deserunt commodi ducimus eos minus, molestiae accusamus magnam sed sunt. Dignissimos eligendi voluptate, ab facilis atque mollitia adipisci sunt sequi.
                </p>
            </div>
        </>
    )
}

export default Dashboard
