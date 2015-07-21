
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');

var mongoose   = require('mongoose');
mongoose.connect('mongodb://admin:tester@ds059722.mongolab.com:59722/expensedb');

var Expense     = require('./app/models/expense');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;        // set our port


var router = express.Router();              
router.use(function(req, res, next) {
    // do logging
    console.log('Something is happening.');
    next(); // make sure we go to the next routes and don't stop here
});

router.get('/', function(req, res) {
    res.json({ message: 'api running'});   
});

router.route('/db').post(function(req, res) {
        
        var expense = new Expense();      
        expense.name = req.body.name;  
        expense.save(function(err) {
            if (err)
                res.send(err);

           res.json({ message: 'Expense created!' });
        });
        
    });

router.route('/db').get(
	function(req, res) {

        	Expense.find(function(err, expenses) {
            if (err)
                res.send(err);

            res.json(expenses);
        });
    });

router.route('/db/:expense_id').get(function(req, res){
		 Expense.findById(req.params.expense_id, function(err, expense) {
            if (err)
                res.send(err);
            res.json(expense);
        });
	});

router.route('/db/:expense_id').put(function(req, res){
	    Expense.findById(req.params.expense_id, function(err, expense) {

            if (err)
                res.send(err);

            if(expense !== null){

            expense = req.body;  // update the expenses info

            // save the expense
            expense.save(function(err) {
                if (err)
                    res.send(err);

                res.json({ message: 'Expence updated!' });
            });
        }    
        });
});

app.use('/api', router);

app.listen(port);
console.log('Running on ' + port);