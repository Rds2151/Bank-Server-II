const Bank = require("./BankServer")
// const promise = new Promise();

exports.getAccount = (accountNumber) => {
    return Bank.findOne({AccountNumber: accountNumber});
}

exports.deleteAccount = (accountNumber) => {
    return Bank.deleteMany({AccountNumber:accountNumber});
}

exports.createAccount = (accountName,accountNumber,accountType,balance) => {
    const Account = new Bank({
        AccountName: accountName,
        AccountNumber: accountNumber,
        AccountType: accountType,
        Balance: balance,
    });

    return Account.save()
}

exports.getAllAccount = () => {
    return Bank.find();
};

exports.transferMoney = async (sender, receiver, amt) => {
    try {
        const senderAccount = await Bank.findOne({ AccountNumber: sender });
        const receiverAccount = await Bank.findOne({ AccountNumber: receiver });

        if (!senderAccount || !receiverAccount) {
            throw new Error('Invalid sender or receiver account number');
        }

        if (senderAccount.Balance < amt) {
            throw new Error('Insufficient funds');
        }

        await Bank.findOneAndUpdate({ AccountNumber: sender }, { $inc: { Balance: -amt } });
        await Bank.findOneAndUpdate({ AccountNumber: receiver }, { $inc: { Balance: amt } });

        return true
    } catch (error) {
        return error.message
    }
};