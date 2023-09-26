# electron-tutorial
This project has been written in Electron.js. It includes:
- A simple to-do list application
- Serial port communication
- Some other features will be added in the future...

Feel free to use all my codes and have fun!

## Issues
- Serial port communication: OS port binding needed!

## Features will be added
- Graphics interface (data visualization)
- Export/import parameters

If you want to learn more about Electron.js, check the [Quick Start Guide](https://www.electronjs.org/docs/latest/tutorial/quick-start).

## How to Use
To clone and run this repository you'll need [Git](https://git-scm.com) and [Node.js](https://nodejs.org/en/download/) (which comes with [npm](https://www.npmjs.com/)) installed on your computer. From your command line:

```bash
# Clone this repository
git clone https://github.com/TA2LSM/electron-tutorial.git

# Go into the repository
cd electron-tutorial

# Install dependencies
npm install

# Run the app
npm start
# OR run the app with nodemon
npm run watch
```

Some information about code structure
- `package.json` - Points to the app's main file and lists its details and dependencies.
- `main.js` - Starts the app (entry point) and creates a browser window to render main.html. This is the app's **main process**.
- `main.html` - A web page to render first. This is the app's **renderer process**.
- `nodemon.json` - Check this file and modify it for your own settings **auto recompile**.


