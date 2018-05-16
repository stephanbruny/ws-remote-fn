const WebSocket = require('ws');
const assert = require('assert');

const { Consumer, Provider } = require('../index');

describe('Consumer <-> Provider integration test', () => {

    it('should call remote function', async () => {

        const server = Provider({ port: 1337 }, {
            foo: async (x, y) => ({ something: { x, y } }),
            bar: (x, y) => ({ blob: { x, y } }),
            add: (x, y) => x + y
        });

        const client = await Consumer('ws://localhost:1337');

        assert(client.foo);
        assert(client.bar);

        const response = await client.foo('foo', 123);
        const added = await client.add(40, 2);
        assert.equal(added, 42);
        server.close();
    });

    it('should throw an exception from remote', async () => {

        const server = Provider({ port: 1337 }, {
            foo: async () => { throw new Error('foo failed') }
        });

        const client = await Consumer('ws://localhost:1337');

        try {
            await client.foo();
        } catch (ex) {
            assert.equal(ex.message, 'foo failed');
        }

        server.close();
    });
});