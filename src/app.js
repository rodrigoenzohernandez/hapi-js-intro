const hapi = require('@hapi/hapi');
const path = require('path');
const inert = require('inert') //Module to serve static files

const init = async () => {
    const server = new hapi.Server({
        port: 3000,
        host: 'localhost',
        routes: {
            files: {
                relativeTo: path.join(__dirname, 'public')
            }
        }
    })

    await server.register(inert)
    await server.register(require('@hapi/vision')) //Allows to use templates engines


    server.views({
        engines:{
            html: require('handlebars')
        },
        relativeTo: __dirname,
        path: 'templates',
        isCached: process.env.NODE_ENV === 'production' //Disable the cache on Dev, to have a quickly refresh.
    })

    await server.start();
    console.log('Server running on: ', server.info.uri);

    server.route({
        method: 'GET',
        path: '/',
        handler: (request, h) =>{
            return '<h1>Hello World</h1>'
        }
    });

    server.route({
        method: 'GET',
        path: '/about',
        handler: (request, h) =>{
            return 'ABOUT'
        }
    })

    server.route({
        method: 'GET',
        path: '/hello/{user}',
        handler: (request, h) => {
            console.log(request.params);
            return `<h1>Hello ${request.params.user}</h1>`
        }
    })

    server.route({
        method: 'GET',
        path: '/text.txt',
        handler: (request, h) => {
            return h.file('./text.txt')
        }
    })

    server.route({
        method: 'GET',
        path: '/page',
        handler: (request, h) => {
            return h.view('index')
        }
    })

    server.route({
        method: 'GET',
        path: '/name',
        handler: (request, h) => {
            
            return h.view('namePage', {
                name: 'fazt'
            })
        }
    })

    server.route({
        method: 'GET',
        path: '/products',
        handler: (request, h) => {
            
            return h.view('products', {
                products: [
                    {name: 'laptop'},
                    {name: 'keyboard'},
                    {name: 'mouse'},
                    {name: 'monitor'},


                ]
            })
        }
    })


};

init()

