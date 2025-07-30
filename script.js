document.getElementById('url-form').addEventListener('submit', async function (e) {
    e.preventDefault();
    const urlInput = document.getElementById('original-url').value;
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = 'Shortening...';

    try {
        const response = await fetch('/shorten-url', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ originalUrl: urlInput }),
        });

        const data = await response.json();

        if (response.ok) {
            resultsDiv.innerHTML = `
                <p><strong>Original URL:</strong> ${urlInput}</p>
                <p><strong>Shortened URL:</strong> <a href="${data.shortenedUrl}" target="_blank">${data.shortenedUrl}</a></p>
                <p><strong>Expires on:</strong> ${data.expiryDate}</p>
            `;
        } else {
            resultsDiv.innerHTML = `<p style="color:red;">Error: ${data.error}</p>`;
        }
    } catch (err) {
        resultsDiv.innerHTML = `<p style="color:red;">Something went wrong. Try again.</p>`;
    }
});


    