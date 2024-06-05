import axios from 'axios'
import Noty from  'noty'
import { initAdmin } from './admin'
import moment from 'moment'

let addToCart = document.querySelectorAll('.add-to-cart')
let cartCounter = document.querySelector('#cartCounter')


function updateCart(bakeryitem) {
    axios.post('/update-cart', bakeryitem).then(res => {
        cartCounter.innerText = res.data.totalQty
        new Noty({
            type: 'success',
            timeout: 800,         //1000 ms= 1 sec
            text: 'Item added to Cart',
            progressBar: true
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

// remove alerts message after x seconds

const alertMsg = document.querySelector('#success-alert')
if(alertMsg) {
    setTimeout(() => {
        alertMsg.remove()
    },2000)
}



//  Change order status

let statuses = document.querySelectorAll('.status_line')
let hiddenInput = document.querySelector('#hiddenInput') 

let order = document.querySelector('#hiddenInput') ? document.querySelector('#hiddenInput').value 
: null
order = JSON.parse(order)
let time = document.createElement('small')



function updateStatus(order) {
    statuses.forEach((status) => {
        status.classList.remove('step-completed')
        status.classList.remove('current')
    })
    let stepCompleted = true;
    statuses.forEach((status) => {
        let dataProp = status.dataset.status
        if(stepCompleted) {
            status.classList.add('step-completed')
        }
        if(dataProp === order.status) {
            stepCompleted = false
            time.innerText = moment(order.updatedAt).format('hh:mm A')
            status.appendChild(time)
            if(status.nextElementSibling) {
                status.nextElementSibling.classList.add('current')
            }
          
        }
    })
}

updateStatus(order);


// Ajax call
const paymentForm = document.querySelector('#payment-form');

if(paymentForm){
    paymentForm.addEventListener('submit', (e)=> {
        e.preventDefault();
        let formData = new FormData(paymentForm);
        let formObject = {}
    
        for(let [key, value] of formData.entries()){
            formObject[key]=value;
        }
        
        axios.post('/orders', formObject).then((res)=> {
            new Noty({
                type: 'success',
                timeout: 800,         //1000 ms= 1 sec
                text: res.data.message,
                progressBar: true
               // layout: 'topleft'   to put it on left side of home page.
            }).show();

            setTimeout(()=> {
                window.location.href = '/customer/orders';
            }, 1000);
            
        }).catch((err)=> {
            console.log(err);
        })
    })
}











// socket
let socket = io()
initAdmin(socket)

// join
if(order) {
    socket.emit('join', `order_${order._id}`)
}

let adminAreaPath = window.location.pathname
console.log(adminAreaPath)

if(adminAreaPath.includes('admin')) {
    socket.emit('join', 'adminRoom')

}

socket.on('orderUpdated', (data) => {
    const updatedOrder = { ...order }
    updatedOrder.updatedAt = moment().format()
    updatedOrder.status = data.status
    updateStatus(updatedOrder)
    new Noty({
        type: 'success',
        timeout: 800,         //1000 ms= 1 sec
        text: 'Order Updated',
        progressBar: false,
       // layout: 'topleft'   to put it on left side of home page.
    }).show();
})

