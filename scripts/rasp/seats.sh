#!/bin/sh

echo

curl -H "Content-Type: application/json" -d '{"respId":"rasp1","password":"rasp1"}' -X POST http://localhost:3000/resp/seats/

echo
echo
