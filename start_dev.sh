#!/bin/bash

npm run -w commons build:watch &
npm run -w src build:watch &
npm run -w srv build:watch &

tail -f
