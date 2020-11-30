import axios from 'axios'
import Noty from  'noty'

let addToCart = document.querySelectorAll('.add-to-cart')
let cartCounter = document.querySelector('#cartCounter')


function updateCart(bakeryitem) {
    axios.post('/update-cart', bakeryitem).then(res => {
        cartCounter.innerText = res.data.totalQty
        new Noty({
            type: 'success',
            timeout: 800,         //1000 ms= 1 sec
            text: 'Item added to Cart',
            progressBar: false
           // layout: 'topleft'   to put it on left side of home page.
        }).show();

    }).catch(err => {
        new Noty({
            type: 'error',
            timeout: 800,         //1000 ms= 1 sec
            text: 'Something went wrong.',
            progressBar: false
        }).show();       
    })
}

addToCart.forEach((btn) => {
    btn.addEventListener('click', (e) => {
        let bakeryitem = JSON.parse(btn.dataset.bakeryitem)
        updateCart(bakeryitem)
    })
})