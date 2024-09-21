// Fetch data for dashboard

const token = localStorage.getItem('token')
const errorAlert = document.getElementById('error-alert');
if (token == null && token == 'undefined') {
    window.location.href = 'login.html';
    document.getElementById('message').innerText = 'Token is invalid login again';
    errorAlert.classList.remove('d-none');
}
// fetch('http://localhost:8000/admins/api/list/school/application/', {
let nextPageUrl = null;  // Global variable to store next page URL
let previousPageUrl = null;  // Global variable to store previous page URL

// Initial data fetching
fetch('http://localhost:8000/admins/api/list/question/', {
    method: 'GET',
    headers: {
        'Authorization': 'Bearer ' + token
    }
})
.then(response => handleResponse(response))
.then(data => updateTable(data))
.catch(error => handleError(error));

// Function to handle response
function handleResponse(response) {
    if (response.ok) {
        return response.json();
    } else if (response.status === 401) {
        handleTokenExpiry();
        throw new Error('Unauthorized: Token expired or invalid');
    } else if (!response.ok) {
        document.getElementById('message').innerText = 'Server is not responding';
        errorAlert.classList.remove('d-none');
    } else {
        throw new Error('Failed to load dashboard data');
    }
}

// Function to update the table and pagination buttons
function updateTable(data) {
    nextPageUrl = data.next;  // Store the next page URL
    previousPageUrl = data.previous;  // Store the previous page URL

    document.getElementById('preBtn').href = previousPageUrl || '#';  // Set previous button href
    document.getElementById('nextBtn').href = nextPageUrl || '#';  // Set next button href
    document.getElementById('count').innerText = data.count;

    const faqList = document.querySelector('.faq-list');  // Target the FAQ list container
faqList.innerHTML = '';  // Clear existing FAQ items

if (Array.isArray(data.results) && data.results.length) {
    data.results.forEach((item, index) => {
        // Create the FAQ item (li element)
        const faqItem = document.createElement('li');
        
        const formattedDate = item.date ? new Date(item.date).toUTCString() : '';

        // Inject the HTML for the FAQ item using template literals
        faqItem.innerHTML = `
            <div data-bs-toggle="collapse" class="collapsed question" href="#faq${index}">
                ${item.name || ''} | ${item.email || ''}
                <i class="bi bi-chevron-down icon-show"></i><i class="bi bi-chevron-up icon-close"></i>
            </div>
            <div id="faq${index}" class="collapse" data-bs-parent=".faq-list">
                <br>
                <h2>${item.subject || ''} | ${formattedDate}</h2>
                <p>${item.question || ''}</p>
            </div>
        `;
        
        // Append the new FAQ item to the list
        faqList.appendChild(faqItem);
    });
} else {
    // If no data is found, display a message
    const noResultItem = document.createElement('li');
    noResultItem.innerHTML = '<p>No FAQs found</p>';
    faqList.appendChild(noResultItem);
}

}

// Event listeners for pagination buttons
document.getElementById('nextBtn').addEventListener('click', function (event) {
    event.preventDefault();
    if (nextPageUrl) {
        fetchPage(nextPageUrl); // Fetch next page data
    }
});

document.getElementById('preBtn').addEventListener('click', function (event) {
    event.preventDefault();
    if (previousPageUrl) {
        fetchPage(previousPageUrl); // Fetch previous page data
    }
});

// Function to fetch data for next/previous page
function fetchPage(url) {
    fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + token
        }
    })
    .then(response => handleResponse(response))
    .then(data => updateTable(data))
    .catch(error => handleError(error));
}

// Function to handle token expiry
function handleTokenExpiry() {
    localStorage.removeItem('token');
    localStorage.removeItem('firstname');
    window.location.href = 'login.html';
}

// Function to handle errors
function handleError(error) {
    document.getElementById('message').innerText = error;
    errorAlert.classList.remove('d-none');
}
