// import { useNavigate } from "react-router";

// export default function Login_Registration_Form() {
//   // It should call the api from https://id-management-system-8bmi.onrender.com/login or /register
//   const navigate = useNavigate();

//   const handleAuth = async (credentials) => {
//     try {
//       // 1. Log them in
//       const authRes = await fetch("https://id-management-system-8bmi.onrender.com/login", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(credentials),
//       });

//       if (!authRes.ok) throw new Error("Invalid Login");
//       const user = await authRes.json();

//       // 2. Save user to localStorage
//       localStorage.setItem("user", JSON.stringify(user));

//       // 3. Check Role/Status
//       if (user.is_admin) {
//         navigate("/admin");
//       } else {
//         // 4. If not admin, check application status
//         const statusRes = await fetch(
//           `https://id-management-system-8bmi.onrender.com/my_applications/${user.user_id}`,
//         );
//         const appData = await statusRes.json();

//         if (!appData.has_applications) {
//           navigate("/form");
//         } else if (appData.status === "pending") {
//           navigate("/waiting");
//         } else if (appData.status === "approved") {
//           navigate("/download");
//         }
//       }
//     } catch (err) {
//       alert(err.message);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
//       <div className="bg-gray-800 p-10 rounded-2xl shadow-2xl w-full max-w-md border border-gray-700 p-bottom-4">
//         <div className="mb-8">
//           <h2 className="text-3xl font-bold text-center text-white mb-2">
//             Welcome Back
//           </h2>
//           <p className="text-center text-gray-400 text-sm">
//             Register/Login to your account
//           </p>
//         </div>
//         <form onSubmit={handleAuth} className="space-y-5">
//           <div>
//             <label
//               className="block text-gray-300 text-sm font-semibold mb-2"
//               htmlFor="username"
//             >
//               Username
//             </label>
//             <input
//               className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all duration-200"
//               type="text"
//               id="username"
//               placeholder="Enter your username"
//             />
//           </div>
//           <div>
//             <label
//               className="block text-gray-300 text-sm font-semibold mb-2"
//               htmlFor="password"
//             >
//               Password
//             </label>
//             <input
//               className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all duration-200"
//               type="password"
//               id="password"
//               placeholder="Enter your password"
//             />
//           </div>
//           <button
//             type="submit"
//             className="w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white py-2.5 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-600 transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg"
//           >
//             Register/Login
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }


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

      if (!authRes.ok) {
        // If login fails, register the user as they don't exist yet
        const registerRes = await fetch("https://id-management-system-8bmi.onrender.com/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(credentials),
        });
      }
      
      const user = await authRes.json();
      localStorage.setItem("user", JSON.stringify(user));

      if (user.is_admin) {
        navigate("/admin");
      } else {
        navigate("/form");
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
            className="w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white py-2.5 rounded-lg font-semibold"
          >
            Register/Login
          </button>
        </form>
      </div>
    </div>
  );
}