const ipc = require('electron').ipcRenderer

const loadCSVBtn = document.getElementById('load_csv')

loadCSVBtn.addEventListener('click', function (event) {
    ipc.send('load_csv')
})

ipc.on('csv_data', function (event, csv_data) {
    document.getElementById('csv_data').innerHTML = csv_data
})