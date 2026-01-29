import { useNavigate } from "react-router";

export default function Login_Registration_Form() {
  const navigate = useNavigate();

  const handleAuth = async (e) => {
    // FIX 1: Prevent the page from refreshing
    e.preventDefault();

    // FIX 2: Extract values from the form inputs
    const username = e.target.username.value;
    const password = e.target.password.value;
    const credentials = { username, password };

    try {
      const authRes = await fetch("https://id-management-system-8bmi.onrender.com/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });

      let user;
      if (!authRes.ok) {
        // If login fails, register the user as they don't exist yet
        const registerRes = await fetch("https://id-management-system-8bmi.onrender.com/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(credentials),
        });
        user = await registerRes.json();
      } else {
        user = await authRes.json();
      }
      
      if (user.is_admin) {
        navigate(`/admin?user_id=${user.user_id}&is_admin=true`);
      } else {
        navigate(`/form?user_id=${user.user_id}`);
      }
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
      <div className="bg-gray-800 p-10 rounded-2xl shadow-2xl w-full max-w-md border border-gray-700">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-center text-white mb-2">Welcome Back</h2>
          <p className="text-center text-gray-400 text-sm">Register/Login to your account</p>
        </div>
        <form onSubmit={handleAuth} className="space-y-5">
          <div>
            <label className="block text-gray-300 text-sm font-semibold mb-2" htmlFor="username">
              Username
            </label>
            <input
              name="username" // Added name attribute
              id="username"
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
              type="text"
              required
            />
          </div>
          <div>
            <label className="block text-gray-300 text-sm font-semibold mb-2" htmlFor="password">
              Password
            </label>
            <input
              name="password" // Added name attribute
              id="password"
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
              type="password"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white py-2.5 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-600 transition-colors cursor-pointer"
          >
            Register/Login
          </button>
        </form>
      </div>
    </div>
  );
}