import axios from "axios";
import fs from "fs";

const configFile = JSON.parse(fs.readFileSync("./config.json", "utf8"));
const BOT_IMG = process.env.BOT_IMG || "https://media-www.partycity.ca/product/seasonal-gardening/party-city-everyday/party-city-party-supplies-decor/8536906/the-child-lunch-napkins-16ct-mandalorian-bd9d20f1-591a-4e4a-8c9f-9b374af50823-jpgrendition.jpg?imdensity=1&imwidth=1244&impolicy=mZoom";

function sendWebhook(data) {
	axios.request({
		method: "POST",
		url: configFile.gasGuzzler,
		headers: {
			"Content-Type": "application/json",
		},
		data: {
			"content": null,
			"embeds": [
				{
					"title": "Highest fees the last 3 hours!",
					"description": data,
					"color": 6893989,
					"footer": {
						"text": "Monitors",
						"icon_url": BOT_IMG
					},
					"thumbnail": {
						"url": BOT_IMG
					}
				}
			],
			"username": "Monitors",
			"avatar_url": BOT_IMG,
		}
	});
}

export function gasGuzzler() {
	axios.get("https://etherscan.io/datasourceHandler?q=gasguzzler&draw=4&columns%5B0%5D%5Bdata%5D=rank&columns%5B0%5D%5Bname%5D=&columns%5B0%5D%5Bsearchable%5D=true&columns%5B0%5D%5Borderable%5D=false&columns%5B0%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B0%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B1%5D%5Bdata%5D=address&columns%5B1%5D%5Bname%5D=&columns%5B1%5D%5Bsearchable%5D=true&columns%5B1%5D%5Borderable%5D=false&columns%5B1%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B1%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B2%5D%5Bdata%5D=txfee_3h&columns%5B2%5D%5Bname%5D=&columns%5B2%5D%5Bsearchable%5D=true&columns%5B2%5D%5Borderable%5D=true&columns%5B2%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B2%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B3%5D%5Bdata%5D=gasused_3h&columns%5B3%5D%5Bname%5D=&columns%5B3%5D%5Bsearchable%5D=true&columns%5B3%5D%5Borderable%5D=true&columns%5B3%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B3%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B4%5D%5Bdata%5D=txfee_24h&columns%5B4%5D%5Bname%5D=&columns%5B4%5D%5Bsearchable%5D=true&columns%5B4%5D%5Borderable%5D=true&columns%5B4%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B4%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B5%5D%5Bdata%5D=gasused_24h&columns%5B5%5D%5Bname%5D=&columns%5B5%5D%5Bsearchable%5D=true&columns%5B5%5D%5Borderable%5D=true&columns%5B5%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B5%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B6%5D%5Bdata%5D=analytics&columns%5B6%5D%5Bname%5D=&columns%5B6%5D%5Bsearchable%5D=true&columns%5B6%5D%5Borderable%5D=false&columns%5B6%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B6%5D%5Bsearch%5D%5Bregex%5D=false&order%5B0%5D%5Bcolumn%5D=2&order%5B0%5D%5Bdir%5D=desc&start=0&length=15&search%5Bvalue%5D=&search%5Bregex%5D=false").then(response => {
		const data = response.data.data;
		const fields: any = [];
		let d = "";

		for (let i = 0; i < 10; i++) {
			try {
				console.log(data[i].address.split("Tag:")[1].split("\">")[0].split("(")[0]);
				const name = data[i].address.split("Tag:")[1].split("\">")[0].split("(")[0];
				const address = data[i].address.split("Tag:")[1].split("\">")[0].split("(")[1].split(")")[0];
				fields.push({
					"name": `[${name}](\`https://etherscan.io/address/${address}\`)`,
					"value": `${data[i].txfee_3h_raw} ETH (${data[i].gasused_3h_raw} gas)`,
					"inline": true
				});

				d += `[${name}](https://etherscan.io/address/${address}) - ${data[i].txfee_3h_raw} ETH (${data[i].gasused_3h_raw} gas)\n`;
			} catch (e) {
				console.log(e);
			}
		}

		sendWebhook(d);
	});
}

gasGuzzler();