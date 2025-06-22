import axios from "axios";
import * as fs from "fs";

const recentItems: any = [];
const configFile = JSON.parse(fs.readFileSync("./config.json", "utf8"));

function removeItemAll(arr, value) {
	let i = 0;
	while (i < arr.length) {
		if (arr[i] === value) {
			arr.splice(i, 1);
		} else {
			++i;
		}
	}
	return arr;
}

function sendWebhook(data: any) {
	data.unixTime = data.unixTime.substring(0, data.unixTime.length - 3);

	const fields = [
		data.unixTime !== null ? {
			name: "Unix Time:",
			value: `<t:${data.unixTime}>`
		} : null,
		data.price !== null ? {
			name: "Price:",
			value: data.price,
		} : null,
		data.openseaCollectionLink !== null ? {
			name: "Opensea Collection Link:",
			value: data.openseaCollectionLink,
		} : null,
		data.websiteLink !== null ? {
			name: "Website Link:",
			value: data.websiteLink,
		} : null
	];
	removeItemAll(fields, null);

	axios.request({
		method: "POST",
		url: configFile.mobyAlerts,
		headers: {
			"Content-Type": "application/json",
		},
		data: {
			"content": null,
			"embeds": [
				{
					"title": `${data.user} ${data.action} ${data.asset}`,
					"url": data.etherscan,
					"color": 6893989,
					"fields": fields,
					"footer": {
						"text": "Monitors",
						"icon_url": process.env.BOT_IMG || "https://media-www.partycity.ca/product/seasonal-gardening/party-city-everyday/party-city-party-supplies-decor/8536906/the-child-lunch-napkins-16ct-mandalorian-bd9d20f1-591a-4e4a-8c9f-9b374af50823-jpgrendition.jpg?imdensity=1&imwidth=1244&impolicy=mZoom"
					},
					"thumbnail": {
						"url": data.image
					}
				}
			],
			"username": "Monitors",
			"avatar_url": process.env.BOT_IMG || "https://media-www.partycity.ca/product/seasonal-gardening/party-city-everyday/party-city-party-supplies-decor/8536906/the-child-lunch-napkins-16ct-mandalorian-bd9d20f1-591a-4e4a-8c9f-9b374af50823-jpgrendition.jpg?imdensity=1&imwidth=1244&impolicy=mZoom",
		}
	}).catch(() => {
		console.log({
			"content": null,
			"embeds": [
				{
					"title": `${data.user} ${data.action} ${data.asset}`,
					"url": data.etherscan,
					"color": 6893989,
					"fields": fields,
					"footer": {
						"text": "Monitors",
						"icon_url": process.env.BOT_IMG || "https://media-www.partycity.ca/product/seasonal-gardening/party-city-everyday/party-city-party-supplies-decor/8536906/the-child-lunch-napkins-16ct-mandalorian-bd9d20f1-591a-4e4a-8c9f-9b374af50823-jpgrendition.jpg?imdensity=1&imwidth=1244&impolicy=mZoom"
					},
					"thumbnail": {
						"url": data.image
					}
				}
			],
			"username": "Monitors",
			"avatar_url": process.env.BOT_IMG || "https://media-www.partycity.ca/product/seasonal-gardening/party-city-everyday/party-city-party-supplies-decor/8536906/the-child-lunch-napkins-16ct-mandalorian-bd9d20f1-591a-4e4a-8c9f-9b374af50823-jpgrendition.jpg?imdensity=1&imwidth=1244&impolicy=mZoom",
		});
		console.log(fields);
		console.log(data);
	});
}

export function getRecentMobyAlerts() {
	axios.get("https://moby-api.onrender.com/whales/list",
		{
			headers: {
				"Authorization": `Bearer ${process.env.MOBY_API_KEY}` || ""
			}
		}).then((resp) => {
		const recentData = resp.data.notifications;
		recentData.forEach((item: any) => {
			recentItems.push(item._id);
		});
	});
}

export function mobyAlerts() {
	axios.get("https://moby-api.onrender.com/whales/list",
		{
			headers: {
				"Authorization": `Bearer ${process.env.MOBY_API_KEY}` || ""
			}
		}).then((resp) => {
		const recentData = resp.data.notifications;

		recentData.forEach((item: any) => {
			if (recentItems.includes(item._id)) {
				return;
			}
			recentItems.push(item._id);

			let bodyData = {};

			try {
				if (item.action_type.toLowerCase().includes("minted")) {
					let os: any = null;
					if (item.contract.openSeaData.collection.slug !== undefined) {
						os = `https://opensea.io/collection/${item.contract.openSeaData.collection.slug}`;
					}
					
					bodyData = {
						"unixTime": item.ts.toString(),
						"user": item.nickname,
						"asset": item.contract.openSeaData.name,
						"action": item.action_type.toLowerCase(),
						"price": item.value ? item.value.toString() : null,
						"etherscan": `https://etherscan.io/tx/${item.contract.address}`,
						"image": item.contract.openSeaData.image_url,
						"openseaCollectionLink": os,
						"websiteLink": item.contract.openSeaData.collection.external_link ? item.contract.openSeaData.collection.external_link : null
					};

				} else if (item.action_type.toLowerCase().includes("sold")) {
					let os: any = null;
					if (item.contract.openSeaData.collection.slug !== undefined) {
						os = `https://opensea.io/collection/${item.contract.openSeaData.collection.slug}`;
					}

					bodyData = {
						"unixTime": item.ts.toString(),
						"user": item.nickname,
						"asset": item.contract.openSeaData.name,
						"action": item.action_type.toLowerCase(),
						"price": item.value ? item.value.toString() : null,
						"etherscan": `https://etherscan.io/tx/${item.contract.address}`,
						"image": item.contract.openSeaData.image_url,
						"openseaCollectionLink": os,
						"websiteLink": item.contract.openSeaData.collection.external_link ? item.contract.openSeaData.collection.external_link : null
					};

				} else {

					let os: any = null;
					if (item.contract.openSeaData.collection.slug !== undefined) {
						os = `https://opensea.io/collection/${item.contract.openSeaData.collection.slug}`;
					}

					bodyData = {
						"unixTime": item.ts.toString(),
						"user": item.nickname,
						"asset": item.contract.openSeaData.name,
						"action": item.action_type.toLowerCase(),
						"price": item.value ? item.value.toString() : null,
						"etherscan": `https://etherscan.io/tx/${item.contract.address}`,
						"image": item.contract.openSeaData.image_url,
						"openseaCollectionLink": os,
						"websiteLink": item.contract.openSeaData.collection.external_link ? item.contract.openSeaData.collection.external_link : null
					};
				}
			} catch (e) {
				console.log(e);
				console.log(item);
			}

			sendWebhook(bodyData);
		});

	});
}