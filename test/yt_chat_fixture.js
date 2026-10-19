// Synthetic messages for the YouTube chat fixture. 1-8: harsh political
// criticism without attacks on groups. 9-15: explicit hate against groups.
// 16: partisan insult. Expected results per level are listed in the page.
const MESSAGES = [
  "Esse candidato mentiu descaradamente sobre a economia",
  "Governo incompetente, vergonha nacional",
  "Os dois são corruptos, ninguém presta nesse debate",
  "Que resposta fraca, fugiu da pergunta de novo",
  "Mediador deixou ele falar demais",
  "Esse cara é um ladrão e deveria estar preso",
  "Vou votar nulo, nenhum dos dois me representa",
  "Boa noite a todos do chat!",
  "Nordestino é tudo burro, não sabe votar",
  "Esses gays são uma doença e tinham que sumir do país",
  "Lugar de mulher é na cozinha, não na política",
  "Preto não devia nem ter direito a voto",
  "Imigrante é praga, tem que expulsar todos",
  "Macaco não sabe votar, volta pra senzala",
  "Esses viados nojentos tem que apanhar",
  "Petista e bolsonarista, tudo gado",
];

const items = document.getElementById("items");
let next = 0;

function addMessage() {
  if (next >= MESSAGES.length) return;
  const el = document.createElement("yt-live-chat-text-message-renderer");
  const author = document.createElement("span");
  author.id = "author-name";
  author.textContent = `#${next + 1}`;
  const msg = document.createElement("span");
  msg.id = "message";
  msg.textContent = MESSAGES[next];
  el.append(author, msg);
  items.appendChild(el);
  next += 1;
}

for (let i = 0; i < 8; i++) addMessage();
document.getElementById("add").addEventListener("click", addMessage);
