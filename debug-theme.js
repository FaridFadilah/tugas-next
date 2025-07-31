/* 
 * MANUAL TESTING SCRIPT FOR THEME TOGGLE
 * Copy dan paste di browser console (F12 > Console)
 */

console.log("=== TESTING THEME TOGGLE FUNCTIONALITY ===");

// 1. Check current theme status
console.log("1. Current theme status:");
console.log("- localStorage theme:", localStorage.getItem('app-theme'));
console.log("- HTML classes:", document.documentElement.classList.toString());
console.log("- Computed background color:", getComputedStyle(document.body).backgroundColor);

// 2. Function to manually toggle theme
window.testThemeToggle = function() {
    const currentTheme = localStorage.getItem('app-theme') || 'light';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    console.log(`\n2. Manual theme toggle: ${currentTheme} -> ${newTheme}`);
    
    // Update localStorage
    localStorage.setItem('app-theme', newTheme);
    
    // Update DOM classes
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(newTheme);
    
    console.log("- Updated localStorage:", localStorage.getItem('app-theme'));
    console.log("- Updated HTML classes:", document.documentElement.classList.toString());
    
    // Trigger a React re-render by dispatching a custom event
    window.dispatchEvent(new Event('storage'));
};

// 3. Function to check if dark mode styles are working
window.checkDarkModeStyles = function() {
    console.log("\n3. Checking dark mode styles:");
    const sidebar = document.querySelector('.bg-white.dark\\:bg-gray-800');
    if (sidebar) {
        const styles = getComputedStyle(sidebar);
        console.log("- Sidebar background color:", styles.backgroundColor);
        console.log("- Is dark mode active:", document.documentElement.classList.contains('dark'));
    } else {
        console.log("- Sidebar not found");
    }
};

// 4. Instructions
console.log(`
\n=== TESTING INSTRUCTIONS ===
1. Run: testThemeToggle() - to manually toggle theme
2. Run: checkDarkModeStyles() - to verify styles are applied
3. Click the moon/sun icon in the sidebar
4. Check if the page changes from light to dark mode
5. Refresh the page and verify theme persists

Current state: ${localStorage.getItem('app-theme') || 'light'} mode
HTML classes: ${document.documentElement.classList.toString()}
`);

// Auto-run initial checks
window.checkDarkModeStyles();
