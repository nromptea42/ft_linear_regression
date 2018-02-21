const fs = require('fs');

function parseMyFile() {
	const parsedFile = [];
	if (fs.existsSync('./data')) {
  		const myFile = fs.readFileSync('./data', 'utf8');
  		const line = myFile.split('\n');
  		line.forEach(nb => {
  			const tmpTab = nb.split(';');
  			parsedFile.push({km: tmpTab[0], price: tmpTab[1]});
  		})
  		return (parsedFile);
	}
	console.log("No data file")
	return ;
}

function normalizeDatas(datas) {
	const normalizeValue = 10000;
	datas.forEach(data => {
		data.km /= normalizeValue;
		data.price /= normalizeValue;
	});
	return datas;
}
function featureScaling(data) {

	const X = [];
	for (var i = 0; i < data.length; i++){ X.push(data[i].km); }

	var min = Math.min(...X);
	var max = Math.max(...X);

	const scale = max - min;

	for (var i = 0; i < data.length; i++){
		data[i].km = (data[i].km - min) / scale;
	}
	return scale;
}

function estimate(mileage, t0, t1) {
	return Number(t0) + (Number(t1) * Number(mileage));
}

function sumTetaZero(datas, t0, t1) {
	let sum = 0;
	datas.forEach(data => {
		sum += (estimate(data.km, t0, t1) - data.price);
	})
	return sum;
}

function sumTetaUn(datas, t0, t1) {
	let sum = 0;
	datas.forEach(data => {
		sum += (estimate(data.km, t0, t1) - data.price) * data.km;
	})
	return sum;
}

function guessTeta(datas) {
	const scale = featureScaling(datas);
	const learningRate = 0.1;
	let tmpT0 = 1.0;
	let tmpT1 = 1.0;
	let t0 = 0.0;
	let t1 = 0.0;
	const precision = 0.001;
	var i = 0;
	while (true) {
		i++;
		if (Math.abs(tmpT0) < precision && Math.abs(tmpT1) < precision) {
			break;
		}
		if (tmpT0 == Infinity || tmpT1 == Infinity || t0 == Infinity || t1 == Infinity) {
			break;
		}
		const sumT0 = sumTetaZero(datas, t0, t1);
		const sumT1 = sumTetaUn(datas, t0, t1);
		tmpT0 = learningRate * (1 / datas.length) * sumT0;
		tmpT1 = learningRate * (1 / datas.length) * sumT1;
		t0 -= tmpT0;
		t1 -= tmpT1;
	}
	t1 /= scale;
	fs.writeFileSync('./model', t0 + ";" + t1);
}

datas = parseMyFile();
guessTeta(datas);