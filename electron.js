const { app, BrowserWindow } = require("electron");
const { spawn } = require("child_process");

let mainWindow;
let nextProcess;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
  });

  mainWindow.loadURL("http://localhost:3000");

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  // Start Next.js production server
  nextProcess = spawn("npm", ["run", "start"], {
    shell: true,
  });

  // Wait for server to boot
  setTimeout(createWindow, 5000);
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});