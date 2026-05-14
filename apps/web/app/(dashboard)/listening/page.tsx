'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef, useCallback, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Headphones, Play, Pause, RotateCcw, CheckCircle2, XCircle, Volume2, Eye, EyeOff, Star, Clock, Loader2, Trash2, Sparkles } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { api } from '@/lib/api';
import toast from 'react-hot-toast';

const TRACKS = [
  {
  id: 1,
  title: 'Sääennuste',
  titleEn: 'Weather Forecast',
  level: 'A1',
  duration: '1:20',
  xp: 35,
  color: 'from-purple-500 to-violet-600',
  category: 'Daily Life',
  transcript: `Hyvää huomenta! Tänään on maanantai, toinen helmikuuta. Sää on kylmä – lämpötila on kymmenen pakkasastetta. Pohjoisessa sataa lunta runsaasti. Etelässä on pilvistä, mutta ei sadetta.

Iltapäivällä tuulee voimakkaasti. Pukekaa lämpimästi, jos menette ulos! Huomenna sää lämpenee hieman – lämpötila nousee viiteen pakkasasteeseen.

Viikonlopuksi on luvassa aurinkoinen sää. Nauttikaa ulkoilusta!`,
  questions: [
    { q: 'What is the temperature today?', options: ['-5°C', '-10°C', '+2°C', '0°C'], correct: 1 },
    { q: 'Where is it snowing heavily?', options: ['In the south', 'In the east', 'In the north', 'Everywhere'], correct: 2 },
    { q: 'What will the weather be like on the weekend?', options: ['Rainy', 'Cloudy', 'Snowy', 'Sunny'], correct: 3 },
    { q: 'What does the speaker advise if you go outside?', options: ['Bring an umbrella', 'Dress warmly', 'Stay home', 'Drive carefully'], correct: 1 },
  ],
},
{
  id: 2,
  title: 'Kaupassa',
  titleEn: 'At the Store',
  level: 'A1',
  duration: '0:55',
  xp: 25,
  color: 'from-emerald-400 to-teal-500',
  category: 'Dialogue',
  transcript: `Myyjä: Hei! Voinko auttaa?
Asiakas: Kyllä kiitos. Etsin maitotuotteita.
Myyjä: Ne ovat tuolla kolmannessa hyllyssä oikealla.
Asiakas: Paljonko tämä maito maksaa?
Myyjä: Se maksaa yksi euro seitsemänkymmentä.
Asiakas: Hyvä. Otan kaksi litraa. Onko teillä myös tuoretta leipää?
Myyjä: Kyllä, paistopiste on tuolla taustalla.
Asiakas: Kiitos paljon!
Myyjä: Ole hyvä. Hyvää päivää!`,
  questions: [
    { q: 'What is the customer looking for?', options: ['Vegetables', 'Dairy products', 'Bread', 'Meat'], correct: 1 },
    { q: 'Where are the dairy products?', options: ['First shelf on left', 'Second shelf', 'Third shelf on right', 'At the back'], correct: 2 },
    { q: 'How much does the milk cost?', options: ['€1.50', '€1.70', '€2.00', '€0.90'], correct: 1 },
    { q: 'How much milk does the customer buy?', options: ['One liter', 'Two liters', 'Three liters', 'Half a liter'], correct: 1 },
  ],
},
{
  id: 3,
  title: 'Uutislähetys',
  titleEn: 'News Broadcast',
  level: 'B1',
  duration: '2:10',
  xp: 65,
  color: 'from-blue-500 to-indigo-600',
  category: 'News',
  transcript: `Hyvää iltaa, tässä YLE Uutiset. Tänään pääuutisena: Suomen hallitus on julkistanut uuden ilmastostrategian, jonka tavoitteena on hiilineutraalius vuoteen 2035 mennessä.

Strategia sisältää merkittäviä investointeja uusiutuvaan energiaan, julkiseen liikenteeseen ja rakennusten energiatehokkuuteen. Lisäksi metsiä suojellaan entistä tiukemmin hiilinieluina.

Elinkeinoelämän edustajat ovat suhtautuneet strategiaan varauksellisesti. He pelkäävät, että nopeat muutokset voivat heikentää Suomen kilpailukykyä kansainvälisillä markkinoilla.

Ympäristöjärjestöt puolestaan pitävät tavoitteita riittämättöminä ja vaativat nopeampia toimia.

Seuraavassa uutisessa: Suomen jalkapallomaajoukko voitti Ruotsin kolmella maalilla nollaan.`,
  questions: [
    { q: 'What is Finland\'s climate goal?', options: ['Carbon neutral by 2030', 'Carbon neutral by 2035', 'Carbon neutral by 2040', 'Reduce emissions by 50%'], correct: 1 },
    { q: 'What are businesses concerned about?', options: ['Higher taxes', 'Loss of jobs', 'Competitive disadvantage', 'Energy prices'], correct: 2 },
    { q: 'What do environmental organizations think of the targets?', options: ['Too ambitious', 'Just right', 'Insufficient', 'Excellent'], correct: 2 },
    { q: 'What was the football result?', options: ['Finland won 2-0', 'Finland won 3-0', 'Draw 1-1', 'Sweden won 3-1'], correct: 1 },
  ],
},
{
  id: 4,
  title: 'Lääkärissä',
  titleEn: 'At the Doctor',
  level: 'A2',
  duration: '1:40',
  xp: 45,
  color: 'from-pink-500 to-rose-600',
  category: 'Healthcare',
  transcript: `Lääkäri: Hyvää päivää! Mikä teitä vaivaa?
Potilas: Hyvää päivää. Minulla on ollut kurkkukipua ja kuumetta kolme päivää.
Lääkäri: Kuinka korkea kuume teillä on ollut?
Potilas: Eilen illalla 38 ja puoli astetta.
Lääkäri: Ymmärrän. Onko teillä myös yskää tai nuhaa?
Potilas: Kyllä, hieman yskää. Ja olen hyvin väsynyt.
Lääkäri: Kuuntelen keuhkonne. Hengittäkää syvään... Hyvä. Teillä on flunssa. Teidän tulee levätä ja juoda paljon nesteitä. Kirjoitan reseptin kipulääkkeeseen.
Potilas: Täytyykö minun mennä töihin huomenna?
Lääkäri: Ei, jäätte kotiin vähintään kaksi päivää. Palataan asiaan, jos ette ole parempi viikon kuluessa.`,
  questions: [
    { q: 'How long has the patient had symptoms?', options: ['One day', 'Two days', 'Three days', 'A week'], correct: 2 },
    { q: 'What was the temperature last night?', options: ['37.5°C', '38°C', '38.5°C', '39°C'], correct: 2 },
    { q: 'What does the doctor prescribe?', options: ['Antibiotics', 'Cough syrup', 'Painkillers', 'Vitamins'], correct: 2 },
    { q: 'How many days should the patient stay home?', options: ['One day', 'Two days', 'Three days', 'A week'], correct: 1 },
  ],
},

{
  id: 5,
  title: 'Aamupala',
  titleEn: 'Breakfast',
  level: 'A1',
  duration: '0:45',
  xp: 20,
  color: 'from-amber-400 to-orange-500',
  category: 'Daily Life',
  transcript: `Äiti: Huomenta! Haluatko puuroa vai leipää?
Lapsi: Huomenta! Otan puuroa, kiitos.
Äiti: Hyvä. Tässä on puuroa ja marjoja. Haluatko maitoa?
Lapsi: Kyllä kiitos. Missä on lusikka?
Äiti: Lusikka on tuolla pöydällä.
Lapsi: Kiitos! Tämä puuro on hyvää.
Äiti: Syö hyvin. Tänään on pitkä päivä.`,
  questions: [
    { q: 'What does the child choose for breakfast?', options: ['Bread', 'Porridge', 'Eggs', 'Cereal'], correct: 1 },
    { q: 'What is served with the porridge?', options: ['Sugar', 'Berries', 'Honey', 'Butter'], correct: 1 },
    { q: 'What is the child looking for?', options: ['A fork', 'A knife', 'A spoon', 'A plate'], correct: 2 },
    { q: 'Where is the spoon?', options: ['In the drawer', 'On the table', 'In the kitchen', 'On the shelf'], correct: 1 },
  ],
},
{
  id: 6,
  title: 'Bussissa',
  titleEn: 'On the Bus',
  level: 'A1',
  duration: '0:50',
  xp: 20,
  color: 'from-cyan-400 to-blue-500',
  category: 'Travel',
  transcript: `Matkustaja: Hei! Meneekö tämä bussi keskustaan?
Kuljettaja: Kyllä, tämä menee keskustaan. Lippu maksaa kolme euroa.
Matkustaja: Hyvä. Tässä on viisi euroa.
Kuljettaja: Kiitos. Tässä on kaksi euroa takaisin.
Matkustaja: Missä minun pitää jäädä pois?
Kuljettaja: Keskusta on kolmas pysäkki tästä eteenpäin.
Matkustaja: Kiitos paljon!
Kuljettaja: Ole hyvä.`,
  questions: [
    { q: 'Where is the passenger going?', options: ['To the train station', 'To the city center', 'To the airport', 'To the library'], correct: 1 },
    { q: 'How much does the ticket cost?', options: ['€2.00', '€3.00', '€4.00', '€5.00'], correct: 1 },
    { q: 'How much change does the passenger get?', options: ['€1.00', '€2.00', '€3.00', 'Nothing'], correct: 1 },
    { q: 'Which stop is the city center?', options: ['First stop', 'Second stop', 'Third stop', 'Last stop'], correct: 2 },
  ],
},
{
  id: 7,
  title: 'Perhe',
  titleEn: 'Family',
  level: 'A1',
  duration: '0:40',
  xp: 15,
  color: 'from-green-400 to-emerald-500',
  category: 'Daily Life',
  transcript: `Hei! Minä olen Anna. Minulla on pieni perhe. Minun perheeseeni kuuluu äiti, isä ja kaksi veljeä. Veljet ovat minua nuorempia.

Äidin nimi on Leena. Hän on opettaja. Isän nimi on Matti. Hän on insinööri. Veljet ovat Topias ja Eemeli. Topias on kymmenen vuotta vanha ja Eemeli on kuusi.

Me asumme Helsingissä. Asumme kerrostalossa lähellä keskustaa. Minulla on myös koira. Sen nimi on Musti.`,
  questions: [
    { q: 'How many brothers does Anna have?', options: ['One', 'Two', 'Three', 'None'], correct: 1 },
    { q: 'What is Anna\'s mother\'s profession?', options: ['Engineer', 'Doctor', 'Teacher', 'Nurse'], correct: 2 },
    { q: 'Where does the family live?', options: ['In Tampere', 'In Helsinki', 'In Turku', 'In Oulu'], correct: 1 },
    { q: 'What pet does Anna have?', options: ['A cat', 'A hamster', 'A dog', 'No pet'], correct: 2 },
  ],
},
{
  id: 8,
  title: 'Kahvilassa',
  titleEn: 'At the Café',
  level: 'A1',
  duration: '0:55',
  xp: 25,
  color: 'from-yellow-400 to-amber-500',
  category: 'Dialogue',
  transcript: `Tarjoilija: Hei! Mitä saisi olla?
Asiakas: Hei! Yksi kahvi ja yksi korvapuusti, kiitos.
Tarjoilija: Tuleeko kahviin maitoa?
Asiakas: Kyllä, vähän maitoa. Ei sokeria.
Tarjoilija: Selvä. Kahvi ja korvapuusti. Se tekee kuusi euroa viisikymmentä.
Asiakas: Tässä. Voinko maksaa kortilla?
Tarjoilija: Kyllä, kortti käy. Laitatko kortin tähän.
Asiakas: Kiitos!
Tarjoilija: Ole hyvä. Kahvi on tuossa tiskillä. Istu mihin vain.`,
  questions: [
    { q: 'What does the customer order?', options: ['Tea and cake', 'Coffee and a cinnamon roll', 'Hot chocolate and a cookie', 'Coffee and a sandwich'], correct: 1 },
    { q: 'Does the customer want sugar?', options: ['Yes, a lot', 'Yes, a little', 'No sugar', 'Not mentioned'], correct: 2 },
    { q: 'How much does the order cost?', options: ['€5.50', '€6.00', '€6.50', '€7.00'], correct: 2 },
    { q: 'Where is the coffee served?', options: ['At the table', 'At the counter', 'Outside', 'Take-away only'], correct: 1 },
  ],
},
{
  id: 9,
  title: 'Värit ja numerot',
  titleEn: 'Colors and Numbers',
  level: 'A1',
  duration: '0:35',
  xp: 15,
  color: 'from-red-400 to-pink-500',
  category: 'Basics',
  transcript: `Katsotaan värejä! Taivas on sininen. Ruoho on vihreää. Aurinko on keltainen. Tomaatti on punainen. Lumi on valkoista.

Nyt numerot yhdestä kymmeneen: yksi, kaksi, kolme, neljä, viisi, kuusi, seitsemän, kahdeksan, yhdeksän, kymmenen.

Montako omenaa pöydällä on? Lasketaan yhdessä: yksi, kaksi, kolme, neljä, viisi. Pöydällä on viisi omenaa. Omenat ovat punaisia.`,
  questions: [
    { q: 'What color is the sky?', options: ['Green', 'Yellow', 'Blue', 'White'], correct: 2 },
    { q: 'What is white according to the text?', options: ['The sky', 'The grass', 'The sun', 'The snow'], correct: 3 },
    { q: 'How many apples are on the table?', options: ['Three', 'Four', 'Five', 'Six'], correct: 2 },
    { q: 'What color are the apples?', options: ['Green', 'Yellow', 'Red', 'Blue'], correct: 2 },
  ],
},
{
  id: 10,
  title: 'Mitä kello on?',
  titleEn: 'What Time Is It?',
  level: 'A1',
  duration: '0:50',
  xp: 20,
  color: 'from-indigo-400 to-purple-500',
  category: 'Basics',
  transcript: `Mitä kello on? Kello on yksi. Nyt on päivä.

Kello on kaksi. Minä syön lounasta.

Kello on kolme. Minä lähden kotiin.

Kello on kuusi. Minä syön illallista perheen kanssa.

Kello on kahdeksan. Minä katson televisiota.

Kello on kymmenen. Minä menen nukkumaan. Hyvää yötä!`,
  questions: [
    { q: 'What happens at 2 o\'clock?', options: ['Goes home', 'Eats lunch', 'Watches TV', 'Goes to sleep'], correct: 1 },
    { q: 'At what time does the person go home?', options: ['1:00', '2:00', '3:00', '6:00'], correct: 2 },
    { q: 'What does the person do at 8 o\'clock?', options: ['Eats dinner', 'Goes to sleep', 'Watches TV', 'Reads a book'], correct: 2 },
    { q: 'What time does the person go to sleep?', options: ['8:00', '9:00', '10:00', '11:00'], correct: 2 },
  ],
},
{
  id: 11,
  title: 'Vuodenajat',
  titleEn: 'Seasons',
  level: 'A1',
  duration: '0:40',
  xp: 15,
  color: 'from-teal-400 to-green-500',
  category: 'Daily Life',
  transcript: `Suomessa on neljä vuodenaikaa: kevät, kesä, syksy ja talvi.

Keväällä lumi sulaa ja linnut laulavat. Kesällä on lämmintä ja aurinkoista. Syksyllä lehdet putoavat ja sataa usein. Talvella on kylmä ja paljon lunta.

Minun lempivuodenaika on kesä. Kesällä uin järvessä ja syön jäätelöä. Mitä sinä teet kesällä?`,
  questions: [
    { q: 'How many seasons are there in Finland?', options: ['Two', 'Three', 'Four', 'Five'], correct: 2 },
    { q: 'What happens in spring?', options: ['Snow melts', 'Leaves fall', 'It is cold', 'It rains often'], correct: 0 },
    { q: 'What is the speaker\'s favorite season?', options: ['Spring', 'Summer', 'Autumn', 'Winter'], correct: 1 },
    { q: 'What does the speaker do in summer?', options: ['Skiing', 'Swimming', 'Ice skating', 'Sledding'], correct: 1 },
  ],
},
{
  id: 12,
  title: 'Harrastukset',
  titleEn: 'Hobbies',
  level: 'A1',
  duration: '0:50',
  xp: 20,
  color: 'from-lime-400 to-green-500',
  category: 'Daily Life',
  transcript: `Hei! Minä olen Mikko. Minulla on paljon harrastuksia.

Maanantaisin käyn uimahallissa. Tiistaisin soitan kitaraa. Keskiviikkoisin pelaan jalkapalloa ystävien kanssa. Torstaisin luen kirjoja. Perjantaisin katson elokuvia.

Viikonloppuna en harrasta mitään erityistä. Lauantaisin nukun pitkään ja sunnuntaisin kävelen metsässä.

Tykkään liikkua luonnossa. Luonto on kaunis kaikkina vuodenaikoina. Mikä on sinun lempiharrastus?`,
  questions: [
    { q: 'What does Mikko do on Mondays?', options: ['Plays guitar', 'Goes swimming', 'Plays football', 'Reads books'], correct: 1 },
    { q: 'On which day does Mikko play football?', options: ['Tuesday', 'Wednesday', 'Thursday', 'Friday'], correct: 1 },
    { q: 'What does Mikko do on Saturdays?', options: ['Watches movies', 'Walks in the forest', 'Sleeps late', 'Plays guitar'], correct: 2 },
    { q: 'Where does Mikko like to move?', options: ['In the city', 'In the gym', 'In nature', 'At home'], correct: 2 },
  ],
},
{
  id: 13,
  title: 'Ravintolassa',
  titleEn: 'At the Restaurant',
  level: 'A2',
  duration: '1:10',
  xp: 35,
  color: 'from-orange-400 to-red-500',
  category: 'Dialogue',
  transcript: `Tarjoilija: Hyvää iltaa! Onko teillä pöytävaraus?
Asiakas: Hyvää iltaa. Kyllä, kahdelle hengelle. Varaus on Mäkelän nimellä.
Tarjoilija: Kyllä, tässä olkaa hyvä. Ruokalista tulee hetken kuluttua.
Asiakas: Kiitos. Mitä te suosittelette tänään?
Tarjoilija: Tänään keittiön suositus on lohta ja perunamuusia. Se on todella hyvää.
Asiakas: Kuulostaa hyvältä. Minä otan lohta. Vaimoni ottaa kasviskeittoa.
Tarjoilija: Juomaksi?
Asiakas: Kaksi lasia valkoviiniä ja vesikannu, kiitos.
Tarjoilija: Selvä. Ruoka tulee noin kahdessakymmenessä minuutissa.`,
  questions: [
    { q: 'How many people is the reservation for?', options: ['One', 'Two', 'Three', 'Four'], correct: 1 },
    { q: 'What is the chef\'s recommendation?', options: ['Chicken and rice', 'Salmon and mashed potatoes', 'Vegetable soup', 'Steak and fries'], correct: 1 },
    { q: 'What does the wife order?', options: ['Salmon', 'Steak', 'Vegetable soup', 'Salad'], correct: 2 },
    { q: 'How long will the food take?', options: ['10 minutes', '15 minutes', '20 minutes', '30 minutes'], correct: 2 },
  ],
},
{
  id: 14,
  title: 'Kirjastossa',
  titleEn: 'At the Library',
  level: 'A2',
  duration: '1:15',
  xp: 35,
  color: 'from-blue-400 to-cyan-500',
  category: 'Dialogue',
  transcript: `Virkailija: Hei! Kuinka voin auttaa?
Opiskelija: Hei! Haluaisin lainata kirjoja suomen kielestä. Onko teillä selkokirjoja?
Virkailija: Kyllä on. Selkokirjat ovat tuolla toisessa kerroksessa. Siellä on myös äänikirjoja ja sanakirjoja.
Opiskelija: Tarvitsenko kirjastokortin?
Virkailija: Kyllä. Voit hankkia kortin tästä tiskiltä. Onko sinulla henkilöllisyystodistus mukana?
Opiskelija: Kyllä, tässä on passi.
Virkailija: Hyvä. Täytä tämä lomake. Lainausaika on neljä viikkoa. Voit uusia lainat verkossa.
Opiskelija: Kiitos paljon! Tämä on todella hyödyllistä.
Virkailija: Ole hyvä! Tervetuloa kirjastoon.`,
  questions: [
    { q: 'What kind of books is the student looking for?', options: ['History books', 'Easy Finnish books', 'Cookbooks', 'Travel books'], correct: 1 },
    { q: 'Where are the easy reader books?', options: ['First floor', 'Second floor', 'Third floor', 'Ground floor'], correct: 1 },
    { q: 'What does the student need to get a library card?', options: ['Money', 'A photo', 'An ID', 'A recommendation'], correct: 2 },
    { q: 'How long is the loan period?', options: ['Two weeks', 'Three weeks', 'Four weeks', 'Six weeks'], correct: 2 },
  ],
},
{
  id: 15,
  title: 'Asunnon etsintä',
  titleEn: 'Apartment Hunting',
  level: 'A2',
  duration: '1:20',
  xp: 40,
  color: 'from-purple-400 to-violet-500',
  category: 'Housing',
  transcript: `Minä olen etsimässä uutta asuntoa. Nykyinen asuntoni on liian pieni. Se on vain kaksikymmentäviisi neliömetriä.

Haluan isomman asunnon. Minulla on nyt kaksi vaihtoehtoa. Ensimmäinen on kaksio keskustassa. Se on neljäkymmentäviisi neliömetriä. Vuokra on seitsemänsataa euroa kuukaudessa. Asunto on remontoitu viime vuonna.

Toinen vaihtoehto on kolmio vähän kauempana keskustasta. Se on kuusikymmentä neliömetriä. Vuokra on kahdeksansataa viisikymmentä euroa. Siinä on oma sauna ja parveke.

Minun pitää päättää ensi viikolla. Kumpi on parempi?`,
  questions: [
    { q: 'Why is the person looking for a new apartment?', options: ['Too expensive', 'Too small', 'Too noisy', 'Too far'], correct: 1 },
    { q: 'How big is the two-room apartment?', options: ['25 m²', '45 m²', '60 m²', '70 m²'], correct: 1 },
    { q: 'What special feature does the three-room apartment have?', options: ['Balcony', 'Fireplace', 'Own sauna', 'Garden'], correct: 2 },
    { q: 'When does the person need to decide?', options: ['Today', 'This weekend', 'Next week', 'Next month'], correct: 2 },
  ],
},
{
  id: 16,
  title: 'Työhaastattelu',
  titleEn: 'Job Interview',
  level: 'A2',
  duration: '1:30',
  xp: 45,
  color: 'from-gray-400 to-slate-500',
  category: 'Work',
  transcript: `Haastattelija: Hyvää päivää! Tervetuloa työhaastatteluun. Kerrotko vähän itsestäsi?
Työnhakija: Kiitos. Olen Laura Virtanen. Olen kaksikymmentäkahdeksan vuotta vanha. Olen asunut Helsingissä viisi vuotta. Opiskelin kauppakorkeakoulussa ja valmistuin kaksi vuotta sitten.
Haastattelija: Miksi haet tätä työtä?
Työnhakija: Tämä työ vaikuttaa todella mielenkiintoiselta. Minulla on kokemusta asiakaspalvelusta ja myynnistä. Pidän tiimityöstä ja uusien asioiden oppimisesta.
Haastattelija: Mitä kieliä puhut?
Työnhakija: Puhun suomea, englantia ja vähän ruotsia. Opiskelen nyt ruotsia lisää.
Haastattelija: Hyvä. Voitko aloittaa ensi kuun alussa?
Työnhakija: Kyllä, se sopii minulle hyvin.`,
  questions: [
    { q: 'How long has Laura lived in Helsinki?', options: ['Two years', 'Three years', 'Five years', 'Ten years'], correct: 2 },
    { q: 'What did Laura study?', options: ['Medicine', 'Business', 'Law', 'Engineering'], correct: 1 },
    { q: 'What experience does Laura have?', options: ['Teaching', 'Customer service and sales', 'Programming', 'Cooking'], correct: 1 },
    { q: 'Which language is Laura currently studying more?', options: ['Finnish', 'English', 'Swedish', 'German'], correct: 2 },
  ],
},
{
  id: 17,
  title: 'Lääkäriasemalla',
  titleEn: 'At the Health Center',
  level: 'A2',
  duration: '1:25',
  xp: 40,
  color: 'from-rose-400 to-pink-500',
  category: 'Healthcare',
  transcript: `Potilas: Hyvää päivää. Minulla on aika kello kymmeneen.
Vastaanottovirkailija: Hyvää päivää. Nimi ja henkilötunnus, kiitos.
Potilas: Matti Korhonen. Henkilötunnus on 150385-123M.
Vastaanottovirkailija: Kiitos. Istukaa hetkeksi odotustilaan. Lääkäri kutsuu teidät pian.
(Myöhemmin)
Lääkäri: Hyvää päivää, herra Korhonen. Mikä tuo teidät tänne tänään?
Potilas: Selkäni on kipeä. Se alkoi viikko sitten, kun nostin raskaan laatikon.
Lääkäri: Ymmärrän. Näytättekö missä tarkalleen sattuu?
Potilas: Täällä alaselässä. Kipu on pahin aamuisin.
Lääkäri: Tutkin selkänne. Ottakaa paita pois, kiitos. Hengittäkää syvään. Kävelkää muutama askel. Hyvä. Kyseessä on lihasjännitys. Määrään teille tulehduskipulääkettä ja fysioterapiaa.`,
  questions: [
    { q: 'What time is the appointment?', options: ['9:00', '10:00', '11:00', '12:00'], correct: 1 },
    { q: 'When did the back pain start?', options: ['Yesterday', 'Three days ago', 'A week ago', 'A month ago'], correct: 2 },
    { q: 'How did the patient hurt their back?', options: ['Fell down', 'Lifted a heavy box', 'Slept badly', 'Sports injury'], correct: 1 },
    { q: 'What treatment does the doctor prescribe?', options: ['Surgery', 'Rest only', 'Painkillers and physiotherapy', 'Massage'], correct: 2 },
  ],
},
{
  id: 18,
  title: 'Matkasuunnitelmat',
  titleEn: 'Travel Plans',
  level: 'A2',
  duration: '1:15',
  xp: 35,
  color: 'from-sky-400 to-blue-500',
  category: 'Travel',
  transcript: `Ensi kesänä aion matkustaa Lappiin. Olen aina halunnut nähdä revontulet ja yöttömän yön.

Matkustan junalla Helsingistä Rovaniemelle. Junamatka kestää noin kahdeksan tuntia. Varaan yöpaikan pienestä mökistä. Mökki on järven rannalla.

Haluan patikoida kansallispuistossa ja käydä porotilalla. Ehkä menen myös kalastamaan. Kaverini sanoo, että Lapissa on kesällä paljon hyttysiä. Minun täytyy ostaa hyttysmyrkkyä.

Odotan matkaa todella paljon. Toivottavasti sää on hyvä!`,
  questions: [
    { q: 'Where is the person planning to travel?', options: ['Turku', 'Tampere', 'Lapland', 'Åland'], correct: 2 },
    { q: 'How will they travel?', options: ['By car', 'By bus', 'By plane', 'By train'], correct: 3 },
    { q: 'Where will they stay?', options: ['A hotel', 'A cottage by a lake', 'A tent', 'A friend\'s house'], correct: 1 },
    { q: 'What does the friend warn about?', options: ['Bears', 'Cold weather', 'Mosquitoes', 'Rain'], correct: 2 },
  ],
},
{
  id: 19,
  title: 'Ruokaostoksilla',
  titleEn: 'Grocery Shopping',
  level: 'A2',
  duration: '1:10',
  xp: 35,
  color: 'from-emerald-400 to-green-500',
  category: 'Daily Life',
  transcript: `On lauantai ja minun täytyy käydä ruokaostoksilla. Katson jääkaappiin ensin. Mitä puuttuu?

Maitoa on vähän jäljellä. Ostan kaksi litraa. Leipä on loppu. Ostan ruisleipää ja näkkileipää. Vihanneksia tarvitaan: porkkanoita, tomaatteja ja kurkku. Hedelmistä ostan omenoita ja banaaneja.

Tarvitsen myös kananmunia, juustoa ja voita. Lihaa en osta tänään, koska syön kasvisruokaa tällä viikolla.

Kauppaan on lyhyt matka. Kävelen sinne, koska sää on kaunis. Otan mukaan kestokassin ja ostoslistan.`,
  questions: [
    { q: 'What day is it?', options: ['Friday', 'Saturday', 'Sunday', 'Monday'], correct: 1 },
    { q: 'What kind of bread does the person buy?', options: ['White bread', 'Rye bread and crispbread', 'Toast', 'Bagel'], correct: 1 },
    { q: 'Why doesn\'t the person buy meat?', options: ['Too expensive', 'Don\'t like meat', 'Eating vegetarian this week', 'Already have meat at home'], correct: 2 },
    { q: 'How does the person go to the store?', options: ['By car', 'By bus', 'By bike', 'Walking'], correct: 3 },
  ],
},
{
  id: 20,
  title: 'Puhelimessa',
  titleEn: 'On the Phone',
  level: 'A2',
  duration: '1:05',
  xp: 30,
  color: 'from-yellow-400 to-orange-500',
  category: 'Dialogue',
  transcript: `Anna: Haloo? Anna puhelimessa.
Pekka: Hei Anna! Täällä Pekka. Mitä kuuluu?
Anna: Hei Pekka! Ihan hyvää kuuluu, kiitos. Entä sinulle?
Pekka: Hyvää myös. Kuule, ajattelin kysyä, haluaisitko tulla elokuviin lauantaina?
Anna: Se kuulostaa hauskalta. Mihin aikaan?
Pekka: Elokuva alkaa kello kuusi. Voidaan tavata asemalla varttia vaille kuusi.
Anna: Sopii! Mikä elokuva on kyseessä?
Pekka: Se on uusi suomalainen komedia. Olen kuullut, että se on todella hauska.
Anna: Loistavaa! Nähdään lauantaina.
Pekka: Nähdään! Hei hei!
Anna: Hei hei!`,
  questions: [
    { q: 'Who is calling?', options: ['Anna', 'Pekka', 'Mikko', 'Laura'], correct: 1 },
    { q: 'What are they planning to do on Saturday?', options: ['Go to a restaurant', 'Go to the movies', 'Go shopping', 'Go to a concert'], correct: 1 },
    { q: 'Where will they meet?', options: ['At the cinema', 'At the station', 'At a café', 'At home'], correct: 1 },
    { q: 'What kind of movie are they going to see?', options: ['A drama', 'An action film', 'A Finnish comedy', 'A documentary'], correct: 2 },
  ],
},
{
  id: 21,
  title: 'Päiväni',
  titleEn: 'My Day',
  level: 'A2',
  duration: '1:15',
  xp: 35,
  color: 'from-violet-400 to-purple-500',
  category: 'Daily Life',
  transcript: `Herään yleensä kello seitsemän arkisin. Ensin käyn suihkussa ja syön aamupalaa. Juon aina kupin kahvia ennen töihin lähtöä.

Lähden kotoa kahdeksalta ja kävelen bussipysäkille. Työmatka kestää noin kolmekymmentä minuuttia. Työt alkavat puoli yhdeksältä ja loppuvat neljältä.

Lounastauko on yhdeltätoista puoli kahteentoista. Syön yleensä lounasta työpaikan ruokalassa. Siellä on hyvä salaattibaari.

Työpäivän jälkeen käyn usein kuntosalilla. Illalla katson vähän televisiota tai luen kirjaa. Menen nukkumaan kymmenen aikaan. Viikonloppuisin nukun pidempään ja tapaan ystäviä.`,
  questions: [
    { q: 'What time does the person usually wake up on weekdays?', options: ['6:00', '7:00', '8:00', '9:00'], correct: 1 },
    { q: 'How long is the commute?', options: ['15 minutes', '30 minutes', '45 minutes', '1 hour'], correct: 1 },
    { q: 'Where does the person eat lunch?', options: ['At home', 'At a restaurant', 'At the workplace canteen', 'At a café'], correct: 2 },
    { q: 'What does the person do after work?', options: ['Goes home directly', 'Meets friends', 'Goes to the gym', 'Watches TV'], correct: 2 },
  ],
},
{
  id: 22,
  title: 'Asuntomessut',
  titleEn: 'Housing Fair',
  level: 'B1',
  duration: '1:50',
  xp: 55,
  color: 'from-teal-400 to-cyan-500',
  category: 'Culture',
  transcript: `Tervetuloa Suomen Asuntomessuille! Tänä vuonna messut järjestetään Oulussa. Alueella on yli kolmekymmentä taloa, ja jokaisessa on jotain ainutlaatuista.

Erityisesti kiinnostusta ovat herättäneet ekologiset puutalot. Niissä on käytetty uusiutuvia materiaaleja ja energiatehokkaita ratkaisuja. Esimerkiksi aurinkopaneelit katolla tuottavat sähköä, ja maalämpö lämmittää talon.

Toinen trendi on muunneltavat tilat. Monissa taloissa on liikuteltavia seiniä. Aamulla voit avata keittiön ja olohuoneen yhdeksi isoksi tilaksi, ja illalla sulkea makuuhuoneen erilleen.

Kävijöitä on ollut ennätyksellisen paljon. Järjestäjät arvioivat, että viikonlopun aikana messuilla vierailee yli kaksikymmentätuhatta ihmistä. Monet etsivät ideoita omaan kotiin.`,
  questions: [
    { q: 'Where is the Housing Fair held this year?', options: ['Helsinki', 'Tampere', 'Oulu', 'Turku'], correct: 2 },
    { q: 'What is special about the ecological houses?', options: ['They are very small', 'They use renewable materials and energy', 'They are underground', 'They are made of glass'], correct: 1 },
    { q: 'What is the second trend mentioned?', options: ['Smart home technology', 'Adaptable spaces', 'Indoor gardens', 'Minimalist design'], correct: 1 },
    { q: 'How many visitors are expected over the weekend?', options: ['Over 10,000', 'Over 15,000', 'Over 20,000', 'Over 30,000'], correct: 2 },
  ],
},
{
  id: 23,
  title: 'Työnhaku',
  titleEn: 'Job Search',
  level: 'B1',
  duration: '2:00',
  xp: 60,
  color: 'from-blue-400 to-indigo-500',
  category: 'Work',
  transcript: `Työnhaku on muuttunut paljon viime vuosina. Nykyään suurin osa työpaikoista löytyy verkosta, ja hakemus lähetetään sähköisesti. Mutta miten erottua joukosta?

Ensinnäkin, räätälöi hakemuksesi jokaiseen työpaikkaan. Älä lähetä samaa hakemusta kaikkialle. Lue työpaikkailmoitus huolellisesti ja mieti, mitä työnantaja todella etsii.

Toiseksi, verkostoidu aktiivisesti. Monet työpaikat täytetään ennen kuin niitä edes ilmoitetaan julkisesti. Käy alan tapahtumissa, ole aktiivinen LinkedInissä ja kerro tuttavillesi, että etsit töitä.

Kolmanneksi, valmistaudu haastatteluun kunnolla. Tutki yrityksen taustat ja mieti valmiiksi vastauksia yleisimpiin kysymyksiin. Haastattelun lopussa sinulla on yleensä mahdollisuus esittää omia kysymyksiä — käytä se tilaisuus hyvin.

Muista, että työnhaku on taito, jota voi harjoitella. Jokainen hakemus ja haastattelu opettaa jotain uutta.`,
  questions: [
    { q: 'What is the first piece of advice given?', options: ['Send many applications', 'Tailor your application', 'Call the employer', 'Use a recruitment agency'], correct: 1 },
    { q: 'Why is networking important?', options: ['It guarantees a job', 'Many jobs are filled before being advertised', 'It replaces the CV', 'It is required by law'], correct: 1 },
    { q: 'What should you do before an interview?', options: ['Arrive very early', 'Research the company background', 'Prepare a presentation', 'Bring a gift'], correct: 1 },
    { q: 'What can job searching teach you?', options: ['Nothing special', 'Something new with each application', 'Only patience', 'How to write faster'], correct: 1 },
  ],
},
{
  id: 24,
  title: 'Kestävä kehitys',
  titleEn: 'Sustainable Development',
  level: 'B1',
  duration: '2:05',
  xp: 60,
  color: 'from-green-400 to-emerald-500',
  category: 'Society',
  transcript: `Kestävä kehitys tarkoittaa, että nykyiset tarpeet tyydytetään vaarantamatta tulevien sukupolvien mahdollisuuksia. Se jaetaan usein kolmeen osa-alueeseen: ekologiseen, taloudelliseen ja sosiaaliseen kestävyyteen.

Ekologinen kestävyys keskittyy ympäristön suojeluun. Ilmastonmuutos, luonnon monimuotoisuuden väheneminen ja saastuminen ovat vakavia uhkia. Suomessa esimerkiksi metsäteollisuus joutuu tasapainottelemaan taloudellisen hyödyn ja metsien suojelun välillä.

Taloudellinen kestävyys tarkoittaa, että talous ei perustu velkaantumiseen tai luonnonvarojen ylikulutukseen. Kiertotalous on tässä keskeinen käsite — tuotteet suunnitellaan niin, että ne kestävät pitkään ja materiaalit voidaan käyttää uudelleen.

Sosiaalinen kestävyys puolestaan liittyy oikeudenmukaisuuteen, tasa-arvoon ja hyvinvointiin. Jokaisella pitäisi olla mahdollisuus koulutukseen, terveydenhuoltoon ja riittävään toimeentuloon.`,
  questions: [
    { q: 'How many dimensions of sustainable development are mentioned?', options: ['Two', 'Three', 'Four', 'Five'], correct: 1 },
    { q: 'What challenge does Finnish forest industry face?', options: ['Lack of workers', 'Balancing profit and forest protection', 'Outdated technology', 'International competition'], correct: 1 },
    { q: 'What is a key concept in economic sustainability?', options: ['Free market', 'Circular economy', 'Privatization', 'Tax reduction'], correct: 1 },
    { q: 'What does social sustainability include?', options: ['Only education', 'Justice, equality and well-being', 'Only healthcare', 'Economic growth'], correct: 1 },
  ],
},
{
  id: 25,
  title: 'Suomen koulujärjestelmä',
  titleEn: 'Finnish School System',
  level: 'B1',
  duration: '2:10',
  xp: 65,
  color: 'from-indigo-400 to-violet-500',
  category: 'Education',
  transcript: `Suomen koulujärjestelmä on herättänyt kansainvälistä kiinnostusta hyvien PISA-tulosten ansiosta. Mikä tekee siitä erityisen?

Ensinnäkin, koulutus on ilmaista esikoulusta yliopistoon asti. Tämä takaa, että kaikilla lapsilla on samat mahdollisuudet riippumatta perheen varallisuudesta. Kouluruoka on myös ilmaista, ja se on usein terveellistä ja monipuolista.

Peruskoulu kestää yhdeksän vuotta, ja oppilaat aloittavat koulun vasta seitsemänvuotiaina. Tämä on myöhemmin kuin useimmissa muissa maissa. Ensimmäisinä vuosina painotetaan leikkiä ja sosiaalisia taitoja akateemisten taitojen sijaan.

Opettajilla on korkea koulutus. Kaikilla peruskoulun opettajilla on maisterin tutkinto. Opettajan ammattia arvostetaan yhteiskunnassa, ja opettajilla on paljon vapautta suunnitella opetustaan.

Viime vuosina on kuitenkin keskusteltu koulujen eriarvoistumisesta ja oppimistulosten laskusta. Hallitus on luvannut lisätä rahoitusta peruskouluihin.`,
  questions: [
    { q: 'Why has Finland\'s school system gained international attention?', options: ['Long school days', 'Good PISA results', 'Strict discipline', 'Private schools'], correct: 1 },
    { q: 'At what age do children start school in Finland?', options: ['Five', 'Six', 'Seven', 'Eight'], correct: 2 },
    { q: 'What qualification do primary school teachers have?', options: ['Bachelor\'s degree', 'Master\'s degree', 'Doctorate', 'Vocational training'], correct: 1 },
    { q: 'What recent concern is mentioned?', options: ['Teacher shortage', 'Inequality and declining results', 'Too many students', 'Outdated buildings'], correct: 1 },
  ],
},
{
  id: 26,
  title: 'Suomalainen sauna',
  titleEn: 'Finnish Sauna',
  level: 'B1',
  duration: '1:55',
  xp: 55,
  color: 'from-red-400 to-orange-500',
  category: 'Culture',
  transcript: `Sauna on yksi Suomen tunnetuimmista symboleista. Sana "sauna" on itse asiassa suomen kielen lainasana monissa kielissä. Mutta sauna on paljon enemmän kuin pelkkä kuuma huone — se on syvällä suomalaisessa kulttuurissa ja historiassa.

Suomessa on arviolta yli kolme miljoonaa saunaa, mikä on uskomaton määrä viiden ja puolen miljoonan asukkaan maassa. Saunoja on kodeissa, kerrostaloissa, toimistoissa ja jopa eduskunnassa.

Perinteisesti saunotaan lauantaisin, mutta nykyään monet käyvät saunassa useammin. Saunassa viihdytään tyypillisesti kymmenestä kahteenkymmeneen minuuttiin kerrallaan. Välillä käydään vilvoittelemassa ulkona tai järvessä, myös talvella avannossa.

Saunalla on myös sosiaalinen merkitys. Liikemiehet ovat perinteisesti neuvotelleet saunassa, ja monet tärkeät päätökset on syntynyt saunan lauteilla. Nykyään sauna on paikka, jossa kaikki ovat tasa-arvoisia — puvut ja tittelit jäävät pukuhuoneeseen.`,
  questions: [
    { q: 'How many saunas are there approximately in Finland?', options: ['One million', 'Two million', 'Over three million', 'Five million'], correct: 2 },
    { q: 'How long do people typically stay in the sauna at a time?', options: ['5-10 minutes', '10-20 minutes', '30-45 minutes', 'One hour'], correct: 1 },
    { q: 'What social role has the sauna played historically?', options: ['A place for celebrations', 'A place for business negotiations', 'A place for weddings', 'A place for religious ceremonies'], correct: 1 },
    { q: 'What happens to suits and titles in the sauna?', options: ['They are celebrated', 'They are discussed', 'They are left in the changing room', 'They are displayed'], correct: 2 },
  ],
},
{
  id: 27,
  title: 'Ilmastonmuutos Suomessa',
  titleEn: 'Climate Change in Finland',
  level: 'B1',
  duration: '2:15',
  xp: 65,
  color: 'from-cyan-400 to-teal-500',
  category: 'Environment',
  transcript: `Ilmastonmuutos vaikuttaa Suomeen monin tavoin. Vaikka joillekin lämpeneminen saattaa kuulostaa houkuttelevalta kylmässä maassa, seuraukset ovat vakavia.

Suomen keskilämpötila on noussut yli kaksi astetta esiteolliseen aikaan verrattuna. Tämä on kaksi kertaa nopeammin kuin maailmanlaajuinen keskiarvo. Talvet ovat lyhentyneet, ja lumipeite tulee myöhemmin ja sulaa aikaisemmin.

Erityisen huolestuttavaa on ikiroudan sulaminen Pohjois-Suomessa. Ikirouta sitoo valtavia määriä hiiltä, ja sen sulaessa vapautuu kasvihuonekaasuja ilmakehään. Tämä kiihdyttää ilmastonmuutosta entisestään.

Toisaalta lämpeneminen pidentää kasvukautta, mikä saattaa hyödyttää maataloutta. Mutta samalla uudet tuholaiset ja kasvitaudit leviävät pohjoiseen. Sään ääri-ilmiöt, kuten rankkasateet ja helleaallot, ovat yleistyneet.

Suomi on sitoutunut olemaan hiilineutraali vuoteen 2035 mennessä. Tavoitteen saavuttaminen vaatii merkittäviä toimia kaikilla sektoreilla.`,
  questions: [
    { q: 'How much has Finland\'s average temperature risen?', options: ['One degree', 'Two degrees', 'Three degrees', 'Four degrees'], correct: 1 },
    { q: 'What is especially worrying in Northern Finland?', options: ['Forest fires', 'Permafrost thawing', 'Flooding', 'Drought'], correct: 1 },
    { q: 'What possible benefit of warming is mentioned?', options: ['More tourism', 'Longer growing season', 'New energy sources', 'Better fishing'], correct: 1 },
    { q: 'By what year does Finland aim to be carbon neutral?', options: ['2030', '2035', '2040', '2050'], correct: 1 },
  ],
},
{
  id: 28,
  title: 'Mökillä',
  titleEn: 'At the Summer Cottage',
  level: 'B1',
  duration: '1:55',
  xp: 55,
  color: 'from-lime-400 to-green-500',
  category: 'Culture',
  transcript: `Mökkeily on olennainen osa suomalaista elämäntapaa. Suomessa on yli puoli miljoonaa kesämökkiä, ja suurin osa suomalaisista viettää aikaa mökillä ainakin kerran vuodessa.

Mökillä eletään usein yksinkertaisemmin kuin kaupungissa. Monilla mökeillä ei ole juoksevaa vettä tai sähköä. Vesi kannetaan järvestä tai kaivosta, ja valaistus hoidetaan kynttilöillä ja öljylampuilla. Tämä paluu perusasioiden äärelle on monille juuri mökkeilyn viehätys.

Tyypillinen mökkipäivä alkaa aamukahvilla laiturilla. Sitten tehdään pieniä askareita: pilkotaan puita, lämmitetään saunaa, haetaan vettä. Iltapäivällä käydään uimassa ja illalla istutaan saunassa pitkään.

Vaikka monet nauttivat mökin rauhasta ja hiljaisuudesta, naapurimökille saatetaan poiketa kahville. Mökillä naapurit ovat usein kauempana kuin kaupungissa, mutta yhteisöllisyys on vahvaa.`,
  questions: [
    { q: 'How many summer cottages are there in Finland?', options: ['Over 100,000', 'Over 300,000', 'Over 500,000', 'Over one million'], correct: 2 },
    { q: 'What do many cottages lack?', options: ['A sauna', 'Running water or electricity', 'A fireplace', 'Windows'], correct: 1 },
    { q: 'How does a typical cottage day start?', options: ['With a swim', 'With morning coffee on the dock', 'With wood chopping', 'With sauna heating'], correct: 1 },
    { q: 'What is said about neighbors at the cottage?', options: ['They are never seen', 'They are farther away but community is strong', 'They are annoying', 'There are no neighbors'], correct: 1 },
  ],
},
{
  id: 29,
  title: 'Jokamiehenoikeudet',
  titleEn: 'Everyman\'s Rights',
  level: 'B1',
  duration: '2:05',
  xp: 60,
  color: 'from-stone-400 to-neutral-500',
  category: 'Society',
  transcript: `Jokamiehenoikeudet ovat yksi Suomen erityispiirteistä. Ne antavat kaikille oikeuden liikkua luonnossa riippumatta siitä, kuka maan omistaa. Vastaavaa järjestelmää ei ole monissa muissa maissa.

Jokamiehenoikeuksilla voit kävellä, hiihtää, pyöräillä ja ratsastaa toisen mailla, kunhan et aiheuta vahinkoa. Voit poimia marjoja ja sieniä, onkia ja veneillä. Voit myös leiriytyä tilapäisesti, kunhan pidät riittävän etäisyyden asuntoihin.

Oikeuksiin liittyy kuitenkin myös velvollisuuksia. Et saa häiritä maanomistajaa, vahingoittaa puita tai pensaita, tehdä avotulta ilman lupaa tai leiriytyä liian lähelle asutusta. Et myöskään saa roskata tai häiritä eläimiä.

Jokamiehenoikeudet eivät koske pihapiiriä, peltoja tai istutuksia. Ne eivät myöskään anna oikeutta metsästää tai kalastaa muuten kuin onkimalla.

Nämä oikeudet ovat tärkeä osa suomalaista luontosuhdetta. Ne opettavat vastuullisuutta ja kunnioitusta ympäristöä kohtaan.`,
  questions: [
    { q: 'What do Everyman\'s Rights allow you to do?', options: ['Build a house', 'Move freely in nature', 'Cut down trees', 'Hunt freely'], correct: 1 },
    { q: 'What is NOT allowed under Everyman\'s Rights?', options: ['Picking berries', 'Fishing with a rod', 'Making open fires without permission', 'Skiing'], correct: 2 },
    { q: 'What areas are excluded from Everyman\'s Rights?', options: ['Forests', 'Lakes', 'Yards and fields', 'Hiking trails'], correct: 2 },
    { q: 'What do these rights teach?', options: ['Individualism', 'Responsibility and respect for nature', 'Commercial use of forests', 'Private property rights'], correct: 1 },
  ],
},
{
  id: 30,
  title: 'Etätyön haasteet',
  titleEn: 'Challenges of Remote Work',
  level: 'B1',
  duration: '2:10',
  xp: 60,
  color: 'from-slate-400 to-gray-500',
  category: 'Work',
  transcript: `Etätyöstä tuli arkipäivää monille suomalaisille koronapandemian aikana. Vaikka monet ovat palanneet toimistoille, etätyö on jäänyt pysyväksi osaksi työelämää. Mutta millaisia haasteita etätyöhön liittyy?

Ensimmäinen haaste on työn ja vapaa-ajan raja. Kun työpiste on omassa kodissa, on vaikea lopettaa työpäivää. Monet huomaavat tekevänsä pidempää päivää kuin toimistolla. Sähköposteihin tulee vastattua myöhään illalla, ja työasiat pyörivät mielessä vapaa-ajallakin.

Toinen haaste on sosiaalinen eristyneisyys. Toimistolla syntyy spontaaneja keskusteluja kahvihuoneessa ja käytävillä. Etätyössä nämä kohtaamiset puuttuvat, ja se voi vaikuttaa sekä työhyvinvointiin että innovaatioihin.

Kolmanneksi, ergonomia kotona ei usein ole yhtä hyvä kuin toimistolla. Huono työtuoli ja väärä näytön korkeus voivat aiheuttaa niska- ja selkävaivoja.

Asiantuntijat suosittelevat säännöllisiä taukoja, selkeää työaikaa ja yhteydenpitoa työkavereihin. Hybridimalli, jossa yhdistetään etätyötä ja toimistopäiviä, on monille toimivin ratkaisu.`,
  questions: [
    { q: 'What is the first challenge of remote work mentioned?', options: ['Low salary', 'Blurred boundaries between work and free time', 'Too many meetings', 'Technical problems'], correct: 1 },
    { q: 'What is the second challenge?', options: ['Too much noise', 'Social isolation', 'Long commute', 'Expensive equipment'], correct: 1 },
    { q: 'What physical problems can poor home ergonomics cause?', options: ['Headaches only', 'Neck and back problems', 'Eye strain only', 'Leg pain'], correct: 1 },
    { q: 'What solution do experts recommend?', options: ['Only office work', 'Only remote work', 'Hybrid model', 'Shorter work week'], correct: 2 },
  ],
},
{
  id: 31,
  title: 'Suomalainen innovaatio',
  titleEn: 'Finnish Innovation',
  level: 'B2',
  duration: '2:30',
  xp: 75,
  color: 'from-blue-500 to-indigo-600',
  category: 'Technology',
  transcript: `Suomi on tunnettu innovaatioistaan, vaikka maa on pieni ja syrjäinen. Miten tällainen maa on onnistunut tuottamaan niin monta menestystarinaa? Vastaus löytyy osittain koulutusjärjestelmästä, osittain yhteiskunnan rakenteista.

Nokian nousu ja tuho on hyvin dokumentoitu tarina. Harvempi kuitenkin tietää, että Nokian romahdus itse asiassa vauhditti Suomen startup-kulttuuria. Kun tuhannet huippuosaajat irtisanottiin, he perustivat uusia yrityksiä. Tästä syntyi niin kutsuttu "Nokian perintö" — verkosto, joka on tuottanut satoja uusia teknologiayrityksiä.

Peliteollisuus on toinen menestystarina. Supercellin ja Rovion kaltaiset yritykset ovat osoittaneet, että Suomesta voi tulla maailmanluokan pelejä. Peliala työllistää nykyään tuhansia ihmisiä ja tuottaa miljardeja euroja vientituloja.

Tällä hetkellä Suomi panostaa voimakkaasti tekoälyyn, kvanttitietokoneisiin ja terveysteknologiaan. Erityisesti terveydenhuollon digitalisaatio nähdään alueena, jossa Suomella on ainutlaatuista osaamista. Rekisteritiedot, joita on kerätty vuosikymmeniä, tarjoavat arvokasta dataa tutkijoille.

Haasteena on kuitenkin kansainvälisten osaajien houkutteleminen Suomeen. Korkea verotus, kieli ja ilmasto eivät aina ole houkuttelevia tekijöitä.`,
  questions: [
    { q: 'What partly explains Finland\'s innovation success?', options: ['Natural resources', 'Education system and social structures', 'Large population', 'Geographical location'], correct: 1 },
    { q: 'What effect did Nokia\'s collapse have?', options: ['Destroyed the tech industry', 'Accelerated startup culture', 'Reduced innovation', 'Caused recession'], correct: 1 },
    { q: 'Which sectors is Finland currently investing heavily in?', options: ['Oil and gas', 'AI, quantum computing and health tech', 'Traditional manufacturing', 'Agriculture'], correct: 1 },
    { q: 'What challenge does Finland face in attracting talent?', options: ['Lack of universities', 'High taxation, language and climate', 'Political instability', 'Poor infrastructure'], correct: 1 },
  ],
},
{
  id: 32,
  title: 'Kaksikielisyys Suomessa',
  titleEn: 'Bilingualism in Finland',
  level: 'B2',
  duration: '2:25',
  xp: 70,
  color: 'from-sky-400 to-blue-600',
  category: 'Society',
  transcript: `Suomi on virallisesti kaksikielinen maa, jossa suomi ja ruotsi ovat tasavertaisia kieliä. Todellisuudessa kielitilanne on kuitenkin huomattavasti monimutkaisempi kuin laki antaa ymmärtää.

Ruotsinkielisten osuus väestöstä on noin viisi prosenttia, ja se on laskenut tasaisesti viime vuosikymmeninä. Silti ruotsin kielen asema on perustuslaissa turvattu. Tämä juontaa juurensa Suomen historiaan osana Ruotsin valtakuntaa.

Pakollinen ruotsin opiskelu herättää säännöllisesti kiivasta keskustelua. Pakkoruotsin vastustajat pitävät sitä tarpeettomana ja ehdottavat, että opiskelijat voisivat valita vapaammin opiskelemansa kielet. Kannattajat taas muistuttavat, että ruotsin taito avaa ovia pohjoismaiseen työmarkkinaan ja kulttuuriin.

Samalla muut kielet ovat nousseet merkittävään asemaan. Suomessa puhutaan nykyään yli 150 eri kieltä äidinkielenä. Venäjä, viro, arabia ja somali ovat suurimmat vähemmistökielet. Maahanmuuton myötä kielten kirjo on kasvanut nopeasti.

Tämä kehitys on herättänyt kysymyksiä siitä, pitäisikö Suomen kielipolitiikkaa uudistaa vastaamaan nykyajan monikielistä todellisuutta.`,
  questions: [
    { q: 'What percentage of Finland\'s population speaks Swedish?', options: ['About 3%', 'About 5%', 'About 10%', 'About 15%'], correct: 1 },
    { q: 'Why is Swedish constitutionally protected in Finland?', options: ['Due to EU regulations', 'Due to historical ties to Sweden', 'Due to Swedish pressure', 'Due to UN requirements'], correct: 1 },
    { q: 'How many languages are spoken as mother tongues in Finland today?', options: ['Over 50', 'Over 100', 'Over 150', 'Over 200'], correct: 2 },
    { q: 'What question has this linguistic diversity raised?', options: ['Whether to abolish Finnish', 'Whether language policy should be reformed', 'Whether to ban minority languages', 'Whether to leave the EU'], correct: 1 },
  ],
},
{
  id: 33,
  title: 'Suomen talouden haasteet',
  titleEn: 'Finland\'s Economic Challenges',
  level: 'B2',
  duration: '2:35',
  xp: 75,
  color: 'from-amber-400 to-yellow-600',
  category: 'Economics',
  transcript: `Suomen talous on kohdannut viime vuosina useita samanaikaisia haasteita, jotka ovat herättäneet huolta niin päättäjissä kuin kansalaisissakin.

Väestön ikääntyminen on ehkä suurin rakenteellinen ongelma. Suomi ikääntyy nopeammin kuin lähes mikään muu Euroopan maa. Huoltosuhde heikkenee, kun yhä useampi siirtyy eläkkeelle ja yhä harvempi on työelämässä. Tämä luo paineita julkiseen talouteen, erityisesti eläkejärjestelmään ja terveydenhuoltoon.

Julkinen velka on kasvanut huolestuttavasti. Vaikka Suomi selvisi finanssikriisistä suhteellisen hyvin, koronapandemia ja Ukrainan sota ovat lisänneet menoja merkittävästi. Hallitus on yrittänyt tasapainottaa taloutta leikkauksilla, mutta ne ovat poliittisesti vaikeita.

Tuottavuuden kasvu on hidastunut. Aiemmin Suomi nojasi vahvasti metsäteollisuuteen ja elektroniikkaan, mutta maailma on muuttunut. Uudet kasvualat eivät ole vielä täysin korvanneet menetettyjä työpaikkoja perinteisiltä aloilta.

Toisaalta Suomi on onnistunut joissakin asioissa erinomaisesti. Vihreä siirtymä tarjoaa mahdollisuuksia, ja suomalaiset puhtaan teknologian yritykset ovat hyvissä asemissa. Koulutettu työvoima ja vakaa yhteiskunta ovat edelleen Suomen vahvuuksia, joita kannattaa vaalia.`,
  questions: [
    { q: 'What is described as the biggest structural problem?', options: ['High unemployment', 'Population aging', 'Inflation', 'Trade deficit'], correct: 1 },
    { q: 'What has contributed to growing public debt?', options: ['Tax cuts only', 'Pandemic and the war in Ukraine', 'EU membership fees', 'Foreign aid'], correct: 1 },
    { q: 'What sectors did Finland traditionally rely on?', options: ['Tourism and agriculture', 'Forest industry and electronics', 'Oil and gas', 'Textiles and fashion'], correct: 1 },
    { q: 'What is mentioned as Finland\'s ongoing strength?', options: ['Cheap labor', 'Educated workforce and stable society', 'Large domestic market', 'Abundant natural resources'], correct: 1 },
  ],
},
{
  id: 34,
  title: 'Maahanmuutto ja kotoutuminen',
  titleEn: 'Immigration and Integration',
  level: 'B2',
  duration: '2:30',
  xp: 70,
  color: 'from-emerald-400 to-teal-600',
  category: 'Society',
  transcript: `Maahanmuutto Suomeen on lisääntynyt merkittävästi 1990-luvulta lähtien, ja se on muuttanut suomalaista yhteiskuntaa monin tavoin. Kotoutuminen on kuitenkin osoittautunut haastavammaksi kuin alun perin kuviteltiin.

Suomen maahanmuuttopolitiikka on perinteisesti ollut melko tiukkaa verrattuna esimerkiksi Ruotsiin. Viime vuosina humanitaarista maahanmuuttoa on kiristetty entisestään, kun taas työperäistä maahanmuuttoa on pyritty helpottamaan. Hallitus on asettanut tavoitteeksi houkutella osaajia ulkomailta.

Työllistyminen on kotoutumisen kulmakivi, mutta juuri siinä on suuria vaikeuksia. Maahanmuuttajien työttömyysaste on moninkertainen kantaväestöön verrattuna. Syitä on monia: kielitaidon puute, verkostojen puuttuminen, tutkintojen tunnustamisen vaikeudet ja toisinaan myös syrjintä työmarkkinoilla.

Toinen haaste on asuinalueiden eriytyminen. Tietyillä pääkaupunkiseudun alueilla maahanmuuttajataustaisen väestön osuus on yli neljäkymmentä prosenttia. Tämä voi hidastaa kielen oppimista ja vaikeuttaa kontaktien syntymistä kantaväestöön.

Onnistuneitakin esimerkkejä on paljon. Monet maahanmuuttajat ovat perustaneet yrityksiä, tuoneet uusia ruokia ja kulttuurivaikutteita sekä rikastuttaneet suomalaista yhteiskuntaa. Tulevaisuudessa onnistunut kotouttaminen on yksi Suomen tärkeimmistä kysymyksistä.`,
  questions: [
    { q: 'How has Finland\'s immigration policy changed recently?', options: ['More humanitarian immigration', 'Stricter humanitarian, easier work-based', 'No changes', 'Open borders'], correct: 1 },
    { q: 'What is the cornerstone of integration according to the text?', options: ['Language skills', 'Employment', 'Education', 'Cultural awareness'], correct: 1 },
    { q: 'What problem is mentioned about residential areas?', options: ['Overcrowding', 'Segregation', 'High rent', 'Poor infrastructure'], correct: 1 },
    { q: 'What positive contribution of immigrants is mentioned?', options: ['Only economic benefits', 'Starting businesses and cultural enrichment', 'Political leadership', 'Educational reform'], correct: 1 },
  ],
},
{
  id: 35,
  title: 'Ilmastokokous',
  titleEn: 'Climate Conference',
  level: 'B2',
  duration: '2:40',
  xp: 80,
  color: 'from-green-400 to-lime-600',
  category: 'Environment',
  transcript: `Kansainvälinen ilmastokokous päättyi eilen myöhään illalla, ja lopputulos herätti ristiriitaisia tunteita. Joidenkin mielestä saavutettiin historiallinen läpimurto, toisten mielestä sitoumukset ovat edelleen täysin riittämättömiä.

Kokouksen keskeisin tulos oli sopimus fossiilisten polttoaineiden tuotannon asteittaisesta vähentämisestä. Tämä on ensimmäinen kerta, kun öljy ja kaasu mainitaan nimeltä kansainvälisessä ilmastosopimuksessa. Öljyntuottajamaat vastustivat mainintaa pitkään, mutta lopulta ne taipuivat.

Kehitysmaat puolestaan pettyivät rahoituslupauksiin. Rikkaat maat lupasivat aiemmin sata miljardia dollaria vuosittain ilmastorahoitukseen, mutta lupausta ei ole täysin pidetty. Nyt perustettiin uusi rahasto, jonka tarkoituksena on korvata köyhille maille ilmastonmuutoksen aiheuttamia vahinkoja.

Suomen edustajat olivat tyytyväisiä siihen, että metsien ja hiilinielujen rooli tunnustettiin aiempaa vahvemmin. Suomi on pitkään korostanut, että metsillä on keskeinen merkitys ilmastonmuutoksen torjunnassa.

Ympäristöjärjestöt muistuttivat kuitenkin, että nykyiset sitoumukset eivät riitä pitämään maapallon keskilämpötilan nousua alle puolentoista asteen. Ne vaativat välittömiä ja konkreettisia toimia kaikilta mailta.`,
  questions: [
    { q: 'What was the main result of the conference?', options: ['Banning all fossil fuels', 'Agreement to gradually reduce fossil fuel production', 'A new carbon tax', 'No agreement was reached'], correct: 1 },
    { q: 'Why were developing countries disappointed?', options: ['Too strict regulations', 'Unfulfilled financing promises', 'Exclusion from negotiations', 'Technology transfer issues'], correct: 1 },
    { q: 'What was Finland satisfied with?', options: ['Stronger recognition of forests and carbon sinks', 'Lower emission targets', 'More time to implement changes', 'Funding for Nordic countries'], correct: 0 },
    { q: 'What do environmental organizations demand?', options: ['More research', 'Immediate and concrete actions', 'Abolishing the agreement', 'Only voluntary measures'], correct: 1 },
  ],
},
{
  id: 36,
  title: 'Koulutus murroksessa',
  titleEn: 'Education in Transition',
  level: 'B2',
  duration: '2:35',
  xp: 75,
  color: 'from-violet-400 to-purple-600',
  category: 'Education',
  transcript: `Suomalainen koulutusjärjestelmä on pitkään ollut kansainvälinen mallioppilas, mutta viimeaikaiset tulokset ovat herättäneet huolen. Miten järjestelmää pitäisi uudistaa vastaamaan tulevaisuuden tarpeita?

Oppimistulokset ovat laskeneet kaikissa keskeisissä aineissa. Erityisen huolestuttavaa on lukutaidon heikkeneminen. Vielä kaksikymmentä vuotta sitten suomalaisnuoret olivat maailman parhaita lukijoita, mutta nyt sijoitus on pudonnut merkittävästi.

Monet asiantuntijat syyttävät digitalisaatiota. Älypuhelimet ja sosiaalinen media kilpailevat nuorten huomiosta, eikä pitkäjänteinen lukeminen enää kiinnosta. Toisaalta digitalisaatio tarjoaa myös mahdollisuuksia, joita ei vielä osata täysin hyödyntää opetuksessa.

Opettajien työolot ovat heikentyneet. Luokkakoot ovat kasvaneet, erityisen tuen tarve on lisääntynyt, ja byrokratia syö aikaa varsinaiselta opetustyöltä. Moni kokenut opettaja harkitsee alanvaihtoa, eikä nuoria houkuta opettajan ammattiin entiseen tapaan.

Koulutuksen rahoitusta on leikattu vuodesta toiseen. Kunnat joutuvat tekemään vaikeita valintoja, ja usein koulutus kärsii. Samaan aikaan vaatimukset kasvavat — tulevaisuuden työelämä edellyttää yhä monipuolisempaa osaamista.

Ratkaisuiksi on ehdotettu muun muassa oppivelvollisuuden pidentämistä, panostuksia varhaiskasvatukseen ja opettajankoulutuksen uudistamista. Yksimielisyys vallitsee siitä, että jotain on tehtävä.`,
  questions: [
    { q: 'What has happened to learning results?', options: ['They have improved', 'They have declined', 'They have stayed the same', 'They fluctuate wildly'], correct: 1 },
    { q: 'What do many experts blame for declining reading skills?', options: ['Poor teachers', 'Digitalization and smartphones', 'Lack of books', 'Short school days'], correct: 1 },
    { q: 'How have teachers\' working conditions changed?', options: ['They have improved significantly', 'Class sizes have grown and bureaucracy has increased', 'Salaries have doubled', 'Working hours have decreased'], correct: 1 },
    { q: 'What solutions have been proposed?', options: ['Shorter school days', 'Extending compulsory education and investing in early childhood education', 'Abolishing schools', 'Privatizing education'], correct: 1 },
  ],
},
{
  id: 37,
  title: 'Kaupungistumisen vaikutukset',
  titleEn: 'Effects of Urbanization',
  level: 'B2',
  duration: '2:20',
  xp: 70,
  color: 'from-rose-400 to-pink-600',
  category: 'Society',
  transcript: `Kaupungistuminen on yksi aikamme merkittävimmistä trendeistä. Suomessa väestö keskittyy yhä voimakkaammin muutamiin suuriin kaupunkeihin, erityisesti pääkaupunkiseudulle, Tampereelle ja Turkuun. Samalla suuri osa maasta tyhjenee.

Helsingin seudulle ennustetaan jopa puolen miljoonan uuden asukkaan kasvua seuraavan kahdenkymmenen vuoden aikana. Tämä luo valtavia paineita asuntotuotantoon, liikenteeseen ja palveluihin. Asuntojen hinnat pääkaupunkiseudulla ovat jo nyt monien ulottumattomissa.

Maaseudulla tilanne on päinvastainen. Pienet kunnat menettävät asukkaitaan, erityisesti nuoria ja työikäisiä. Palvelut karsitaan, kun verotulot vähenevät. Koulu suljetaan, sitten terveysasema, lopulta kauppakin. Jäljelle jäävät ne, joilla ei ole varaa tai mahdollisuutta muuttaa.

Tällä kehityksellä on myös kulttuurisia seurauksia. Suomi on historiallisesti ollut maaseutuvaltainen maa, ja monet perinteet juontavat juurensa maatalousyhteiskuntaan. Kun maaseutu tyhjenee, osa tästä kulttuuriperinnöstä on vaarassa kadota.

Toisaalta kaupungistumisessa on myös myönteisiä puolia. Kaupungit ovat innovaatioiden, kulttuurin ja talouskasvun keskuksia. Tiivis asuminen on ekologisempaa kuin hajautettu yhdyskuntarakenne. Suuret ikäluokat tarvitsevat palveluita, joita on helpompi järjestää kaupungeissa.

Kysymys kuuluukin: onko Suomen järkevää yrittää pitää koko maata asuttuna, vai pitäisikö keskittyminen hyväksyä ja sopeutua siihen?`,
  questions: [
    { q: 'Which cities are attracting the most population growth?', options: ['Oulu and Rovaniemi', 'Helsinki region, Tampere and Turku', 'Vaasa and Kuopio', 'Lahti and Pori'], correct: 1 },
    { q: 'What happens to services in small municipalities?', options: ['They expand', 'They are cut as tax revenues decrease', 'They are privatized', 'They remain unchanged'], correct: 1 },
    { q: 'What cultural consequence of urbanization is mentioned?', options: ['New traditions emerging', 'Risk of losing rural cultural heritage', 'Language change', 'Religious revival'], correct: 1 },
    { q: 'What fundamental question does the text pose?', options: ['Whether to build more cities', 'Whether to accept population concentration or try to keep the whole country inhabited', 'Whether to move the capital', 'Whether to restrict immigration'], correct: 1 },
  ],
},
{
  id: 38,
  title: 'Suomen energiajärjestelmä',
  titleEn: 'Finland\'s Energy System',
  level: 'B2',
  duration: '2:35',
  xp: 75,
  color: 'from-cyan-400 to-blue-600',
  category: 'Technology',
  transcript: `Suomen energiajärjestelmä on keskellä historiallista murrosta. Maan tavoitteena on olla hiilineutraali vuoteen 2035 mennessä, ja tämä edellyttää perusteellisia muutoksia energiantuotannossa ja -kulutuksessa.

Ydinvoima muodostaa selkärangan Suomen sähköntuotannossa. Olkiluoto 3:n valmistuminen oli merkittävä virstanpylväs, vaikka projekti viivästyi yli kymmenellä vuodella ja ylitti budjettinsa moninkertaisesti. Nyt reaktori tuottaa noin neljätoista prosenttia Suomen sähköstä.

Tuulivoima on kasvanut räjähdysmäisesti. Kymmenen vuotta sitten tuulivoiman osuus sähköntuotannosta oli marginaalinen, mutta nyt se on noussut yli kymmeneen prosenttiin ja kasvaa edelleen. Tuulivoiman haaste on kuitenkin sen vaihtelevuus — tyynellä säällä tuotanto romahtaa.

Aurinkoenergian potentiaali Suomessa on yllättävän hyvä, vaikka maa ei ole aurinkoisimmasta päästä. Kesän pitkät päivät kompensoivat talven pimeyttä ainakin osittain. Aurinkopaneelien määrä on moninkertaistunut, mutta lähtötaso on edelleen matala.

Lämmityksessä siirrytään pois fossiilisista polttoaineista. Lämpöpumput, kaukolämpö ja biopolttoaineet korvaavat öljyä. Monet taloyhtiöt ja omakotitalot ovat investoineet maalämpöön.

Haasteet ovat kuitenkin mittavat. Energian varastointi, siirtoverkkojen kapasiteetti ja huoltovarmuus vaativat miljardien investointeja. Lisäksi siirtymän on oltava sosiaalisesti oikeudenmukainen, jotta kustannukset eivät kasaudu pienituloisten maksettavaksi.`,
  questions: [
    { q: 'What forms the backbone of Finland\'s electricity production?', options: ['Solar power', 'Nuclear power', 'Wind power', 'Coal'], correct: 1 },
    { q: 'What challenge does wind power face?', options: ['Too expensive', 'Variability in production', 'Public opposition', 'Lack of technology'], correct: 1 },
    { q: 'What compensates for winter darkness in solar energy?', options: ['Government subsidies', 'Long summer days', 'Battery storage', 'Import of solar panels'], correct: 1 },
    { q: 'What is required for a socially just transition?', options: ['No changes', 'Costs not burdening low-income households', 'Higher energy prices for all', 'Privatization of energy'], correct: 1 },
  ],
},
{
  id: 39,
  title: 'Tulevaisuuden työelämä',
  titleEn: 'Future of Working Life',
  level: 'B2',
  duration: '2:40',
  xp: 80,
  color: 'from-fuchsia-400 to-purple-600',
  category: 'Work',
  transcript: `Millaiselta näyttää suomalainen työelämä kymmenen tai kahdenkymmenen vuoden kuluttua? Asiantuntijat ovat yhtä mieltä siitä, että muutos on väistämätön, mutta sen suunnasta ja nopeudesta kiistellään.

Tekoäly tulee mullistamaan monia aloja. Rutiininomaiset asiantuntijatyöt, kuten kirjanpito, lakiasiakirjojen laadinta ja jopa lääketieteellinen diagnostiikka, voidaan yhä useammin automatisoida. Tämä ei välttämättä tarkoita työpaikkojen katoamista, vaan työn sisältöjen muuttumista. Ihmisen rooliksi jää tekoälyn valvonta, luova ongelmanratkaisu ja vuorovaikutus.

Jatkuva oppiminen nousee keskeiseksi taidoksi. Yhden tutkinnon varassa ei enää voi luottaa pärjäävänsä koko työuraa. Työnantajat odottavat työntekijöiltä valmiutta päivittää osaamistaan säännöllisesti. Tämä asettaa paineita koulutusjärjestelmälle, jonka on tarjottava joustavia tapoja opiskella työn ohessa.

Perinteinen työsuhde on murtumassa. Itsensätyöllistäminen, alustatyö ja projektikohtaiset toimeksiannot yleistyvät. Tämä tuo joustavuutta, mutta myös epävarmuutta. Sosiaaliturvajärjestelmä, joka on rakennettu pysyvän palkkatyön varaan, ei vastaa uuden työelämän tarpeisiin.

Työn merkityksellisyys korostuu erityisesti nuoremmilla sukupolvilla. Pelkkä palkka ei enää riitä motivaatioksi — työn on tarjottava arvostusta, kehittymismahdollisuuksia ja tunnetta siitä, että tekee jotain tärkeää. Työnantajien on otettava tämä huomioon kilpaillessaan osaavasta työvoimasta.`,
  questions: [
    { q: 'What does AI mean for professional jobs?', options: ['Complete job elimination', 'Content of work changing rather than disappearing', 'No impact', 'Only positive effects'], correct: 1 },
    { q: 'What becomes a key skill according to the text?', options: ['Manual dexterity', 'Continuous learning', 'Physical strength', 'Memorization'], correct: 1 },
    { q: 'What is happening to traditional employment relationships?', options: ['They are strengthening', 'They are breaking down', 'They are unchanged', 'They are legally mandated'], correct: 1 },
    { q: 'What do younger generations emphasize in work?', options: ['Only salary', 'Meaningfulness and appreciation', 'Short hours', 'Job security above all'], correct: 1 },
  ],
},
{
  id: 40,
  title: 'Hyvinvointivaltion tulevaisuus',
  titleEn: 'Future of the Welfare State',
  level: 'B2',
  duration: '2:45',
  xp: 80,
  color: 'from-teal-400 to-cyan-600',
  category: 'Society',
  transcript: `Pohjoismainen hyvinvointivaltio on pitkään ollut kansainvälinen esikuva. Maksuton koulutus, julkinen terveydenhuolto ja kattava sosiaaliturva ovat taanneet kansalaisille perusturvan elämän eri tilanteissa. Mutta kestääkö tämä malli tulevaisuudessa?

Väestörakenteen muutos on järjestelmän suurin haaste. Suomi vanhenee vauhdilla, ja huoltosuhde heikkenee nopeasti. Vuonna 2030 ennustetaan olevan jo yli seitsemänkymmentä tuhatta sellaista yli 65-vuotiasta, jotka tarvitsevat säännöllisiä palveluita. Samaan aikaan työikäisten määrä vähenee.

Terveydenhuollon kustannukset kasvavat paitsi ikääntymisen myös uusien hoitomuotojen vuoksi. Lääketiede kehittyy huimaa vauhtia, ja uudet hoidot ovat usein kalliita. Ihmiset myös odottavat saavansa parasta mahdollista hoitoa. Miten rajalliset resurssit pitäisi jakaa oikeudenmukaisesti?

Julkinen talous on tiukoilla, eikä veronkorotuksille näytä olevan poliittista kannatusta. Päinvastoin, monet puolueet lupaavat veronkevennyksiä. Samaan aikaan palveluiden tarve kasvaa. Yhtälö on mahdoton ilman rakenteellisia uudistuksia.

Onko hyvinvointivaltion supistaminen väistämätöntä, vai löytyykö uusia ratkaisuja? Jotkut ehdottavat perustuloa, toiset palveluiden digitalisointia ja kolmannet yksityisen ja julkisen sektorin yhteistyön lisäämistä. Yksi asia on varma: vanhalla mallilla ei voida jatkaa. Kysymys on siitä, millaisen hyvinvointivaltion haluamme tulevaisuudessa.`,
  questions: [
    { q: 'What is the biggest challenge for the welfare state?', options: ['Immigration', 'Demographic change', 'Globalization', 'Technology'], correct: 1 },
    { q: 'What is driving up healthcare costs?', options: ['Only aging', 'Aging and new expensive treatments', 'Only new treatments', 'Administrative costs'], correct: 1 },
    { q: 'What is the political reality regarding taxes?', options: ['Wide support for tax increases', 'Little political support for tax increases', 'Taxes are being abolished', 'Only corporations are taxed more'], correct: 1 },
    { q: 'What solutions are mentioned as possibilities?', options: ['Only basic income', 'Basic income, digitalization, public-private cooperation', 'Abolishing welfare entirely', 'Returning to pre-welfare state model'], correct: 1 },
  ],
},
];

