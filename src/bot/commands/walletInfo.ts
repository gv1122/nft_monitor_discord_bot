import TlsClient from "../../client/index";


export async function walletInfo(address: any) {
	try {
		const client = new TlsClient("chrome_91", "");
		await client.initialize();

		const addyInfo = {};
		const walletInfo = await client.get(`https://api.nftgo.io/api/v1/profile/metrics?address=${address}`, {
			"accept": "*/*",
			"accept-encoding": "gzip, deflate, br",
			"accept-language": "en-US,en;q=0.9",
			"content-type": "text/plain;charset=UTF-8",
			"sec-ch-ua": "\" Not;A Brand\";v=\"99\", \"Google Chrome\";v=\"97\", \"Chromium\";v=\"97\"",
			"sec-ch-ua-mobile": "?0",
			"sec-ch-ua-platform": "\"Windows\"",
			"sec-fetch-dest": "empty",
			"sec-fetch-mode": "cors",
			"sec-fetch-site": "same-origin",
			"user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.71 Safari/537.36",
		});
		const nfts = await client.get(`https://nftgo.io/api/v1/nft-search?addresses=ETH-${address}`, {
			"accept": "*/*",
			"accept-encoding": "gzip, deflate, br",
			"accept-language": "en-US,en;q=0.9",
			"content-type": "text/plain;charset=UTF-8",
			"sec-ch-ua": "\" Not;A Brand\";v=\"99\", \"Google Chrome\";v=\"97\", \"Chromium\";v=\"97\"",
			"sec-ch-ua-mobile": "?0",
			"sec-ch-ua-platform": "\"Windows\"",
			"sec-fetch-dest": "empty",
			"sec-fetch-mode": "cors",
			"sec-fetch-site": "same-origin",
			"user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.71 Safari/537.36",
		});
		const collections = await client.get(`https://api.nftgo.io/api/v1/collections/holding?addresses=ETH-${address}`, {
			"accept": "*/*",
			"accept-encoding": "gzip, deflate, br",
			"accept-language": "en-US,en;q=0.9",
			"content-type": "text/plain;charset=UTF-8",
			"sec-ch-ua": "\" Not;A Brand\";v=\"99\", \"Google Chrome\";v=\"97\", \"Chromium\";v=\"97\"",
			"sec-ch-ua-mobile": "?0",
			"sec-ch-ua-platform": "\"Windows\"",
			"sec-fetch-dest": "empty",
			"sec-fetch-mode": "cors",
			"sec-fetch-site": "same-origin",
			"user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.71 Safari/537.36",
		});


		addyInfo["walletValue"] = JSON.parse(walletInfo.body).data.value;
		addyInfo["nftAmnt"] = JSON.parse(nfts.body).data.total;
		addyInfo["collectionAmnt"] = JSON.parse(collections.body).data.total;

		addyInfo["nfts"] = [];

		for (let i = 0; i < 5; i++) {
			try {
				const nft = JSON.parse(collections.body).data.collections[i];
				addyInfo["nfts"].push({
					"name": nft.name,
					"openseaLink": nft.openseaLink
				});

				for (const media in nft.media) {
					addyInfo["nfts"][nft.name][media] = nft.media[media];
				}
			} catch {
				break;
			}

		}

		return addyInfo;
	} catch {
		return {
			"error": "Error fetching data"
		};
	}
}