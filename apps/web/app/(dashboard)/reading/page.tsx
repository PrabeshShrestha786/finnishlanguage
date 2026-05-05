'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useCallback } from 'react';
import { BookOpen, Clock, Star, ChevronRight, CheckCircle2, XCircle, RotateCcw, Trophy, Layers, Sparkles, Loader2, X, ChevronDown, Trash2 } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { api } from '@/lib/api';
import toast from 'react-hot-toast';

const STORIES: {
  id: number; title: string; titleEn: string; level: string; duration: string;
  xp: number; color: string; category: string; text: string; vocab: string[];
  questions: { q: string; options: string[]; correct: number }[];
}[] = [
  // ── A1 ──────────────────────────────────────────────────────────────────
  {
    id: 1,
    title: 'Perhe Helsingissä',
    titleEn: 'A Family in Helsinki',
    level: 'A1',
    duration: '6 min',
    xp: 40,
    color: 'from-cyan-500 to-blue-500',
    category: 'Daily Life',
    text: `Matti ja Anna asuvat Helsingissä. Heillä on kaksi lasta: Liisa ja Pekka. Matti on lääkäri ja Anna on opettaja. Helsinki on Suomen pääkaupunki ja siellä asuu yli 600 000 ihmistä. He asuvat isossa talossa lähellä merta.

Aamuisin Matti herää kello kuusi ja juoksee puistossa. Anna tekee aamiaista kaikille. Liisa ja Pekka syövät aamiaista ja menevät sitten kouluun. Koulu alkaa kello kahdeksan ja loppuu kello kahteen. Lapset pitävät koulusta ja heillä on monta kaveria.

Illalla koko perhe syö yhdessä kotona. He puhuvat päivästä ja kertovat kuulumisia. Lapset tekevät läksyjä illan aikana. Matti ja Anna katsovat uutisia televisiosta. Perhe menee nukkumaan kello kymmenen.

Viikonloppuisin perhe käy mökillä järven rannalla. Siellä he uivat, kalastavat ja rentoutuvat. Lapset rakastavat mökkiä ja leikkivät ulkona. Matti sanoo: "Mökki on paras paikka!" Anna on samaa mieltä.`,
    vocab: ['asuvat (live)', 'lääkäri (doctor)', 'opettaja (teacher)', 'pääkaupunki (capital city)', 'yhdessä (together)', 'kaverit (friends)', 'rentoutuvat (relax)', 'läksyt (homework)'],
    questions: [
      { q: 'Where do Matti and Anna live?', options: ['In Turku', 'In Helsinki', 'In Tampere', 'In Oulu'], correct: 1 },
      { q: 'What is Matti\'s profession?', options: ['Teacher', 'Engineer', 'Doctor', 'Shopkeeper'], correct: 2 },
      { q: 'What does Matti do every morning before work?', options: ['Makes breakfast', 'Runs in the park', 'Reads a book', 'Goes shopping'], correct: 1 },
      { q: 'What time does school start?', options: ['At seven', 'At nine', 'At ten', 'At eight'], correct: 3 },
      { q: 'How many children do Matti and Anna have?', options: ['One', 'Three', 'Four', 'Two'], correct: 3 },
      { q: 'What does the family do together in the evening?', options: ['Go for a walk', 'Watch a film', 'Eat dinner and talk', 'Play board games'], correct: 2 },
      { q: 'What do the children do in the evening at home?', options: ['Watch television', 'Play games', 'Do homework', 'Play music'], correct: 2 },
      { q: 'Where is the family\'s cottage?', options: ['By the sea', 'By a lake', 'On a mountain', 'In the city'], correct: 1 },
      { q: 'What does the family do at the cottage?', options: ['Swim and fish', 'Ski and skate', 'Shop and eat out', 'Read and sleep'], correct: 0 },
      { q: 'How many people live in Helsinki?', options: ['Over 400,000', 'Over 500,000', 'Over 600,000', 'Over 800,000'], correct: 2 },
    ],
  },
  {
    id: 2,
    title: 'Ravintolassa Helsingissä',
    titleEn: 'At a Restaurant in Helsinki',
    level: 'A1',
    duration: '6 min',
    xp: 35,
    color: 'from-emerald-400 to-teal-500',
    category: 'Dialogue',
    text: `Liisa ja Pekka menevät ravintolaan Helsingissä. Ravintola on iso ja kaunis. Siellä on monta pöytää ja paljon ihmisiä. Tarjoilija tulee heidän luokseen ja sanoo: "Hyvää päivää! Haluatteko pöydän kahdelle?" Liisa vastaa: "Kyllä, kiitos!"

Tarjoilija antaa heille ruokalistan. Liisa katsoo ruokalistaa ja sanoo: "Tämä näyttää hyvältä!" Liisa tilaa lohikeiton ja salaatin. Pekka tilaa pizzan ja lasillisen mehua. Tarjoilija kirjoittaa tilauksen ylös ja menee keittiöön.

Ruoka tulee nopeasti. Lohikeitto on kuumaa ja tuoksuu hyvältä. Liisa sanoo: "Tämä keitto on todella herkullista!" Pekka sanoo: "Myös pizza on loistava!" He syövät hitaasti ja puhuvat samalla. Ruoka on erittäin hyvää ja ravintola on rauhallinen.

Ruoan jälkeen Liisa ottaa suklaakakkua jälkiruoaksi. Pekka ottaa jäätelöä. Tarjoilija tuo laskun ja Liisa maksaa. Ateria maksaa yhteensä 45 euroa. He lähtevät ravintolasta tyytyväisinä ja sanovat: "Tulemme tänne uudelleen!"`,
    vocab: ['ravintola (restaurant)', 'tarjoilija (waiter)', 'ruokalista (menu)', 'lohikeitto (salmon soup)', 'herkullista (delicious)', 'jälkiruoka (dessert)', 'lasku (bill)', 'tyytyväinen (satisfied)'],
    questions: [
      { q: 'Where do Liisa and Pekka go?', options: ['To a café', 'To a restaurant', 'To a shop', 'To a park'], correct: 1 },
      { q: 'How many people is the table for?', options: ['One', 'Three', 'Two', 'Four'], correct: 2 },
      { q: 'What does Liisa order as a main course?', options: ['Pizza', 'Salmon soup and salad', 'Pasta', 'A burger'], correct: 1 },
      { q: 'What does Pekka order to drink?', options: ['Water', 'Coffee', 'Juice', 'Milk'], correct: 2 },
      { q: 'What does Liisa say about the salmon soup?', options: ['It is expensive', 'It is too cold', 'It is really delicious', 'It is too salty'], correct: 2 },
      { q: 'What does Pekka think of his pizza?', options: ['It is okay', 'It is too small', 'It is excellent', 'It is cold'], correct: 2 },
      { q: 'What dessert does Liisa choose?', options: ['Ice cream', 'Apple pie', 'Chocolate cake', 'Fruit salad'], correct: 2 },
      { q: 'What dessert does Pekka choose?', options: ['Ice cream', 'Chocolate cake', 'Fruit', 'Nothing'], correct: 0 },
      { q: 'How much does the meal cost in total?', options: ['35 euros', '40 euros', '50 euros', '45 euros'], correct: 3 },
      { q: 'What do Liisa and Pekka say when leaving the restaurant?', options: ['The food was too expensive', 'We will come here again', 'The service was slow', 'We prefer another restaurant'], correct: 1 },
    ],
  },
  {
    id: 3,
    title: 'Joulu Suomessa',
    titleEn: 'Christmas in Finland',
    level: 'A1',
    duration: '6 min',
    xp: 35,
    color: 'from-red-400 to-rose-500',
    category: 'Culture',
    text: `Joulu on Suomessa suuri juhla. Se on joulukuussa. Jouluaatto on 24. joulukuuta. Se on tärkein päivä perheelle. Kaikki suomalaiset rakastavat joulua.

Jouluruoka on tärkeä osa joulua. Suomalaiset syövät kinkkua ja lanttulaatikkoa. Glögi on lämmin joulusauma ja se on hyvää. Joulutorti on pieni pulla ja se on herkullinen. Perhe syö yhdessä ja on iloinen.

Joulupukki tuo lahjat lapsille. Hän tulee Lapista joka vuosi. Hänellä on punainen takki ja pitkä parta. Lapset kirjoittavat kirjeen joulupukille. Lahjat ovat kuusen alla jouluaamuna.

Suomalaiset koristavat kodin joulukuusella ja valoilla. Perhe kokoontuu yhteen jouluaattona. He syövät yhdessä ja juttelevat. Joulu on rauhallinen aika Suomessa. Se on monien mielestä paras aika vuodesta.`,
    vocab: ['jouluaatto (Christmas Eve)', 'joulupukki (Santa Claus)', 'lahjat (gifts)', 'kinkku (ham)', 'glögi (mulled wine)', 'joulutorti (Christmas pastry)', 'joulukuusi (Christmas tree)', 'parta (beard)'],
    questions: [
      { q: 'When is Christmas Eve in Finland?', options: ['December 23rd', 'December 25th', 'December 24th', 'December 26th'], correct: 2 },
      { q: 'Where does Santa Claus come from in Finland?', options: ['From Helsinki', 'From the North Pole', 'From Lapland', 'From Oulu'], correct: 2 },
      { q: 'What traditional food do Finns eat at Christmas?', options: ['Reindeer and salmon', 'Ham and swede casserole', 'Pizza and pasta', 'Fish and potatoes'], correct: 1 },
      { q: 'What is "glögi"?', options: ['A Christmas cookie', 'A type of ham', 'A warm Christmas drink', 'A Christmas carol'], correct: 2 },
      { q: 'What do children write to Santa?', options: ['An email', 'A letter', 'A list on the wall', 'A text message'], correct: 1 },
      { q: 'Where are the gifts found on Christmas morning?', options: ['In a stocking by the fireplace', 'At the front door', 'In a bag from Santa', 'Under the Christmas tree'], correct: 3 },
      { q: 'What do Finnish families decorate their homes with?', options: ['Snow and ice sculptures', 'A Christmas tree and lights', 'Candles and stars only', 'Pine branches and ribbons'], correct: 1 },
      { q: 'What is Santa\'s appearance described as?', options: ['Blue coat and short hair', 'Green coat and white beard', 'Red coat and long beard', 'White coat and red hat'], correct: 2 },
      { q: 'What kind of time is Christmas described as in Finland?', options: ['Busy and exciting', 'Noisy and festive', 'Rainy and cold', 'Peaceful and the best time of year'], correct: 3 },
      { q: 'When do families gather together?', options: ['On Christmas Day', 'On Christmas Eve', 'On New Year\'s Eve', 'On December 23rd'], correct: 1 },
    ],
  },
  {
    id: 4,
    title: 'Helsinki – Suomen Pääkaupunki',
    titleEn: 'Helsinki – Finland\'s Capital',
    level: 'A1',
    duration: '6 min',
    xp: 35,
    color: 'from-sky-400 to-cyan-500',
    category: 'Nordic Life',
    text: `Helsinki on Suomen pääkaupunki. Se on myös Suomen suurin kaupunki. Helsingissä asuu yli 600 000 ihmistä. Kaupunki on meren rannalla Etelä-Suomessa. Helsinki on kaunis ja moderni kaupunki.

Helsingissä on paljon nähtävyyksiä. Tuomiokirkko on Helsingin tunnetuin rakennus. Se on valkoinen ja iso. Senaatintori on kirkon edessä ja se on suuri aukio. Monet turistit käyvät siellä joka vuosi.

Helsingissä on hyvä julkinen liikenne. Kaupungissa on metro, bussit ja raitiovaunut. Ihmiset liikkuvat helposti paikasta toiseen. Myös pyöräily on suosittu tapa liikkua kesällä. Helsinki on pieni ja helppo kaupunki liikkua.

Helsinki on kansainvälinen kaupunki. Siellä asuu ihmisiä monesta maasta. Kaupungissa on paljon ravintoloita, kahviloita ja puistoja. Kesällä Helsinki on erityisen kaunis. Monet ihmiset nauttivat kaupungista paljon.`,
    vocab: ['pääkaupunki (capital city)', 'tuomiokirkko (cathedral)', 'senaatintori (senate square)', 'raitiovaunu (tram)', 'metro (metro)', 'nähtävyys (attraction)', 'aukio (square)', 'kansainvälinen (international)'],
    questions: [
      { q: 'What is Helsinki?', options: ['Finland\'s second largest city', 'A city in Sweden', 'Finland\'s capital and largest city', 'A port city in northern Finland'], correct: 2 },
      { q: 'How many people live in Helsinki?', options: ['Over 400,000', 'Over 600,000', 'Over 800,000', 'Over 1,000,000'], correct: 1 },
      { q: 'Where is Helsinki located?', options: ['On the coast in southern Finland', 'In central Finland', 'In northern Finland', 'On the border with Sweden'], correct: 0 },
      { q: 'What is the most famous building in Helsinki?', options: ['The Olympic Stadium', 'Helsinki Castle', 'The Opera House', 'The Cathedral (Tuomiokirkko)'], correct: 3 },
      { q: 'What colour is the Cathedral?', options: ['Red', 'Yellow', 'White', 'Grey'], correct: 2 },
      { q: 'What is in front of the Cathedral?', options: ['A harbour', 'Senate Square', 'A park', 'The railway station'], correct: 1 },
      { q: 'What public transport options does Helsinki have?', options: ['Only buses and taxis', 'Metro, buses and trams', 'Only trams and bikes', 'Buses and a monorail'], correct: 1 },
      { q: 'What is a popular way to travel in Helsinki in summer?', options: ['By boat', 'By scooter', 'By cycling', 'By horse'], correct: 2 },
      { q: 'When is Helsinki especially beautiful?', options: ['In autumn', 'In winter', 'In spring', 'In summer'], correct: 3 },
      { q: 'What does Helsinki have a lot of?', options: ['Factories and warehouses', 'Mountains and forests', 'Restaurants, cafés and parks', 'Museums and universities only'], correct: 2 },
    ],
  },

  // ── A2 ──────────────────────────────────────────────────────────────────
  {
    id: 5,
    title: 'Suomen Talvi',
    titleEn: 'The Finnish Winter',
    level: 'A2',
    duration: '8 min',
    xp: 55,
    color: 'from-blue-500 to-indigo-600',
    category: 'Nature',
    text: `Suomen talvi on kylmä ja pimeä, mutta myös erittäin kaunis. Lumi peittää maan joulukuusta maaliskuuhun. Lämpötila voi laskea jopa miinus 30 asteeseen Pohjois-Suomessa. Lapset rakastavat leikkiä lumessa ja rakentaa lumiukkoja puistoissa.

Pohjois-Suomessa, Lapissa, aurinko ei nouse ollenkaan joulukuun aikana. Tätä aikaa kutsutaan kaamos-ajaksi eli polaariseksi yöksi. Kuitenkin revontulet eli aurora borealis valaisevat taivaan vihreillä ja punaisilla väreillä. Revontulet ovat yksi Suomen tunnetuimmista nähtävyyksistä, ja monet turistit tulevat katsomaan niitä joka vuosi.

Suomalaiset viettävät talvea monella tavalla. He hiihtävät, luistelevat ja käyvät säännöllisesti saunassa. Sauna on suomalaiselle kulttuurille erittäin tärkeä perinne. Suomessa on noin kolme miljoonaa saunaa, mikä on enemmän kuin yksi jokaista kahta ihmistä kohti.

Talvella jouluaatto on tärkein juhlapäivä Suomessa. Se on 24. joulukuuta ja perheet kokoontuvat yhteen. Perinteistä jouluruokaa syödään yhdessä ja lahjat annetaan jouluaattona. Suomalaiset myös juovat paljon kahvia ja teetä pitääkseen itsensä lämpimänä kylmänä talvena.`,
    vocab: ['kylmä (cold)', 'lumi (snow)', 'revontulet (northern lights)', 'kaamos (polar night)', 'luistelevat (skate)', 'sauna (sauna)', 'jouluaatto (Christmas Eve)', 'perinne (tradition)'],
    questions: [
      { q: 'When does snow typically cover the ground in Finland?', options: ['October to February', 'December to March', 'November to January', 'January to April'], correct: 1 },
      { q: 'How cold can it get in Northern Finland in winter?', options: ['Minus 10 degrees', 'Minus 20 degrees', 'Minus 30 degrees', 'Minus 40 degrees'], correct: 2 },
      { q: 'What is "kaamos"?', options: ['A Finnish winter sport', 'A type of sauna', 'The polar night when the sun does not rise', 'A Christmas tradition'], correct: 2 },
      { q: 'What are the northern lights called in Finnish?', options: ['Kaamos', 'Revontulet', 'Lumikki', 'Talviaura'], correct: 1 },
      { q: 'Why do tourists come to Lapland in winter?', options: ['To ski on famous slopes', 'To see the northern lights', 'To attend the Christmas market', 'To experience the midnight sun'], correct: 1 },
      { q: 'Approximately how many saunas are there in Finland?', options: ['One million', 'Two million', 'Three million', 'Four million'], correct: 2 },
      { q: 'When is Christmas Eve in Finland?', options: ['December 25th', 'December 23rd', 'December 24th', 'December 26th'], correct: 2 },
      { q: 'When are Christmas gifts given in Finland?', options: ['On Christmas morning', 'On Christmas Eve', 'On New Year\'s Eve', 'On December 26th'], correct: 1 },
      { q: 'What do Finns drink a lot of in winter to stay warm?', options: ['Hot chocolate and juice', 'Coffee and tea', 'Soup and milk', 'Mulled wine only'], correct: 1 },
      { q: 'Where in Finland does the sun not rise during December?', options: ['In Helsinki', 'In Turku', 'In Tampere', 'In Lapland'], correct: 3 },
    ],
  },
  {
    id: 6,
    title: 'Suomen Itsenäistyminen',
    titleEn: 'Finland\'s Independence',
    level: 'A2',
    duration: '8 min',
    xp: 55,
    color: 'from-blue-400 to-blue-600',
    category: 'History',
    text: `Suomi itsenäistyi Venäjästä 6. joulukuuta 1917. Ennen itsenäisyyttä Suomi oli osa Venäjän keisarikuntaa yli sata vuotta. Venäjän vallankumous vuonna 1917 antoi Suomelle mahdollisuuden itsenäistyä. Suomen eduskunta julisti itsenäisyyden joulukuussa 1917.

Itsenäistymisen jälkeen Suomessa alkoi sisällissota. Sota käytiin vuonna 1918 punaisten ja valkoisten välillä. Valkoiset voittivat sodan toukokuussa 1918. Sisällissota jätti syvät haavat suomalaiseen yhteiskuntaan, ja siitä toipuminen kesti kauan.

Itsenäistymisen jälkeen Suomi kehitti nopeasti omia instituutioitaan. Suomi sai oman presidentin, oman armeijan ja oman valuutan. Suomi liittyi Kansainliittoon vuonna 1920 ja sai kansainvälistä tunnustusta. Maan talous kasvoi ja elintaso parani 1920-luvulla.

Tänään Suomi juhlistaa itsenäisyyspäivää joka vuosi 6. joulukuuta. Presidentinlinnassa järjestetään vastaanotto, jota kutsutaan "linnan juhlaksi". Miljoona suomalaista katsoo vastaanottoa televisiosta. Itsenäisyyspäivä on tärkeä kansallinen juhla kaikille suomalaisille.`,
    vocab: ['itsenäistyi (gained independence)', 'eduskunta (parliament)', 'sisällissota (civil war)', 'vallankumous (revolution)', 'keisarikunta (empire)', 'valuutta (currency)', 'vastaanotto (reception)', 'elintaso (standard of living)'],
    questions: [
      { q: 'When did Finland declare independence?', options: ['6 December 1918', 'independence day is January 1st', 'December 6th, 1917', 'March 6th, 1920'], correct: 2 },
      { q: 'From which country did Finland gain independence?', options: ['Sweden', 'Russia', 'Germany', 'Britain'], correct: 1 },
      { q: 'What happened in Finland shortly after independence?', options: ['A civil war broke out', 'A general election was held', 'A new king was crowned', 'The economy collapsed'], correct: 0 },
      { q: 'Which side won the Finnish Civil War?', options: ['The Reds', 'The Blues', 'The Greens', 'The Whites'], correct: 3 },
      { q: 'When was the civil war fought?', options: ['1917', '1918', '1919', '1920'], correct: 1 },
      { q: 'What organisation did Finland join in 1920?', options: ['The United Nations', 'The European Union', 'The League of Nations', 'NATO'], correct: 2 },
      { q: 'What did Finland receive after independence?', options: ['Its own president, army and currency', 'Land from Russia', 'Financial aid from Sweden', 'A royal family'], correct: 0 },
      { q: 'What event made Finnish independence possible?', options: ['A Finnish military victory', 'A peace treaty with Sweden', 'The Russian Revolution of 1917', 'A UN resolution'], correct: 2 },
      { q: 'What is the "linnan juhlat"?', options: ['A military parade', 'A reception at the Presidential Palace', 'A fireworks display', 'A concert in Helsinki'], correct: 1 },
      { q: 'What happened to Finland\'s economy in the 1920s?', options: ['It grew and the standard of living improved', 'It collapsed due to war debt', 'It stayed the same', 'It declined due to sanctions'], correct: 0 },
    ],
  },
  {
    id: 7,
    title: 'Suomalainen Ruokakulttuuri',
    titleEn: 'Finnish Food Culture',
    level: 'A2',
    duration: '7 min',
    xp: 50,
    color: 'from-amber-400 to-orange-500',
    category: 'Culture',
    text: `Suomalainen ruokakulttuuri on ainutlaatuinen ja mielenkiintoinen. Suomalaiset syövät paljon kalaa, erityisesti lohta, silakkaa ja muikkua. Metsästä kerätään marjoja, sieniä ja yrttejä. Nämä raaka-aineet ovat tärkeä osa perinteistä suomalaista ruokaa.

Ruisleipä on suomalaisille erittäin tärkeä. Sitä syödään lähes joka aterialla. Ruisleipä on tumma, hapan ja terveellinen. Suomalaiset ovat syöneet ruisleipää satoja vuosia. Nykyään ruisleipää viedään myös ulkomaille.

Kahvinjuonti on suuri osa suomalaista kulttuuria. Suomi on yksi maailman suurimmista kahvinkuluttajista henkilöä kohti. Suomalaiset juovat kahvia aamulla, töissä ja vieraiden kanssa. Kahvitauko on tärkeä sosiaalinen hetki suomalaisessa arjessa.

Suomalainen keittiö on muuttunut viime vuosikymmeninä. Nuoret suomalaiset syövät yhä enemmän kansainvälistä ruokaa. Helsingissä on ravintoloita monesta eri maasta. Silti perinteiset suomalaiset ruoat ovat edelleen suosittuja, etenkin juhlissa.`,
    vocab: ['ruisleipä (rye bread)', 'silakka (herring)', 'muikku (vendace)', 'marjat (berries)', 'sienet (mushrooms)', 'kahvitauko (coffee break)', 'hapan (sour)', 'raaka-aineet (ingredients)'],
    questions: [
      { q: 'What types of fish do Finns eat a lot of?', options: ['Tuna and sardines', 'Cod and mackerel', 'Salmon, herring and vendace', 'Trout and carp'], correct: 2 },
      { q: 'What is collected from the forest in Finland?', options: ['Nuts and seeds', 'Berries, mushrooms and herbs', 'Roots and bark', 'Flowers and leaves'], correct: 1 },
      { q: 'What bread is very important to Finns?', options: ['White bread', 'Sourdough bread', 'Flatbread', 'Rye bread'], correct: 3 },
      { q: 'What is rye bread like?', options: ['White, sweet and soft', 'Yellow, mild and fluffy', 'Dark, sour and healthy', 'Brown, spicy and crunchy'], correct: 2 },
      { q: 'How long have Finns eaten rye bread?', options: ['For decades', 'For hundreds of years', 'Since the 20th century', 'For about 50 years'], correct: 1 },
      { q: 'What is Finland\'s ranking in coffee consumption?', options: ['Average for Europe', 'Low compared to other countries', 'One of the highest per person in the world', 'The lowest in Scandinavia'], correct: 2 },
      { q: 'When do Finns drink coffee?', options: ['Only in the morning', 'In the morning, at work and with guests', 'Only in the evenings', 'Only on weekends'], correct: 1 },
      { q: 'What has changed about Finnish cuisine recently?', options: ['Finns eat less fish', 'Traditional food is disappearing', 'Young Finns eat more international food', 'Coffee has become less popular'], correct: 2 },
      { q: 'What kind of restaurants can be found in Helsinki?', options: ['Only Finnish restaurants', 'Restaurants from many different countries', 'Mostly fast food chains', 'Only Scandinavian restaurants'], correct: 1 },
      { q: 'When are traditional Finnish foods especially popular?', options: ['Every day equally', 'At international events', 'During celebrations and holidays', 'Only in winter'], correct: 2 },
    ],
  },
  {
    id: 8,
    title: 'Sauna – Suomalainen Perinne',
    titleEn: 'Sauna – A Finnish Tradition',
    level: 'A2',
    duration: '8 min',
    xp: 55,
    color: 'from-orange-400 to-red-500',
    category: 'Culture',
    text: `Sauna on yksi tärkeimmistä suomalaisista perinteistä. Suomessa on noin 3,3 miljoonaa saunaa ja vain 5,5 miljoonaa asukasta. Lähes jokaisessa kodissa on oma sauna. Sauna on rekisteröity UNESCOn aineettoman kulttuuriperinnön listalle vuonna 2020.

Saunan historia Suomessa on tuhatvuotinen. Muinaiset suomalaiset käyttivät saunaa peseytymiseen, parantamiseen ja rentoutumiseen. Lapset syntyivät usein saunassa ennen vanhaan. Sauna oli myös paikka, jossa tehtiin tärkeitä päätöksiä.

Perinteinen suomalainen sauna on puusauna, jota lämmitetään puilla. Kiukaalla on kiviä, joille heitetään vettä. Löyly syntyy, kun vesi muuttuu kuumaksi höyryksi. Saunassa hikiillään ja sen jälkeen mennään kylmään veteen tai järveen.

Nykyään saunominen on tärkeä sosiaalinen tapahtuma. Perheet saunovat yhdessä viikonloppuisin. Liikekumppanit käyvät saunassa yhdessä tärkeiden neuvottelujen jälkeen. Sauna on paikka, jossa kaikki ovat tasa-arvoisia, ja se on tärkeä osa suomalaista identiteettiä.`,
    vocab: ['sauna (sauna)', 'kiuas (sauna stove)', 'löyly (steam in sauna)', 'perinne (tradition)', 'kulttuuri (culture)', 'peseytyminen (washing)', 'tasa-arvoinen (equal)', 'asukkaat (residents)'],
    questions: [
      { q: 'How many saunas are there in Finland?', options: ['About 1.5 million', 'About 2 million', 'About 3.3 million', 'About 5 million'], correct: 2 },
      { q: 'What happened in 2020 regarding Finnish sauna?', options: ['A new type of sauna was invented', 'Sauna was listed on UNESCO\'s Intangible Cultural Heritage list', 'Finland exported its first sauna', 'A sauna world championship was held'], correct: 1 },
      { q: 'How old is the sauna tradition in Finland?', options: ['About 100 years', 'About 500 years', 'About a thousand years', 'About 200 years'], correct: 2 },
      { q: 'What did ancient Finns use the sauna for?', options: ['Cooking food', 'Washing, healing and relaxing', 'Religious ceremonies only', 'Storing food in winter'], correct: 1 },
      { q: 'What type of sauna is traditional in Finland?', options: ['An electric sauna', 'A steam room', 'A wood-heated sauna', 'An infrared sauna'], correct: 2 },
      { q: 'What is "löyly"?', options: ['A sauna brush', 'Steam created by throwing water on hot stones', 'The wooden seat in a sauna', 'A cold plunge pool'], correct: 1 },
      { q: 'What do people typically do after the sauna?', options: ['Have a meal', 'Go to sleep immediately', 'Go into cold water or a lake', 'Drink coffee'], correct: 2 },
      { q: 'Who uses the sauna together after important negotiations?', options: ['Politicians and journalists', 'Business partners', 'Teachers and students', 'Doctors and patients'], correct: 1 },
      { q: 'What principle is associated with the sauna?', options: ['Strict social hierarchy', 'Equality — everyone is equal in the sauna', 'Silence and meditation', 'Competition and endurance'], correct: 1 },
      { q: 'What does sauna represent for Finns?', options: ['A luxury for wealthy people', 'An old-fashioned custom', 'An important part of Finnish identity', 'A health treatment only'], correct: 2 },
    ],
  },

  // ── B1 ──────────────────────────────────────────────────────────────────
  {
    id: 9,
    title: 'Tekoäly Muuttaa Maailmaa',
    titleEn: 'Artificial Intelligence is Changing the World',
    level: 'B1',
    duration: '10 min',
    xp: 80,
    color: 'from-violet-500 to-purple-600',
    category: 'Technology',
    text: `Tekoäly on yksi aikamme merkittävimmistä teknologioista, ja se muuttaa maailmaa nopeammin kuin koskaan ennen. Tekoäly tarkoittaa tietokonejärjestelmiä, jotka voivat suorittaa tehtäviä, joihin normaalisti tarvitaan ihmisen älykkyyttä. Tällaisia tehtäviä ovat esimerkiksi kuvien tunnistaminen, kielen kääntäminen ja monimutkaisten ongelmien ratkaiseminen. Suomi on yksi Euroopan johtavista maista tekoälyn hyödyntämisessä julkisissa palveluissa.

Tekoäly vaikuttaa jo nyt moniin ammatteihin ja toimialoihin. Terveydenhuollossa tekoäly auttaa lääkäreitä diagnosoimaan sairauksia nopeammin ja tarkemmin kuin ennen. Koulutuksessa tekoälypohjaiset ohjelmat voivat mukauttaa opetuksen jokaisen oppilaan yksilöllisiin tarpeisiin. Teollisuudessa robotit hoitavat yhä enemmän vaarallisia ja toistuvia töitä ihmisten puolesta, mikä parantaa turvallisuutta.

Tekoälyn kehitys herättää myös tärkeitä eettisiä kysymyksiä. Monet pelkäävät, että automaatio vie heidän työpaikkansa tulevaisuudessa. Tietosuoja on suuri huolenaihe, sillä tekoälyjärjestelmät keräävät valtavia määriä henkilökohtaisia tietoja. Euroopan unioni on vastannut näihin haasteisiin säätämällä maailman ensimmäisen kattavan tekoälylain vuonna 2024.

Suomalaiset teknologiayritykset, kuten Nokia ja monet startup-yritykset, ovat aktiivisesti mukana tekoälyn kehittämisessä. Suomen hallitus on investoinut merkittävästi tekoälykoulutukseen ja tutkimukseen. Tavoitteena on varmistaa, että suomalaisilla on taidot, joita tulevaisuuden työmarkkinat vaativat. Asiantuntijat uskovat, että tekoäly luo myös uusia työpaikkoja, vaikka se samalla muuttaa monia vanhoja ammatteja.`,
    vocab: ['tekoäly (artificial intelligence)', 'diagnosoimaan (to diagnose)', 'tietosuoja (data privacy)', 'automaatio (automation)', 'eettinen (ethical)', 'mukautua (to adapt)', 'investoida (to invest)', 'asiantuntija (expert)'],
    questions: [
      { q: 'What does "tekoäly" mean in English?', options: ['Digital technology', 'Artificial intelligence', 'Robotics', 'Computer science'], correct: 1 },
      { q: 'Which of these is an example of an AI task mentioned in the text?', options: ['Building cars', 'Translating languages', 'Driving trucks', 'Mining minerals'], correct: 1 },
      { q: 'How does AI help doctors in healthcare?', options: ['It replaces doctors entirely', 'It helps diagnose diseases faster and more accurately', 'It only handles hospital paperwork', 'It performs surgery independently'], correct: 1 },
      { q: 'What benefit do industrial robots bring according to the text?', options: ['They reduce costs dramatically', 'They improve workplace safety', 'They make products cheaper', 'They work faster than any human'], correct: 1 },
      { q: 'What is one major concern about AI mentioned in the text?', options: ['It is too expensive to develop', 'Automation may take people\'s jobs', 'It uses too much electricity', 'It is unreliable in practice'], correct: 1 },
      { q: 'What did the European Union do in 2024 regarding AI?', options: ['Banned all AI development', 'Invested heavily in AI startups', 'Enacted the world\'s first comprehensive AI law', 'Created a new European AI institute'], correct: 2 },
      { q: 'Which Finnish companies are mentioned as active in AI development?', options: ['Supercell and Rovio', 'Nokia and several startups', 'Kone and Wärtsilä', 'Finnair and Kesko'], correct: 1 },
      { q: 'What can AI-based programs do in education?', options: ['Replace all teachers', 'Grade all exams automatically', 'Adapt teaching to each student\'s individual needs', 'Provide free university degrees'], correct: 2 },
      { q: 'What is Finland\'s goal regarding AI investment?', options: ['To automate all government jobs', 'To ban AI in schools', 'To ensure Finns have the skills the future job market requires', 'To become the world\'s largest AI exporter'], correct: 2 },
      { q: 'What do experts believe about AI and employment?', options: ['AI will eliminate all jobs within 10 years', 'AI creates no new jobs at all', 'AI will create new jobs even as it changes old ones', 'AI only affects low-skill jobs'], correct: 2 },
    ],
  },
  {
    id: 10,
    title: 'Suomi ja NATO',
    titleEn: 'Finland and NATO',
    level: 'B1',
    duration: '10 min',
    xp: 80,
    color: 'from-blue-600 to-indigo-700',
    category: 'Current Events',
    text: `Suomi liittyi Pohjois-Atlantin puolustusliitto NATOon huhtikuussa 2023, mikä oli historiallinen muutos maan ulkopolitiikassa. Suomi oli ollut sotilaallisesti liittoutumaton lähes 80 vuoden ajan toisen maailmansodan jälkeen. Venäjän hyökkäys Ukrainaan helmikuussa 2022 muutti suomalaisen mielipiteen nopeasti. Ennen hyökkäystä vain noin 25 prosenttia suomalaisista kannatti NATO-jäsenyyttä, mutta hyökkäyksen jälkeen kannatus nousi yli 70 prosenttiin.

Suomen NATO-jäsenyys on merkittävä muutos koko Euroopan turvallisuusarkkitehtuurille. Suomen 1 340 kilometrin yhteinen raja Venäjän kanssa on nyt myös NATOn ulkoraja. Tämä vahvistaa puolustusliittoa merkittävästi ja lähettää selkeän viestin Venäjälle. Ruotsi liittyi NATOon Suomen jälkeen maaliskuussa 2024, ja nyt molemmat Pohjoismaat ovat osa liittoa.

NATO-jäsenyys tuo Suomelle sekä velvoitteita että etuja. Jäsenmaiden on sitouduttava käyttämään vähintään kaksi prosenttia bruttokansantuotteestaan puolustukseen. Suomen on myös osallistuttava NATOn yhteisiin harjoituksiin ja operaatioihin. Vastineeksi Suomi saa turvatakuut, joiden mukaan hyökkäys Suomea vastaan katsottaisiin hyökkäykseksi kaikkia jäsenmaita vastaan.

Venäjä on reagoinut Suomen NATO-jäsenyyteen uhkaamalla vahvistaa puolustustaan rajalla. Suhteet Venäjään ovat jäähtyneet merkittävästi jäsenyyden myötä. Suomi on kuitenkin korostanut, että päätös on puhtaasti puolustuksellinen. Suomalaiset ovat enimmäkseen tyytyväisiä jäsenyyteen, sillä he uskovat sen parantavan maan turvallisuutta pitkällä aikavälillä.`,
    vocab: ['liittoutumaton (non-aligned)', 'puolustusliitto (defence alliance)', 'turvatakuut (security guarantees)', 'bruttokansantuote (GDP)', 'ulkoraja (external border)', 'kannatus (support)', 'velvoite (obligation)', 'puolustuksellinen (defensive)'],
    questions: [
      { q: 'When did Finland join NATO?', options: ['February 2022', 'April 2023', 'March 2024', 'January 2023'], correct: 1 },
      { q: 'How long had Finland been militarily non-aligned before joining NATO?', options: ['About 30 years', 'About 50 years', 'About 80 years', 'About 100 years'], correct: 2 },
      { q: 'What event rapidly changed Finnish public opinion about NATO?', options: ['A Finnish government decision', 'Russia\'s invasion of Ukraine in February 2022', 'A NATO invitation', 'A Swedish referendum'], correct: 1 },
      { q: 'What was public support for NATO before Russia\'s invasion?', options: ['About 10%', 'About 50%', 'About 70%', 'About 25%'], correct: 3 },
      { q: 'How long is Finland\'s shared border with Russia?', options: ['840 kilometres', '1,340 kilometres', '2,000 kilometres', '640 kilometres'], correct: 1 },
      { q: 'When did Sweden join NATO?', options: ['April 2023', 'January 2024', 'March 2024', 'June 2024'], correct: 2 },
      { q: 'What percentage of GDP must NATO members spend on defence?', options: ['At least one percent', 'At least two percent', 'At least three percent', 'At least five percent'], correct: 1 },
      { q: 'What do NATO\'s security guarantees mean for Finland?', options: ['Finland gets free weapons', 'An attack on Finland is treated as an attack on all members', 'Finland controls NATO\'s eastern border alone', 'Finland pays no membership fees'], correct: 1 },
      { q: 'How has Russia reacted to Finland\'s NATO membership?', options: ['By accepting it peacefully', 'By closing its border with Finland', 'By threatening to strengthen its defences on the Finnish border', 'By joining talks with NATO'], correct: 2 },
      { q: 'How do most Finns view NATO membership?', options: ['They are opposed to it', 'They are indifferent', 'They are mostly satisfied and believe it improves security', 'They want to leave NATO'], correct: 2 },
    ],
  },
  {
    id: 11,
    title: 'Suomalainen Koulutusjärjestelmä',
    titleEn: 'The Finnish Education System',
    level: 'B1',
    duration: '10 min',
    xp: 80,
    color: 'from-emerald-500 to-teal-600',
    category: 'Education',
    text: `Suomen koulutusjärjestelmä tunnetaan kansainvälisesti yhdeksi maailman parhaimmista. Suomi sijoittuu jatkuvasti PISA-tutkimuksessa huippuluokkaan matematiikassa, lukemisessa ja luonnontieteissä. Järjestelmän menestyksen takana on useita tekijöitä, kuten opettajien korkea koulutustaso, maksuttomuus kaikilla tasoilla ja tasa-arvon korostaminen. Suomessa kaikkien lasten on mahdollista saada laadukas koulutus asuinpaikasta tai perheen varallisuudesta riippumatta.

Perusopetus alkaa Suomessa seitsenvuotiaana ja kestää yhdeksän vuotta. Opettajat tarvitsevat vähintään maisterin tutkinnon, ja opettajakoulutukseen on erittäin vaikea päästä. Suomessa ei ole perinteisiä kansallisia standarditestejä peruskoulussa, ja oppilaisiin kohdistuvaa painetta pyritään vähentämään tietoisesti. Kotitehtäviä annetaan huomattavasti vähemmän kuin useimmissa muissa maissa.

Lukio ja ammatillinen koulutus ovat toisen asteen vaihtoehtoja peruskoulun jälkeen. Molemmat väylät johtavat ylioppilastutkintoon tai ammattitutkintoon, ja jatkokoulutus on mahdollista kummankin kautta. Ammatillista koulutusta arvostetaan Suomessa yhtä lailla kuin akateemista, mikä on poikkeuksellista moniin muihin maihin verrattuna. Korkea-asteen koulutus on Suomessa maksutonta, mikä tekee yliopistoista ja ammattikorkeakouluista kaikkien saavutettavia.

Suomen koulutusmalli herättää laajaa kansainvälistä kiinnostusta. Maat ympäri maailmaa lähettävät opettajia ja päättäjiä tutustumaan suomalaiseen malliin. Asiantuntijat kuitenkin varoittavat, että mallia ei voi suoraan kopioida, koska se perustuu suomalaiseen kulttuuriin ja yhteiskunnallisiin arvoihin. Menestyksen ydin on luottamus: luottamus opettajiin, oppilaisiin ja koko koulutusjärjestelmään.`,
    vocab: ['koulutusjärjestelmä (education system)', 'maisterin tutkinto (master\'s degree)', 'perusopetus (basic education)', 'ammattitutkinto (vocational qualification)', 'tasa-arvo (equality)', 'varallisuus (wealth)', 'luottamus (trust)', 'standarditesti (standardized test)'],
    questions: [
      { q: 'In which international study does Finland consistently rank at the top?', options: ['The TIMSS study', 'The PISA study', 'The OECD survey', 'The UNESCO ranking'], correct: 1 },
      { q: 'What minimum qualification do Finnish teachers need?', options: ['A bachelor\'s degree', 'A diploma', 'A doctorate', 'A master\'s degree'], correct: 3 },
      { q: 'At what age does basic education start in Finland?', options: ['At five', 'At six', 'At seven', 'At eight'], correct: 2 },
      { q: 'What is unusual about Finnish schools regarding testing?', options: ['There are tests every week', 'There are no national standardized tests in basic education', 'Tests are only in Finnish language', 'Tests are replaced with oral exams'], correct: 1 },
      { q: 'How does homework in Finland compare to other countries?', options: ['Much more homework', 'The same amount', 'Much less homework', 'No homework at all'], correct: 2 },
      { q: 'What options do students have after basic education?', options: ['University only', 'Vocational school only', 'Upper secondary school or vocational education', 'They must work for two years first'], correct: 2 },
      { q: 'How is vocational education viewed in Finland?', options: ['As inferior to academic education', 'As equally valued as academic education', 'As only for struggling students', 'As more prestigious than university'], correct: 1 },
      { q: 'What is unique about higher education in Finland?', options: ['It is free of charge', 'It lasts only two years', 'Only top students can attend', 'It is entirely online'], correct: 0 },
      { q: 'Why can\'t the Finnish education model be directly copied?', options: ['It is protected by copyright', 'It requires too much funding', 'It is based on Finnish culture and societal values', 'It only works in cold climates'], correct: 2 },
      { q: 'What is described as the core of Finland\'s educational success?', options: ['Strict discipline', 'High salaries for teachers', 'Trust in teachers, pupils and the system', 'Advanced technology in classrooms'], correct: 2 },
    ],
  },
  {
    id: 12,
    title: 'Ilmastonmuutos ja Pohjoismaat',
    titleEn: 'Climate Change and the Nordic Countries',
    level: 'B1',
    duration: '10 min',
    xp: 80,
    color: 'from-teal-500 to-cyan-600',
    category: 'Science',
    text: `Ilmastonmuutos vaikuttaa Pohjoismaihin nopeammin ja voimakkaammin kuin useimpiin muihin alueisiin maailmassa. Arktinen alue lämpenee jopa neljä kertaa nopeammin kuin maapallon keskilämpötila. Suomessa talvet ovat lyhentyneet ja muuttuneet lauhemmiksi viimeisten vuosikymmenten aikana. Lumen määrä on vähentynyt erityisesti Etelä-Suomessa, mikä vaikuttaa merkittävästi talvimatkailuun ja luontoon.

Ilmastonmuutoksen vaikutukset näkyvät selvästi arjessa. Kasvukausi on pidentynyt, mikä hyödyttää maataloutta, mutta muuttaa myös ekosysteemejä. Jäätalvet ovat harventuneet Itämerellä, mikä vaikuttaa laivareitin käyttöön ja kalastukseen. Monet eläinlajit ovat siirtyneet pohjoisemmaksi sopivampien elinympäristöjen perässä.

Pohjoismaat ovat asettaneet kunnianhimoisia ilmastotavoitteita vastauksena tähän kriisiin. Suomi pyrkii olemaan hiilineutraali vuoteen 2035 mennessä, mikä on yksi maailman tiukimmista tavoitteista. Uusiutuvan energian, kuten tuuli- ja aurinkovoiman, osuutta on lisätty merkittävästi. Metsät ovat Suomelle erityisen tärkeä hiilinielu, mutta metsäteollisuuden ja ilmastonsuojelun välinen tasapaino on jatkuvan poliittisen keskustelun aihe.

Kansalaiset, yritykset ja hallitukset tekevät yhteistyötä ilmastonmuutoksen hillitsemiseksi. Suomalaiset yritykset kehittävät puhtaita teknologioita, joita viedään maailmanlaajuisesti. Nuoret ovat erityisen aktiivisia ilmastoliikkeessä ja vaativat nopeampia toimia päätöksentekijöiltä. Vaikka haasteet ovat suuria, Pohjoismaat näyttävät esimerkkiä siitä, miten moderni talous voi siirtyä kohti kestävämpää tulevaisuutta.`,
    vocab: ['ilmastonmuutos (climate change)', 'hiilineutraali (carbon neutral)', 'uusiutuva energia (renewable energy)', 'hiilinielu (carbon sink)', 'ekosysteemi (ecosystem)', 'kasvukausi (growing season)', 'kunnianhimoinen (ambitious)', 'kestävä (sustainable)'],
    questions: [
      { q: 'How much faster is the Arctic warming compared to the global average?', options: ['Twice as fast', 'Three times as fast', 'Four times as fast', 'Five times as fast'], correct: 2 },
      { q: 'What has happened to winters in Finland in recent decades?', options: ['They have become longer and colder', 'They have become shorter and milder', 'They have stayed the same', 'They have become windier'], correct: 1 },
      { q: 'Where has snowfall decreased most significantly in Finland?', options: ['In Northern Finland', 'In Lapland', 'In Southern Finland', 'Equally everywhere'], correct: 2 },
      { q: 'How has a longer growing season affected Finland?', options: ['It has harmed agriculture', 'It benefits agriculture but changes ecosystems', 'It has no effect on nature', 'It makes farming more difficult'], correct: 1 },
      { q: 'What has happened to ice winters in the Baltic Sea?', options: ['They have become more frequent', 'They have become rarer', 'They have stayed the same', 'They no longer exist'], correct: 1 },
      { q: 'By what year does Finland aim to be carbon neutral?', options: ['By 2030', 'By 2035', 'By 2040', 'By 2050'], correct: 1 },
      { q: 'What types of renewable energy are mentioned?', options: ['Nuclear and hydroelectric', 'Wind and solar power', 'Tidal and geothermal', 'Biomass and hydrogen'], correct: 1 },
      { q: 'What is described as an important carbon sink for Finland?', options: ['Peat bogs', 'Lakes', 'Forests', 'Oceans'], correct: 2 },
      { q: 'Who is described as particularly active in the climate movement?', options: ['Politicians', 'Business leaders', 'Young people', 'Scientists'], correct: 2 },
      { q: 'What role are Nordic countries playing in the climate transition?', options: ['Blocking international agreements', 'Showing an example of sustainable modern economies', 'Focusing only on nuclear power', 'Opposing renewable energy mandates'], correct: 1 },
    ],
  },

  // ── B2 ──────────────────────────────────────────────────────────────────
  {
    id: 13,
    title: 'Tekoälyn Etiikka ja Sääntely Euroopassa',
    titleEn: 'AI Ethics and Regulation in Europe',
    level: 'B2',
    duration: '12 min',
    xp: 110,
    color: 'from-slate-600 to-slate-800',
    category: 'Technology',
    text: `Euroopan unioni hyväksyi huhtikuussa 2024 maailman ensimmäisen kattavan tekoälysäädöksen, joka tunnetaan nimellä EU:n tekoälylaki. Tämä historiallinen asiakirja pyrkii sääntelemään tekoälyn käyttöä riskiperusteisesti luokittelemalla sovellukset korkean, matalan ja minimaalisen riskin kategorioihin. Laki asettaa tiukat vaatimukset erityisesti kasvojentunnistukselle, luottopisteytykselle ja tekoälypohjaisille päätöksentekojärjestelmille, joilla on merkittäviä vaikutuksia yksilöiden oikeuksiin. Eurooppalainen lähestymistapa poikkeaa merkittävästi Yhdysvaltojen ja Kiinan malleista, joissa sääntely on toistaiseksi jäänyt huomattavasti kevyemmäksi.

Tekoälyn eettinen kehittäminen on noussut keskeiseksi kysymykseksi, kun algoritmit osallistuvat yhä enemmän elämän kannalta kriittisiin päätöksiin. Tutkimukset ovat osoittaneet, että tekoälyjärjestelmät voivat ylläpitää ja jopa vahvistaa olemassa olevia yhteiskunnallisia ennakkoluuloja, mikäli niiden koulutusdata heijastaa historiallisia epätasa-arvoisuuksia. Oikeudenmukaisuuden, läpinäkyvyyden ja vastuullisuuden periaatteet ovat tulleet keskeisiksi kriteereiksi tekoälyjärjestelmien arvioinnissa. Kysymys siitä, kuka on vastuussa tekoälyn tekemistä virheistä, on yhä suurelta osin ratkaisematta niin juridisesti kuin eettisestikin.

Generatiivinen tekoäly, kuten ChatGPT ja Googlen Gemini, on tuonut tekoälyn eettiset kysymykset suuren yleisön tietoisuuteen. Nämä järjestelmät pystyvät tuottamaan vakuuttavan oloisia tekstejä, kuvia ja videoita, joita on yhä vaikeampi erottaa ihmisten luomasta sisällöstä. Harhauttavan sisällön eli ns. deepfakejen leviäminen uhkaa demokratiaa ja julkista luottamusta tiedotusvälineisiin. Tekijänoikeuteen liittyvät kysymykset ovat myös nousseet esille, koska generatiivinen tekoäly on koulutettu usein tekijänoikeudella suojatulla materiaalilla ilman sisällöntuottajien suostumusta.

Suomi on pyrkinyt asemoimaan itsensä vastuullisen tekoälyn edelläkävijäksi Euroopassa. Maan hallitus on laatinut kansallisen tekoälystrategian, joka korostaa sekä innovaation edistämistä että eettisten periaatteiden noudattamista. Suomalaiset yliopistot ja tutkimuslaitokset tekevät aktiivista yhteistyötä yritysten ja julkishallinnon kanssa tekoälyn soveltamisessa. Tulevaisuuden kannalta ratkaisevaa on se, onnistuuko kansainvälinen yhteisö sopimaan yhteisistä pelisäännöistä ennen kuin teknologia kehittyy sääntelyä edemmäksi.`,
    vocab: ['tekoälylaki (AI Act)', 'riskiperusteinen (risk-based)', 'ennakkoluulo (bias/prejudice)', 'läpinäkyvyys (transparency)', 'vastuullisuus (accountability)', 'generatiivinen (generative)', 'deepfake (deepfake)', 'tekijänoikeus (copyright)'],
    questions: [
      { q: 'When was the EU AI Act approved?', options: ['January 2023', 'April 2024', 'June 2023', 'December 2024'], correct: 1 },
      { q: 'How does the EU AI Act classify AI applications?', options: ['By country of origin', 'Based on risk level', 'By the company developing them', 'By the number of users'], correct: 1 },
      { q: 'How does Europe\'s regulatory approach differ from the US and China?', options: ['Europe has no regulation at all', 'Europe\'s regulation is significantly stricter', 'Europe only regulates military AI', 'Europe and the US have identical rules'], correct: 1 },
      { q: 'What problem can arise when AI systems are trained on historical data?', options: ['They become too slow', 'They can maintain and reinforce existing social biases', 'They require more energy', 'They lose accuracy over time'], correct: 1 },
      { q: 'What is described as unresolved regarding AI mistakes?', options: ['The technical cause of errors', 'Who is legally and ethically responsible', 'Whether AI makes mistakes at all', 'The cost of fixing AI errors'], correct: 1 },
      { q: 'What threat do deepfakes pose according to the text?', options: ['They slow down the internet', 'They are too expensive to produce', 'They threaten democracy and public trust in media', 'They replace human artists'], correct: 2 },
      { q: 'What copyright concern is raised about generative AI?', options: ['AI cannot understand copyrighted content', 'AI is trained on copyrighted material without permission', 'AI companies pay too much for licenses', 'Copyright law does not apply to AI'], correct: 1 },
      { q: 'How does Finland position itself in AI development?', options: ['As a critic of all AI regulation', 'As a follower of US AI policy', 'As a pioneer of responsible AI in Europe', 'As focused only on military AI'], correct: 2 },
      { q: 'What is crucial for the future of AI governance?', options: ['Each country developing its own rules independently', 'International agreement on common rules before technology outpaces regulation', 'Banning all generative AI tools globally', 'Leaving regulation entirely to the private sector'], correct: 1 },
      { q: 'What principles are mentioned as key criteria for evaluating AI systems?', options: ['Speed, accuracy and cost', 'Fairness, transparency and accountability', 'Power, reach and influence', 'Privacy, simplicity and innovation'], correct: 1 },
    ],
  },
  {
    id: 14,
    title: 'Hyvinvointivaltion Tulevaisuus Suomessa',
    titleEn: 'The Future of the Welfare State in Finland',
    level: 'B2',
    duration: '12 min',
    xp: 110,
    color: 'from-blue-700 to-indigo-800',
    category: 'Law & Society',
    text: `Suomen hyvinvointivaltio, joka rakentuu laajan sosiaaliturvajärjestelmän, universaalin terveydenhuollon ja maksuttoman koulutuksen varaan, on kohdannut kasvavia taloudellisia paineita 2020-luvulla. Maan julkinen velka on kasvanut merkittävästi, ja ikääntyvä väestö rasittaa eläke- ja terveydenhuoltomenoja tavalla, joka edellyttää rakenteellisia uudistuksia. Hallitus on joutunut tekemään kipeitä leikkauksia sosiaalietuuksiin samaan aikaan, kun inflaatio ja energiakriisi ovat heikentäneet kotitalouksien ostovoimaa. Tämä tasapainoilu sosiaalisen oikeudenmukaisuuden ja taloudellisen kestävyyden välillä on noussut Suomen politiikan keskeisimmäksi kiistakysymykseksi.

Suomen talouskasvu on ollut vaatimatonta viime vuosina verrattuna muihin EU-maihin. Rakenteelliset haasteet, kuten viennin yksipuolinen riippuvuus tietyistä toimialoista ja alhainen syntyvyys, hidastavat pitkän aikavälin kasvupotentiaalia. Toisaalta Suomen teknologia- ja innovaatiosektori tarjoaa lupauksia: maa on yksi EU:n johtavista tutkimus- ja kehitysmenojen suhteessa kansantuotteeseen. Vihreä siirtymä puhtaaseen energiaan luo merkittäviä investointimahdollisuuksia erityisesti tuuli- ja vetyvoimaan.

Suomi on reagoinut taloudellisiin haasteisiin useilla rakenteellisilla uudistuksilla. Sosiaali- ja terveydenhuollon uudistus, ns. sote-uudistus, toteutettiin vuonna 2023 siirtämällä palvelujen järjestämisvastuu kunnilta uusille hyvinvointialueille. Uudistuksen tavoitteena on taata yhdenvertaiset palvelut kaikille asuinpaikasta riippumatta ja hillitä kustannusten kasvua pitkällä aikavälillä. Uudistuksen todelliset vaikutukset selviävät kuitenkin vasta vuosien kuluessa.

Suomalainen yhteiskunnallinen malli on kansainvälisesti arvostettu esimerkki siitä, miten korkea elintaso, sosiaalinen tasa-arvo ja toimiva demokratia voivat yhdistyä. Mallin säilyttäminen edellyttää kuitenkin jatkuvaa sopeutumista muuttuviin olosuhteisiin, kuten globalisaatioon, digitalisaatioon ja ilmastonmuutokseen. Tulevaisuuden hyvinvointivaltio rakentuu todennäköisesti vahvemmin julkisen ja yksityisen sektorin kumppanuuden sekä teknologian hyödyntämisen varaan. Lopulta kysymys on siitä, mihin arvoihin suomalaiset haluavat yhteiskuntansa perustuvan tulevina vuosikymmeninä.`,
    vocab: ['hyvinvointivaltio (welfare state)', 'sosiaaliturva (social security)', 'ikääntyvä väestö (aging population)', 'ostovoima (purchasing power)', 'syntyvyys (birth rate)', 'sote-uudistus (social and healthcare reform)', 'hyvinvointialue (wellbeing county)', 'rakenteellinen (structural)'],
    questions: [
      { q: 'What three pillars is the Finnish welfare state built on?', options: ['Defence, trade and agriculture', 'Social security, universal healthcare and free education', 'Low taxes, free markets and innovation', 'Housing, employment and pensions'], correct: 1 },
      { q: 'What is driving increased pressure on Finland\'s public finances?', options: ['Military spending and immigration', 'Growing public debt and an aging population', 'Declining exports and rising imports', 'Energy costs and drought'], correct: 1 },
      { q: 'What structural challenge limits Finland\'s long-term growth?', options: ['Excessive regulation and bureaucracy', 'Declining birth rate and export dependency on certain sectors', 'High corporate tax rates', 'A shortage of natural resources'], correct: 1 },
      { q: 'What sector offers promise for Finland\'s economy?', options: ['Tourism and hospitality', 'Agriculture and fishing', 'Technology and innovation', 'Traditional manufacturing'], correct: 2 },
      { q: 'What is the sote reform?', options: ['A military reform transferring command to NATO', 'A tax reform cutting income taxes', 'A healthcare reform transferring services from municipalities to wellbeing counties', 'An education reform removing university fees'], correct: 2 },
      { q: 'What is the goal of the sote reform?', options: ['To privatise all health services', 'To ensure equal services and control cost growth', 'To reduce the number of hospitals', 'To merge Finland\'s regions into fewer units'], correct: 1 },
      { q: 'What investment opportunities does the green transition create?', options: ['Oil and gas infrastructure', 'Wind and hydrogen power', 'Nuclear power and coal', 'Traditional hydroelectric power'], correct: 1 },
      { q: 'What will the future welfare state likely rely more heavily on?', options: ['Increased taxation only', 'Public-private partnerships and technology', 'Foreign aid and EU grants', 'Reduction of public services'], correct: 1 },
      { q: 'What is described as internationally admired about the Finnish model?', options: ['Its military strength', 'How high living standards, social equality and democracy coexist', 'Its low level of immigration', 'Its reliance on natural resources'], correct: 1 },
      { q: 'What is described as the ultimate question for Finland?', options: ['Whether to remain in the EU', 'What values Finns want their society to be based on', 'Whether to increase military spending', 'How to attract more foreign investment'], correct: 1 },
    ],
  },
  {
    id: 15,
    title: 'Kyberturvallisuus ja Digitaaliset Uhkat',
    titleEn: 'Cybersecurity and Digital Threats',
    level: 'B2',
    duration: '12 min',
    xp: 110,
    color: 'from-gray-700 to-gray-900',
    category: 'Technology',
    text: `Kyberturvallisuudesta on tullut 2020-luvulla yksi kansainvälisen politiikan ja kansallisen turvallisuuden keskeisimmistä kysymyksistä. Valtiollisten toimijoiden ja rikollisten ryhmittymien suorittamat kyberhyökkäykset ovat lisääntyneet räjähdysmäisesti, ja niiden kohteet ulottuvat kriittisestä infrastruktuurista, kuten sähköverkosta ja sairaaloista, poliittisiin instituutioihin ja mediayhtiöihin. Venäjä, Kiina ja Pohjois-Korea on kansainvälisesti tunnistettu merkittävimmiksi valtiollisen kybervakoilun ja sabotaasin toteuttajiksi. Hyökkäysten attribuointi eli tekijän tunnistaminen on teknisesti erittäin haastavaa, mikä vaikeuttaa kansainvälistä vastuunottoa ja oikeudellisia toimia.

Suomi on ollut erityisen alttiina kyberhyökkäyksille geopoliittisen sijaintinsa ja Venäjälle vastaisten kantojensa vuoksi. Suomen eduskunnan tietojärjestelmiin murtauduttiin vuonna 2020, ja hyökkäyksen takana epäillään venäläistä APT29-ryhmää. Finanssisektori, satamat ja energiainfrastruktuuri ovat tunnistettuja kohteita, joita suojataan yhä kehittyneemmillä teknisillä ja hallinnollisilla toimenpiteillä. Suomi on reagoinut uhkiin perustamalla kansallisen kyberturvallisuuskeskuksen ja tiivistämällä yhteistyötä NATO-kumppaneiden kanssa.

Ransomware eli kiristyshaittaohjelmat ovat nousseet yhdeksi vakavimmista kyberuhkista sekä julkiselle että yksityiselle sektorille. Hyökkääjät salaavat uhrin tiedostot ja vaativat lunnaita, jotka maksetaan usein kryptovaluutoilla jäljittämisen vaikeuttamiseksi. Maailmanlaajuisten terveydenhuolto-organisaatioiden, öljyputkistojen ja koulujärjestelmien lamauttaminen on osoittanut, kuinka laajoja yhteiskunnallisia vaikutuksia tällaisilla hyökkäyksillä voi olla. Vaikka viranomaiset ovat onnistuneet purkamaan useita kiristysryhmiä, uusia syntyy jatkuvasti niiden tilalle.

Kyberturvallisuuden vahvistaminen edellyttää sekä teknologisia investointeja että inhimillisen tekijän hallintaa. Tutkimusten mukaan suurin osa onnistuneista tietoturvamurroista saa alkunsa yksinkertaisesta inhimillisestä virheestä, kuten tietojenkalasteluviestiin vastaamisesta. Organisaatioiden on investoitava henkilöstön koulutukseen teknisten suojausten rinnalla. Kansainvälisen yhteistyön tiivistäminen normien, tietojenvaihdon ja kyberrikollisuuden torjunnan alalla on välttämätöntä, jotta digitaalinen ympäristö voidaan pitää turvallisena ja luotettavana.`,
    vocab: ['kyberturvallisuus (cybersecurity)', 'attribuointi (attribution)', 'ransomware (ransomware)', 'kryptovaluutta (cryptocurrency)', 'tietojenkalastelu (phishing)', 'sabotaasi (sabotage)', 'infrastruktuuri (infrastructure)', 'inhimillinen virhe (human error)'],
    questions: [
      { q: 'Which countries are identified as the most significant state-level cyber aggressors?', options: ['Iran, Turkey and North Korea', 'Russia, China and North Korea', 'USA, Israel and China', 'Russia, Iran and Syria'], correct: 1 },
      { q: 'What makes cyber attack attribution technically difficult?', options: ['Attackers use undetectable weapons', 'Identifying the perpetrator is extremely challenging', 'Attacks happen too quickly to trace', 'Most attacks leave no digital footprint'], correct: 1 },
      { q: 'Which Finnish institution was hacked in 2020?', options: ['The Bank of Finland', 'The Finnish Army', 'The Finnish Parliament', 'Helsinki University'], correct: 2 },
      { q: 'Which group is suspected of the Finnish Parliament hack?', options: ['Chinese APT41 group', 'North Korean Lazarus group', 'Anonymous', 'Russian APT29 group'], correct: 3 },
      { q: 'How do ransomware attackers receive payment?', options: ['Through bank transfers', 'Through cryptocurrencies to make tracking difficult', 'Through cash deliveries', 'Through gift cards'], correct: 1 },
      { q: 'What sectors are identified as cyber attack targets in Finland?', options: ['Tourism, retail and education', 'Financial sector, ports and energy infrastructure', 'Agriculture, forestry and fishing', 'Media, arts and culture'], correct: 1 },
      { q: 'What challenge remains after authorities dismantle ransomware groups?', options: ['The victims cannot recover their data', 'New groups constantly emerge to replace them', 'The legal process takes too long', 'Countries cannot agree on punishment'], correct: 1 },
      { q: 'What is identified as the most common origin of successful data breaches?', options: ['Poorly written software code', 'Unpatched operating systems', 'Simple human error such as responding to phishing', 'Weak encryption standards'], correct: 2 },
      { q: 'How has Finland responded to cybersecurity threats?', options: ['By disconnecting from the internet', 'By establishing a national cybersecurity centre and cooperating with NATO', 'By banning all foreign software', 'By developing its own internet infrastructure'], correct: 1 },
      { q: 'What is described as essential to keep the digital environment safe?', options: ['Each country acting alone', 'Banning cryptocurrencies globally', 'Strengthening international cooperation on norms and cybercrime', 'Limiting public access to the internet'], correct: 2 },
    ],
  },
  {
    id: 16,
    title: 'Maahanmuutto ja Integraatio Suomessa',
    titleEn: 'Immigration and Integration in Finland',
    level: 'B2',
    duration: '12 min',
    xp: 110,
    color: 'from-violet-700 to-purple-900',
    category: 'Law & Society',
    text: `Suomi on muuttunut viimeisten kolmen vuosikymmenen aikana suhteellisen homogeenisesta yhteiskunnasta yhä monimuotoisemmaksi maaksi maahanmuuton kasvun myötä. Ulkomaalaistaustaisten osuus väestöstä on kasvanut noin kolmesta prosentista lähes kahdeksaan prosenttiin 1990-luvun alusta, vaikka se on edelleen huomattavasti pienempi kuin monissa muissa Länsi-Euroopan maissa. Suomeen tullaan sekä humanitaarisista syistä turvapaikanhakijoina että perheen, työn ja opiskelun perässä. Maahanmuuttokysymyksistä on tullut yksi Suomen politiikan kiistanalaisimmista aiheista, joka jakaa mielipiteitä puoluerajojen yli.

Integraatio eli maahanmuuttajien kotoutuminen suomalaiseen yhteiskuntaan on sekä yksilöllinen että yhteiskunnallinen prosessi. Suomen kielen oppiminen on keskeinen kotoutumisen mittari, mutta suomen kielen vaikeus on tunnistettu merkittäväksi esteeksi kotoutumiselle. Hallitus tarjoaa kotoutumiskoulutusta, johon sisältyy suomen tai ruotsin kielen opetusta sekä yhteiskuntatietoutta. Työllistyminen on toinen keskeinen integraation osatekijä: ulkomaalaistaustaisten työllisyysaste on edelleen merkittävästi alhaisempi kuin kantaväestöllä, vaikka ero on kaventunut.

Suomessa käydään yhteiskunnallista keskustelua siitä, kuinka paljon maahanmuuttoa tarvitaan ja millaisilla ehdoilla. Väestön ikääntyminen ja syntyvyyden lasku ovat luoneet taloudellisia paineita, joihin työperäinen maahanmuutto voi osaltaan vastata. Hallitukset ovat pyrkineet houkuttelemaan erityisesti osaavaa työvoimaa aloille, joilla on työvoimapula, kuten terveydenhuoltoon, teknologiasektorille ja rakennusalalle. Toisaalta kriittiset äänenpainot korostavat integraation haasteita ja kustannuksia sekä kulttuuristen erojen tuomia jännitteitä.

Tutkimustieto antaa moniulotteisen kuvan maahanmuuton vaikutuksista suomalaiseen yhteiskuntaan. Toisen sukupolven maahanmuuttajat, eli Suomessa syntyneet maahanmuuttajien lapset, ovat monin paikoin integroituneet yhteiskuntaan huomattavasti paremmin kuin vanhempansa. Suomi voi parhaimmillaan tarjota maahanmuuttajille turvallisuuden, tasa-arvon ja mahdollisuuksien yhteiskunnan. Onnistuneen integraation avain on molemminpuolinen sopeutuminen: maahanmuuttajien on opittava suomalaisesta yhteiskunnasta, mutta myös vastaanottavan yhteiskunnan on kehityttävä monimuotoisuuden kohtaamisessa.`,
    vocab: ['maahanmuutto (immigration)', 'integraatio (integration)', 'kotoutuminen (settling in)', 'turvapaikanhakija (asylum seeker)', 'työllistyminen (employment)', 'molemminpuolinen (mutual)', 'toinen sukupolvi (second generation)', 'työvoimapula (labour shortage)'],
    questions: [
      { q: 'What percentage of Finland\'s population has a foreign background today?', options: ['About 3%', 'About 5%', 'Nearly 8%', 'About 15%'], correct: 2 },
      { q: 'How has the foreign-born share of the population changed since the early 1990s?', options: ['It has stayed at about 3%', 'It has grown from about 3% to nearly 8%', 'It has declined slightly', 'It has grown to over 15%'], correct: 1 },
      { q: 'What is identified as a major obstacle to integration in Finland?', options: ['The high cost of living', 'Cultural differences in food', 'The difficulty of the Finnish language', 'The cold climate'], correct: 2 },
      { q: 'What does the government\'s integration training include?', options: ['Only job training', 'Finnish or Swedish language and civics knowledge', 'Only cultural orientation', 'English language courses only'], correct: 1 },
      { q: 'How does immigrant employment compare to the native Finnish population?', options: ['It is the same', 'Immigrants have a higher employment rate', 'It is significantly lower, though the gap has narrowed', 'There is no reliable data on this'], correct: 2 },
      { q: 'Why is labour immigration considered important for Finland?', options: ['To increase cultural diversity', 'Due to an aging population and declining birth rate', 'To reduce wage costs', 'To meet EU immigration quotas'], correct: 1 },
      { q: 'Which sectors specifically face labour shortages in Finland?', options: ['Agriculture, mining and forestry', 'Healthcare, technology and construction', 'Retail, tourism and hospitality', 'Education, arts and media'], correct: 1 },
      { q: 'How have second-generation immigrants integrated compared to their parents?', options: ['Much worse than their parents', 'About the same as their parents', 'Much better than their parents in many respects', 'There is no difference'], correct: 2 },
      { q: 'What does successful integration require from both sides?', options: ['Immigrants must fully abandon their culture', 'Immigrants adapt while the receiving society also develops in welcoming diversity', 'The receiving society does not need to change', 'Both sides must stay separate'], correct: 1 },
      { q: 'What can Finland offer immigrants at its best?', options: ['The highest salaries in Europe', 'Security, equality and a society of opportunities', 'The warmest climate in Scandinavia', 'The most lenient immigration rules in the EU'], correct: 1 },
    ],
  },
];

