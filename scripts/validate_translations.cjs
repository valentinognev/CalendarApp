const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/utils/translations.ts');

try {
    const content = fs.readFileSync(filePath, 'utf8');

    // Quick and dirty syntax check by trying to eval it (it's risky but local and efficient for this)
    // We need to mock 'export const' to make it valid JS for verify
    const mockContent = content.replace('export const TRANSLATIONS', 'const TRANSLATIONS');

    try {
        // Evaluate the code to see if it throws a SyntaxError
        // We use Function constructor to isolate it slightly better than eval
        new Function(mockContent);
        console.log("Syntax is VALID.");
    } catch (e) {
        console.error("Syntax Error found:");
        console.error(e.message);

        // Try to find the line number from stack (if available) or guess
        if (e.stack) {
            console.error(e.stack.split('\n')[0]);
        }
    }

    // Also assume manual brace counting
    let openBraces = 0;
    const lines = content.split('\n');
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const open = (line.match(/\{/g) || []).length;
        const close = (line.match(/\}/g) || []).length;
        openBraces += open;
        openBraces -= close;

        if (openBraces < 0) {
            console.error(`Negative brace count at line ${i + 1}. Extra '}'?`);
            break;
        }
    }

    if (openBraces !== 0) {
        console.error(`Brace mismatch! Final count: ${openBraces}. (Should be 0). Missing '}'?`);
    } else {
        console.log("Brace count seems correct (0).");
    }

} catch (err) {
    console.error("File read error:", err);
}
