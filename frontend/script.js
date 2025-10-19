// script.js

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("bmiForm");
    const result = document.getElementById("result");

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const weight = document.getElementById("weight").value;
        const height = document.getElementById("height").value;

        if (!weight || !height) {
            result.innerHTML = "Please fill in both fields!";
            result.style.color = "red";
            return;
        }

        try {
            const response = await fetch("http://localhost:3000/bmi", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include", // ✅ important for cookies
                body: JSON.stringify({ weight, height })
            });

            const data = await response.json();

            if (response.ok) {
                result.innerHTML = `
                    <p>Your BMI is: <strong>${data.bmi}</strong></p>
                    <p>Category: <strong>${data.category}</strong></p>
                `;
                result.style.color = "green";
            } else {
                result.innerHTML = data.message || "Error calculating BMI";
                result.style.color = "red";
            }
        } catch (error) {
            console.error(error);
            result.innerHTML = "Network error. Make sure your backend is running.";
            result.style.color = "red";
        }
    });
});
