/* eslint-disable no-mixed-spaces-and-tabs */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Client } from "@notionhq/client";

const notion = new Client({ auth: "secret_gc0ZENU7QjVXlYBNqEEARufyJycNS7BP3gxvBRduIhh" });

(async () => {
	const response = await notion.pages.create({
		parent: {
			database_id: "bded91d3becc41c79543de951d90876d",
		},
		properties: {
			Name: {
				title: [
					{
						text: {
							content: "testing",
						},
					},
				],
			},
			Status: {
				select: {
					"name": "To Do"
				}
			}
		}
	});
	// @ts-ignore
	console.log(response);
})();