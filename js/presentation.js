class Presentation {
	constructor(slides) {
		this.slides = slides;
		console.log(slides);
	}

	static async parse(text) {
		loadCache();
		const slides = [];
		const lines = text.split("\n");
		for (let line of lines) {
			line = line.trim();
			if (!line || line.startsWith("#")) {
				continue;
			} // ignore comments
			const cards = line.split("|");
			const slide = [];
			slides.push(slide);

			for (let c of cards) {
				let [cardName, count] = c.split("*");
				cardName = cardName.trim();
				if (!cardName) {
					continue;
				}
				const card = { name: cardName, count };
				card.img = await imageUrl(cardName);
				slide.push(card);
			}
		}
		saveCache();
		return new Presentation(slides);
	}

	sleep(time) {
		return new Promise((resolve) => setTimeout(resolve, time));
	}

	start() {
		this.shown = [];
		this.slideNr = -1;
		this.next();
	}

	next() {
		if (this.slideNr >= this.slides.length - 1) {
			return false;
		}
		this.show(++this.slideNr);
	}

	prev() {
		if (this.slideNr <= 0) {
			return false;
		}
		this.show(--this.slideNr);
	}

	show(slideNr) {
		for (const element of this.shown) {
			document.body.removeChild(element);
		}
		this.shown.length = 0;
		const slide = this.slides[slideNr];
		console.log(slide);
		if (!slide) {
			return false;
		}
		for (const card of slide) {
			const container = document.createElement("figure");
			container.classList.add("container");
			container.classList.add(slide.length > 2 ? (slide.length > 10 ? "container33" : "container50") : "container100");
			const img = document.createElement("img");
			container.appendChild(img);
			img.src = card.img;
			img.classList.add("card");
			if (card.count) {
				const caption = document.createElement("figcaption");
				container.appendChild(caption);
				caption.classList.add("caption");
				caption.innerText = card.count;
			}
			document.body.appendChild(container);
			this.shown.push(container);
		}
	}
}
