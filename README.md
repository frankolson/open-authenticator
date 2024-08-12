# Open Authenticator

An open source 2FA authenticator app for iOS and Android built using SocketSupply.

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Introduction

Open Authenticator is a free and open-source two-factor authentication (2FA) app designed to enhance the security of your online accounts. It supports both iOS and Android platforms and is built using the SocketSupply framework.

## Features

- **Cross-Platform**: Available on both iOS and Android (TODO).
- **Secure**: Uses industry-standard algorithms for generating time-based one-time passwords (TOTP).
- **Open Source**: Fully open source, allowing for community contributions and transparency.
- **User-Friendly**: Simple and intuitive user interface.
- **Offline**: Works without an internet connection.

## Installation

### Prerequisites

- Node.js and npm installed on your machine.
- Xcode (for iOS development).
- Android Studio (for Android development).
- A local build of [SocketSuppply](https://github.com/socketsupply/socket) using the `next` branch and the relink instructions in that branch's [README file](https://github.com/socketsupply/socket/blob/next/README.md#development).

### Setup

1. Clone the repository:
    ```sh
    git clone https://github.com/yourusername/open-authenticator.git
    cd open-authenticator
    ```

2. Install dependencies:
    ```sh
    npm install
    ```

3. Link to the local SocketSupply build:
    ```sh
    npm link @socketsupply/socket
    ```

### Running the local emulator

_**Note**: You will not be able to use the camera based features using the emulators, but you can use this setup for quick development of all other features._

1. Run the app on an emulator:
    ```sh
    npm run dev
    ```

### Running on a physical device

1. Ensure that you have a configured `.sscrc` file in the root of the project with the necessary credentials. An example `.ssrc` setup can be found in the `.ssrc-example` file at the root of this project. Checkout the [SocketSupply documentation]https://socketsupply.co/guides/#mobile-guides) for more information.

2. Ensure the device is plugged into your computer and then issue the install command:
  1. For iOS
      ```sh
      npm run install:ios
      ```
  2. For Android
      ```sh
      npm run install:android
      ```

## Usage

1. Open the app on your device.
2. Scan the QR code provided by the service you want to enable 2FA for.
3. Use the generated code to complete the 2FA setup on the service.

## Contributing

We welcome contributions from everyone! Please check our [Contribution Guide](CONTRIBUTING.md) to learn more.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.