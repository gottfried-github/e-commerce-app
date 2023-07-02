import api from '../../../e-commerce-api/src/client/index.js'
import Main from '../../../e-commerce-front-end/src/visitor.js'
import '../../../e-commerce-front-end/src/styles/visitor.scss'

import './visitor.html'

function main() {
    Main(document.querySelector('.root'), api.visitor)
}

document.addEventListener('DOMContentLoaded', main)