const LEVEL_COLORS: Record<string, string> = {
  A1: 'bg-emerald-100 text-emerald-700',
  A2: 'bg-blue-100 text-blue-700',
  B1: 'bg-violet-100 text-violet-700',
  B2: 'bg-orange-100 text-orange-700',
};

type Track = typeof TRACKS[0];
type ViewState = 'list' | 'player' | 'result';

function AudioWave({ playing }: { playing: boolean }) {
  return (
    <div className="flex items-end gap-0.5 h-8">
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={i}
          className="w-1 bg-violet-400 rounded-full"
          animate={playing ? {
            height: [4, Math.random() * 24 + 8, 4],
          } : { height: 4 }}
          transition={playing ? {
            duration: 0.6 + Math.random() * 0.4,
            repeat: Infinity,
            delay: i * 0.05,
            ease: 'easeInOut',
          } : { duration: 0.3 }}
        />
      ))}
    </div>
  );
}

const LEVEL_COLORS_GRADIENT: Record<string, string> = {
  A1: 'from-purple-500 to-violet-600',
  A2: 'from-pink-500 to-rose-600',
  B1: 'from-blue-500 to-indigo-600',
  B2: 'from-emerald-400 to-teal-500',
};

export default function ListeningPage() {
  const { user, updateUser, refreshUser } = useAuthStore();
  const [view, setView] = useState<ViewState>('list');
  const [selectedTrack, setSelectedTrack] = useState<Track | null>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [loadingAudio, setLoadingAudio] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);
  const [quizMode, setQuizMode] = useState(false);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [filter, setFilter] = useState<'All' | 'A1' | 'A2' | 'B1' | 'B2'>('All');
  const [showGenPanel, setShowGenPanel] = useState(false);
  const [genLevel, setGenLevel] = useState<'A1' | 'A2' | 'B1' | 'B2'>('A1');
  const [genTopic, setGenTopic] = useState('');
  const [generating, setGenerating] = useState(false);
  const [generatedTracks, setGeneratedTracks] = useState<(Track & { dbId?: string })[]>([]);
  const [loadingTracks, setLoadingTracks] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [wordBar, setWordBar] = useState<{
    word: string; x: number; y: number;
    translation: string | null;
    form: string | null;
    baseForm: string | null;
    grammaticalCase: string | null;
  } | null>(null);
  const [translating, setTranslating] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!wordBar) return;
    let id: ReturnType<typeof setTimeout>;
    const close = () => setWordBar(null);
    id = setTimeout(() => document.addEventListener('click', close), 0);
    window.addEventListener('scroll', close, true);
    return () => {
      clearTimeout(id);
      document.removeEventListener('click', close);
      window.removeEventListener('scroll', close, true);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wordBar !== null]);

  const handleWordClick = useCallback(async (word: string, e: React.MouseEvent) => {
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    const clean = word.replace(/[.,!?;:"""''()[\]…—–]/g, '').trim();
    if (!clean || clean.length < 2) return;
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    const sentence = (e.target as HTMLElement).closest('p')?.textContent?.trim() || '';
    setWordBar({ word: clean, x: rect.left + rect.width / 2, y: rect.top, translation: null, form: null, baseForm: null, grammaticalCase: null });
    setTranslating(true);
    try {
      const res = await api.post('/ai/translate', { text: clean, from: 'fi', to: 'en', context: sentence });
      const d = res.data?.data || {};
      setWordBar((prev) => prev ? {
        ...prev,
        translation: d.translation || '—',
        form: d.form || null,
        baseForm: d.baseForm || null,
        grammaticalCase: d.grammaticalCase || null,
      } : null);
    } catch {
      setWordBar((prev) => prev ? { ...prev, translation: '(failed)' } : null);
    } finally {
      setTranslating(false);
    }
  }, []);

  useEffect(() => {
    api.get('/ai/listening-tracks')
      .then((res) => {
        const data = res.data.data ?? res.data;
        const tracks: (Track & { dbId?: string })[] = (Array.isArray(data) ? data : []).map((t: any) => ({
          id: t.id,
          dbId: t.id,
          title: t.title,
          titleEn: t.titleEn,
          level: t.level,
          duration: '~2:00',
          xp: t.xp,
          color: t.color,
          category: t.category,
          transcript: t.text,
          questions: t.questions as Track['questions'],
        }));
        setGeneratedTracks(tracks);
      })
      .catch(() => {})
      .finally(() => setLoadingTracks(false));
  }, []);

  const deleteGeneratedTrack = async (dbId: string) => {
    setGeneratedTracks((prev) => prev.filter((t) => t.dbId !== dbId));
    try { await api.delete(`/ai/listening-tracks/${dbId}`); } catch {}
  };
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioCacheRef = useRef<Map<number | string, string>>(new Map());

  useEffect(() => {
    return () => {
      audioRef.current?.pause();
      audioCacheRef.current.forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);

  const loadAndPlayTrack = useCallback(async (track: typeof TRACKS[0]) => {
    const startAudio = (url: string) => {
      if (audioRef.current) audioRef.current.pause();
      const audio = new Audio(url);
      audioRef.current = audio;
      audio.ontimeupdate = () => {
        if (audio.duration) setProgress((audio.currentTime / audio.duration) * 100);
      };
      audio.onended = () => { setPlaying(false); setProgress(100); };
      audio.play();
      setPlaying(true);
    };

    const cached = audioCacheRef.current.get(track.id);
    if (cached) { startAudio(cached); return; }

    setLoadingAudio(true);
    try {
      const response = await api.post('/ai/tts', { text: track.transcript }, { responseType: 'blob' });
      const url = URL.createObjectURL(response.data);
      audioCacheRef.current.set(track.id, url);
      startAudio(url);
    } catch (err) {
      console.error('TTS failed:', err);
      setPlaying(false);
    } finally {
      setLoadingAudio(false);
    }
  }, []);

  const togglePlay = () => {
    if (!selectedTrack) return;
    if (playing) {
      audioRef.current?.pause();
      setPlaying(false);
    } else if (audioRef.current && progress > 0 && progress < 100) {
      audioRef.current.play();
      setPlaying(true);
    } else {
      setProgress(0);
      loadAndPlayTrack(selectedTrack);
    }
  };

  const restartTrack = () => {
    if (audioRef.current) { audioRef.current.pause(); audioRef.current = null; }
    setProgress(0);
    setPlaying(false);
    if (selectedTrack) loadAndPlayTrack(selectedTrack);
  };

  const generateTrack = async () => {
    setGenerating(true);
    setShowGenPanel(false);
    try {
      const res = await api.post('/ai/reading/generate', { level: genLevel, topic: genTopic || undefined });
      const data = res.data.data ?? res.data;
      const questions = (data.questions as any[]).slice(0, 4).map((q: any) => ({
        q: q.q, options: q.options as string[], correct: q.correct as number,
      }));
      const saved = await api.post('/ai/listening-tracks', {
        title: data.title,
        titleEn: data.titleEn,
        level: genLevel,
        xp: data.xp ?? 50,
        color: LEVEL_COLORS_GRADIENT[genLevel],
        category: data.category ?? 'AI Generated',
        transcript: data.text,
        questions,
      });
      const savedData = saved.data.data ?? saved.data;
      const track: Track & { dbId?: string } = {
        id: savedData.id,
        dbId: savedData.id,
        title: savedData.title,
        titleEn: savedData.titleEn,
        level: genLevel,
        duration: '~2:00',
        xp: savedData.xp,
        color: savedData.color,
        category: savedData.category,
        transcript: savedData.text,
        questions,
      };
      setGeneratedTracks((prev) => [track, ...prev]);
      openTrack(track);
    } catch {
      toast.error('Failed to generate track. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  const openTrack = (track: Track) => {
    if (audioRef.current) { audioRef.current.pause(); audioRef.current = null; }
    setSelectedTrack(track);
    setView('player');
    setPlaying(false);
    setProgress(0);
    setShowTranscript(false);
    setQuizMode(false);
    setCurrentQ(0);
    setAnswers([]);
    setSelected(null);
  };

  const handleAnswer = (idx: number) => {
    if (selected !== null || !selectedTrack) return;
    setSelected(idx);
    setTimeout(() => {
      const newAnswers = [...answers, idx];
      setAnswers(newAnswers);
      if (currentQ + 1 < selectedTrack.questions.length) {
        setCurrentQ((q) => q + 1);
        setSelected(null);
      } else {
        const finalCorrect = newAnswers.filter((a, i) => a === selectedTrack.questions[i]?.correct).length;
        const finalPct = Math.round((finalCorrect / selectedTrack.questions.length) * 100);
        if (finalPct >= 70) {
          const xp = selectedTrack.xp;
          updateUser({ totalXP: (user?.totalXP || 0) + xp });
          api.post('/users/xp', { xpEarned: xp, source: 'listening' }).then(() => refreshUser()).catch(() => {});
        }
        setView('result');
      }
    }, 900);
  };

  const score = answers.filter((a, i) => a === selectedTrack?.questions[i]?.correct).length;
  const pct = selectedTrack ? Math.round((score / selectedTrack.questions.length) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Tap-to-translate tooltip */}
      {mounted && wordBar && createPortal(
        <div
          className="fixed z-[9999] bg-slate-800 text-white rounded-xl shadow-2xl px-3.5 py-2.5 pointer-events-none"
          style={{
            left: Math.max(8, Math.min(wordBar.x - 90, window.innerWidth - 200)),
            top: wordBar.y - 8,
            transform: 'translateY(-100%)',
            minWidth: 180,
            maxWidth: 260,
          }}
        >
          <div className="text-yellow-300 font-bold text-sm">{wordBar.word}</div>
          {translating ? (
            <div className="text-slate-400 text-xs mt-1 animate-pulse">Translating…</div>
          ) : (
            <>
              <div className="text-white text-sm mt-0.5 font-medium">{wordBar.form || wordBar.translation || '—'}</div>
              {(wordBar.baseForm || wordBar.grammaticalCase) && (
                <div className="border-t border-slate-600 mt-1.5 pt-1.5 flex flex-col gap-0.5">
                  {wordBar.baseForm && wordBar.baseForm !== wordBar.word && (
                    <div className="text-slate-400 text-xs">{wordBar.baseForm} = {wordBar.translation}</div>
                  )}
                  {wordBar.grammaticalCase && (
                    <div className="text-slate-500 text-xs italic">{wordBar.grammaticalCase}</div>
                  )}
                </div>
              )}
            </>
          )}
        </div>,
        document.body,
      )}

      <AnimatePresence mode="wait">

        {/* TRACK LIST */}
        {view === 'list' && (
          <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">

            {/* Toolbar */}
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => setShowGenPanel(false)}
                className={`flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-xl transition-all hover:scale-105 active:scale-95 ${
                  !showGenPanel
                    ? 'bg-gradient-to-r from-purple-500 to-violet-600 text-white shadow-md'
                    : 'bg-white border-2 border-purple-500 text-purple-600 hover:bg-purple-50'
                }`}>
                <Headphones className="w-4 h-4" /> Listening Tracks
              </button>

              <motion.button
                whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                onClick={() => setShowGenPanel((v) => !v)} disabled={generating}
                className={`flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-xl transition-all hover:scale-105 active:scale-95 disabled:opacity-60 ${
                  showGenPanel || generating
                    ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-md'
                    : 'bg-white border-2 border-violet-500 text-violet-600 hover:bg-violet-50'
                }`}>
                {generating
                  ? <><Loader2 className="w-4 h-4 animate-spin" /> Generating...</>
                  : <><Sparkles className="w-4 h-4" /> Generate with AI</>}
              </motion.button>

              <div className="hidden md:flex items-center gap-2 bg-cyan-50 border border-cyan-100 rounded-xl px-3 py-1.5">
                <Headphones className="w-4 h-4 text-cyan-600" />
                <span className="text-cyan-700 text-sm font-semibold">
                  {TRACKS.filter((t) => filter === 'All' || t.level === filter).length + generatedTracks.filter((t) => filter === 'All' || t.level === filter).length} Tracks{generatedTracks.length > 0 ? ` · ${generatedTracks.filter((t) => filter === 'All' || t.level === filter).length} saved` : ''}
                </span>
              </div>

              <div className="ml-auto flex items-center gap-2">
                <span className="text-slate-500 text-sm font-medium">Level:</span>
                {(['All', 'A1', 'A2', 'B1', 'B2'] as const).map((lvl) => (
                  <button key={lvl} onClick={() => setFilter(lvl)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      filter === lvl ? 'bg-blue-600 text-white shadow-sm' : 'bg-white border border-slate-200 text-slate-600 hover:border-blue-300'
                    }`}>{lvl}</button>
                ))}
              </div>
            </div>

            {/* Generate with AI — full two-column view */}
            {showGenPanel && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid md:grid-cols-3 gap-5"
              >
                {/* Left: controls */}
                <div className="md:col-span-2 space-y-4">
                  <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                    <h3 className="text-slate-800 font-black text-base mb-4 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-violet-500" /> Generate a Listening Track
                    </h3>

                    {/* Level selector */}
                    <div className="flex items-center gap-3 mb-5 flex-wrap">
                      <span className="text-slate-700 font-semibold text-sm">Level:</span>
                      {(['A1', 'A2', 'B1', 'B2'] as const).map((l) => (
                        <button key={l} onClick={() => setGenLevel(l)}
                          className={`px-3 py-1.5 rounded-lg text-sm font-bold transition-all ${genLevel === l ? 'bg-blue-600 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                          {l}
                        </button>
                      ))}
                    </div>

                    {/* Topic input */}
                    <div className="mb-5">
                      <label className="text-slate-600 text-sm font-semibold block mb-1.5">Topic <span className="text-slate-400 font-normal">(optional)</span></label>
                      <input
                        value={genTopic}
                        onChange={(e) => setGenTopic(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && generateTrack()}
                        placeholder="e.g. Finnish sauna, Helsinki market, winter sports…"
                        className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-violet-400/30 focus:border-violet-400 transition-all"
                      />
                    </div>

                    {/* Generate button */}
                    <motion.button
                      whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                      onClick={generateTrack} disabled={generating}
                      className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-violet-600 to-purple-600 text-white text-sm font-semibold px-5 py-3 rounded-xl shadow-sm hover:shadow-md transition-all disabled:opacity-60"
                    >
                      {generating
                        ? <><Loader2 className="w-4 h-4 animate-spin" /> Generating…</>
                        : <><Sparkles className="w-4 h-4" /> Generate Track</>}
                    </motion.button>

                    {/* Note */}
                    <p className="text-xs text-slate-400 mt-3 text-center">
                      Tracks are saved to your library and earn you <span className="text-amber-500 font-semibold">+50 XP</span> on completion.
                    </p>
                  </div>
                </div>

                {/* Right: how it works */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                  <h3 className="text-slate-700 font-black text-sm uppercase tracking-widest mb-4">How it works</h3>
                  <div className="space-y-4">
                    {[
                      { step: '1', title: 'Choose your level', desc: 'Pick A1–B2 to match your Finnish listening level.' },
                      { step: '2', title: 'Add a topic (optional)', desc: 'Guide the AI with a theme like "café" or "weather".' },
                      { step: '3', title: 'Audio is generated', desc: 'A unique Finnish audio track with transcript and quiz is created instantly.' },
                      { step: '4', title: 'Listen & earn XP', desc: 'Answer the comprehension questions to earn XP. Your track is saved to your library.' },
                    ].map(({ step, title, desc }) => (
                      <div key={step} className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white text-xs font-black flex-shrink-0 mt-0.5">
                          {step}
                        </div>
                        <div>
                          <div className="text-slate-800 text-sm font-semibold">{title}</div>
                          <div className="text-slate-400 text-xs mt-0.5 leading-relaxed">{desc}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* All Tracks Grid — only shown when generate panel is closed */}
            {!showGenPanel && (
            <div className="grid md:grid-cols-2 gap-4">
              {/* Generated tracks first */}
              {generatedTracks
                .filter((t) => filter === 'All' || t.level === filter)
                .map((track, i) => (
                  <motion.div key={track.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }} whileHover={{ y: -3 }}
                    className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden group relative">
                    <div className={`h-2 bg-gradient-to-r ${track.color}`} />
                    <div className="p-5 cursor-pointer" onClick={() => openTrack(track)}>
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${LEVEL_COLORS[track.level]}`}>{track.level}</span>
                            <span className="text-xs text-slate-400 bg-slate-50 px-2 py-0.5 rounded-full">{track.category}</span>
                            <span className="text-xs text-violet-500 bg-violet-50 px-2 py-0.5 rounded-full font-semibold flex items-center gap-1"><Sparkles className="w-2.5 h-2.5" />AI</span>
                          </div>
                          <h3 className="text-slate-800 font-black text-base">{track.title}</h3>
                          <p className="text-slate-500 text-xs">{track.titleEn}</p>
                        </div>
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${track.color} flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform`}>
                          <Play className="w-5 h-5 text-white fill-white" />
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-slate-400">
                        <div className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{track.duration}</div>
                        <div className="flex items-center gap-1"><Star className="w-3.5 h-3.5 text-amber-400" />+{track.xp} XP</div>
                        <div className="flex items-center gap-1"><Volume2 className="w-3.5 h-3.5" />{track.questions.length} questions</div>
                      </div>
                    </div>
                    <button onClick={(e) => { e.stopPropagation(); if (track.dbId) deleteGeneratedTrack(track.dbId); }}
                      className="absolute top-4 right-4 p-1.5 rounded-lg bg-slate-100 hover:bg-red-100 hover:text-red-500 text-slate-400 transition-all opacity-0 group-hover:opacity-100">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </motion.div>
                ))}

              {/* Static tracks */}
              {TRACKS
                .filter((t) => filter === 'All' || t.level === filter)
                .map((track, i) => (
                  <motion.div key={track.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.07 }} whileHover={{ y: -3 }}
                    onClick={() => openTrack(track)}
                    className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden cursor-pointer group">
                    <div className={`h-2 bg-gradient-to-r ${track.color}`} />
                    <div className="p-5">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${LEVEL_COLORS[track.level]}`}>{track.level}</span>
                            <span className="text-xs text-slate-400 bg-slate-50 px-2 py-0.5 rounded-full">{track.category}</span>
                          </div>
                          <h3 className="text-slate-800 font-black text-base">{track.title}</h3>
                          <p className="text-slate-500 text-xs">{track.titleEn}</p>
                        </div>
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${track.color} flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform`}>
                          <Play className="w-5 h-5 text-white fill-white" />
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-slate-400">
                        <div className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{track.duration}</div>
                        <div className="flex items-center gap-1"><Star className="w-3.5 h-3.5 text-amber-400" />+{track.xp} XP</div>
                        <div className="flex items-center gap-1"><Volume2 className="w-3.5 h-3.5" />{track.questions.length} questions</div>
                      </div>
                    </div>
                  </motion.div>
                ))}
            </div>
            )}
          </motion.div>
        )}

        {/* PLAYER VIEW */}
        {view === 'player' && selectedTrack && !quizMode && (
          <motion.div key="player" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="max-w-2xl mx-auto space-y-4">
            <button onClick={() => { if (audioRef.current) { audioRef.current.pause(); audioRef.current = null; } setView('list'); }} className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-all">
              ← Back to tracks
            </button>

            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <div className={`h-2 bg-gradient-to-r ${selectedTrack.color}`} />
              <div className="p-6">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${LEVEL_COLORS[selectedTrack.level]}`}>{selectedTrack.level}</span>
                  <span className="text-xs text-slate-400">{selectedTrack.category}</span>
                </div>
                <h2 className="text-xl font-black text-slate-800 mb-4">{selectedTrack.title} — {selectedTrack.titleEn}</h2>

                {/* Player */}
                <div className={`rounded-xl p-6 mb-4 bg-gradient-to-br ${selectedTrack.color} relative overflow-hidden`}>
                  <div className="absolute inset-0 bg-black/10" />
                  <div className="relative flex flex-col items-center gap-4">
                    <AudioWave playing={playing} />
                    <div className="w-full bg-white/20 h-1.5 rounded-full overflow-hidden">
                      <motion.div className="h-full bg-white rounded-full" animate={{ width: `${progress}%` }} transition={{ duration: 0.1 }} />
                    </div>
                    <div className="flex items-center gap-4">
                      <button onClick={restartTrack} className="p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-all">
                        <RotateCcw className="w-4 h-4" />
                      </button>
                      <button
                        onClick={togglePlay}
                        disabled={loadingAudio}
                        className="w-14 h-14 rounded-full bg-white flex items-center justify-center shadow-lg hover:scale-105 transition-transform disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
                      >
                        {loadingAudio
                          ? <Loader2 className="w-6 h-6 text-violet-600 animate-spin" />
                          : playing
                          ? <Pause className="w-6 h-6 text-violet-600" />
                          : <Play className="w-6 h-6 text-violet-600 fill-violet-600 ml-0.5" />
                        }
                      </button>
                      <button onClick={() => setShowTranscript((s) => !s)} className="p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-all">
                        {showTranscript ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    <span className="text-white/70 text-xs">{showTranscript ? 'Hide transcript' : 'Show transcript'}</span>
                  </div>
                </div>

                <AnimatePresence>
                  {showTranscript && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="bg-slate-50 rounded-xl p-4 border border-slate-200 mb-4 text-slate-600 text-sm leading-7 overflow-hidden"
                    >
                      <p className="text-xs text-slate-400 mb-2 italic">Tap any word to translate</p>
                      {selectedTrack.transcript.split('\n').map((para, pi) =>
                        para.trim() === '' ? <br key={pi} /> : (
                          <p key={pi} className="mb-1">
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
                        )
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>

                <motion.button
                  whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
                  onClick={() => { if (audioRef.current) { audioRef.current.pause(); } setQuizMode(true); setCurrentQ(0); setAnswers([]); setSelected(null); }}
                  className="btn-primary w-full py-3 text-sm"
                >
                  Answer Comprehension Questions →
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}

        {/* QUIZ MODE */}
        {view === 'player' && selectedTrack && quizMode && (
          <motion.div key="quiz" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="max-w-xl mx-auto">
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <span className="text-slate-500 text-sm">Question {currentQ + 1} of {selectedTrack.questions.length}</span>
                <div className="flex gap-1">
                  {selectedTrack.questions.map((_, i) => (
                    <div key={i} className={`h-1.5 w-8 rounded-full ${i < currentQ ? 'bg-violet-500' : i === currentQ ? 'bg-violet-300' : 'bg-slate-200'}`} />
                  ))}
                </div>
              </div>
              <motion.div key={currentQ} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                <h3 className="text-slate-800 font-bold text-lg mb-5">{selectedTrack.questions[currentQ].q}</h3>
                <div className="space-y-2.5">
                  {selectedTrack.questions[currentQ].options.map((opt, idx) => {
                    const isCorrect = idx === selectedTrack.questions[currentQ].correct;
                    const isSelected = selected === idx;
                    return (
                      <motion.button
                        key={idx}
                        whileHover={selected === null ? { x: 4 } : {}}
                        onClick={() => handleAnswer(idx)}
                        className={`w-full flex items-center gap-3 p-4 rounded-xl border text-left transition-all ${
                          selected === null
                            ? 'border-slate-200 hover:border-violet-300 hover:bg-violet-50 text-slate-700'
                            : isSelected && isCorrect ? 'border-emerald-400 bg-emerald-50 text-emerald-700'
                            : isSelected && !isCorrect ? 'border-red-400 bg-red-50 text-red-700'
                            : isCorrect ? 'border-emerald-400 bg-emerald-50 text-emerald-700'
                            : 'border-slate-200 bg-slate-50 text-slate-400'
                        }`}
                      >
                        <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                          selected === null ? 'bg-slate-100 text-slate-500' :
                          isSelected && isCorrect ? 'bg-emerald-400 text-white' :
                          isSelected && !isCorrect ? 'bg-red-400 text-white' :
                          isCorrect ? 'bg-emerald-400 text-white' : 'bg-slate-100 text-slate-400'
                        }`}>{String.fromCharCode(65 + idx)}</span>
                        <span className="font-medium text-sm">{opt}</span>
                        {selected !== null && isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-500 ml-auto" />}
                        {selected !== null && isSelected && !isCorrect && <XCircle className="w-4 h-4 text-red-500 ml-auto" />}
                      </motion.button>
                    );
                  })}
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* RESULT */}
        {view === 'result' && selectedTrack && (
          <motion.div key="result" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-md mx-auto">
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 text-center">
              <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 ${pct >= 70 ? 'bg-violet-100' : 'bg-orange-100'}`}>
                <Headphones className={`w-8 h-8 ${pct >= 70 ? 'text-violet-600' : 'text-orange-500'}`} />
              </div>
              <h2 className="text-2xl font-black text-slate-800 mb-1">{pct >= 80 ? 'Excellent hearing!' : pct >= 60 ? 'Good job!' : 'Keep listening!'}</h2>
              <p className="text-slate-500 text-sm mb-5">{score}/{selectedTrack.questions.length} correct answers</p>
              <div className="bg-slate-50 rounded-xl p-4 mb-6">
                <div className="text-4xl font-black text-slate-800">{pct}%</div>
                {pct >= 70 && <div className="text-emerald-600 font-bold text-sm mt-1">+{selectedTrack.xp} XP Earned!</div>}
              </div>
              <div className="flex gap-3">
                <button onClick={() => { setView('player'); setQuizMode(false); setProgress(0); }} className="btn-secondary flex-1 py-2.5 text-sm flex items-center justify-center gap-2">
                  <RotateCcw className="w-4 h-4" /> Listen Again
                </button>
                <button onClick={() => setView('list')} className="btn-primary flex-1 py-2.5 text-sm">More Tracks</button>
              </div>
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
