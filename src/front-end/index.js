import Main from '../../../fi-front-end/src/admin.js'
import './index.html'

function main() {
    Main(document.querySelector('#main'))
}

document.addEventListener('DOMContentLoaded', main)