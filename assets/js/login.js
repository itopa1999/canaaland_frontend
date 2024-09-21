document.querySelector('.general-form').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const formData = new FormData(this);
    document.getElementById('spinner').classList.remove('d-none');
    document.getElementById('login-text').classList.add('d-none');
    const errorAlert = document.getElementById('error-alert');
    errorAlert.classList.add('d-none');
    document.getElementById('message').innerText = '';

    // fetch('http://localhost:8000/admins/api/login/', {
    fetch('http://localhost:8000/admins/api/login/', {
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
                localStorage.setItem('token', data.access);
                localStorage.setItem('firstname', data.first_name);
                if (data.group && data.group.includes('admin')) {
                    window.location.href = 'dashboard.html';
                }else if (data.group.includes('agent')) {
                    window.location.href = 'index.html';
                }
            })
        }
        else if (response.status === 400) {
            return response.json()
            .then(data => {
                document.getElementById('message').innerText = data.detail;
                errorAlert.classList.remove('d-none');
                document.getElementById('spinner').classList.add('d-none');
                document.getElementById('login-text').classList.remove('d-none');
            });
        }else if (!response.ok) {
            document.getElementById('message').innerText = 'Server is not responding';
            errorAlert.classList.remove('d-none');
        }
        else {
            // Display error
            document.getElementById('message').innerText = data.detail;
            errorAlert.classList.remove('d-none');
            document.getElementById('spinner').classList.add('d-none');
            document.getElementById('login-text').classList.remove('d-none');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        // Display a generic error message
        document.getElementById('message').innerText = 'An unexpected error occurred.';
        errorAlert.classList.remove('d-none');
        document.getElementById('spinner').classList.add('d-none');
        document.getElementById('login-text').classList.remove('d-none');
    });
    
});



























