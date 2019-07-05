let cache = {};


const format = "large";

function loadCache()
{
	try
	{
		const s = localStorage.getItem("img"+format);
		if(s) {cache = JSON.parse(s);}
	}
	catch(e) {console.warn("Couldn't initialize cache.",e.name);}
}

function saveCache()
{
	try
	{
		localStorage.setItem("img"+format,JSON.stringify(cache));
	}
	catch(e) {console.warn("Couldn't save cache.",e.name);}
}

async function imageUrl(cardName)
{
	let url = cards[cardName];
	if(url) return url;

	if((url=cache[cardName]))
	{
		console.warn(cardName+" not in index file, load from cache.");
		return url;
	}
	console.warn(cardName+" neither in index nor cache, load from scryfall.");

	const uri = 'https://api.scryfall.com/cards/search?q='+encodeURIComponent(`!"${cardName}"++not:reprint`);
	const json = await fetch(uri).then(res=>res.json());
	if(!json||!json.data)
	{
		console.warn("Could not find image for card "+cardName);
		return null;
	}
	url = json.data[0].image_uris[format];
	cache[cardName]=url;
	return url;
}
