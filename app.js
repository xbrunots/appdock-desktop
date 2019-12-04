 const electron = require('electron');

 const { app, ipcMain, BrowserWindow } = electron;

 const path = require('path')
 const url = require('url')

 var sql = require('./config/mysql');
 var tables = require('./config/tables');

 let window = null
 let splash = null

 // Wait until the app is ready
 app.once('ready', () => {
     createWindows()
 })

 function createWindows() {

     let screen = electron.screen;
     /*  splash = new BrowserWindow({
           width: 500,
           height: 300,
           show: true,
           resizable: false,
           webPreferences: {
               devTools: false
           }
       });
       splash.setMenu(null)*/
     window = new BrowserWindow({
             titleBarStyle: 'hidden',
             width: 500,
             height: 400,
             show: false,
             resizable: true,
             slashes: true,
             icon: path.join(__dirname, 'assets/logo_normal.png')
                 // webPreferences: {
                 //   devTools: false
                 // }
         }) // window.setMenu(null)


     const WINDOW_WIDTH = 450;
     const WINDOW_HEIGHT = 300;

     //Definindo centro da tela principal
     let bounds = screen.getPrimaryDisplay().bounds;
     let x = Math.ceil(bounds.x + ((bounds.width - WINDOW_WIDTH) / 2));
     let y = Math.ceil(bounds.y + ((bounds.height - WINDOW_HEIGHT) / 2));

     splash = new BrowserWindow({
         titleBarStyle: 'hidden',
         width: WINDOW_WIDTH,
         height: WINDOW_HEIGHT,
         x: x,
         y: y,
         center: true,
         frame: false,
         alwaysOnTop: true,
         maximizable: false,
         minimizable: false,
         fullscreenable: false,
         skipTaskbar: true,
         titleBarStyle: 'hiddenInset',
         icon: path.join(__dirname, 'assets/logo_normal.png'),
         vibrancy: 'dark',

     });
     //  splash.setMenu(null)

     splash.center();

     //    window.maximize() 
     window.loadURL(url.format({
         pathname: path.join(__dirname, 'index.html'),
         protocol: 'file:',
         slashes: true
     }))

     splash.loadURL(url.format({
         pathname: path.join(__dirname, 'splash.html'),
         protocol: 'file:',
         slashes: true
     }))

     window.once('ready-to-show', () => {
         // window.show();
         // window.maximize()
         setTimeout(function() {
             splash.close();
             window.maximize()
             window.show();
         }, 3000);
     })

 }

 function addChildren(arg) {}
 ipcMain.on('btnclick', (arg) => {
     addChildren(arg)
 })