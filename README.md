# PS4 PKG Sender

This is a [Docker compose](https://docs.docker.com/compose/) Web Server UI for the [PS4 Remote PKG installer](https://gist.github.com/flatz/60956f2bf1351a563f625357a45cd9c8)

## Dependencies

### Install Docker Compose

Instructions here: [https://docs.docker.com/compose/install/](https://docs.docker.com/compose/install/)

## Configure

### IPs

In the `docker-compose.yml` file, you will see inside the `environment` section:

- LOCALIP=192.168.0.2
- PS4IP=192.168.0.100

Replace `192.168.0.2` (The value for `LOCALIP`) with the IP of the computer running this.

Replace `192.168.0.100` (The value for `PS4IP`) with the IP of the PS4.

### Folder to serve PKGs from

`./files` is the folder that will be used to look for *.pkg files

You can:

- Move the PKGs you want available inside the `files` folder.

or

- Replace the `files` folder with a symlink pointing to where the PKGs you want available are.

## Run

`docker-compose -f /path/to/docker-compose.yml up`

## Usage

First, make sure the PS4 is running at the `PS4IP` and the PS4 Remote PKG installer is running.

You should be able to open in a browser http://192.168.0.2:3333/
(Replace the `LOCALIP`=192.168.0.2 for the one you configured)

It will load a page with all the PKG files it could find inside the `files` folder and their filesize.

Clicking on one of them will send it to the PS4 Remote PKG installer.
