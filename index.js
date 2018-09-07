
function makePlugin(opts) {

  let bluetoothManager = opts.bluetoothManager;

  const name = "bluetooth"

  function scope() {
    return opts.scope || 'private';
  }

  function parse (addr) {
    console.log("multiserv-blueooth: parsing address: " + addr);

    if (!addr.startsWith("bt:")) return null;
    return addr.replace("bt:", "");
  }

  function client (address, cb) {
    console.log("multiserv-blueooth: client connection " + address)

    bluetoothManager.connect(address, cb);

    return function() {
      bluetoothManager.disconnect(address);
    }

  }

  function server (onConnection) {
    console.log("multiserv-bluetooth: starting server");

    // The bluetooth manager calls back with a duplex stream on a new connection
    // which we can then call back onConnection with
    bluetoothManager.listenForIncomingConnections(
      (err, connection) => onConnection(connection)
    )

    return function() {
      bluetoothManager.stopServer();
    }
  }

  return {
    name: name,
    scope: scope,
    parse: parse,
    client: client,
    server: server
  }

}

module.export = makePlugin;
