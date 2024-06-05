async function downloadMedia() {
    const mediaUrl = document.getElementById('mediaUrl').value;
    const url = 'https://social-download-all-in-one.p.rapidapi.com/v1/social/autolink';
    const options = {
        method: 'POST',
        headers: {
            'x-rapidapi-key': '7339b6b816msh5ea4b41e7780dc6p149332jsn31bd12926fd6',
            'x-rapidapi-host': 'social-download-all-in-one.p.rapidapi.com',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ url: mediaUrl })
    };

    document.getElementById('loading').style.display = 'block';
    document.getElementById('result').innerHTML = '';
    try {
        const response = await fetch(url, options);
        const result = await response.json();
        displayResult(result);
    } catch (error) {
        console.error(error);
        document.getElementById('result').innerHTML = `<p style="color: red;">Error: ${error.message}</p>`;
    }
    document.getElementById('loading').style.display = 'none';
}

function displayResult(data) {
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = '';

    if (data.error) {
        resultDiv.innerHTML = `<p style="color: red;">Error: Could not retrieve media.</p>`;
        return;
    }

    resultDiv.innerHTML += `<h3>${data.title}</h3>`;
    resultDiv.innerHTML += `<p>Author: ${data.author}</p>`;
    resultDiv.innerHTML += `<p>Duration: ${formatDuration(data.duration)}</p>`;
    resultDiv.innerHTML += `<img src="${data.thumbnail}" alt="Thumbnail" class="thumbnail">`;

    data.medias.forEach(media => {
        resultDiv.innerHTML += `
            <a href="${media.url}" class="download-link" target="_blank">Download ${media.quality} (${media.extension})</a>
        `;
    });

    const shareUrl = window.location.href + '?url=' + encodeURIComponent(data.url);
    resultDiv.innerHTML += `
        <div class="social-buttons">
            <a href="https://www.facebook.com/sharer/sharer.php?u=${shareUrl}" target="_blank" class="social-button facebook">Share on Facebook</a>
            <a href="https://twitter.com/intent/tweet?url=${shareUrl}" target="_blank" class="social-button twitter">Share on Twitter</a>
            <a href="https://www.linkedin.com/shareArticle?mini=true&url=${shareUrl}" target="_blank" class="social-button linkedin">Share on LinkedIn</a>
            <a href="https://www.youtube.com/share?url=${shareUrl}" target="_blank" class="social-button youtube">Share on YouTube</a>
            <button class="social-button instagram" onclick="copyToClipboard('${shareUrl}')">Share on Instagram</button>
        </div>
    `;
}

function formatDuration(seconds) {
    const minutes = Math.floor(seconds / 60);
    seconds = seconds % 60;
    return `${minutes}m ${seconds}s`;
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        alert('Link copied to clipboard. You can now share it on Instagram.');
    }).catch(err => {
        console.error('Could not copy text: ', err);
    });
}
