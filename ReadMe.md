# electron-tutorial
This project has been written in Electron.js. It includes:
- A simple to-do list application
- Serial port communication
- Some other features will be added in the future...

Feel free to use all my codes and have fun!
If you want to learn more about Electron.js, check the [Quick Start Guide](https://www.electronjs.org/docs/latest/tutorial/quick-start).

## Issues
- Serial port communication: OS port binding needed!

## Features will be added
- Graphics interface (data visualization)
- Export/import parameters


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

## Deployment

- npm i electron-packager --save-dev (for development)
- npm i electron-packager -g (for CLI)
- npm i electron --save-dev (for development)
- Add "productName": "...", to package.json
- Get project from github and make "npm install" for every different os platform (important)
    - `MAC Command:` 
    ```bash
        electron-packager . --overwrite --platform=darwin --arch=x64 --icon=assets/icons/mac/icon.icns --prune=true --out=release-builds
    ```
    - `WIN Command:` 
    ```bash
        electron-packager . electron-tutorial-app --overwrite --asar=true --platform=win32 --arch=ia32 --icon=assets/icons/win/icon.ico --prune=true --out=release-builds --version-string.CompanyName=CE --version-string.FileDescription=CE --version-string.ProductName="TA2LSM Electron Project"
    ```
    - `LINUX Command:` 
    ```bash
        electron-packager . electron-tutorial-app --overwrite --asar=true --platform=linux --arch=x64 --icon=assets/icons/linux/icon.png --prune=true --out=release-builds
    ```