const LEVEL_COLORS: Record<string, string> = {
  A1: 'bg-emerald-100 text-emerald-700',
  A2: 'bg-blue-100 text-blue-700',
  B1: 'bg-violet-100 text-violet-700',
  B2: 'bg-orange-100 text-orange-700',
};

const AI_COLORS = [
  'from-violet-500 to-purple-600',
  'from-pink-500 to-rose-500',
  'from-amber-400 to-orange-500',
  'from-teal-400 to-cyan-500',
];

interface AnyStory {
  id: string | number;
  dbId?: string;
  title: string;
  titleEn: string;
  level: string;
  duration: string;
  xp: number;
  color: string;
  category: string;
  text: string;
  vocab: string[];
  questions: { q: string; options: string[]; correct: number }[];
}
type ViewState = 'list' | 'reading' | 'quiz' | 'result';

export default function ReadingPage() {
  const { user, updateUser } = useAuthStore();
  const [view, setView] = useState<ViewState>('list');
  const [selectedStory, setSelectedStory] = useState<AnyStory | null>(null);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [filter, setFilter] = useState<'All' | 'A1' | 'A2' | 'B1' | 'B2'>('All');
  const [showPassage, setShowPassage] = useState(false);
  const [completedStories, setCompletedStories] = useState<Record<string | number, { score: number; pct: number }>>({});
  const [tooltip, setTooltip] = useState<{ word: string; translation: string | null; x: number; y: number } | null>(null);
  const [translating, setTranslating] = useState(false);

  // AI generation state
  const [aiStories, setAiStories] = useState<AnyStory[]>([]);
  const [aiLoading, setAiLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [showGenPanel, setShowGenPanel] = useState(false);
  const [genLevel, setGenLevel] = useState<string>(user?.finnishLevel || 'A1');
  const [genTopic, setGenTopic] = useState('');

  useEffect(() => {
    try {
      const saved = localStorage.getItem('finnmate-reading-history');
      if (saved) setCompletedStories(JSON.parse(saved));
    } catch {}
  }, []);

  useEffect(() => {
    api.get('/ai/stories')
      .then((res) => {
        const stories: AnyStory[] = (res.data || []).map((s: any) => ({
          id: s.id,
          dbId: s.id,
          title: s.title,
          titleEn: s.titleEn,
          level: s.level,
          duration: '~5 min',
          xp: s.xp,
          color: s.color,
          category: s.category,
          text: s.text,
          vocab: s.vocab as string[],
          questions: s.questions as { q: string; options: string[]; correct: number }[],
        }));
        setAiStories(stories);
      })
      .catch(() => {})
      .finally(() => setAiLoading(false));
  }, []);

  useEffect(() => {
    const close = () => setTooltip(null);
    document.addEventListener('click', close);
    return () => document.removeEventListener('click', close);
  }, []);

  const generateStory = async () => {
    setGenerating(true);
    setShowGenPanel(false);
    const toastId = toast.loading('Generating your story with AI...');
    try {
      const res = await api.post('/ai/reading/generate', { level: genLevel, topic: genTopic || undefined });
      const raw = res.data.data;
      if (!raw?.title || !raw?.text) throw new Error('Invalid response');
      const color = AI_COLORS[aiStories.length % AI_COLORS.length];
      const tempId = Date.now();
      const storyPayload = {
        title: raw.title,
        titleEn: raw.titleEn || '',
        level: genLevel,
        duration: '~5 min',
        xp: 40,
        color,
        category: raw.category || 'AI Generated',
        text: raw.text,
        vocab: raw.vocab || [],
        questions: (raw.questions || []).map((q: any) => ({
          q: q.q,
          options: q.options,
          correct: q.correct,
        })),
      };
      // Show story immediately (session only), then persist in background
      const sessionStory: AnyStory = { ...storyPayload, id: tempId };
      setAiStories((prev) => [sessionStory, ...prev]);
      toast.success('Story generated! 🇫🇮', { id: toastId });
      setGenTopic('');
      // Persist to backend — swap temp id for DB id on success
      api.post('/ai/stories', storyPayload)
        .then((saved) => {
          const dbId: string = saved.data.id;
          setAiStories((prev) =>
            prev.map((s) => s.id === tempId ? { ...s, id: dbId, dbId } : s)
          );
        })
        .catch(() => {/* story still visible for this session */});
    } catch {
      toast.error('Failed to generate story. Try again.', { id: toastId });
    } finally {
      setGenerating(false);
    }
  };

  const handleWordClick = useCallback(async (word: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const clean = word.replace(/[.,!?;:"""''()[\]…—–]/g, '').trim();
    if (!clean || clean.length < 2) return;
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    setTooltip({ word: clean, translation: null, x: rect.left, y: rect.top - 76 });
    setTranslating(true);
    try {
      const res = await api.post('/ai/translate', { text: clean, from: 'fi', to: 'en' });
      setTooltip((prev) => prev ? { ...prev, translation: res.data.translation || '—' } : null);
    } catch {
      setTooltip((prev) => prev ? { ...prev, translation: '(failed)' } : null);
    } finally {
      setTranslating(false);
    }
  }, []);

  const deleteStory = async (story: AnyStory, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!story.dbId) return;
    try {
      await api.delete(`/ai/stories/${story.dbId}`);
      setAiStories((prev) => prev.filter((s) => s.dbId !== story.dbId));
      toast.success('Story deleted');
    } catch {
      toast.error('Failed to delete story');
    }
  };

  const baseStories: AnyStory[] = filter === 'All' ? STORIES : STORIES.filter((s) => s.level === filter);
  const filteredAi = filter === 'All' ? aiStories : aiStories.filter((s) => s.level === filter);
  const filtered: AnyStory[] = [...filteredAi, ...baseStories];

  const startStory = (story: AnyStory) => {
    setSelectedStory(story);
    setView('reading');
    setCurrentQ(0);
    setAnswers([]);
    setSelected(null);
  };

  const startQuiz = () => {
    if (!selectedStory) return;
    setView('quiz');
    setCurrentQ(0);
    setSelected(null);
    setShowPassage(false);
    setAnswers(Array(selectedStory.questions.length).fill(null));
  };

  const goToQuestion = (idx: number) => {
    setCurrentQ(idx);
    setSelected(answers[idx] ?? null);
  };

  const handleAnswer = (idx: number) => {
    if (answers[currentQ] !== null) return; // already answered — locked
    setSelected(idx);
    setTimeout(() => {
      const newAnswers = [...answers];
      newAnswers[currentQ] = idx;
      setAnswers(newAnswers);

      if (newAnswers.every((a) => a !== null)) {
        const finalCorrect = newAnswers.filter((a, i) => a === selectedStory?.questions[i]?.correct).length;
        const finalPct = selectedStory ? Math.round((finalCorrect / selectedStory.questions.length) * 100) : 0;
        if (finalPct >= 70 && selectedStory) {
          const xp = selectedStory.xp;
          updateUser({ totalXP: (user?.totalXP || 0) + xp });
          api.post('/users/xp', { xpEarned: xp, source: 'reading' }).catch(() => {});
        }
        if (selectedStory) {
          setCompletedStories((prev) => {
            const updated = { ...prev, [selectedStory.id]: { score: finalCorrect, pct: finalPct } };
            try { localStorage.setItem('finnmate-reading-history', JSON.stringify(updated)); } catch {}
            return updated;
          });
        }
        setView('result');
      } else {
        // advance to next unanswered question
        const next = newAnswers.findIndex((a, i) => i > currentQ && a === null);
        if (next !== -1) {
          setCurrentQ(next);
          setSelected(null);
        } else {
          const first = newAnswers.findIndex((a) => a === null);
          if (first !== -1) { setCurrentQ(first); setSelected(null); }
        }
      }
    }, 900);
  };

  const score = answers.filter((a, i) => a === selectedStory?.questions[i]?.correct).length;
  const pct = selectedStory ? Math.round((score / selectedStory.questions.length) * 100) : 0;

  const renderClickableText = (text: string) => (
    <>
      {text.split(/\n\n+/).map((para, i) => (
        <p key={i}>
          {para.trim().split(/\s+/).map((word, wi) => (
            <span
              key={wi}
              onClick={(e) => handleWordClick(word, e)}
              className="cursor-pointer hover:bg-yellow-100 rounded px-0.5 transition-colors duration-100"
            >
              {word}{' '}
            </span>
          ))}
        </p>
      ))}
    </>
  );

  return (
    <div className="space-y-6">
      {/* Tap-to-translate tooltip */}
      {tooltip && (
        <div
          className="fixed z-50 bg-slate-800 text-white rounded-xl shadow-2xl px-3.5 py-2.5 min-w-[120px] pointer-events-none"
          style={{ left: Math.max(8, Math.min(tooltip.x, (typeof window !== 'undefined' ? window.innerWidth : 800) - 200)), top: Math.max(8, tooltip.y) }}
        >
          <div className="text-yellow-300 font-bold text-sm">{tooltip.word}</div>
          <div className="text-slate-300 text-xs mt-0.5">
            {translating ? <span className="animate-pulse">Translating…</span> : (tooltip.translation || '')}
          </div>
          <div className="absolute -bottom-1.5 left-4 w-3 h-3 bg-slate-800 rotate-45" />
        </div>
      )}

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-800">Reading Practice</h1>
          <p className="text-slate-500 text-sm mt-0.5">Read Finnish texts and test your comprehension</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="hidden md:flex items-center gap-2 bg-cyan-50 border border-cyan-100 rounded-xl px-3 py-2">
            <BookOpen className="w-4 h-4 text-cyan-600" />
            <span className="text-cyan-700 text-sm font-semibold">{STORIES.length + aiStories.length} Stories{aiStories.length > 0 ? ` · ${aiStories.length} saved` : ''}</span>
          </div>
          <motion.button
            whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            onClick={() => setShowGenPanel((v) => !v)}
            disabled={generating}
            className="flex items-center gap-2 bg-gradient-to-r from-violet-600 to-purple-600 text-white text-sm font-semibold px-4 py-2 rounded-xl shadow-sm hover:shadow-md transition-all disabled:opacity-60"
          >
            {generating
              ? <><Loader2 className="w-4 h-4 animate-spin" /> Generating...</>
              : <><Sparkles className="w-4 h-4" /> Generate with AI</>
            }
          </motion.button>
        </div>
      </motion.div>

      {/* AI Generate Panel */}
      <AnimatePresence>
        {showGenPanel && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            className="bg-white border border-violet-200 rounded-2xl p-5 shadow-lg"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-violet-500" />
                <span className="font-bold text-slate-800">Generate a New Story</span>
                <span className="text-xs bg-violet-100 text-violet-700 px-2 py-0.5 rounded-full font-semibold">Powered by Groq AI</span>
              </div>
              <button onClick={() => setShowGenPanel(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-shrink-0">
                <label className="block text-xs font-semibold text-slate-500 mb-1.5">Level</label>
                <div className="flex gap-1.5">
                  {['A1', 'A2', 'B1', 'B2'].map((lvl) => (
                    <button key={lvl} onClick={() => setGenLevel(lvl)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        genLevel === lvl ? 'bg-violet-600 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}>
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex-1">
                <label className="block text-xs font-semibold text-slate-500 mb-1.5">Topic <span className="font-normal text-slate-400">(optional)</span></label>
                <input
                  type="text"
                  value={genTopic}
                  onChange={(e) => setGenTopic(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && generateStory()}
                  placeholder="e.g. Finnish seasons, coffee culture, Helsinki trams…"
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 transition-all"
                />
              </div>
              <div className="flex items-end">
                <motion.button
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                  onClick={generateStory}
                  className="btn-primary px-5 py-2 text-sm font-semibold flex items-center gap-2 whitespace-nowrap"
                  style={{ background: 'linear-gradient(135deg, #7c3aed, #9333ea)' }}
                >
                  <Sparkles className="w-4 h-4" /> Generate
                </motion.button>
              </div>
            </div>
            <p className="text-xs text-slate-400 mt-3">Stories are saved to your library and persist across sessions. Each AI story gives +40 XP on completion.</p>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">

        {/* STORY LIST */}
        {view === 'list' && (
          <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {/* Filter */}
            <div className="flex items-center gap-2 mb-5 flex-wrap">
              <span className="text-slate-500 text-sm font-medium">Level:</span>
              {(['All', 'A1', 'A2', 'B1', 'B2'] as const).map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setFilter(lvl)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    filter === lvl ? 'bg-blue-600 text-white shadow-sm' : 'bg-white border border-slate-200 text-slate-600 hover:border-blue-300'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>

            {aiLoading && (
              <div className="flex items-center gap-2 text-slate-400 text-sm mb-4">
                <Loader2 className="w-4 h-4 animate-spin" /> Loading your library…
              </div>
            )}
            <div className="grid md:grid-cols-2 gap-4">
              {filtered.map((story, i) => {
                const isAi = !!story.dbId;
                return (
                <motion.div
                  key={String(story.id)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07 }}
                  whileHover={{ y: -3 }}
                  className={`bg-white rounded-2xl border shadow-sm overflow-hidden cursor-pointer group ${isAi ? 'border-violet-200' : 'border-slate-100'}`}
                  onClick={() => startStory(story)}
                >
                  <div className={`h-2 bg-gradient-to-r ${story.color}`} />
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${LEVEL_COLORS[story.level]}`}>{story.level}</span>
                          <span className="text-xs text-slate-400 bg-slate-50 px-2 py-0.5 rounded-full">{story.category}</span>
                          {isAi && (
                            <span className="text-xs bg-violet-100 text-violet-700 px-2 py-0.5 rounded-full font-semibold flex items-center gap-1">
                              <Sparkles className="w-2.5 h-2.5" /> AI
                            </span>
                          )}
                          {completedStories[story.id] && (
                            <span className="text-xs bg-emerald-50 border border-emerald-200 text-emerald-700 px-2 py-0.5 rounded-full font-semibold flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" /> {completedStories[story.id].pct}%
                            </span>
                          )}
                        </div>
                        <h3 className="text-slate-800 font-black text-base">{story.title}</h3>
                        <p className="text-slate-500 text-xs">{story.titleEn}</p>
                      </div>
                      <div className="flex items-center gap-2 ml-3 shrink-0">
                        {isAi && (
                          <button
                            onClick={(e) => deleteStory(story, e)}
                            title="Delete story"
                            className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-300 hover:text-red-500 hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${story.color} flex items-center justify-center shadow-sm`}>
                          <BookOpen className="w-5 h-5 text-white" />
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-slate-400">
                      <div className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{story.duration}</div>
                      <div className="flex items-center gap-1"><Star className="w-3.5 h-3.5 text-amber-400" />+{story.xp} XP</div>
                      <div className="flex items-center gap-1"><Layers className="w-3.5 h-3.5" />{story.questions.length} questions</div>
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex gap-1">
                        {story.vocab.slice(0, 4).map((v, vi) => (
                          <span key={vi} className="text-xs bg-slate-50 border border-slate-200 text-slate-500 px-2 py-0.5 rounded-full">{v.split(' ')[0]}</span>
                        ))}
                      </div>
                      <span className="text-blue-600 text-xs font-semibold flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        Read <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* READING VIEW */}
        {view === 'reading' && selectedStory && (
          <motion.div key="reading" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="max-w-3xl mx-auto space-y-4">
            <button onClick={() => setView('list')} className="text-slate-400 hover:text-slate-700 text-sm flex items-center gap-1 transition-colors">
              ← Back to stories
            </button>

            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <div className={`h-2 bg-gradient-to-r ${selectedStory.color}`} />
              <div className="p-6 md:p-8">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${LEVEL_COLORS[selectedStory.level]}`}>{selectedStory.level}</span>
                  <span className="text-xs text-slate-400">{selectedStory.category}</span>
                </div>
                <h2 className="text-2xl font-black text-slate-800 mb-0.5">{selectedStory.title}</h2>
                <p className="text-slate-400 text-sm mb-6">{selectedStory.titleEn}</p>

                <div className="text-slate-700 leading-8 text-base mb-6 bg-slate-50 rounded-xl p-5 border border-slate-100 space-y-4">
                  {renderClickableText(selectedStory.text)}
                </div>
                <p className="text-xs text-slate-400 -mt-4 mb-5 flex items-center gap-1.5">
                  <span className="inline-block w-2 h-2 bg-yellow-200 rounded" /> Tap any word to translate
                </p>

                {/* Key Vocabulary */}
                <div className="mb-6">
                  <h3 className="text-slate-800 font-bold text-sm mb-2">Key Vocabulary</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedStory.vocab.map((v, i) => (
                      <span key={i} className="text-xs bg-blue-50 border border-blue-100 text-blue-700 px-3 py-1 rounded-full font-medium">{v}</span>
                    ))}
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  onClick={startQuiz}
                  className="btn-primary w-full py-3 flex items-center justify-center gap-2"
                >
                  Test Comprehension <ChevronRight className="w-4 h-4" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}

        {/* QUIZ VIEW */}
        {view === 'quiz' && selectedStory && (
          <motion.div key="quiz" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="max-w-2xl mx-auto space-y-3">

            {/* Collapsible passage review */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <button
                onClick={() => setShowPassage((v) => !v)}
                className="w-full flex items-center justify-between px-5 py-3.5 text-left hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <BookOpen className="w-4 h-4 text-blue-500" />
                  <span className="font-semibold text-slate-700 text-sm">Review Passage</span>
                  <span className="text-xs text-slate-400 hidden sm:inline">— {selectedStory.title}</span>
                </div>
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${showPassage ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {showPassage && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-5 border-t border-slate-100">
                      <div className="text-slate-700 leading-7 text-sm bg-slate-50 rounded-xl p-4 border border-slate-100 mt-4 max-h-64 overflow-y-auto space-y-3">
                        {renderClickableText(selectedStory.text)}
                      </div>
                      <p className="text-xs text-slate-400 mt-1.5 flex items-center gap-1">
                        <span className="inline-block w-2 h-2 bg-yellow-200 rounded" /> Tap any word to translate
                      </p>
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {selectedStory.vocab.map((v, i) => (
                          <span key={i} className="text-xs bg-blue-50 border border-blue-100 text-blue-700 px-2 py-0.5 rounded-full">{v}</span>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Question card */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              {/* Progress dots — clickable to jump between questions */}
              <div className="flex items-center justify-between mb-6">
                <span className="text-slate-500 text-sm">
                  Question {currentQ + 1} of {selectedStory.questions.length}
                </span>
                <div className="flex gap-1.5">
                  {selectedStory.questions.map((_, i) => {
                    const isAnswered = answers[i] !== null;
                    const isCurrent = i === currentQ;
                    return (
                      <button
                        key={i}
                        onClick={() => goToQuestion(i)}
                        title={`Question ${i + 1}${isAnswered ? ' (answered)' : ''}`}
                        className={`h-2 rounded-full transition-all duration-200 ${
                          isCurrent
                            ? 'w-6 bg-blue-500'
                            : isAnswered
                            ? 'w-4 bg-blue-400 hover:bg-blue-500'
                            : 'w-4 bg-slate-200 hover:bg-slate-300'
                        }`}
                      />
                    );
                  })}
                </div>
              </div>

              <motion.div
                key={currentQ}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.25 }}
              >
                <h3 className="text-slate-800 font-bold text-lg mb-5">{selectedStory.questions[currentQ].q}</h3>

                {/* Already-answered indicator */}
                {answers[currentQ] !== null && (
                  <p className="text-xs text-slate-400 mb-3 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
                    Already answered — use the dots above to navigate
                  </p>
                )}

                <div className="space-y-2.5">
                  {selectedStory.questions[currentQ].options.map((opt, idx) => {
                    const isCorrect = idx === selectedStory.questions[currentQ].correct;
                    const isSelected = selected === idx;
                    const isLocked = answers[currentQ] !== null;
                    const showFeedback = selected !== null || isLocked;
                    return (
                      <motion.button
                        key={idx}
                        whileHover={!showFeedback ? { x: 4 } : {}}
                        whileTap={!showFeedback ? { scale: 0.99 } : {}}
                        onClick={() => handleAnswer(idx)}
                        className={`w-full flex items-center gap-3 p-4 rounded-xl border text-left transition-all ${
                          !showFeedback
                            ? 'border-slate-200 hover:border-blue-300 hover:bg-blue-50 text-slate-700'
                            : isSelected && isCorrect
                            ? 'border-emerald-400 bg-emerald-50 text-emerald-700'
                            : isSelected && !isCorrect
                            ? 'border-red-400 bg-red-50 text-red-700'
                            : isCorrect
                            ? 'border-emerald-400 bg-emerald-50 text-emerald-700'
                            : 'border-slate-200 bg-slate-50 text-slate-400'
                        }`}
                      >
                        <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                          !showFeedback ? 'bg-slate-100 text-slate-500' :
                          isSelected && isCorrect ? 'bg-emerald-400 text-white' :
                          isSelected && !isCorrect ? 'bg-red-400 text-white' :
                          isCorrect ? 'bg-emerald-400 text-white' : 'bg-slate-100 text-slate-400'
                        }`}>
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span className="font-medium text-sm">{opt}</span>
                        {showFeedback && isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-500 ml-auto" />}
                        {showFeedback && isSelected && !isCorrect && <XCircle className="w-4 h-4 text-red-500 ml-auto" />}
                      </motion.button>
                    );
                  })}
                </div>
              </motion.div>
            </div>

            {/* Unanswered count hint */}
            {answers.some((a) => a === null) && (
              <p className="text-center text-xs text-slate-400">
                {answers.filter((a) => a === null).length} question{answers.filter((a) => a === null).length !== 1 ? 's' : ''} remaining
              </p>
            )}
          </motion.div>
        )}

        {/* RESULT VIEW */}
        {view === 'result' && selectedStory && (
          <motion.div key="result" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="max-w-md mx-auto">
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
                className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-5 ${pct >= 70 ? 'bg-emerald-100' : 'bg-orange-100'}`}
              >
                {pct >= 70 ? (
                  <Trophy className="w-10 h-10 text-emerald-600" />
                ) : (
                  <BookOpen className="w-10 h-10 text-orange-500" />
                )}
              </motion.div>
              <h2 className="text-2xl font-black text-slate-800 mb-1">
                {pct >= 90 ? 'Excellent!' : pct >= 70 ? 'Great job!' : 'Keep practicing!'}
              </h2>
              <p className="text-slate-500 text-sm mb-5">
                You answered {score} out of {selectedStory.questions.length} correctly
              </p>
              <div className="bg-slate-50 rounded-xl p-4 mb-6">
                <div className="text-4xl font-black text-slate-800 mb-1">{pct}%</div>
                <div className="text-slate-400 text-sm">Comprehension Score</div>
                {pct >= 70 && (
                  <div className="mt-2 text-emerald-600 font-bold text-sm">+{selectedStory.xp} XP Earned!</div>
                )}
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => { setView('reading'); setCurrentQ(0); setAnswers([]); setSelected(null); }}
                  className="btn-secondary flex-1 flex items-center justify-center gap-2 py-2.5 text-sm"
                >
                  <RotateCcw className="w-4 h-4" /> Try Again
                </button>
                <button onClick={() => setView('list')} className="btn-primary flex-1 py-2.5 text-sm">
                  More Stories
                </button>
              </div>
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
