import axios from "axios";
import fs from "fs";

let recentItems: any = {};
const configFile = JSON.parse(fs.readFileSync("./config.json", "utf8"));

function sendWebhook(data: any) {
	let mintedData = "";
	let boughtData = "";
	let soldData = "";
	const fields: any = [];

	if (data.mints.length !== 0) {
		data.mints.forEach((mint: any) => {
			mintedData += `__[${mint.contract.openSeaData.name}](${mint.contract.openSeaData.external_link})__ - ${mint.count} minted\n`;
		});
		fields.push({
			"name": "Most Minted",
			"value": mintedData
		});
	}

	if (data.buys.length !== 0) {
		data.buys.forEach((buy: any) => {
			boughtData += `__[${buy.contract.openSeaData.name}](${buy.contract.openSeaData.external_link})__ - ${buy.count} bought\n`;
		});
		fields.push({
			"name": "Most Bought",
			"value": boughtData
		});
	}

	if (data.sells.length !== 0) {
		try {
			data.sells.forEach((sell: any) => {
				soldData += `__[${sell.contract.openSeaData.name}](${sell.contract.openSeaData.external_link})__ - ${sell.count} sold\n`;
			});
			fields.push({
				"name": "Most Sold",
				"value": soldData
			});
		} catch {
			console.log("error in overivew");
		}

	}

	axios.request({
		method: "POST",
		url: configFile.mobyOverview,
		headers: {
			"Content-Type": "application/json",
		},
		data: {
			"content": null,
			"embeds": [
				{
					"title": "NFT Overview - Last 5 Minutes",
					"timestamp": new Date().toISOString(),
					"color": 6893989,
					"fields": fields,
					"footer": {
						"text": "Monitors",
						"icon_url": process.env.BOT_IMG || "https://media-www.partycity.ca/product/seasonal-gardening/party-city-everyday/party-city-party-supplies-decor/8536906/the-child-lunch-napkins-16ct-mandalorian-bd9d20f1-591a-4e4a-8c9f-9b374af50823-jpgrendition.jpg?imdensity=1&imwidth=1244&impolicy=mZoom"
					},
				}
			],
			"username": "Monitors",
			"avatar_url": process.env.BOT_IMG || "https://media-www.partycity.ca/product/seasonal-gardening/party-city-everyday/party-city-party-supplies-decor/8536906/the-child-lunch-napkins-16ct-mandalorian-bd9d20f1-591a-4e4a-8c9f-9b374af50823-jpgrendition.jpg?imdensity=1&imwidth=1244&impolicy=mZoom",
		}
	});
}

export function getRecentMobyOverview() {
	axios.get("https://moby-api.onrender.com/wallets/overview/whales", {
		headers: {
			"Content-Type": "application/json",
			"Authorization": `Bearer ${process.env.MOBY_API_KEY}` || ""
		},
	}).then((response: any) => {
		recentItems = response.data.data;
	});
}

export function mobyOverview() {
	axios.get("https://moby-api.onrender.com/wallets/overview/whales", {
		headers: {
			"Content-Type": "application/json",
			"Authorization": `Bearer ${process.env.MOBY_API_KEY}` || ""
		},
	}).then((response: any) => {
		const mobyData = response.data.data;
		if (mobyData !== recentItems) {
			sendWebhook(mobyData);
		}
	});
}



