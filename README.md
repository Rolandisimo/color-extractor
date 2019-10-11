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
- Clone repo
- Run `npm run start` from the root to start the server and the client simultaneously
- Alternatively, `cd client && yarn start` and `cd server && npm run start`
