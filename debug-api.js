
async function main() {
    console.log('Probing /api/chat directly (Node.js Fetch)...');
    try {
        const response = await fetch('http://localhost:3000/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                messages: [{ role: 'user', content: 'Debug probe.' }]
            })
        });

        console.log('Status:', response.status);
        console.log('Headers:', JSON.stringify(Object.fromEntries(response.headers.entries())));

        if (response.ok) {
            console.log('Reading stream...');
            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                console.log('CHUNK:', decoder.decode(value));
            }
        } else {
            console.log('Error Body:', await response.text());
        }
    } catch (err) {
        console.error('Fetch Failed:', err);
    }
}

main();
