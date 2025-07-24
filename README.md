# Cozy DataViewer

DataViewer is an application designed to be installed on a Cozy instance and integrated into the PLRS (Personal Learning Record Store) system.

## Description

This application allows you to visualize and manage learning data within the Cozy ecosystem, interfacing with the PLRS server for storing and retrieving Learning Records.

## Prerequisites

- A functional Cozy Stack instance
- A configured PLRS server
- Node.js and Yarn

## Installation

### 1. Install Cozy Stack

Refer to the Cozy Stack README: https://github.com/cozy/cozy-stack/#installing-a-cozy-stack

### 2. Install PLRS Server

The PLRS server is included as a submodule in this repository. First, initialize and update the submodule:

```bash
git submodule init
git submodule update
```

The PLRS server is located in the `lrs-gateway/` directory. Follow the PLRS server README instructions or https://github.com/Prometheus-X-association/lrs-gateway

⚠️ **Note:** You won't need any database. Just run the equivalent of:

```bash
cd lrs-gateway
docker compose up -d app
```

depending on the deployment method you choose.

### 3. Install DataViewer

```bash
yarn install
yarn build
cozy-stack apps install dataviewer $PWD/build
```

### 4. Configure Features

Set up the necessary flags:
When deploying at scale, it will be possible to define these flags for all instances within a context.


```bash
cozy-stack features flags '{"dataviewer.plrs": true}'
cozy-stack features flags '{"dataviewer.plrs.server.url": "<plrs_server_url>"}'
```

⚠️ **Important:** Replace `<plrs_server_url>` with the actual URL of your PLRS server.

### 5. Access the Application

Navigate to the onboarding page: http://dataviewer.cozy.localhost:8080/
(or the address corresponding to your Cozy Stack deployment)

In the browser console, you should see a URL similar to:

```
Webhook receiver url: http://cozy.localhost:8080/jobs/webhooks/202f8b689b9945fba29db496ff0a441a
```

**Copy this webhook URL**, it will be needed to configure your data resource on the Vision web interface.

Note: This step will be automated through the Vision API when it becomes available.


### 6. Install Dataspace Connector (PDC)

The PDC source code is available here: https://github.com/Prometheus-X-association/dataspace-connector

Follow the README file to configure it.

Once your PDC is running and linked to a Vision account:
1. Create an infrastructure offer on it
2. Link it to the webhook URL obtained during the DataViewer application onboarding

## Support

For any issues or questions, refer to the documentation of related projects:
- [Cozy Stack](https://github.com/cozy/cozy-stack/)
- [PLRS Server](https://github.com/Prometheus-X-association/lrs-gateway)
- [Dataspace Connector](https://github.com/Prometheus-X-association/dataspace-connector)
