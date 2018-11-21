class Presentation
{
	constructor(slides)
	{	
		this.slides = slides;
		console.log(slides);
	}

	static parse(text)
	{
		const slides = [];
		const lines = text.split("\n");
		for(const line of lines)
		{
			cardNames = line.split("|");
			const slide = [];
			slides.push(slide);

			for(let cardName of cardNames)
			{
				cardName = cardName.trim();
				const card = {name: cardName};
				const uri = "https://api.scryfall.com/cards/named?fuzzy="+encodeURIComponent(cardName);
				fetch(uri).then(res=>res.json())
				.then(json =>
				{
					card.img = json.image_uris.normal;
				});
				slide.push(card);
			}
		}
		return new Presentation(slides);
	}

	show()
	{
		for(const slide: this.slides)	
		{
			sleep("500");
		}
	}
}
