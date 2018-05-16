const WebSocket = require('ws');
const jsonrpc = require('./jsonrpc');

const rpc = method => (...args) => jsonrpc.request(method, args);

const openWebsocket = (address, options) => new Promise((resolve, reject) => {
    try {
        const websocket = new WebSocket(address, options);
        websocket.on('open', () => {
            return resolve(websocket);
        });
    } catch (ex) {
        return reject(ex);
    }
});

module.exports = async (address, options, methods) => {
    const socket = await openWebsocket(address, options);

    const callRemote = method => async (...args) =>{
        const request = rpc(method)(...args);

        const getResponse = (id) => new Promise((resolve, reject) => {
            let handler = socket.on('message', (msg) => {
                const res = JSON.parse(msg);
                if (res.id === id) {
                    if (res.error) return reject(res.error);
                    socket.removeEventListener(handler);
                    return resolve(res.result);
                }
            });
        });

        const result = getResponse(request.id);
        socket.send(JSON.stringify(request));
        return result;
    }

    const remoteMethods = methods || await callRemote('@discover')(null);

    let remoteApi = {};

    remoteMethods.forEach(methodName => {
        remoteApi[methodName] = callRemote(methodName);
    });

    return remoteApi;
}