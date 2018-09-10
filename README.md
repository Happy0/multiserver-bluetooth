# multiserver-dht

_A [multiserver](https://github.com/ssbc/multiserver) plugin that facilitates communication across bluetooth serial.

This module requires a bluetooth-manager as a parameter for taking care of connections, disconnections and opening connection streams. This is to allow this plugin to be used on different platforms (e.g. mobile, linux, windows) with the same interface.

For an example implementation of the bluetooth-manager, see [ssb-bluetooth-manager](https://github.com/Happy0/ssb-bluetooth-manager)
