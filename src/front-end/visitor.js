import api from '../../../fi-api/src/client/index.js'
import Main from '../../../fi-front-end/src/visitor.js'

import './visitor.html'

function main() {
    Main(api.visitor)
}

document.addEventListener('DOMContentLoaded', main)
