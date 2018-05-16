const Uuid = require('uuid');

module.exports = {
    errors: {
        PARSE_ERROR: -32700,
        INVALID_REQUEST: -32600,
        METHOD_NOT_FOUND: -32601,
        INVALID_PARAMS: -32602,
        INTERNAL_ERROR: -32603
    },
    request: (method, parameters) => ({
        jsonrpc: '2.0',
        id: Uuid.v4(),
        method,
        params: parameters
    }),
    response: (requestId, result) => ({
        jsonrpc: '2.0',
        id: requestId,
        result
    }),
    error: (requestId, code, message, data) => ({
        jsonrpc: '2.0',
        id: requestId,
        error: { code, message, data }
    })
}