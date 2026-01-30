import { useNavigate, useSearchParams } from "react-router";
import { useEffect, useState } from "react";

const BASE_URL = "https://id-management-system-8bmi.onrender.com";

export default function HomePage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const userId = searchParams.get("user_id");
  const isAdmin = searchParams.get("is_admin") === "true";
  const [hasApp, setHasApp] = useState(false);
  const [appStatus, setAppStatus] = useState(null);

  useEffect(() => {
    if (!userId || isAdmin) return;

    fetch(`${BASE_URL}/my_applications/${userId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data && data.has_applications) {
          setHasApp(true);
          setAppStatus(data.status);
        } else {
          setHasApp(false);
        }
      })
      .catch(() => {
        setHasApp(false);
      });
  }, [userId, isAdmin]);

  if (isAdmin) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Scout - Admin</h1>
        <p className="mb-4">Welcome, admin. For security, please change the admin password immediately.</p>
        <button
          onClick={() => navigate(`/admin?user_id=${userId}&is_admin=true`)}
          className="px-4 py-2 bg-red-600 text-white rounded"
        >
          Go to Admin Dashboard
        </button>
      </div>
    );
  }

  if (!userId) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Scout</h1>
        <p className="mb-4">Please log in to submit an application or check status.</p>
        <button onClick={() => navigate('/login')} className="px-4 py-2 bg-blue-600 text-white rounded">Login</button>
        {/* The login form lives at /login */}
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Scout</h1>
      <p className="mb-4">Welcome back.</p>

      {!hasApp && (
        <button
          onClick={() => navigate(`/form?user_id=${userId}`)}
          className="px-4 py-2 bg-green-600 text-white rounded mr-4"
        >
          Submit form and request for approval
        </button>
      )}

      {hasApp && (
        <>
          <button
            onClick={() => navigate(`/waiting?user_id=${userId}`)}
            className="px-4 py-2 bg-yellow-600 text-white rounded mr-4"
          >
            My approval status ({appStatus})
          </button>
          <button
            onClick={() => navigate(`/form?user_id=${userId}`)}
            className="px-4 py-2 bg-green-600 text-white rounded mr-4"
          >
            Edit Application
          </button>
        </>
      )}
    </div>
  );
}
