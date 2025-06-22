import {getRecentMobyOverview, mobyOverview} from "./monitors/moby/mobyOverview";
import {getRecentMobyAlerts, mobyAlerts} from "./monitors/moby/mobyAlerts";
import {getRecentMobyExplore, mobyExplore} from "./monitors/moby/mobyExplore";
import {mobyMints} from "./monitors/moby/mobyMints";
import {gasGuzzler} from "./monitors/gas/gas";
import {Twitter} from "./monitors/twitter/twitter";
import {floorTrending} from "./monitors/icy/floorTrending";
import {salesTrending} from "./monitors/icy/salesTrending";
import {averageTrending} from "./monitors/icy/averageTrending";
import {volumeTrending} from "./monitors/icy/volumeTrending";
import {highestSaleTrending} from "./monitors/icy/highestSaleTrending";

getRecentMobyOverview();
setInterval(mobyOverview, 1000 * 60 * 5);
getRecentMobyAlerts();
setInterval(mobyAlerts, 10000);
getRecentMobyExplore();
setInterval(mobyExplore, 6500);
setInterval(mobyMints, 1000 * 30);

setInterval(gasGuzzler, 1000 * 60 * 3);

new Twitter().run();

setInterval(floorTrending, 1000 * 60 * 60);

setInterval(salesTrending, 1000 * 60 * 60);

setInterval(averageTrending, 1000 * 60 * 60);

setInterval(volumeTrending, 1000 * 60 * 60);

setInterval(highestSaleTrending, 1000 * 60 * 60);