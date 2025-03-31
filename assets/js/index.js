document.querySelector('.question-form').addEventListener('submit', function (event) {
    event.preventDefault();

    const form = document.getElementById('question');
    const formData = new FormData(this);
    document.getElementById('spinner').classList.remove('d-none');

    fetch('https://lucky1999.pythonanywhere.com/admins/api/create/question/', {
        method: 'POST',
        body: formData,
    })
    .then(response => response.json().then(data => ({ status: response.status, body: data })))
    .then(({ status, body }) => {
        document.getElementById('spinner').classList.add('d-none');
        console.log(body);
        if (status >= 400) { // ✅ Corrected condition
            Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: body.error,
                confirmButtonText: 'OK'
            });
            return;
        }
    
        Swal.fire({
            icon: 'success',
            title: 'Success!',
            text: body.message,
            confirmButtonText: 'OK'
        });
    
        form.reset();
    })
    .catch(error => {
        document.getElementById('spinner').classList.add('d-none'); 

        Swal.fire({
            icon: 'error',
            title: 'Network Error!',
            text: 'Server is not responding. Please try again later.',
            confirmButtonText: 'OK'
        });
    });
});




document.querySelector('.attendance-form').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const form = document.getElementById('attend-form');
    const formData = new FormData(this);
    document.getElementById('spinner1').classList.remove('d-none');
    document.getElementById('login-text1').classList.add('d-none');
    
    fetch('https://lucky1999.pythonanywhere.com/admins/api/take/attendance/', {
        method: 'POST',
        body: formData,
    })
    .then(response => response.json().then(data => ({ status: response.status, body: data })))
    .then(({ status, body }) => {
        document.getElementById('spinner1').classList.add('d-none');
        document.getElementById('login-text1').classList.remove('d-none');
        console.log(body)
        if (status === 201) {
            Swal.fire({
                icon: 'success',
                title: 'Success',
                text: body.message,
                timer: 5000,
                showConfirmButton: false
            });
            form.reset();
        } else {
            let errorMessage = body.error || 'An unexpected error occurred.';
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: errorMessage
            });
        }
    })
    .catch(error => {
        document.getElementById('spinner1').classList.add('d-none');
        document.getElementById('login-text1').classList.remove('d-none');
        Swal.fire({
            icon: 'error',
            title: 'Network Error',
            text: 'Something went wrong. Please try again later.'
        });
    });
});


window.onload = function() {
    fetch('https://lucky1999.pythonanywhere.com/admins/api/get/department/', {
        method: 'GET',
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        }
        else if (!response.ok) {
            document.getElementById('message').innerText = 'Server is not responding';
            errorAlert.classList.remove('d-none');
        }
        else {
            throw new Error('Failed to load data');
        }
    }).then(data => {
        const departmentSelect = document.getElementById('departmentSelect');

        data.department.forEach(dept => {
        // Create an option element
        let option = document.createElement('option');
        option.value = dept.id; // Set the value to the department id
        option.text = dept.name; // Set the display text to the department name
        
        // Append the option element to the select
        departmentSelect.appendChild(option);
})

});

}



document.querySelector('.register-form').addEventListener('submit', function (event) {
    event.preventDefault();

    const form = document.getElementById('registering-form');
    const formData = new FormData(this);

    // Show spinner, hide button text
    document.getElementById('spinner2').classList.remove('d-none');
    document.getElementById('login-text2').classList.add('d-none');

    fetch('https://lucky1999.pythonanywhere.com/admins/api/register/member/', {
        method: 'POST',
        body: formData,
    })
    .then(response => response.json().then(data => ({ status: response.status, body: data })))
    .then(({ status, body }) => {
        document.getElementById('spinner2').classList.add('d-none');
        document.getElementById('login-text2').classList.remove('d-none');

        console.log(body)
        if (status === 201) {
            Swal.fire({
                icon: 'success',
                title: 'Success!',
                text: body.message,
                confirmButtonColor: '#3085d6'
            });
            form.reset();
        } else if (status === 400) {
            const errorMessage = body.error || 'Invalid input';
            Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: errorMessage,
                confirmButtonColor: '#d33'
            });
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: 'An unexpected error occurred.',
                confirmButtonColor: '#d33'
            });
        }
    })
    .catch(error => {
        document.getElementById('spinner2').classList.add('d-none');
        document.getElementById('login-text2').classList.remove('d-none');

        Swal.fire({
            icon: 'error',
            title: 'Network Error!',
            text: 'Server is not responding.',
            confirmButtonColor: '#d33'
        });
    });
});
