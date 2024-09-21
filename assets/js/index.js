document.querySelector('.question-form').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const form = document.getElementById('question');
    const formData = new FormData(this);
    document.getElementById('spinner').classList.remove('d-none');
    document.getElementById('login-text').classList.add('d-none');
    const errorAlert = document.getElementById('error-alert');
    errorAlert.classList.add('d-none');
    const SuccessAlert = document.getElementById('success-alert');
    SuccessAlert.classList.add('d-none');
    document.getElementById('error-message').innerText = '';
    document.getElementById('success-message').innerText = '';

    // fetch('http://localhost:8000/admins/api/login/', {
    fetch('http://localhost:8000/admins/api/create/question/', {
        method: 'POST',
        body: formData,
        headers: {
            'X-CSRFToken': '{{ csrf_token }}' // For Django CSRF protection
        }
    })
    .then(response => {
        if (response.ok) {
            return response.json()
            .then(data => {
                document.getElementById('success-message').innerText = data.message;
                SuccessAlert.classList.remove('d-none');
                form.reset();
                document.getElementById('spinner').classList.add('d-none');
                document.getElementById('login-text').classList.remove('d-none');

            });
        }else if (response.status === 400){
        return response.json()
        .then(data => {
            if (data.errors) {
                document.getElementById('error-message').innerText = data.error;
            }
            else if (data.name) {
                document.getElementById('error-message').innerText = data.name;
            } else if (data.email) {
                document.getElementById('error-message').innerText = data.email;
            }else if (data.subject) {
                document.getElementById('error-message').innerText = data.subject;
            }else if (data.question) {
                document.getElementById('error-message').innerText = data.question;
            }else {
                document.getElementById('error-message').innerText = 'An unexpected error occurred.';
            }
            errorAlert.classList.remove('d-none');
            document.getElementById('spinner').classList.add('d-none');
            document.getElementById('login-text').classList.remove('d-none');
        
        })
        }else if (!response.ok) {
            document.getElementById('error-message').innerText = 'Server is not responding';
            errorAlert.classList.remove('d-none');
        }
        else {
            // Display error
            document.getElementById('error-message').innerText = 'An unexpected error occurred.';
            errorAlert.classList.remove('d-none');
            document.getElementById('spinner').classList.add('d-none');
            document.getElementById('login-text').classList.remove('d-none');
        }
    })
    .catch(error => {
        document.getElementById('error-message').innerText = error;
        errorAlert.classList.remove('d-none');
        document.getElementById('spinner').classList.add('d-none');
        document.getElementById('login-text').classList.remove('d-none');
    });
    
});



document.querySelector('.attendance-form').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const form = document.getElementById('attend-form');
    const formData = new FormData(this);
    document.getElementById('spinner1').classList.remove('d-none');
    document.getElementById('login-text1').classList.add('d-none');
    const errorAlert = document.getElementById('error-alert1');
    errorAlert.classList.add('d-none');
    const SuccessAlert = document.getElementById('success-alert1');
    SuccessAlert.classList.add('d-none');
    document.getElementById('error-message1').innerText = '';
    document.getElementById('success-message1').innerText = '';

    // fetch('http://localhost:8000/admins/api/login/', {
    fetch('http://localhost:8000/admins/api/take/attendance/', {
        method: 'POST',
        body: formData,
        headers: {
            'X-CSRFToken': '{{ csrf_token }}' // For Django CSRF protection
        }
    })
    .then(response => {
        if (response.ok) {
            return response.json()
            .then(data => {
                document.getElementById('success-message1').innerText = data.message;
                SuccessAlert.classList.remove('d-none');
                form.reset();
                document.getElementById('spinner1').classList.add('d-none');
                document.getElementById('login-text1').classList.remove('d-none');

            });
        }else if (response.status === 400){
        return response.json()
        .then(data => {
            if (data.day) {
                document.getElementById('error-message1').innerText = data.error;
            }
            else if (data.member) {
                document.getElementById('error-message1').innerText = data.name;
            }else {
                document.getElementById('error-message1').innerText = data.detail;
            }
            errorAlert.classList.remove('d-none');
            document.getElementById('spinner1').classList.add('d-none');
            document.getElementById('login-text1').classList.remove('d-none');
        
        })
        }else if (!response.ok) {
            document.getElementById('error-message1').innerText = 'Server is not responding';
            errorAlert.classList.remove('d-none');
        }
        else {
            // Display error
            document.getElementById('error-message1').innerText = 'An unexpected error occurred.';
            errorAlert.classList.remove('d-none');
            document.getElementById('spinner1').classList.add('d-none');
            document.getElementById('login-text1').classList.remove('d-none');
        }
    })
    .catch(error => {
        document.getElementById('error-message1').innerText = error;
        errorAlert.classList.remove('d-none');
        document.getElementById('spinner1').classList.add('d-none');
        document.getElementById('login-text1').classList.remove('d-none');
    });
    
});


window.onload = function() {
    fetch('http://localhost:8000/admins/api/get/department/', {
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





document.querySelector('.register-form').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const form = document.getElementById('registering-form');
    const formData = new FormData(this);
    document.getElementById('spinner2').classList.remove('d-none');
    document.getElementById('login-text2').classList.add('d-none');
    const errorAlert = document.getElementById('error-alert2');
    errorAlert.classList.add('d-none');
    const SuccessAlert = document.getElementById('success-alert2');
    SuccessAlert.classList.add('d-none');
    document.getElementById('error-message2').innerText = '';
    document.getElementById('success-message2').innerText = '';

    // fetch('http://localhost:8000/admins/api/login/', {
    fetch('http://localhost:8000/admins/api/register/member/', {
        method: 'POST',
        body: formData,
        headers: {
            'X-CSRFToken': '{{ csrf_token }}' // For Django CSRF protection
        }
    })
    .then(response => {
        if (response.ok) {
            return response.json()
            .then(data => {
                document.getElementById('success-message2').innerText = data.message;
                SuccessAlert.classList.remove('d-none');
                form.reset();
                document.getElementById('spinner2').classList.add('d-none');
                document.getElementById('login-text2').classList.remove('d-none');

            });
        }else if (response.status === 400){
        return response.json()
        .then(data => {
            if (data.day) {
                document.getElementById('error-message2').innerText = data.error;
            }
            else if (data.member) {
                document.getElementById('error-message2').innerText = data.name;
            }else {
                document.getElementById('error-message2').innerText = data.errors;
            }
            errorAlert.classList.remove('d-none');
            document.getElementById('spinner2').classList.add('d-none');
            document.getElementById('login-text2').classList.remove('d-none');
        
        })
        }else if (!response.ok) {
            document.getElementById('error-message2').innerText = 'Server is not responding';
            errorAlert.classList.remove('d-none');
        }
        else {
            // Display error
            document.getElementById('error-message2').innerText = 'An unexpected error occurred.';
            errorAlert.classList.remove('d-none');
            document.getElementById('spinner2').classList.add('d-none');
            document.getElementById('login-text2').classList.remove('d-none');
        }
    })
    .catch(error => {
        document.getElementById('error-message2').innerText = error;
        errorAlert.classList.remove('d-none');
        document.getElementById('spinner2').classList.add('d-none');
        document.getElementById('login-text2').classList.remove('d-none');
    });
    
});

