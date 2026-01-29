import { useSearchParams, useNavigate } from "react-router";
import { useEffect } from "react";

export default function AdminDashboard(){
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const userId = searchParams.get("user_id");
    const isAdmin = searchParams.get("is_admin") === "true";

    useEffect(() => {
        // Redirect to login if not admin
        if (!userId || !isAdmin) {
            navigate("/");
        }
    }, [userId, isAdmin, navigate]);

    // If not admin, don't render anything (redirect will happen)
    if (!isAdmin) {
        return <h1>remember, man, hacking is not that easy. Not on my watch, stay back in the line, boy!</h1>;
    }

    return (<div>Admin Dashboard</div>)
}