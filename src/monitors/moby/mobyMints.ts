import axios from "axios";
import * as fs from "fs";

const configFile = JSON.parse(fs.readFileSync("./config.json", "utf8"));

function sendWebhook(data: any) {
	axios.request({
		method: "POST",
		url: configFile.mobyMints,
		headers: {
			"Content-Type": "application/json",
		},
		data: {
			"content": null,
			"embeds": [
				{
					"title": "Hot Mints",
					"timestamp": new Date().toISOString(),
					"color": 6893989,
					"fields": data,
					"footer": {
						"text": "Monitors",
						"icon_url": process.env.BOT_IMG || "https://media-www.partycity.ca/product/seasonal-gardening/party-city-everyday/party-city-party-supplies-decor/8536906/the-child-lunch-napkins-16ct-mandalorian-bd9d20f1-591a-4e4a-8c9f-9b374af50823-jpgrendition.jpg?imdensity=1&imwidth=1244&impolicy=mZoom"
					},
					"thumbnail": {
						"url": process.env.BOT_IMG || "https://media-www.partycity.ca/product/seasonal-gardening/party-city-everyday/party-city-party-supplies-decor/8536906/the-child-lunch-napkins-16ct-mandalorian-bd9d20f1-591a-4e4a-8c9f-9b374af50823-jpgrendition.jpg?imdensity=1&imwidth=1244&impolicy=mZoom"
					}
				}
			],
			"username": "Monitors",
			"avatar_url": process.env.BOT_IMG || "https://media-www.partycity.ca/product/seasonal-gardening/party-city-everyday/party-city-party-supplies-decor/8536906/the-child-lunch-napkins-16ct-mandalorian-bd9d20f1-591a-4e4a-8c9f-9b374af50823-jpgrendition.jpg?imdensity=1&imwidth=1244&impolicy=mZoom",
		}
	});
}


export function mobyMints() {
	axios.get("https://moby-api.onrender.com/rank/1h", {
		headers: {
			"Authorization": `Bearer ${process.env.MOBY_API_KEY}` || ""
		}
	}).then(resp => {
		const fields: any = [];

		for (let i = 0; i < 5; i++) {
			const data = resp.data.data[i];
			fields.push({
				"name": `${data.contract.openSeaData.name}`,
				"value": `[Opensea](https://opensea.io/collection/${data.contract.openSeaData.collection.slug})\nMints: \`${data.count}\`\nUnique Minters: \`${data.unique}\``,
			});
		}

		sendWebhook(fields);
	});
}