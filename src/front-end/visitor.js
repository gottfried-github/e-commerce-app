import api from '../../../fi-api/src/client/index.js'
import Main from '../../../fi-front-end/src/visitor.js'
import '../../../fi-front-end/src/styles/visitor.scss'

import './visitor.html'

function main() {
    Main(document.querySelector('.root'), api.visitor)
}

document.addEventListener('DOMContentLoaded', main)
