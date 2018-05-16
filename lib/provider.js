const WebSocket = require('ws');
const jsonrpc = require('./jsonrpc');

module.exports = (options, api) => {
    const server = new WebSocket.Server(options);

    const response = req => {
        return {
            result: data => jsonrpc.response(req.id, data),
            error: (code, message, data) => jsonrpc.error(req.id, code, message, data)
        }
    }

    const serverApi = {
        '@discover': () => Object.keys(api)
    }

    const provider = Object.assign(serverApi, api);

    const sendResponse = socket => message => socket.send(JSON.stringify(message));

    server.on('connection', (socket) => {
        const send = sendResponse(socket);
        socket.on('message', async data => {
            const req = JSON.parse(data);
            const res = response(req);
            const apiFunction = provider[req.method];
            if (!apiFunction) {
                return send(res.error(jsonrpc.errors.METHOD_NOT_FOUND, 'Unknown method' ));
            }
            try {
                const callResult = await apiFunction(...req.params);
                return send(res.result(callResult));
            } catch (ex) {
                return send(res.error (ex.code || -32000, ex.message ));
            }
        })
    });

    return server;
}