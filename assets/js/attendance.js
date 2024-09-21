// Fetch data for dashboard

const token = localStorage.getItem('token')
const errorAlert = document.getElementById('error-alert');
if (token == null && token == 'undefined') {
    window.location.href = 'login.html';
    document.getElementById('message').innerText = 'Token is invalid login again';
    errorAlert.classList.remove('d-none');
}
// fetch('http://localhost:8000/admins/api/list/school/application/', {
    let nextPageUrl = null;  // Store next page URL
    let previousPageUrl = null;  // Store previous page URL
    let baseUrl = 'http://127.0.0.1:8000/admins/api/list/attendance/';
    let searchQuery = '';  // Default empty search query
    let orderingQuery = '';  // Default empty ordering query
    
    // Function to fetch the member list with dynamic URL parameters
    function fetchMembers(url = baseUrl) {
        fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + token
            }
        })
        .then(response => {
            if (response.ok) {
                return response.json();  // Parse the JSON if response is successful
            } else if (response.status === 401) {
                handleTokenExpiry();
                throw new Error('Unauthorized: Token expired or invalid');
            } else {
                throw new Error('Failed to load member data');
            }
        })
        .then(data => updateTable(data))  // Pass data to update the table
        .catch(error => handleError(error));  // Handle any error
    }
    
    // Initial data fetch
    fetchMembers();
    
    // Update table and pagination
    function updateTable(data) {
        nextPageUrl = data.next;  // Store next page URL
        previousPageUrl = data.previous;  // Store previous page URL
    
        // Disable buttons if no next/previous page
        document.getElementById('nextBtn').disabled = !nextPageUrl;
        document.getElementById('preBtn').disabled = !previousPageUrl;
    
        // Update the table count
        document.getElementById('count').innerText = data.count;
    
        const tableBody = document.querySelector('#attendance-table tbody');
        tableBody.innerHTML = ''; // Clear existing rows
        console.log(data.results)
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
                `;
                if (item.member.department == null || item.member.department === '') {
                    row.innerHTML += '<td>None</td>';  // Append "None" if the district is null
                } else {
                    row.innerHTML += `<td>${item.member.department.name}</td>`;  // Append the district if it exists
                }
                tableBody.appendChild(row);
            });
        } else {
            const row = document.createElement('tr');
            row.innerHTML = '<td colspan="12">No Member found</td>';
            tableBody.appendChild(row);
        }
    }
    
    // Event listeners for pagination buttons
    document.getElementById('nextBtn').addEventListener('click', function (event) {
        event.preventDefault();
        if (nextPageUrl) {
            fetchMembers(nextPageUrl);  // Fetch next page data
        }
    });
    
    document.getElementById('preBtn').addEventListener('click', function (event) {
        event.preventDefault();
        if (previousPageUrl) {
            fetchMembers(previousPageUrl);  // Fetch previous page data
        }
    });
    
    // Event listener for search input
    document.getElementById('searchInput').addEventListener('input', function (event) {
        searchQuery = event.target.value;  // Update search query
        let searchUrl = `${baseUrl}?search=${searchQuery}&ordering=${orderingQuery}&page=1`;
        fetchMembers(searchUrl);  // Fetch results for the search query
    });
    
    // Event listener for ordering selection
    document.getElementById('orderingSelect').addEventListener('change', function (event) {
        orderingQuery = event.target.value;  // Update ordering query
        let orderUrl = `${baseUrl}?search=${searchQuery}&ordering=${orderingQuery}&page=1`;
        fetchMembers(orderUrl);  // Fetch results for the ordering selection
    });
    
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
        fetch('http://localhost:8000/admins/api/download/attendance/', {
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
    