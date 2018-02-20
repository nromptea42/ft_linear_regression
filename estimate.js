const readline = require('readline');
const fs = require('fs');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('Mileage ? ', (answer) => {
  
  if (isNaN(answer) === false && answer > 0) {
  	let tabTeta = [0, 0];
  	if (fs.existsSync('./model')) {
  		const myFile = fs.readFileSync('./model', 'utf8');
  		tabTeta = myFile.split(';');
	}
	const price = Number(tabTeta[0]) + Number((tabTeta[1] * answer));
  	console.log("Estimated price is : " + price + " !");
  }

  rl.close();
});