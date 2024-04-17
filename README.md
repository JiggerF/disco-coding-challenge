# Disco-coding-challenge
This repository contains UI test automation for Disco which runs on nodeJS and playwright test framework. 


## Pre-requisite:
- npm ^10.5.2
- node ^20.12.2: https://docs.npmjs.com/downloading-and-installing-node-js-and-npm


## How to Run Locally
1. Clone this repository to local
2. From root folder, install dependencies as defined in package.json
```
    $ npm install
```
3. Execute all UI tests
```
    $ npx playwright test pricingPage.spec.js --project='chromium' --reporter=list
```

## Challenges:
1. Unable to consistently control both the sliders to change number of Users and Files. For demonstration purpose, rerun if initial run fails.
2. 5 hours to complete all the tests is not sufficient
