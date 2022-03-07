const path = require('path')
const { app, BrowserWindow } = require("electron")
const isDev = !app.isPackaged

const createWindow = () => {
  const win = new BrowserWindow({
    width: 1600,
    height: 900,
    webPreferences: {
      nodeIntegration: false,
    },
  })

  win.loadURL(
    isDev
    ? 'http://localhost:3000'
    : `file://${path.join(__dirname, '../build/index.html')}`
  )

  if (isDev)
  {
    win.webContents.openDevTools({ mode: 'right' })
  }
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin')
  {
    app.quit();
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0)
  {
    createWindow()
  }
})