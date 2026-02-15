
import * as ai from 'ai';
console.log('AI SDK Exports:', Object.keys(ai).sort());
try {
    const { streamText } = ai;
    console.log('streamText type:', typeof streamText);
} catch (e) {
    console.error(e);
}
