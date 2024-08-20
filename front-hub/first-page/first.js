
function goToRegister() {
    Swal.fire({
        title: 'Create an Account',
        text: 'You will be redirected to the registration page.',
        icon: 'info',
        confirmButtonText: 'OK',
        
    }).then((result) => {
        if (result.isConfirmed) {
            window.location.href = 'http://localhost:9999/registerPage';
        }
    });
}

function goToLogin() {
    Swal.fire({
        title: 'Sign In',
        text: 'You will be redirected to the login page.',
        icon: 'info',
        confirmButtonText: 'OK'
    }).then((result) => {
        if (result.isConfirmed) {
            window.location.href = 'http://localhost:9999/loginPage';
        }
    });
}


