import axios from "axios";

export async function getCollectionStats(slug) {
	const returnData = {};

	let address = await axios.get(`https://moby-api.onrender.com/search/${slug}/contract`);
	address = address.data.contracts[0].address;

	const stats = await axios.get(`https://moby-api.onrender.com/collection/${address}/overview/1h`);
	const openseaData = await axios.request({
		"url": `https://moby-api.onrender.com/contract/${address}`,
		"headers": {
			"accept": "*/*",
			"accept-language": "en-US,en;q=0.9",
			"authorization": `Bearer ${process.env.MOBY_API_KEY}`,
		},
		"method": "GET"
	});

	if (stats.data.stats.current !== undefined) {
		const currentData = stats.data.stats.current;

		if (currentData.volume !== undefined) {
			returnData["volume"] = currentData.volume;
		} else {
			returnData["volume"] = "N/A";
		}
		if (currentData.sales !== undefined) {
			returnData["salesAmnt"] = currentData.sales;
		} else {
			returnData["salesAmnt"] = "N/A";
		}
		if (currentData.sales_floor !== undefined) {
			returnData["salesFloor"] = currentData.sales_floor;
		} else {
			returnData["salesFloor"] = "N/A";
		}
		if (currentData.listing_count !== undefined) {
			returnData["listedAmnt"] = currentData.listing_count;
		} else {
			returnData["listedAmnt"] = "N/A";
		}
		if (currentData.list_floor !== undefined) {
			returnData["floor"] = currentData.list_floor;
		} else {
			returnData["floor"] = "N/A";
		}
	}

	if (openseaData.data.contract.openSeaData !== undefined) {
		const openSeaData = openseaData.data.contract.openSeaData;

		if (openSeaData.image_url !== undefined) {
			returnData["image"] = openSeaData.image_url;
		} else if (openSeaData.collection.image_url !== undefined) {
			returnData["image"] = openSeaData.collection.image_url;
		} else {
			returnData["image"] = process.env.BOT_IMG || "https://media-www.partycity.ca/product/seasonal-gardening/party-city-everyday/party-city-party-supplies-decor/8536906/the-child-lunch-napkins-16ct-mandalorian-bd9d20f1-591a-4e4a-8c9f-9b374af50823-jpgrendition.jpg?imdensity=1&imwidth=1244&impolicy=mZoom";
		}
		if (openSeaData.name !== undefined) {
			returnData["name"] = openSeaData.name;
		} else {
			returnData["name"] = address;
		}
		if (openSeaData.external_link !== undefined) {
			returnData["link"] = openSeaData.external_link;
		} else if (openSeaData.collection.external_link !== undefined) {
			returnData["link"] = openSeaData.collection.external_link;
		} else {
			returnData["link"] = "N/A";
		}
		if (openSeaData.collection.discord_url !== undefined) {
			returnData["discord"] = openSeaData.collection.discord_url;
		} else {
			returnData["discord"] = "N/A";
		}
		if (openSeaData.collection.slug !== undefined) {
			returnData["slug"] = `https://opensea.io/collection/${openSeaData.collection.slug}`;
		} else {
			returnData["slug"] = "https://opensea.io";
		}
		if (openSeaData.collection.twitter_username !== undefined) {
			returnData["twitter"] = openSeaData.collection.twitter_username;
		} else {
			returnData["twitter"] = "N/A";
		}

	}

	/*
	const fields: any = [];

	for (const key in returnData.nfts) {
		fields.push({
			name: returnData.nfts[key].name,
			value: returnData.nfts[key].openseaLink,
			inline: false
		});
	}

	const statsEmbed = new MessageEmbed()
		.setColor("#6931a5")
		.setTitle(`${returnData.name ? returnData.name : address} info`)
		.setURL(returnData.slug)
		.setDescription(`Balance: **${walletData.walletValue.toFixed(2)}Ξ**\n__Collections Owned__: ${walletData.collectionAmnt}\n__NFTs Owned__: ${walletData.nftAmnt}\n`)
		.setThumbnail(returnData.image)
		.addFields(fields)
		.setTimestamp()
		.setFooter({
			text: "Helper",
			iconURL: process.env.BOT_IMG || "https://media-www.partycity.ca/product/seasonal-gardening/party-city-everyday/party-city-party-supplies-decor/8536906/the-child-lunch-napkins-16ct-mandalorian-bd9d20f1-591a-4e4a-8c9f-9b374af50823-jpgrendition.jpg?imdensity=1&imwidth=1244&impolicy=mZoom"
		});
	*/
}