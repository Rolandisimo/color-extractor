# Extract all colors from any image

## Supported sources
- URL ✅
- Image upload ❌ _(coming soon)_

## Supported extensions
- jpg
- png

## Structure
- `client` - React application in Javascript
- `server` - NodeJS express server application
  - `server/colors` - Python scripts for color extracting

## Pre-requisites
- Installed `virtualenv` for starting the python scripts in a virtual environment

## Usage
For development:
- Start client by running `./client.development.sh`
- Start server by running `./server.development.sh`

For production [WIP]:
- `./client.production.sh`
- `./server.production.sh`
