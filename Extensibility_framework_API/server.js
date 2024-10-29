const http = require('http');
const url = require('url');

let data = {
    1: { id: 1, name: 'John Doe', email: 'john.doe@example.com', status: 'valid' },
    2: { id: 2, name: 'Jane Smith', email: 'jane.smith@example.com', status: 'valid' },
    3: { id: 3, name: 'Michael Brown', email: null, status: 'invalid' }  // Invalid data (missing email)
};

// let data = [
//     { id: 4, name: 'Aslin', email: 'aslin@example.com', status: 'valid' },
//     { id: 5, name: 'Manoj', email: 'manoj@example.com', status: 'valid' },
//     { id: 6, name: 'Sherin', email: 'sherin@example.com', status: 'valid' },
//     { id: 7, name: 'Andrea', email: 'andrea@example.com', status: 'valid' },
//     { id: 8, name: 'Beenu', email: 'beenu@example.com', status: 'valid' },
//     { id: 9, name: 'Jose', email: 'jose@example.com', status: 'valid' },
//     { id: 10, name: 'Hannibal', email: 'hannibal@example.com', status: 'valid' },
//     { id: 11, name: 'Riswin', email: 'riswin@example.com', status: 'valid' },
//     { id: 12, name: 'Sreejith', email: 'sreejith@example.com', status: 'valid' },
//     { id: 13, name: 'Sija', email: 'sija@example.com', status: 'valid' },
//     { id: 14, name: 'Priya', email: 'priya@example.com', status: 'valid' },
//     { id: 15, name: 'Adeno', email: 'adeno@example.com', status: 'valid' }
//   ];

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const method = req.method;
    const id = parsedUrl.pathname.split('/')[3]; // Extract ID from URL

    // Handle different HTTP methods
    if (method === 'GET' && parsedUrl.pathname === '/api/data') {
        // Get all data
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(data));
    } else if (method === 'GET' && parsedUrl.pathname.startsWith('/api/data/')) {
        // Get single data by ID
        if (data[id]) {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(data[id]));
        } else {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Data not found' }));
        }
    } else if (method === 'POST' && parsedUrl.pathname === '/api/data') {
        // Create new data entry
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            const newData = JSON.parse(body);
            const newId = Math.max(...Object.keys(data).map(id => parseInt(id))) + 1; // Increment ID
            newData.id = newId;
            data[newId] = newData;
            res.writeHead(201, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Data created successfully', data: newData }));
        });
    } else if (method === 'PUT' && parsedUrl.pathname.startsWith('/api/data/')) {
        // Update data entry by ID
        if (data[id]) {
            let body = '';
            req.on('data', chunk => {
                body += chunk.toString();
            });
            req.on('end', () => {
                const updatedData = JSON.parse(body);
                data[id] = { ...data[id], ...updatedData }; // Merge new data
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Data updated successfully', data: data[id] }));
            });
        } else {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Data not found' }));
        }
    } else if (method === 'DELETE' && parsedUrl.pathname.startsWith('/api/data/')) {
        // Delete data entry by ID
        if (data[id]) {
            delete data[id];
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Data deleted successfully' }));
        } else {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Data not found' }));
        }
    } else {
        // Handle 404 for other routes
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Not Found' }));
    }
});

// Start the server
const port = 3000;
server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
