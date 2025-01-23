function formatDate(date) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(date).toLocaleDateString('en-US', options);
}

async function fetchCoverLetter() {
    try {
        const response = await fetch('../input/coverletter.txt');
        const content = await response.text();
        return content;
    } catch (error) {
        console.error('Error loading cover letter:', error);
    }
}

async function renderCoverLetter(content) {
    // Update date
    const dateElement = document.querySelector('.date');
    dateElement.textContent = formatDate(new Date());

    // Format letter content
    const paragraphs = content.split('\n\n').filter(p => p.trim());
    const letterBody = document.querySelector('.letter-body');
    
    // Add recipient block
    const recipientBlock = document.createElement('div');
    recipientBlock.className = 'recipient';
    recipientBlock.innerHTML = `
        <p>MLK Community Hospital</p>
        <p>Los Angeles, CA</p>
    `;
    letterBody.appendChild(recipientBlock);

    // Add salutation and content
    const contentDiv = document.createElement('div');
    contentDiv.className = 'content';
    contentDiv.innerHTML = paragraphs.map((p, index) => {
        if (index === 0) {
            // First paragraph is salutation
            return `<p class="salutation">${p.trim()}</p>`;
        } else if (index === paragraphs.length - 1) {
            // Last paragraph is signature
            return `
                <div class="signature">
                    <p>${p.trim()}</p>
                    <p class="signature-name">Jonathan Young
                    <br>
                    <a href="tel:626 626 0656">626 626 0656</a> | <a href="mailto:jyoung0696@gmail.com">jyoung0696@gmail.com</a>
                    </p>
                </div>`;
        } else {
            return `<p class="paragraph">${p.trim()}</p>`;
        }
    }).join('\n');
    
    letterBody.appendChild(contentDiv);
}

async function renderPage() {
    const content = await fetchCoverLetter();
    await renderCoverLetter(content);
}

renderPage();
