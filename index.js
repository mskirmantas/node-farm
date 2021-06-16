const fs = require('fs');
const http = require('http');
const url = require('url');

const replaceTemplate = require('./modules/replaceTemplate');


// FILES

// Blocking, synchronous way

// const textInput = fs.readFileSync('./txt/input.txt', 'utf-8');
// console.log(textInput);

// const textOutput = `This is what we know about avocado: ${textInput}.\nCreated on ${Date.now()}`;
// fs.writeFileSync('./txt/output.txt', textOutput);
// console.log('File written!');

// Non-blocking, asynchronous way

// fs.readFile('./txt/start.txt', 'utf-8', (err, data1) => {
//     if (err) {
//         return console.log('ERROR');
//     }
//     fs.readFile(`./txt/${data1}.txt`, 'utf-8', (err, data2) => {
//         console.log(data2);
//         fs.readFile('./txt/append.txt', 'utf-8', (err, data3) => {
//             console.log(data3);

//             fs.writeFile('./txt/final.txt', `${data2}\n${data3}`, 'utf-8', err => {
//                 console.log('Your file has been written!');
//             })
//         });
//     });
// });
// console.log('Will read file!');

// SERVER


const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, 'utf-8');
const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html`, 'utf-8');
const tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`, 'utf-8');

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data);

const server = http.createServer((request, response) => {
    const {query, pathname} = url.parse(request.url, true)

    //Overview page
    if (pathname === '/' || pathname === '/overview'){

    response.writeHead(200, {'Content-type': 'text/html'});

    const cardsHtml = dataObj.map(el => replaceTemplate(tempCard, el)).join('');
    // console.log(cardsHtml); // returns array of data strings as html. Needs to be joined into a single string

    const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHtml)
    response.end(output);


    //Product page
    }else if(pathname === '/product'){
        response.writeHead(200, {'Content-type': 'text/html'});

        const product = dataObj[query.id];
        const output = replaceTemplate(tempProduct, product);
        response.end(output);


    //API
    }else if(pathname === '/api'){
    response.writeHead(200, {'Content-type': 'application/json'});
    response.end(data);


    // Not found
    }else{
        response.writeHead(404, {
            'Content-type': 'text/html',
            'my-own-header': 'hello-world'
        });
        response.end('<h1>Page not found!</h1>');
    }
    
});

server.listen(8000, '127.0.0.1', ()=> { // 8000 is a PORT, 127.0.0.1 = standard IP address for localhost
    console.log('Listening to request on port 8000');
}) 
