import Main from '../../../fi-front-end/src/admin.js'
import '../../../fi-front-end/src/styles/admin.scss'

import api from '../../../fi-api/src/client/index.js'

import './admin.html'

function main() {
    Main(document.querySelector('#main'), api.admin)
}

document.addEventListener('DOMContentLoaded', main)