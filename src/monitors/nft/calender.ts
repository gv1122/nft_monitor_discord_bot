import axios from "axios";

export function calender() {
	const time = Date.now();
	console.log(`https://api.nftgo.io/api/v1/drop/projects?startTime=${time}`);
	axios.get(`https://api.nftgo.io/api/v1/drop/projects?startTime=${time}`, {
		headers: {
			"accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
			"accept-language": "en-US,en;q=0.9",
			"cache-control": "max-age=0",
			"sec-ch-ua": "\" Not A;Brand\";v=\"99\", \"Chromium\";v=\"101\", \"Google Chrome\";v=\"101\"",
			"sec-ch-ua-mobile": "?0",
			"sec-ch-ua-platform": "\"macOS\"",
			"sec-fetch-dest": "document",
			"sec-fetch-mode": "navigate",
			"sec-fetch-site": "none",
			"sec-fetch-user": "?1",
			"upgrade-insecure-requests": "1",
		}
	}).then((res) => {
		const data = res.data.data.projects;

		const projects: any = [];

		for (const d of data) {
			const begin = parseInt((time / 1000).toString());
			const end = parseInt(((time / 1000) + 86400).toString());
			const projectTime = parseInt((d.startTime / 1000).toString());

			if (projectTime >= begin && projectTime <= end) {
				const fields: any = [];

				if (d.price) {
					fields.push({
						name: "Price",
						value: `${d.price}`,
					});
				}
				if (d.total) {
					fields.push({
						name: "Stock",
						value: `${d.total}`,
					});
				}
				if (d.discord) {
					fields.push({
						name: "Discord",
						value: `${d.discord}`,
					});
				}
				if (d.twitter) {
					fields.push({
						name: "Twitter",
						value: `${d.twitter}`,
					});
				}
				if (d.mintLink) {
					fields.push({
						name: "Mint",
						value: `${d.mintLink}`,
					});
				}

				projects.push({
					"content": null,
					"embeds": [
						{
							"title": `[${d.name}](${d.link})`,
							"description": `<t:${d.startTime / 1000}>\n`+ d.desc,
							"color": 6893989,
							"fields": fields,
							"footer": {
								"text": "Monitors",
								"icon_url": process.env.BOT_IMG || "https://media-www.partycity.ca/product/seasonal-gardening/party-city-everyday/party-city-party-supplies-decor/8536906/the-child-lunch-napkins-16ct-mandalorian-bd9d20f1-591a-4e4a-8c9f-9b374af50823-jpgrendition.jpg?imdensity=1&imwidth=1244&impolicy=mZoom"
							},
							"thumbnail": {
								"url": d.logo
							}
						}
					],
					"username": "Monitors",
					"avatar_url": process.env.BOT_IMG || "https://media-www.partycity.ca/product/seasonal-gardening/party-city-everyday/party-city-party-supplies-decor/8536906/the-child-lunch-napkins-16ct-mandalorian-bd9d20f1-591a-4e4a-8c9f-9b374af50823-jpgrendition.jpg?imdensity=1&imwidth=1244&impolicy=mZoom",
				});


			}
		}
	}).catch((err) => {
		console.log(`Error: ${err.response.status}`);
	});
}


calender();