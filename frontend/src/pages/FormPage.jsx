import { useSearchParams, useNavigate } from "react-router";

export default function FormPage(){
    const [searchParams] = useSearchParams();
    const userId = searchParams.get("user_id");
    const navigate = useNavigate();

    const handleApplication = (e) => {
        // Prevent the page from refreshing
        e.preventDefault();

        // Extract form data from the form inputs
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData);

        if (!userId) {
            alert("Error: User not logged in");
            return;
        }

        // fetch https://id-management-system-8bmi.onrender.com/submit_form , use the input below as form_data and get the logged in user's id
        // POST method
        fetch("https://id-management-system-8bmi.onrender.com/submit_form", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                user_id: userId,
                form_data: data
            })
        })
        .then(response => response.json())
        .then(data => {
            alert("Form submitted successfully!");
            navigate(`/`);
        })
        .catch(error => {
            alert("Error submitting form: " + error.message);
        });
    }

    return (
    <div>
        <h1>Form Page</h1>
        <form onSubmit={handleApplication}>
            <input type="text" name="application_data" />
            <input type="text" name="application_data_2" />
            <button type="submit">Submit & Apply</button>
        </form>
        <p>Who's using: {userId}</p>
    </div>
)
}