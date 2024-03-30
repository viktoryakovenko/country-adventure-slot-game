# SigmaSoftware Slot machine prototype

## Installation

```bash
$ npm install
```

## Running the app

### Running locally in development mode

1. Create `.env` file with all required variables (`.env.example` can be used as a reference)

2. Run the following command

```bash
$ npm run start:dev
```

## Description:
  This repository includes a project that supports pixi v+ version which based on TS, and bundled by Webpack.

### This game template contains: 
- Pixi v7
- Pixi Spine plugin
- GSAP lib
- stats.js lib
- howler
- data.gui
- scripts for build:
  - audio
  - sprites
- scenes
  - Scene manager
  - Base scenes for start.
- Simple State machine
- Simple injection system
- Simple layout system
- Bitmap fonts


## Pre-install Setup:
- Be sure that `ffmpeg` is present in terminal (`brew install ffmpeg` for mac).
- Install [ImageMagic](http://imagemagick.org/) with "Install legacy utilities" checked during instalation.
- Install [Node](http://nodejs.org/)
- `npm install`
- `npm run build-assets`
- `npm run build:dev` or `npm run build:prod` for production build 
- `npm run http:server`
- or
- `npm run serve`


## help resources

**Bitmap fonts creator online tool**: https://snowb.org/

* [Backend](wiki/backend/README.md)
* [Wiki](wiki/MAIN.md)
