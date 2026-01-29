import { useState } from "react";
import Login_Registration_Form from "./pages/LoginRegistrationForm.jsx";

function App() {
  const [count, setCount] = useState(0);

  return (<div>
    <Login_Registration_Form />
  </div>);
}

export default App;
