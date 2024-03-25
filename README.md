<a href="https://klave.com/">
  <img alt="Klave - Wallet" src="https://klave.com/images/marketplace/utxo-protocol.svg">
  <h1 align="center">UTXO protocol implementation on Klave</h1>
</a>

<p align="center">
  An implementation on Klave of the Unspent Transaction Output (UTXO) protocol that is used by many cryptocurrencies.
</p>

<p align="center">
  <a href="#description"><strong>Description</strong></a> ·
  <a href="#features"><strong>Features</strong></a> ·
  <a href="#deploy-your-own"><strong>Deploy Your Own</strong></a> ·
  <a href="#build-locally"><strong>Build Locally</strong></a> ·
  <a href="#authors"><strong>Authors</strong></a>
</p>

![Wasm](https://img.shields.io/badge/Webassembly-5E4EE3?style=for-the-badge&labelColor=white&logo=webassembly&logoColor=5E4EE3) ![AssemblyScript](https://img.shields.io/badge/Assemblyscript-3578C7?style=for-the-badge&labelColor=white&logo=assemblyscript&logoColor=3578C7)

## Description

The Unspent Transaction Output (UTXO) protocol is used by several cryptocurrencies to track ownership of the digital currency. UTXOs are like digital change left over from cryptocurrency transactions. They represent the amount of digital currency that a user can spend. The UTXO protocol is essential to prevent double-spending by ensuring that each UTXO can be spent only once. When you make a cryptocurrency (using UTXO protocol) transaction, your wallet uses UTXOs as inputs to create new transactions. These UTXOs are the evidence of your previous cryptocurrency receipts. To spend a UTXO, the entire amount must be used, similar to spending a physical banknote. If the UTXO value is more than what you want to send, a new UTXO is created as change and sent back to your wallet.

The Klave UTXO protocol implementation provides the following functionalities:

- Create your cryptocurrency UTXO based
- Transfer coin from one account to another
- Get the current coin balance of an account
- Get the total supply of the coin available on the network

## Features

- **Create coin:** Create your Wallet
- **Manage supply:** Create, delete and use your cryptographic keys
- **Manage transaction:** Send and receive coins

## Deploy Your Own

You can deploy your own version of the Klave UTXO implementation with one click:

[![Deploy on Klave](https://klave.com/images/deploy-on-klave.svg)](https://app.klave.com/template/github/secretarium/klave-utxo)

## Build Locally

You can build your into wasm locally, allowing you to validate the hash of the application deployed on Klave.

> Note: You should have node and yarn installed to be able to build locally.

```bash
yarn install
yarn build
```
This will create the .wasm file in the ./klave folder.

## Authors

This library is created by [Klave](https://klave.com) and [Secretarium](https://secretarium.com) team members, with contributions from:

- Jeremie Labbe ([@jlabbeklavo](https://github.com/jlabbeKlavo)) - [Klave](https://klave.com) | [Secretarium](https://secretarium.com)
- Nicolas Marie ([@Akhilleus20](https://github.com/Akhilleus20)) - [Klave](https://klave.com) | [Secretarium](https://secretarium.com)
- Etienne Bosse ([@Gosu14](https://github.com/Gosu14)) - [Klave](https://klave.com) | [Secretarium](https://secretarium.com)