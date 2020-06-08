var http = require("http")
var fs = require("fs")
var jimp = require("jimp")
var errorLog = []
var qrWidth = 132
var camScale = 1.5 //3ds camera is 5:3 res
var qrCount = 96 //96 QR codes. It's a lot....

function getFileURL(number) {
	return "http://www.bandaigames.channel.or.jp/list/digimon_game/world_re_digitize/3ds/img/special/02/nm" + number + "_qr.jpg"
}

async function formatQR(i) {
	var formattedNumber = ("0" + i).slice(-2)
	var image = await jimp.read(getFileURL(formattedNumber))
	var wSize = 500*camScale
	var hSize = 300*camScale
	var background = await new jimp(wSize, hSize, "white")
	await background.composite(image, (wSize/2)-(qrWidth/2), hSize/2-(qrWidth/2))
	await background.writeAsync("QR/"+formattedNumber+".png")
}


function downloadQR() {
	(async()=>{
		for (var i=1;i<=qrCount;i++) {
			await formatQR(i)
		}
	})()
}

downloadQR()

//currently unused
function writeErrorLog() {
	const writeStream = fs.createWriteStream("errors.txt")
	const pathName = writeStream.path
	var array = errorLog
	array.unshift("Error log")
	array.forEach(value => writeStream.write(`${value}\n`))
	writeStream.on("finish", () => {
	   console.log(`wrote error data to ${pathName}`)
	})
	writeStream.on("error", (err) => {
		console.error(`error writing to ${pathName} => ${err}`)
	})
	writeStream.end()
}