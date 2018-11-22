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
    		if(line.startsWith("#")||line.startsWith("//")) {continue;} // ignore comments
			cardNames = line.split("|");
			const slide = [];
			slides.push(slide);

			for(let cardName of cardNames)
			{
				cardName = cardName.trim();
				if(!cardName) {continue;}
				const card = {name: cardName};
				//const uri = "https://api.scryfall.com/cards/named?fuzzy="+encodeURIComponent(cardName);
				const uri = 'https://api.scryfall.com/cards/search?q='+encodeURIComponent(`!"${cardName}"++not:reprint`);
				const json = await fetch(uri).then(res=>res.json());
				if(!json||!json.data)
				{
					console.warn("Could not find image for card "+cardName);
					continue;
				}
				card.img = json.data[0].image_uris.normal;
				slide.push(card);
			}
		}
		return new Presentation(slides);
	}

	sleep(time)
	{
 		return new Promise((resolve) => setTimeout(resolve, time));
	}

	start()
	{
		this.shown = [];
		this.slideNr = -1;
		this.next();
	}

	next()
	{
		if(this.slideNr>=this.slides.length-1) {return false;}
		this.show(++this.slideNr);
	}

	prev()
	{
		if(this.slideNr<=0) {return false;}
		this.show(--this.slideNr);
	}


	show(slideNr)
	{
			for(const element of this.shown)
			{
				document.body.removeChild(element);
			}
			this.shown.length=0;
			const slide = this.slides[slideNr];
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
