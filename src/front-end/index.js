import Main from '../../../fi-front-end/src/admin.js'
import '../../../fi-front-end/src/styles/index.scss'

import api from '../../../fi-api/src/client/index.js'

import './index.html'

function main() {
    Main(document.querySelector('#main'), api)
}

document.addEventListener('DOMContentLoaded', main)