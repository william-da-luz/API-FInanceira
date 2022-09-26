const express = require("express");

const { v4: uuidv4 } = require("uuid");

const app = express();

app.use(express.json());

const customers = [];


//Middleware
function verifyIfExistsAccountCPF (request, response, netx) {
	const { cpf }= request.headers;

	const customer = customer.find(customer => customer.cpf === cpf);

	if(!customer){
		return response.status(400).json({ error: "customer not found" })
	}

	request.customer = customer;

	return next();

};





function getBalance(statement) {
	//vai pegar todos os valores passados para dentro dele e transforma-los em um só, vai fazer o calculo do que entrou menos o que saiu
	const balance = statment.reduce((acc, operation) => {
		if(operation.type === 'credit') {
			return acc + operation.amount;
		}else {
			return acc - operation.amount;
		}

	}, 0)//o valor inicial que vamos trabalhar

	return balance; 

};





app.post("/account", (request, response) => {
	const { cpf, name } = request.body;

	const customerAlreadyExists = customers.some((customer) => customer.cpf === cpf)

	if(customerAlreadyExists) {
		return response.status(400).json({ error: "custome already Exists!"})
	}

	const id = uuidv4();

	customers.push({
		cpf,
		name,
		id,
		statement: []
	})

	return response.status(201).send();
});
 

//app.use(verifyIfExistsAccountCPF);

app.get("/statement/", verifyIfExistsAccountCPF, (request, response) => {
	const { customer } = request;
	

	return response.json(customer.statement);
});






app.post("deposit", verifyIfExistsAccountCPF, (request, response) => {
	const { description, amount } = request.body;


	//verifica se a conta é valida ou não
	const { customer } = request;

	const statementOperation = {
		description,
		amount,
		created_at: new Date(),
		type: "credit"
	}

	customer.statement.push(statementOperation);

	return response.status(201).send();
});





app.post("/withdraw", verifyIfExistsAccountCPF, (request, response) => {
	const { amount } = request.body;//recebendo a quantia que queremos receber o saque
	const { customer } = request;

	const balance = getBalance(customer.statement);

	if(balance < amount) {
		return response.status(400).json({ error: "Insufficient funds!"})
	}

	const statementOperation = {
		amount,
		created_at: new Date(),
		type: "debit"
	}

	customer.statment.push(statementOperation);

	return response,status(201).send();
});


app.get("statement/date", verifyIfExistsAccountCPF, (request, response) => {
	const { customer } = request;
	const { date } = request.query;

	const dateFormat = new Date(date + " 00:00");

	const statement = customer.satement.filter(
		(statement) => statement.created_at.toDateString() === 
		new Date(dateFormat).toDateString())

	return response.json(statement);


	//atualizar nome so usuario
	app.put("/account", (request, response) => {
		const { name } = request.body;
		const { customer } = request;

		customer.name = name;

		return response,status(201).send();
	})
});

//obter dados da conta

app.get("/account", verifyIfExistsAccountCPF, (request, responde) => {
	const { customer } = request;

	return response.json(customer);
});

app.delete("/account", verifyIfExistsAccountCPF, (request, response) => {
	const { customer } = request;

	//quero remover uma poição apartir do customer
	customers.splice(customer, 1)

	return response.status(200).json(customers);
});


app.get("/balance", verifyIfExistsAccountCPF, (request, response) => {
	const { customer } = request;

	const balance = getBalance(customer.statement);

	return response.json(balance);
});

app.listen(3333); 