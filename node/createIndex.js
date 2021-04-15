/** Requires that "scryfall-default-cards.json" is available.
Read Scryfall JSON and transform it into a data structure that can be accessed more quickly and that only contains card name and image URL for the first print.*/
const fs = require('fs');
const data = fs.readFileSync('scryfall-default-cards.json');
const cards = JSON.parse(data);
const indexBase = [];
for(let card of cards)
{
  // we already have an older print
  if(indexBase[card.name]&&indexBase[card.name].released_at<card.released_at) {continue;}
  const uris = card.image_uris;
  if(!uris)
  {
    console.error("No images for card "+card.name+" "+card.uri);
    continue;
  }
  indexBase[card.name]={url:card.image_uris.large,released_at:card.released_at}
}
const index = {}; // [] does not work with associative arrays with stringify
for(let key in indexBase)
{
  index[key]=indexBase[key].url;
}
fs.writeFile('cards.js', "var cards ="+JSON.stringify(index,null, 2)+";", 'utf8',console.error);
