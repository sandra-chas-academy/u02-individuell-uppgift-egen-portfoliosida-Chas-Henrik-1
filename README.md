# Personal portfolio page

This is a single-page, 'Portfolio Site' consisting of 5 sections:
- Home
- About
- Tech Stack
- Projects
- Contact

The design is a 'Mobile First' responsive design that also support Tablet's and Desktop's. Breakpoints have been set at 650px for Tablet's & Small Desktop's, and 1024px for Medium & Large Desktop's.  
  
One additional content driven breakpoints have been set at 830px:  
- The 830px breakpoint achieves a smooth transition from the 'mobile full screen project card' as the card turns directly into two cards when passing the breakpoint. 
  
The site uses HTML5, CSS & JavaScript and the following Java Script 'user interaction' has been added:
1. Progress bar when user loads the page.
2. Hamburger menu.
3. A ResizeObserver has been added to the Header that updates the `scroll-padding-top` attribute when the header is resized, to achieve flawless scroll offset for the internal menu links.
4. Active menu indication
5. 'Expand/Collapse All' button to expand/collapse all 'Description' & 'Technology' details.
  
The site supports ‘dark theme’ (configured through operating system settings).  
  
Effort has been made to make the page print properly by removing header & footer and assuring suitable page breaks.  
  
Both the cv.json & the GitHub API data is cached in Local Storage. The data in Local Storage is timestamped and is invalidated after 24h, so that the cache reflects the latest server content if the cv.json and/or the the GitHub API data is updated on the server.
  
All images, except the profile picture and the 'artistic images' (in the project section) are 'svg formatted' to scale seamlessly with different screen resolutions. The profile picture and the 'artistic images' are webP formatted to achieve the best possible compression while still preserving the details of the image, and the images are also available in png format as fallback in case webP is not supported by the client browser. All images except images used on the landing page are lazy loaded to improve performance. The fonts are hosted locally (as .woff2 files) and the landing-page fonts are preloaded to improve performance.
  
The `display: inline; vertical-align: middle;` solution has been selected over the 'flex-box' solution for the 'icon & text grid cells' even though the icon vertical alignment is slightly worse. The reason for this, is that the 'line wrap behavior' is way better for the 'vertical-align' solution when the (icon & text) line run out of horizontal space.
  
A 'three column menu' has been used for Tablet's & Small Desktop's in favor of a the 'two column menu' to reduce the header height as much as possible.
  
