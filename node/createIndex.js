/** Requires that "scryfall-default-cards.json" is available.
Read Scryfall JSON and transform it into a data structure that can be accessed more quickly and that only contains card name and image URL for the first print.*/
const fs = require("fs");
const data = fs.readFileSync("scryfall-default-cards.json");
const cards = JSON.parse(data);
const indexBase = [];

// sorting by release date and then stable sorting by frame would be simpler but didn't work in practise and changed the order creating large diffs on cards.js
for (let card of cards) {
	// prefer first printing
	// exception: new printing has older frame
	if (
		indexBase[card.name] &&
		(parseInt(indexBase[card.name].frame) < parseInt(card.frame) ||
			(parseInt(indexBase[card.name].frame) == parseInt(card.frame) &&
				indexBase[card.name].released_at < card.released_at))
	) {
		continue;
	}
	if (card.set_name === "San Diego Comic-Con 2015") continue;
	if (card.lang !== "en") continue; // ignore japanese alternate art
	// double faced cards
	if (card.name.includes("//") && !card.image_uris) {
		card.image_uris = card.card_faces[0].image_uris;
	}
	const uris = card.image_uris;
	if (!uris) {
		console.error("No images for card " + card.name + " " + card.uri);
		continue;
	}
	indexBase[card.name] = { url: card.image_uris.large, released_at: card.released_at, frame: card.frame };
}
const index = {}; // [] does not work with associative arrays with stringify
for (let key in indexBase) {
	index[key] = indexBase[key].url;
}
fs.writeFile("cards.js", "var cards =" + JSON.stringify(index, null, 2) + ";", "utf8", console.error);
