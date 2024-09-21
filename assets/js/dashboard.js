
const token = localStorage.getItem('token')
const errorAlert = document.getElementById('error-alert');
if (token == null && token == 'undefined') {
    window.location.href = 'login.html';
    document.getElementById('message').innerText = 'Token is invalid login again';
    errorAlert.classList.remove('d-none');
}
// fetch('http://localhost:8000/admins/api/list/school/application/', {
fetch('http://localhost:8000/admins/api/admin/dashboard/', {
    method: 'GET',
    headers: {
        'Authorization': 'Bearer ' + token
    }
})
.then(response => {
    if (response.ok) {
        return response.json();
    } else if (response.status === 401) {
        // Token is expired or invalid
        handleTokenExpiry();
    }
    else if (!response.ok) {
        document.getElementById('message').innerText = 'Server is not responding';
        errorAlert.classList.remove('d-none');
    }
    else {
        throw new Error('Failed to load dashboard data');
    }
})
.then(data => {
    const dateTimeString = data.year;
    const year = new Date(dateTimeString).getFullYear();
    document.getElementById('year').innerText = year;
    document.getElementById('year1').innerText = year;
    document.getElementById('year2').innerText = year;
    document.getElementById('year3').innerText = year;
    document.getElementById('member_count').innerText = data.member_count;
    document.getElementById('attend').innerText = data.attend;
    document.getElementById('question_count').innerText = data.question_count;
    document.getElementById('count_2024').innerText = data.count_2024;
    document.getElementById('attend_2024').innerText = data.attend_2024;
    document.getElementById('question_count_2024').innerText = data.question_count_2024;
    document.getElementById('count_2023').innerText = data.count_2023;
    document.getElementById('question_count_2023').innerText = data.question_count_2023;

    var all_member = data.member_count + data.count_2024 + data.count_2023
    var all_attend = data.attend + data.attend_2024
    var all_question = data.question_count + data.question_count_2024 + data.question_count_2023

    document.getElementById('all-member-count').innerText = all_member;
    document.getElementById('all-attend-count').innerText = all_attend;
    document.getElementById('all-question-count').innerText = all_question;

    
})
.catch(error => {
    document.getElementById('message').innerText = error;
    errorAlert.classList.remove('d-none');
});



function handleTokenExpiry() {
    // Clear stored token and redirect to login
    localStorage.removeItem('token');
    localStorage.removeItem('firstname');
    window.location.href = 'login.html';
}