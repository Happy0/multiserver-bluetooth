
function makePlugin(opts) {

  let bluetoothManager = opts.bluetoothManager;

  let ownMacAddress = null;

  const name = "bluetooth"

  function scope() {
    return opts.scope || 'public';
  }

  function parse (addr) {
    if (!addr.startsWith("bt:")) return null;
    return addr.replace("bt:", "");
  }

  /**
   * The multiserver address format does not allow : symbols to be used, so we omit them internally.
   * This function adds them back in.
   * 
   * @param {} internalRepresentation the internal representation (e.g. 65D900DDB353)
   * @returns the bluetooth mac address implementation (e.g. 65:D9:00:DD:B3:53)
   */
  function toMacAddress(internalRepresentation) {
    const parts = [];

    // Take a copy of the string
    let btInternalRepresentation = internalRepresentation.slice();

    do { 
      parts.push(btInternalRepresentation.substring(0, 2)) 
    } 
    while( (btInternalRepresentation = btInternalRepresentation.substring(2, btInternalRepresentation.length)) != "" );

    return parts.join(":");
  }

  function client (address, cb) {
    const macAddress = toMacAddress(address);

    bluetoothManager.connect(macAddress, cb);

    return function() {
      bluetoothManager.disconnect(address);
    }

  }

  function server (onConnection, startedCb) {

    bluetoothManager.getOwnMacAddress((err, address) => {
      console.log("multiserver-bluetooth: Own address is " + address);
      
      ownMacAddress = address;

      // The bluetooth manager calls back with a duplex stream on a new connection
      // which we can then call back onConnection with
      bluetoothManager.listenForIncomingConnections(
        (err, connection) => onConnection(connection)
      )

      if (startedCb) {
        // Call back to let multiserver know that we're ready to accept incoming connections
        startedCb(err, macAddress);
      }

    })

    return function() {
      bluetoothManager.stopServer();
    }
  }

  function stringify (s) {
    if (s !== scope()) return;
    return ['bt', ownMacAddress].join(':')
  }

  return {
    name: name,
    scope: scope,
    parse: parse,
    client: client,
    server: server,
    stringify: stringify
  }

}

module.exports = makePlugin;
