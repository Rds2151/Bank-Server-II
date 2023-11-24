var express = require("express");
const server = require("../models/server")

var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
    res.render("index", { title: "Express" });
});

router.post("/api/addAccount", (req, res, next) => {
	const accountName = req.body.accountName
    const accountNumber = parseInt(req.body.accountNumber)
    const accountType = req.body.accountType
    const balance = parseInt(req.body.balance)

	server.getAccount(accountNumber)
		.then((result) => {
			if ( result != null) {
				res.render("index", { flag : "addAccount", message: "Error: Account number already exists." });
			} else {
				server.createAccount(accountName,accountNumber,accountType,balance)
					.then((result) => {
						res.render("index", { flag : "addAccount", message: "Account created successfully!" });
					})
					.catch((error) => {
						res.render("index", { flag : "addAccount", message: error });
					})
			}
		});
});

router.post("/api/viewAccount/", (req, res, next) => {
    const accountNumber = parseInt(req.body.accountNumber)
    
	server.getAccount(accountNumber)
		.then((result) => {
			if ( result === null) {
				throw new Error(`No account found with Account Number: ${req.body.accountNumber}`)
			}
			console.log(result)
			res.render("index", { flag: "viewAccount", account: result });
		})	
		.catch((error) => {
			res.render("index", { flag: "viewAccount", message:error, account: null });
		})
});

router.post("/api/sendMoney", (req,res,next) => {
    const senderNumber = parseInt(req.body.senderNumber);
    const receiverNumber = parseInt(req.body.receiverNumber);
    const amount = req.body.amount;

	server.transferMoney(senderNumber,receiverNumber,amount)
		.then((result) => {
			if (result == true) {
				result = "Transaction successful. Money sent."
				res.render("index", { flag: "sendMoney",  message: result});
			} else {
				throw new Error(result)
			}
		})
		.catch((error) => {
			res.render("index", { flag: "sendMoney",  message: error});
		})
})

router.get("/api/viewAllAccount", (req, res, next) => {
	server.getAllAccount()
		.then((result) => {
			if(result.length > 0) {
				res.render("index", { flag: "viewAllAccount", data: result });
			} else {
				throw new Error("")
			}
		})
		.catch((error) => {
			res.render("index", { flag: "viewAllAccount" });
		})
});


router.post("/api/deleteAccount/", (req, res, next) => {
    const accountNumber = parseInt(req.body.accountNumber)

	server.deleteAccount(accountNumber)
		.then((result) => {
			if (result.deletedCount > 0) {
				res.render("index", { flag: "deleteAccount", message: `Account with Account Number ${req.body.accountNumber} deleted successfully`});
			} else {
				throw new Error("");
			}
		})
		.catch((error) => {
			res.render("index", { flag: "deleteAccount",message: `No account found with Account Number: ${req.body.accountNumber}`});	
		});
});

module.exports = router;
