// Fetch data for dashboard

const token = localStorage.getItem('token')
const errorAlert = document.getElementById('error-alert');
if (token == null && token == 'undefined') {
    window.location.href = 'login.html';
    document.getElementById('message').innerText = 'Token is invalid login again';
    errorAlert.classList.remove('d-none');
}
let currentPage = 1;  // Current page tracker
let searchQuery = '';  // Default empty search query
let orderingQuery = '';  // Default empty ordering query
const baseUrl = 'https://lucky1999.pythonanywhere.com/admins/api/list/attendance/';

async function fetchMembers() {
    const url = `${baseUrl}?page=${currentPage}&search=${searchQuery}&ordering=${orderingQuery}`;

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + token
            }
        });

        if (response.status === 401) {
            handleTokenExpiry();
            throw new Error('Unauthorized: Token expired or invalid');
        }

        if (!response.ok) {
            throw new Error('Failed to load member data');
        }

        const data = await response.json();
        updateTable(data);
    } catch (error) {
        handleError(error);
    }
}

function updateTable(data) {
    // Update pagination buttons
    document.getElementById('nextBtn').disabled = !data.next;
    document.getElementById('preBtn').disabled = !data.previous;

    // Update the total count
    document.getElementById('count').innerText = data.count;

    const tableBody = document.querySelector('#attendance-table tbody');
    tableBody.innerHTML = ''; // Clear existing rows

    if (Array.isArray(data.results) && data.results.length) {
        data.results.forEach((item, index) => {
            const row = document.createElement('tr');
            const formattedDate = item.date ? new Date(item.date).toUTCString() : '';
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${item.member.name || ''}</td>
                <td>${item.member.email || ''}</td>
                <td>${item.member.phone || ''}</td>
                <td>${item.member.gender || ''}</td>
                <td>${item.day || ''}</td>
                <td>${item.member.assembly || ''}</td>
                <td>${item.member.district || ''}</td>
                <td>${formattedDate}</td>
                <td>${item.member.department ? item.member.department.name : 'None'}</td>
            `;
            tableBody.appendChild(row);
        });
    } else {
        const row = document.createElement('tr');
        row.innerHTML = '<td colspan="12">No Member found</td>';
        tableBody.appendChild(row);
    }
}

// Pagination button event listeners
document.getElementById('nextBtn').addEventListener('click', function (event) {
    event.preventDefault();
    currentPage++;
    fetchMembers();
});

document.getElementById('preBtn').addEventListener('click', function (event) {
    event.preventDefault();
    if (currentPage > 1) {
        currentPage--;
        fetchMembers();
    }
});

// Search input event listener
document.getElementById('searchInput').addEventListener('input', function (event) {
    searchQuery = event.target.value;
    currentPage = 1;  // Reset to first page on search
    fetchMembers();
});

// Ordering selection event listener
document.getElementById('orderingSelect').addEventListener('change', function (event) {
    orderingQuery = event.target.value;
    currentPage = 1;  // Reset to first page on ordering change
    fetchMembers();
});

// Initial data fetch
fetchMembers();

    // Function to handle errors
    function handleError(error) {
        document.getElementById('message').innerText = error.message;
        errorAlert.classList.remove('d-none');
    }
    
    // Function to handle token expiry
    function handleTokenExpiry() {
        localStorage.removeItem('token');
        localStorage.removeItem('firstname');
        window.location.href = 'login.html';
    }
    


    var download = document.getElementById('download');
    download.addEventListener('click', function() {
        fetch('https://lucky1999.pythonanywhere.com/admins/api/download/attendance/', {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + token
            }
        })
        .then(response => {
            if (response.ok) {
                return response.blob();  // Get the response as a Blob
            } else if (response.status === 401) {
                // Token is expired or invalid
                handleTokenExpiry();
            } else {
                throw new Error('Server is not responding');
            }
        })
        .then(blob => {
            // Create a link element
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'All_Marked_Attendance_Report.csv'; // Set the default filename
            document.body.appendChild(a); // Append to the body
            a.click(); // Trigger the download
            a.remove(); // Remove the link after download
            window.URL.revokeObjectURL(url); // Free up memory
        })
        .catch(error => {
            console.error('Error:', error);
            document.getElementById('message').innerText = error.message;
            errorAlert.classList.remove('d-none');
        });
    });
    