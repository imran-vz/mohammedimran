# DNS-AID records to publish for imran.codes

These records must be added at the authoritative DNS provider for `imran.codes`; they cannot be shipped from the Astro/Vercel application code. Keep DNSSEC enabled for the public zone so validating resolvers can authenticate the records.

```dns
_index._agents.imran.codes. 3600 IN HTTPS 1 imran.codes. alpn="h2" port=443 mandatory=alpn,port,key65528 key65528="https://imran.codes/.well-known/api-catalog"
_a2a._agents.imran.codes.   3600 IN HTTPS 1 imran.codes. alpn="a2a,h2" port=443 mandatory=alpn,port,key65528 key65528="https://imran.codes/.well-known/api-catalog"
_mcp._agents.imran.codes.   3600 IN HTTPS 1 imran.codes. alpn="mcp,h2" port=443 mandatory=alpn,port,key65528 key65528="https://imran.codes/mcp"
_index._agents.imran.codes. 3600 IN TXT "dnsaid=index url=https://imran.codes/.well-known/api-catalog"
```

`key65528` is an experimental/private-use SvcParamKey that carries the HTTPS endpoint URI until DNS-AID endpoint parameters are registered. If the DNS provider UI does not support HTTPS records, publish the same values as SVCB records instead.

Validation examples after publishing:

```sh
dig +dnssec HTTPS _index._agents.imran.codes
dig +dnssec HTTPS _a2a._agents.imran.codes
dig +dnssec HTTPS _mcp._agents.imran.codes
dig TXT _index._agents.imran.codes
```
