let cache = {};

const format = "png";

async function loadCache()
{
	const s = localStorage.getItem("img."+format);
	if(s) {cache = JSON.parse(s);}
}

async function saveCache()
{
	localStorage.setItem("img."+format,JSON.stringify(cache));
}

async function imageUrl(cardName)
{
	let url = null;
	if((url=cache[cardName])) {return url;}
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
