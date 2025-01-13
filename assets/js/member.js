document.addEventListener('DOMContentLoaded', function() {
    // Fetch data for dashboard

const token = localStorage.getItem('token')
const errorAlert = document.getElementById('error-alert');
if (token == null && token == 'undefined') {
    window.location.href = 'login.html';
    document.getElementById('message').innerText = 'Token is invalid login again';
    errorAlert.classList.remove('d-none');
}
let currentPage = 1;
let searchQuery = '';  
let orderingQuery = '';

function debounce(func, wait) {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

const debouncedFetchMembers = debounce(fetchMembers, 300);

async function fetchMembers() {
    const url = new URL('http://127.0.0.1:8000/admins/api/list/member/');
    url.searchParams.append('page', currentPage);
    if (searchQuery) url.searchParams.append('search', searchQuery);
    if (orderingQuery) url.searchParams.append('ordering', orderingQuery);

    try {
        const response = await fetch(url, { method: 'GET',headers: {
            'Authorization': 'Bearer ' + token
        } });
        if (!response.ok) {
            let errorMessage = 'An unexpected error occurred.';
            if (response.status === 401 || response.status === 403) {
                errorMessage = 'Unauthorized access. Redirecting to login...';
                setTimeout(() => window.location.href = 'login.html', 4000);
            } else if (response.status === 400) {
                const data = await response.json();
                errorMessage = data.error_description || 'There was a bad request.';
            }
            document.getElementById('message').innerText = errorMessage;
            errorAlert.classList.remove('d-none');
            return;
        }

        const data = await response.json();
        document.getElementById('count').innerText = data.count;
        displayMembers(data.results);
        handlePagination(data.next, data.previous);
    } catch (error) {
        document.getElementById('message').innerText = 'Error: ' + error;
        errorAlert.classList.remove('d-none');
    }
}

function displayMembers(results) {
    const tableBody = document.querySelector('#member-table tbody');
    tableBody.innerHTML = '';

    if (results.length) {
        results.forEach((item, index) => {
            const row = document.createElement('tr');
            const formattedDate = item.date ? new Date(item.date).toUTCString() : '';
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${item.name || ''}</td>
                <td>${item.email || ''}</td>
                <td>${item.phone || ''}</td>
                <td>${item.gender || ''}</td>
                <td>${item.assembly || ''}</td>
                <td>${item.district || ''}</td>
                <td>${item.denomination || ''}</td>
                <td>${item.country || ''}</td>
                <td>${item.state || ''}</td>
                <td>${item.department?.name || ''}</td>
                <td>${formattedDate}</td>
            `;
            tableBody.appendChild(row);
        });
    } else {
        const row = document.createElement('tr');
        row.innerHTML = '<td colspan="12">No Member found</td>';
        tableBody.appendChild(row);
    }
}

function handlePagination(nextPage, previousPage) {
    const nextBtn = document.getElementById('nextBtn');
    const preBtn = document.getElementById('preBtn');

    nextBtn.disabled = !nextPage;
    preBtn.disabled = !previousPage;

    nextBtn.onclick = function (event) {
        event.preventDefault();
        if (nextPage) {
            currentPage++;
            fetchMembers();
        }
    };

    preBtn.onclick = function (event) {
        event.preventDefault();
        if (previousPage) {
            currentPage--;
            fetchMembers();
        }
    };
}

document.getElementById('searchInput').addEventListener('input', function (event) {
    searchQuery = event.target.value;
    debouncedFetchMembers();
});

document.getElementById('orderingSelect').addEventListener('change', function (event) {
    orderingQuery = event.target.value;
    fetchMembers();
});

fetchMembers();

    
    // Function to handle token expiry
    function handleTokenExpiry() {
        localStorage.removeItem('token');
        localStorage.removeItem('firstname');
        window.location.href = 'login.html';
    }
    


    var download = document.getElementById('download');
    download.addEventListener('click', function() {
        fetch('http://localhost:8000/admins/api/download/member/', {
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
            a.download = 'All_Register_Member_Report.csv'; // Set the default filename
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
    
})