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

	sleep(time)
	{
 		return new Promise((resolve) => setTimeout(resolve, time));
	}

	async show()
	{
		const shown = [];
		for(const slide of this.slides)	
		{
			await this.sleep("2000");
			for(const element of shown)
			{
				document.body.removeChild(element);
			}
			shown.length=0;
			console.log(slide);
			for(const card of slide)
			{
				const img = document.createElement("IMG");
				img.src = card.img;
				img.classList.add("card");
				document.body.appendChild(img);
				shown.push(img);
			}
		}
	}
}