The site is published on Netlify (see hyperlink below):  
[https://chas-henrik-u02-egen-portfoliosida.netlify.app/](https://chas-henrik-u02-egen-portfoliosida.netlify.app/)
  
***
*Known problems:*
1. `break-inside: avoid-page` doesn't work properly on flex-boxes when printed from Safari, and a workaround has been applied to alleviate this problem. Printing with 'HP Smart' from Safari still doesn't work though.
2. Lazy loaded images doesn't show up in 'Print Preview' in Safari until images has been browsed on page.

*Notes:*
1. The Site has been performance optimized to achieve as good Lighthouse performance as possible, but there is still one thing that could be further optimized. The cv.json and GitHub API data could all be downloaded in parallel to reduce the 'total load time' substantially for the page when a brand new user enters the site. However if doing so, it is no longer possible to estimate the 'time to completion' in a progressbar, and for most cases a progressbar would not even be needed.
  
***

## Frågor:

### Vad kan man utveckla m.h.a av Javascript inom frontend?
Man kan utveckla interaktion & funktionalitet m.h.a JavaScript.  

Exempel på interaktion med användaren:
1. Reagera på olika events (t.ex. click, mouseover, drag, drop)
2. Ändra, lägga till och ta bort HTML element
3. Visa & ta bort pop-ups

Exempel på funktionalitet:
1. Spara data i Local Storage
2. Kommunicera med backend m.h.a Rest API
3. Beräkningar i fronend såväl som backend
4. Spara data i backend databas
5. Kommunicera med externa tjänster m.h.a API (väderdata, recept, generera data från Chat GPT)
  
  
### Vad är JSON och hur används det inom frontend?

JSON står för “JavaScript Object Notation” och är ett text format för att lagra och transportera data. JSON är särskilt utformat för att vara enkelt att läsa och skriva för både människor och maskiner. JSON består av nyckel-värde-par och använder en syntax som liknar JavaScript-objekt, vilket gör det väldigt lätt att arbeta med i webbutveckling, särskilt på frontend-sidan.  
  
JSON används för att utbyta data mellan webbläsaren och servern, hantera dynamisk data och lagra konfigurationer. Frontendutvecklare använder även JSON för att hantera och manipulera data som behövs för att skapa interaktiva och responsiva webbapplikationer.

JSON används bland annat i:
1. API-kommunikation : För att skicka och ta emot data från API:er. 
2. Data-navigering och rendering : Då JSON-data kan hämtas från en server och omvandlas direkt till JavaScript-objekt, så blir det enkelt att navigera och bearbeta data för att rendera dynamiskt innehåll i en webbsida. Observera att JSON objekt kan innehålla länkar (URL:er) till andra JSON objekt och detta används för data-navigering.
3. Lokalt lagrad data : JSON används för att cacha 'extern data', t.ex. API data, i webbläsarens “localStorage” (m.h.a. `JSON.stringify(obj)`) för att snabbt kunna hämta cachat data från den lokala maskinen (m.h.a. `JSON.parse(obj)`).
4. Konfiguration och inställningar : Vissa frontendverktyg och bibliotek använder JSON som data format för sina konfigurationer och inställningar. 
5. Serialisering och deserialisering av data : JSON gör det möjligt att serialisera JavaScript-objekt till en textsträng, och detta behövs för att kunna skicka objekt i HTTP-anrop.
  
### Vad är HTTP och varför bör man som frontendutvecklare ha kunskap om det och dess protokoll?

Hypertext Transfer Protocol (HTTP) är det kommunikationsprotokoll som används för att överföra webbsidor. Det ursprungliga syftet med HTTP var att tillhandahålla en metod för att överföra HTML-sidor från webbservrar till webbklienter.
  
HTTP bygger på ett förfrågan/svar-förfarande mellan klient och server. En HTTP-klient som skall hämta en HTML-fil, bild eller annan fil från en webbserver skickar en förfrågan bestående av en kort textsträng till en TCP-port på servern (vanligtvis 80). Textsträngen innehåller information om vilken version av HTTP som används, och vilken fil (eller annan resurs eller information) som klienten vill att servern skall skicka och kan som exempel se ut så här: `GET /index.html HTTP/1.1`  
  
HTTP definierar nio kommandon som en klient kan skicka till en HTTP-server:
- **CONNECT** : Används för att sätta upp en tvåvägs kommunikation (tunnel) med servern. Används med proxy-servrar som kan fungera som SSL-tunnlar.
- **OPTIONS** : Returnerar en lista över de HTTP-kommandon som servern stöder.
- **HEAD** : Ber servern att skicka information om den utpekade resursen utan att skicka själva innehållet i filen.
- **GET** : Ber servern att skicka den utpekade resursen (t.ex. fil eller resultatet av en programkörning, databasförfrågan eller motsvarande) till klienten.
- **PUT** : Används för att uppdatera en existerande resurs på servern.
- **POST** : Används för att skapa en ny 'samling av resurser' på servern. Notera även att om man skickar multipla POST kommandon, så kommer flera instanser att skapas.
- **PATCH** : Används för att patcha en resurs, dvs uppdatera en del av en resurs. Följande 'patch operationer' stöds: `test, remove, add, replace, move & copy`.
- **DELETE** : Raderar den utpekade filen. Detta kommando används sällan och många webbservrar inte har stöd för det.
- **TRACE** : Ber servern att skicka tillbaka klientförfrågan precis i det skick som den anlände till servern. Detta kommando kan användas för att kontrollera om någon tredje part mellan klient och server har gjort några ändringar i förfrågan, eller som loop-back test i debug syfte.

Som frontendutvecklare behöver man kunskap om HTTP och dess protokoll för att förstå hur man hämtar data på ett effektivt sätt, och hur data skickas och skyddas i en webbapplikation, då detta förbättrar både användarupplevelsen och säkerheten. Och som frontendutvecklare bör man åtminstone känna till följande om HTTP och dess protokoll:
1. Förståelse för klient-server-kommunikation: Man behöver förstå hur förfrågningar och svar hanteras mellan klient och server.
2. Förfrågningstyper (GET, POST, PUT, DELETE): Det är viktigt att förstå skillnaderna mellan HTTP's förfrågningstyper när man arbetar med API-anrop i frontendkoden, och förstå 'när man ska använda vad'.
3. HTTP-statuskoder: Statuskoder som 200 (OK), 404 (Not Found) och 500 (Server Error) ger information om resultatet av en förfrågan. Dessa är viktiga att känna till för att kunna hantera fel i frontendkoden och ge användaren rätt information om vad som sker.
4. Säkerhet (HTTPS): HTTPS är en säker version av HTTP som använder SSL/TLS-kryptering för att skydda datan som skickas mellan klient och server. Att förstå hur HTTPS fungerar är viktigt för att kunna göra säkra applikationer och se till att användardata skyddas.
5. Caching och prestanda: HTTP har inbyggda funktioner för caching som gör det möjligt att förbättra sidladdningstider och prestanda och som frontendutvecklare är det bra att förstå hur dessa fungerar, och hur man kan utnyttja dessa för att optimera webbplatsen.
