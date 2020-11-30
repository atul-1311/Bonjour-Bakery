const Menu = require('../../models/menu')
function homeController() {
    return {
        index(req, res) {
            Menu.find().then(function(bakeryitems) {
                console.log(bakeryitems)
               return res.render('home', { bakeryitems: bakeryitems })
            })
            

        }


    }


}

module.exports = homeController