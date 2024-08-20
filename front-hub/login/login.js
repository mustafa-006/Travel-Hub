document.getElementById("login").addEventListener("submit", function(event) {
    event.preventDefault();

    var email = document.getElementById("email").value;
    var pass = document.getElementById("password").value;
    var rememberCheckbox = document.getElementById("remember");

    function validateE(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(String(email).toLowerCase());
    }

    if (!validateE(email)) {
        Swal.fire({
            icon: "error",
            title: "Invalid email",
            text: "Please enter a valid email."
        });
        return;
    }

    if (pass.length < 8) {
        Swal.fire({
            icon: "error",
            title: "Password Error",
            text: "Your password must be at least 8 characters long."
        });
        return;
    }

    if (rememberCheckbox.checked) {
        localStorage.setItem("rememberedEmail", email);
    } else {
        localStorage.removeItem("rememberedEmail");
    }

    fetch('http://localhost:9999/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email, password: pass })
    })
    .then(response => {
        if (response.ok) {
            window.location.href = '/profile';
        } else {
            return response.text().then(text => {
                throw new Error(text || 'Login failed with unknown error.');
            });
        }
    })
    .catch(error => {
        Swal.fire({
            icon: "error",
            title: "Login failed",
            text: error.message || 'An unexpected error occurred.'
        });
    });
});

document.addEventListener('DOMContentLoaded', function() {
    var rememberedEmail = localStorage.getItem('rememberedEmail');
    if (rememberedEmail) {
        document.getElementById('email').value = rememberedEmail;
        document.getElementById('remember').checked = true;
    }
});

document.getElementById("togglePassword").addEventListener("click", function() {
    var passwordInput = document.getElementById("password");
    if (passwordInput.type === "password") {
        passwordInput.type = "text";
        this.textContent = "Hide";
    } else {
        passwordInput.type = "password";
        this.textContent = "Show";
    }
});
