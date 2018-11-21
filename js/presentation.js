class Presentation
{
	constructor(slides)
	{	
		this.slides = slides;
		console.log(slides);
	}

	static async parse(text)
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
				const json = await fetch(uri).then(res=>res.json());
				card.img = json.image_uris.normal;
				slide.push(card);
			}
		}
		return new Presentation(slides);
	}

	sleep(time)
	{
 		return new Promise((resolve) => setTimeout(resolve, time));
	}

	show()
	{
		this.shown = [];
		this.slideNr = -1;
		this.next();
	}

	next()
	{
			for(const element of this.shown)
			{
				document.body.removeChild(element);
			}
			this.shown.length=0;
			const slide = this.slides[++this.slideNr];
			console.log(slide);
			if(!slide) {return false;}
			for(const card of slide)
			{
				const img = document.createElement("IMG");
				img.src = card.img;
				img.classList.add("card");
				document.body.appendChild(img);
				this.shown.push(img);
			}
	}
}
