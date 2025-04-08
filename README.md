# ERC20 Token API with Viem

## Overview

This project demonstrates an example of deploying an ERC20 token smart contract and interacting with it using a Node.js (TypeScript) backend via [Viem](https://viem.sh/).

### Tech Stack
- Solidity (ERC20)
- Hardhat
- NestJs
- Viem

---

## Features

- Deploy a custom ERC20 token
- REST API to:
    - Get token metadata
    - Check user balance
    - Transfer tokens using `transferFromWithPermit`
- Basic unit tests for the token contract

---

## Getting Started

### 1. Start Backend

```bash
cd backend
npm install
npm start
```

### 2. Deploy contract

```bash
cd ../contract
npm install
npx hardhat node
npx hardhat test
npx hardhat ignition deploy ./ignition/modules/BBTestToken.ts
```
To interact with API, use [Swagger on localhost](http://localhost:3000/)
