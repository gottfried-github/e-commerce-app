import Main from '../../../e-commerce-front-end/src/admin.js'
import '../../../e-commerce-front-end/src/styles/admin.scss'

import api from '../../../e-commerce-api/src/client/index.js'

import './admin.html'

function main() {
    Main(document.querySelector('#main'), api.admin)
}

document.addEventListener('DOMContentLoaded', main)