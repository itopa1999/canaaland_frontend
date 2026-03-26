
const token = localStorage.getItem('token')
const errorAlert = document.getElementById('error-alert');
if (token == null && token == 'undefined') {
    window.location.href = 'login.html';
    document.getElementById('message').innerText = 'Token is invalid login again';
    errorAlert.classList.remove('d-none');
}
// fetch('https://lucky1999.pythonanywhere.com/admins/api/list/school/application/', {
fetch('https://lucky1999.pythonanywhere.com/admins/api/admin/dashboard/', {
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
    const current_year = data.current_year;
    const all_years = data.all_years;
    const yearly_data = data.yearly_data;

    // Set header with current year
    document.getElementById('year').innerText = current_year;

    // Populate current year data
    const currentYearData = yearly_data[current_year];
    if (currentYearData) {
        document.getElementById('year1').innerText = current_year;
        document.getElementById('year2').innerText = current_year;
        document.getElementById('year3').innerText = current_year;
        document.getElementById('member_count').innerText = currentYearData.statistics.members_count;
        document.getElementById('attend').innerText = currentYearData.statistics.attendance_count;
        document.getElementById('question_count').innerText = currentYearData.statistics.questions_count;
    }

    // Calculate overall totals
    let all_member = 0;
    let all_attend = 0;
    let all_question = 0;

    // Populate data for all years and calculate totals
    all_years.forEach(year => {
        const yearStats = yearly_data[year].statistics;
        all_member += yearStats.members_count;
        all_attend += yearStats.attendance_count;
        all_question += yearStats.questions_count;

        // Populate specific year data (for backward compatibility with 2024 and 2023)
        if (year === 2024) {
            document.getElementById('count_2024').innerText = yearStats.members_count;
            document.getElementById('attend_2024').innerText = yearStats.attendance_count;
            document.getElementById('question_count_2024').innerText = yearStats.questions_count;
        } else if (year === 2023) {
            document.getElementById('count_2023').innerText = yearStats.members_count;
            document.getElementById('question_count_2023').innerText = yearStats.questions_count;
        }
    });

    // Set overall totals
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