# TODO

- [ ] Verify the `aarch64` image on real ARM hardware. It is built natively from source, but nothing has run the result yet.
- [ ] The dashboard derives its suggested stratum URLs from the pools' internal ports, which are only the reachable ones when StartOS grants the preferred external port. It cannot ask StartOS for the assigned port; **Connection Info** is authoritative. Consider having `main` write the assigned ports into the stats API so the dashboard can show them.
- [ ] Confirm a solo block pays the finder and the `poolfee` output, end to end. The config is right by construction and ckpool validates `pooladdress` on start, but no block has actually been found on a chain where this could be observed.
