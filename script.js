async function checkEmail() {
    const email = document.getElementById('emailInput').value;
    const messageOutput = document.getElementById('messageOutput');
    const jsonOutput = document.getElementById('jsonOutput');

    // Clear previous outputs and styles
    messageOutput.textContent = '';
    messageOutput.classList.remove('error', 'success');
    jsonOutput.textContent = '';

    if (!email) {
        messageOutput.textContent = 'Please enter an email address.';
        messageOutput.classList.add('error');
        jsonOutput.textContent = JSON.stringify({ error: 'No email provided' }, null, 2);
        return;
    }

    try {
        const response = await fetch('http://localhost:5000/check_disposable', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: email }),
        });

        const data = await response.json();

        // Display JSON response
        jsonOutput.textContent = JSON.stringify(data, null, 2);

        // Display user-friendly message
        if (response.ok) {
            if (data.disposable) {
                messageOutput.textContent = `The email domain is likely disposable.`;
                messageOutput.classList.add('error');
            } else {
                messageOutput.textContent = `The email domain is not disposable.`;
                messageOutput.classList.add('success');
            }
        } else {
            messageOutput.textContent = data.error || 'An error occurred while checking the email.';
            messageOutput.classList.add('error');
        }
    } catch (error) {
        console.error('Fetch error:', error);
        messageOutput.textContent = 'Network error: Unable to reach the server.';
        messageOutput.classList.add('error');
        jsonOutput.textContent = JSON.stringify({ error: `Network error: ${error.message}` }, null, 2);
    }
}