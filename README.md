# ws-remote-fn

**Call remote functions as if they where local!**

This tiny library let's you call functions from external processes, or remote servers easily.  
No need for boiler-plating or juggling protocols.  
Also it enabled you to create simple and fast RPC-APIs.  

If you're developing service oriented systems or microservices, and don't need/want heavy REST-APIs,  
this module might just be what you were looking for.

## Install

`npm install --save ws-remote-fn`

## Usage

### Provider

A **Provider** exposes an API to websocket-clients.  

#### Spec:

```js
Provider = (options, api) => WebSocket.Server
```

#### Parameters:

`options` - WebSocket.Server options (see [ws](https://github.com/websockets/ws/blob/master/doc/ws.md))  
`api` - object containing functions only

**Example:**

```js
const { Provider } = require('ws-remote-fn');

const myApi = {
    myFunction: (x, y, z) => {
        /* ... */
        return something;
    }
}

const myProvider = Provider({ port: 1337 }, myApi);
...

```

### Consumer

A **Consumer** is a wrapper around a WebSocket-client, acting as a simple object with methods, representing a provider's API.

#### Spec:

```js
Consumer = (address, options, methods) => object
```

#### Parameters:

`address` - a string to a websocket address (e.g. `ws://localhost:1337`)  
`options` - WebSocket-options (see [ws](https://github.com/websockets/ws/blob/master/doc/ws.md))  
`methods` - an array of method names of the remote's API **(you don't need this - an automatic discovery is built in)**  

**Example**:

```js
const { Consumer } = require('ws-remote-fn');

const remote = Consumer('ws://localhost:1337');
const something = await remote.myFunction(123, 'foobar');
```
