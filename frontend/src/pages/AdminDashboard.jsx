import { useSearchParams, useNavigate } from "react-router";
import { useEffect, useState } from "react";

const BASE_URL = "https://id-management-system-8bmi.onrender.com";

export default function AdminDashboard(){
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const userId = searchParams.get("user_id");
    const isAdmin = searchParams.get("is_admin") === "true";
    const [applications, setApplications] = useState([]);
    const [mustChange, setMustChange] = useState(false);
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");

    useEffect(() => {
        if (!userId || !isAdmin) {
            navigate("/");
            return;
        }

                // Check if admin must change password first
                fetch(`${BASE_URL}/admin_password_needs_change/${userId}`)
                    .then(res => res.json())
                    .then(data => {
                        if (data?.needs_change) {
                            setMustChange(true);
                            setApplications([]);
                            return;
                        }

                        // fetch pending applications
                        fetch(`${BASE_URL}/pending_applications/${userId}`)
                            .then(res => {
                                if (!res.ok) throw new Error('Failed to fetch');
                                return res.json();
                            })
                            .then(data => setApplications(data || []))
                            .catch(() => setApplications([]));
                    })
                    .catch(() => {
                        setApplications([]);
                    });
    }, [userId, isAdmin, navigate]);

    if (!isAdmin) {
        return <h1>Unauthorized</h1>;
    }

    const handleChangePassword = () => {
        if (!currentPassword || !newPassword) {
            alert('Please fill both fields');
            return;
        }

        fetch(`${BASE_URL}/change_password/${userId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ current_password: currentPassword, new_password: newPassword })
        }).then(res => {
            if (!res.ok) return res.json().then(j => { throw new Error(j.detail || 'Change failed') })
            return res.json();
        }).then(() => {
            alert('Password changed successfully');
            setMustChange(false);
            // reload pending applications
            fetch(`${BASE_URL}/pending_applications/${userId}`)
              .then(res => res.json())
              .then(data => setApplications(data || []))
              .catch(() => setApplications([]));
        }).catch(err => alert(err.message || 'Error'));
    }

    const handleApprove = (applicationId) => {
        fetch(`${BASE_URL}/approve_application/${applicationId}/${userId}`, {
            method: 'POST'
        }).then(res => {
            if (!res.ok) throw new Error('Approve failed');
            return res.json();
        }).then(() => {
            setApplications(apps => apps.filter(a => a.application_id !== applicationId));
        }).catch(err => alert(err.message || 'Error'));
    }

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
            {mustChange ? (
                <div className="mb-4 border p-4 rounded bg-yellow-100">
                    <h2 className="font-semibold">Security: change admin password</h2>
                    <p className="text-sm mb-2">You are required to change the admin password before using the dashboard.</p>
                    <div className="flex flex-col gap-2">
                        <input value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} type="password" placeholder="Current password" className="px-3 py-2 border rounded" />
                        <input value={newPassword} onChange={e => setNewPassword(e.target.value)} type="password" placeholder="New password" className="px-3 py-2 border rounded" />
                        <div>
                            <button onClick={handleChangePassword} className="px-3 py-1 bg-blue-600 text-white rounded">Change password</button>
                        </div>
                    </div>
                </div>
            ) : (
                <>
                    <h2 className="text-xl font-semibold mb-2">Pending Applications</h2>
                    {applications.length === 0 && <p>No pending applications.</p>}
                    <ul>
                        {applications.map(app => (
                            <li key={app.application_id} className="mb-4 border p-3 rounded">
                                <div><strong>Application ID:</strong> {app.application_id}</div>
                                <div><strong>User ID:</strong> {app.user_id}</div>
                                <div><strong>Data:</strong> <pre className="whitespace-pre-wrap">{JSON.stringify(app.form_data, null, 2)}</pre></div>
                                <div className="mt-2">
                                    <button onClick={() => handleApprove(app.application_id)} className="px-3 py-1 bg-green-600 text-white rounded mr-2">Approve</button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </>
            )}
        </div>
    )
}