export default function Login_Registration_Form() {
  const handleSubmission = () => console.log("Success!");
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
      <div className="bg-gray-800 p-10 rounded-2xl shadow-2xl w-full max-w-md border border-gray-700 p-bottom-4">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-center text-white mb-2">
            Welcome Back
          </h2>
          <p className="text-center text-gray-400 text-sm">
            Register/Login to your account
          </p>
        </div>
        <form onSubmit={handleSubmission} className="space-y-5">
          <div>
            <label
              className="block text-gray-300 text-sm font-semibold mb-2"
              htmlFor="username"
            >
              Username
            </label>
            <input
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all duration-200"
              type="text"
              id="username"
              placeholder="Enter your username"
            />
          </div>
          <div>
            <label
              className="block text-gray-300 text-sm font-semibold mb-2"
              htmlFor="password"
            >
              Password
            </label>
            <input
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all duration-200"
              type="password"
              id="password"
              placeholder="Enter your password"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white py-2.5 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-600 transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg"
          >
            Register/Login
          </button>
        </form>
      </div>
    </div>
  );
}
