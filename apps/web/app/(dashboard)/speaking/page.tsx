'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef, useEffect, useCallback } from 'react';
import { Mic, MicOff, Volume2, RefreshCw, ChevronRight, CheckCircle2, Info, Loader2, Wand2, Zap, Sparkles, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';

const SPEAKING_SETS = [
  {
    id: 1,
    title: 'Basic Greetings',
    titleFi: 'Perustervehdykset',
    level: 'A1',
    xp: 20,
    color: 'from-emerald-400 to-teal-500',
    category: 'Greetings',
    phrases: [
      { fi: 'Hyvää huomenta', en: 'Good morning', tip: 'hü-vää huo-men-ta' },
      { fi: 'Hyvää päivää', en: 'Good afternoon', tip: 'hü-vää päi-vää' },
      { fi: 'Hyvää iltaa', en: 'Good evening', tip: 'hü-vää il-taa' },
      { fi: 'Hei, miten menee?', en: 'Hi, how are you?', tip: 'hei mi-ten me-nee' },
      { fi: 'Kiitos, hyvin.', en: 'Thank you, fine.', tip: 'kii-tos hü-vin' },
      { fi: 'Nähdään huomenna!', en: 'See you tomorrow!', tip: 'näh-dään huo-men-na' },
    ],
  },
  {
    id: 2,
    title: 'At the Café',
    titleFi: 'Kahvilassa',
    level: 'A2',
    xp: 30,
    color: 'from-amber-400 to-orange-500',
    category: 'Dialogue',
    phrases: [
      { fi: 'Haluaisin tilata kahvin, kiitos', en: 'I would like to order a coffee, please', tip: 'ha-lu-ai-sin ti-la-ta kah-vin kii-tos' },
      { fi: 'Onko teillä kauramaito?', en: 'Do you have oat milk?', tip: 'on-ko teil-lä kau-ra-mai-to' },
      { fi: 'Paljonko tämä maksaa?', en: 'How much does this cost?', tip: 'pal-jon-ko tä-mä mak-saa' },
      { fi: 'Saanko kuitin, kiitos?', en: 'Can I have a receipt, please?', tip: 'saan-ko kui-tin kii-tos' },
      { fi: 'Voisinko saada lasillisen vettä?', en: 'Could I get a glass of water?', tip: 'voi-sin-ko saa-da la-sil-li-sen vet-tä' },
      { fi: 'Se oli todella hyvää!', en: 'That was really good!', tip: 'se o-li to-del-la hü-vää' },
    ],
  },
  {
    id: 3,
    title: 'Talking about Hobbies',
    titleFi: 'Harrastuksista puhuminen',
    level: 'B1',
    xp: 45,
    color: 'from-violet-500 to-purple-600',
    category: 'Daily Life',
    phrases: [
      { fi: 'Harrastan lukemista ja valokuvausta', en: 'I do reading and photography as hobbies', tip: 'har-ras-tan lu-ke-mis-ta ja val-o-ku-vaus-ta' },
      { fi: 'Käyn kuntosalilla kolmesti viikossa', en: 'I go to the gym three times a week', tip: 'käün kun-to-sa-lil-la kol-mes-ti vii-kos-sa' },
      { fi: 'Suomi on kaunis maa ulkoiluun', en: 'Finland is a beautiful country for outdoor activities', tip: 'suo-mi on kau-nis maa ul-koi-luun' },
      { fi: 'Pidän erityisesti metsässä kävelystä', en: 'I especially enjoy walking in the forest', tip: 'pi-dän e-ri-tyi-ses-ti met-säs-sä kä-ve-lys-tä' },
      { fi: 'Viikonloppuisin pelaan jalkapalloa', en: 'On weekends I play football', tip: 'vii-kon-lop-puis-in pe-la-an jal-ka-pal-lo-a' },
      { fi: 'Musiikki on intohimoni', en: 'Music is my passion', tip: 'mu-siik-ki on in-to-hi-mo-ni' },
    ],
  },
  {
    id: 4,
    title: 'Expressing Opinions',
    titleFi: 'Mielipiteen ilmaiseminen',
    level: 'B2',
    xp: 60,
    color: 'from-blue-600 to-indigo-700',
    category: 'Discussion',
    phrases: [
      { fi: 'Olen täysin samaa mieltä kanssasi', en: 'I completely agree with you', tip: 'o-len täy-sin sa-maa miel-tä kans-sa-si' },
      { fi: 'Näen asian hieman eri tavalla', en: 'I see the matter slightly differently', tip: 'nä-en a-si-an hi-e-man e-ri ta-val-la' },
      { fi: 'Toisaalta täytyy ottaa huomioon...', en: 'On the other hand, one must consider...', tip: 'toi-saal-ta täy-tüy ot-taa huo-mi-oon' },
      { fi: 'Tämä on monimutkainen kysymys', en: 'This is a complex question', tip: 'tä-mä on mo-ni-mut-kai-nen küsy-müs' },
      { fi: 'Uskon, että tulevaisuus on valoisampi', en: 'I believe the future is brighter', tip: 'us-kon et-tä tu-le-vai-suus on va-loi-sam-pi' },
      { fi: 'Kaiken kaikkiaan olen optimistinen', en: 'All in all, I am optimistic', tip: 'kai-ken kaik-ki-aan o-len op-ti-mis-ti-nen' },
    ],
  },
  {
  id: 5,
  title: 'Introducing Yourself',
  titleFi: 'Itsensä esitteleminen',
  level: 'A1',
  xp: 20,
  color: 'from-sky-400 to-blue-500',
  category: 'Greetings',
  phrases: [
    { fi: 'Hei, minä olen Anna', en: 'Hi, I am Anna', tip: 'hei mi-nä o-len an-na' },
    { fi: 'Minun nimeni on Mikko', en: 'My name is Mikko', tip: 'mi-nun ni-me-ni on mik-ko' },
    { fi: 'Olen kotoisin Suomesta', en: 'I am from Finland', tip: 'o-len ko-toi-sin suo-mes-ta' },
    { fi: 'Asun Helsingissä', en: 'I live in Helsinki', tip: 'a-sun hel-sin-gis-sä' },
    { fi: 'Olen kaksikymmentä vuotta vanha', en: 'I am twenty years old', tip: 'o-len kak-si-küm-men-tä vuot-ta van-ha' },
    { fi: 'Hauska tutustua!', en: 'Nice to meet you!', tip: 'haus-ka tu-tus-tu-a' },
  ],
},
{
  id: 6,
  title: 'Numbers and Counting',
  titleFi: 'Numerot ja laskeminen',
  level: 'A1',
  xp: 20,
  color: 'from-rose-400 to-pink-500',
  category: 'Basics',
  phrases: [
    { fi: 'Yksi, kaksi, kolme', en: 'One, two, three', tip: 'ük-si kak-si kol-me' },
    { fi: 'Kuinka monta omenaa?', en: 'How many apples?', tip: 'kuin-ka mon-ta o-me-na-a' },
    { fi: 'Pöydällä on neljä kirjaa', en: 'There are four books on the table', tip: 'pöü-däl-lä on nel-jä kir-ja-a' },
    { fi: 'Minulla on kaksi koiraa', en: 'I have two dogs', tip: 'mi-nul-la on kak-si koi-ra-a' },
    { fi: 'Paljonko kello on?', en: 'What time is it?', tip: 'pal-jon-ko kel-lo on' },
    { fi: 'Kello on viisi', en: 'It is five o\'clock', tip: 'kel-lo on vii-si' },
  ],
},
{
  id: 7,
  title: 'Colors Around Us',
  titleFi: 'Värit ympärillämme',
  level: 'A1',
  xp: 20,
  color: 'from-purple-400 to-violet-500',
  category: 'Basics',
  phrases: [
    { fi: 'Taivas on sininen', en: 'The sky is blue', tip: 'tai-vas on si-ni-nen' },
    { fi: 'Ruoho on vihreää', en: 'The grass is green', tip: 'ruo-ho on vih-re-ää' },
    { fi: 'Pidän punaisesta väristä', en: 'I like the color red', tip: 'pi-dän pu-nai-ses-ta vä-ris-tä' },
    { fi: 'Auto on musta', en: 'The car is black', tip: 'au-to on mus-ta' },
    { fi: 'Lumi on valkoista', en: 'The snow is white', tip: 'lu-mi on val-kois-ta' },
    { fi: 'Mikä on lempivärisi?', en: 'What is your favorite color?', tip: 'mi-kä on lem-pi-vä-ri-si' },
  ],
},
{
  id: 8,
  title: 'Family Members',
  titleFi: 'Perheenjäsenet',
  level: 'A1',
  xp: 20,
  color: 'from-emerald-400 to-green-500',
  category: 'Daily Life',
  phrases: [
    { fi: 'Tämä on minun äitini', en: 'This is my mother', tip: 'tä-mä on mi-nun äi-ti-ni' },
    { fi: 'Isäni on opettaja', en: 'My father is a teacher', tip: 'i-sä-ni on o-pet-ta-ja' },
    { fi: 'Minulla on yksi sisko', en: 'I have one sister', tip: 'mi-nul-la on ük-si sis-ko' },
    { fi: 'Veljeni on nuorempi kuin minä', en: 'My brother is younger than me', tip: 'vel-je-ni on nuo-rem-pi kuin mi-nä' },
    { fi: 'Isoäitini asuu maalla', en: 'My grandmother lives in the countryside', tip: 'i-so-äi-ti-ni a-suu maal-la' },
    { fi: 'Rakastan perhettäni', en: 'I love my family', tip: 'ra-kas-tan per-het-tä-ni' },
  ],
},
{
  id: 9,
  title: 'At Home',
  titleFi: 'Kotona',
  level: 'A1',
  xp: 20,
  color: 'from-amber-400 to-yellow-500',
  category: 'Daily Life',
  phrases: [
    { fi: 'Tämä on minun kotini', en: 'This is my home', tip: 'tä-mä on mi-nun ko-ti-ni' },
    { fi: 'Keittiö on tuolla', en: 'The kitchen is over there', tip: 'keit-ti-ö on tuol-la' },
    { fi: 'Olohuoneessa on sohva', en: 'There is a sofa in the living room', tip: 'o-lo-huo-nees-sa on soh-va' },
    { fi: 'Makuuhuone on pieni', en: 'The bedroom is small', tip: 'ma-kuu-huo-ne on pie-ni' },
    { fi: 'Kylpyhuone on oikealla', en: 'The bathroom is on the right', tip: 'kül-pü-huo-ne on oi-ke-al-la' },
    { fi: 'Ikkunasta näkyy puisto', en: 'You can see a park from the window', tip: 'ik-ku-nas-ta nä-küy puis-to' },
  ],
},
{
  id: 10,
  title: 'Food and Eating',
  titleFi: 'Ruoka ja syöminen',
  level: 'A1',
  xp: 20,
  color: 'from-orange-400 to-red-500',
  category: 'Daily Life',
  phrases: [
    { fi: 'Minulla on nälkä', en: 'I am hungry', tip: 'mi-nul-la on näl-kä' },
    { fi: 'Haluan syödä leipää', en: 'I want to eat bread', tip: 'ha-lu-an süö-dä lei-pää' },
    { fi: 'Tämä ruoka on hyvää', en: 'This food is good', tip: 'tä-mä ruo-ka on hü-vää' },
    { fi: 'Otan lisää maitoa', en: 'I will take more milk', tip: 'o-tan li-sää mai-to-a' },
    { fi: 'En pidä kalasta', en: 'I don\'t like fish', tip: 'en pi-dä ka-las-ta' },
    { fi: 'Kiitos, olen kylläinen', en: 'Thank you, I am full', tip: 'kii-tos o-len kül-läi-nen' },
  ],
},
{
  id: 11,
  title: 'Weather Talk',
  titleFi: 'Säästä puhuminen',
  level: 'A1',
  xp: 20,
  color: 'from-cyan-400 to-teal-500',
  category: 'Daily Life',
  phrases: [
    { fi: 'Tänään on kaunis ilma', en: 'Today the weather is beautiful', tip: 'tä-nään on kau-nis il-ma' },
    { fi: 'Ulkona sataa vettä', en: 'It is raining outside', tip: 'ul-ko-na sa-taa vet-tä' },
    { fi: 'Aurinko paistaa', en: 'The sun is shining', tip: 'au-rin-ko pais-taa' },
    { fi: 'Tänään on kylmä', en: 'Today it is cold', tip: 'tä-nään on kül-mä' },
    { fi: 'Tuulee todella paljon', en: 'It is really windy', tip: 'tuu-lee to-del-la pal-jon' },
    { fi: 'Huomenna sataa lunta', en: 'Tomorrow it will snow', tip: 'huo-men-na sa-taa lun-ta' },
  ],
},
{
  id: 12,
  title: 'Days and Time',
  titleFi: 'Päivät ja aika',
  level: 'A1',
  xp: 20,
  color: 'from-indigo-400 to-blue-500',
  category: 'Basics',
  phrases: [
    { fi: 'Tänään on maanantai', en: 'Today is Monday', tip: 'tä-nään on maa-nan-tai' },
    { fi: 'Huomenna on tiistai', en: 'Tomorrow is Tuesday', tip: 'huo-men-na on tiis-tai' },
    { fi: 'Viikonloppu on ihana', en: 'The weekend is wonderful', tip: 'vii-kon-lop-pu on i-ha-na' },
    { fi: 'Mihin aikaan tapaamme?', en: 'What time shall we meet?', tip: 'mi-hin ai-kaan ta-paam-me' },
    { fi: 'Herään joka aamu kello seitsemän', en: 'I wake up every morning at seven o\'clock', tip: 'he-rään jo-ka aa-mu kel-lo seit-se-män' },
    { fi: 'Menen nukkumaan myöhään', en: 'I go to sleep late', tip: 'me-nen nuk-ku-maan müö-hään' },
  ],
},
{
  id: 13,
  title: 'Getting Around',
  titleFi: 'Liikkuminen',
  level: 'A1',
  xp: 20,
  color: 'from-lime-400 to-green-500',
  category: 'Travel',
  phrases: [
    { fi: 'Missä on bussipysäkki?', en: 'Where is the bus stop?', tip: 'mis-sä on bus-si-pü-säk-ki' },
    { fi: 'Menen kävellen kauppaan', en: 'I go to the store on foot', tip: 'me-nen kä-vel-len kaup-paan' },
    { fi: 'Tämä bussi menee keskustaan', en: 'This bus goes to the city center', tip: 'tä-mä bus-si me-nee kes-kus-taan' },
    { fi: 'Paljonko lippu maksaa?', en: 'How much does the ticket cost?', tip: 'pal-jon-ko lip-pu mak-saa' },
    { fi: 'Juna lähtee laiturilta kolme', en: 'The train departs from platform three', tip: 'ju-na läh-tee lai-tu-ril-ta kol-me' },
    { fi: 'Käänny oikealle risteyksessä', en: 'Turn right at the intersection', tip: 'kään-nü oi-ke-al-le ris-te-ük-ses-sä' },
  ],
},
{
  id: 14,
  title: 'Ordering at a Restaurant',
  titleFi: 'Ravintolassa tilaaminen',
  level: 'A2',
  xp: 30,
  color: 'from-red-400 to-rose-500',
  category: 'Dialogue',
  phrases: [
    { fi: 'Voisinko saada ruokalistan, kiitos?', en: 'Could I have the menu, please?', tip: 'voi-sin-ko saa-da ruo-ka-lis-tan kii-tos' },
    { fi: 'Mitä te suosittelette tänään?', en: 'What do you recommend today?', tip: 'mi-tä te suo-si-tel-et-te tä-nään' },
    { fi: 'Otan päivän keittoa alkuruoaksi', en: 'I will have the soup of the day as a starter', tip: 'o-tan päi-vän keit-to-a al-ku-ruo-ak-si' },
    { fi: 'Onko teillä kasvisvaihtoehtoja?', en: 'Do you have vegetarian options?', tip: 'on-ko teil-lä kas-vis-vaih-to-eh-to-ja' },
    { fi: 'Lasku, kiitos', en: 'The bill, please', tip: 'las-ku kii-tos' },
    { fi: 'Saisinko vielä jälkiruokaa?', en: 'Could I still get dessert?', tip: 'sai-sin-ko vie-lä jäl-ki-ruo-kaa' },
  ],
},
{
  id: 15,
  title: 'Shopping for Clothes',
  titleFi: 'Vaatteiden ostaminen',
  level: 'A2',
  xp: 30,
  color: 'from-pink-400 to-fuchsia-500',
  category: 'Dialogue',
  phrases: [
    { fi: 'Etsin uutta talvitakkia', en: 'I am looking for a new winter coat', tip: 'et-sin uut-ta tal-vi-tak-ki-a' },
    { fi: 'Voinko sovittaa tätä paitaa?', en: 'Can I try on this shirt?', tip: 'voin-ko so-vit-taa tä-tä pai-taa' },
    { fi: 'Onko tätä muissa väreissä?', en: 'Is this available in other colors?', tip: 'on-ko tä-tä muis-sa vä-reis-sä' },
    { fi: 'Tämä on liian pieni, tarvitsen isomman koon', en: 'This is too small, I need a bigger size', tip: 'tä-mä on lii-an pie-ni tar-vit-sen i-som-man koon' },
    { fi: 'Paljonko tämä maksaa?', en: 'How much does this cost?', tip: 'pal-jon-ko tä-mä mak-saa' },
    { fi: 'Otan tämän, kiitos', en: 'I will take this one, thank you', tip: 'o-tan tä-män kii-tos' },
  ],
},
{
  id: 16,
  title: 'At the Doctor',
  titleFi: 'Lääkärissä',
  level: 'A2',
  xp: 30,
  color: 'from-blue-400 to-cyan-500',
  category: 'Healthcare',
  phrases: [
    { fi: 'Minulla on ollut kuumetta kolme päivää', en: 'I have had a fever for three days', tip: 'mi-nul-la on ol-lut kuu-met-ta kol-me päi-vää' },
    { fi: 'Kurkkuni on todella kipeä', en: 'My throat is really sore', tip: 'kurk-ku-ni on to-del-la ki-pe-ä' },
    { fi: 'Mihin aikaan vastaanotto on auki?', en: 'What time does the clinic open?', tip: 'mi-hin ai-kaan vas-taan-ot-to on au-ki' },
    { fi: 'Tarvitsen reseptin uusimisen', en: 'I need a prescription renewal', tip: 'tar-vit-sen re-sep-tin uu-si-mi-sen' },
    { fi: 'Kuinka usein minun pitää ottaa tätä lääkettä?', en: 'How often should I take this medicine?', tip: 'kuin-ka u-sein mi-nun pii-tää ot-taa tä-tä lää-ket-tä' },
    { fi: 'Voin jo paljon paremmin, kiitos', en: 'I feel much better already, thank you', tip: 'voin jo pal-jon pa-rem-min kii-tos' },
  ],
},
{
  id: 17,
  title: 'Making Plans',
  titleFi: 'Suunnitelmien tekeminen',
  level: 'A2',
  xp: 30,
  color: 'from-violet-400 to-purple-500',
  category: 'Dialogue',
  phrases: [
    { fi: 'Haluaisitko lähteä elokuviin lauantaina?', en: 'Would you like to go to the movies on Saturday?', tip: 'ha-lu-ai-sit-ko läh-te-ä e-lo-ku-viin lau-an-tai-na' },
    { fi: 'Mihin aikaan sinulle sopii?', en: 'What time suits you?', tip: 'mi-hin ai-kaan si-nul-le so-pii' },
    { fi: 'Tavataan asemalla kello kuusi', en: 'Let\'s meet at the station at six o\'clock', tip: 'ta-va-taan a-se-mal-la kel-lo kuu-si' },
    { fi: 'Valitettavasti en pääse tällä kertaa', en: 'Unfortunately I can\'t make it this time', tip: 'va-li-tet-ta-vas-ti en pää-se täl-lä ker-taa' },
    { fi: 'Sopiiko ensi viikonloppu paremmin?', en: 'Would next weekend work better?', tip: 'so-pii-ko en-si vii-kon-lop-pu pa-rem-min' },
    { fi: 'Loistava idea, nähdään silloin!', en: 'Great idea, see you then!', tip: 'lois-ta-va i-de-a näh-dään sil-loin' },
  ],
},
{
  id: 18,
  title: 'Talking About Work',
  titleFi: 'Työstä puhuminen',
  level: 'A2',
  xp: 30,
  color: 'from-slate-400 to-gray-500',
  category: 'Daily Life',
  phrases: [
    { fi: 'Olen töissä toimistossa', en: 'I work in an office', tip: 'o-len töis-sä toi-mis-tos-sa' },
    { fi: 'Työskentelen myyjänä kaupassa', en: 'I work as a salesperson in a store', tip: 'tüös-ken-te-len müü-jä-nä kau-pas-sa' },
    { fi: 'Työpäiväni alkaa kahdeksalta', en: 'My workday starts at eight', tip: 'tüö-päi-vä-ni al-kaa kah-dek-sal-ta' },
    { fi: 'Minulla on lounastauko keskipäivällä', en: 'I have a lunch break at midday', tip: 'mi-nul-la on lou-nas-tau-ko kes-ki-päi-väl-lä' },
    { fi: 'Pidän työstäni todella paljon', en: 'I like my job very much', tip: 'pi-dän tüös-tä-ni to-del-la pal-jon' },
    { fi: 'Ensi kuussa aloitan uudessa työpaikassa', en: 'Next month I will start at a new workplace', tip: 'en-si kuus-sa a-loi-tan uu-des-sa tüö-pai-kas-sa' },
  ],
},
{
  id: 19,
  title: 'Describing People',
  titleFi: 'Ihmisten kuvaileminen',
  level: 'A2',
  xp: 30,
  color: 'from-amber-400 to-orange-500',
  category: 'Daily Life',
  phrases: [
    { fi: 'Hän on pitkä ja hoikka', en: 'He/she is tall and slim', tip: 'hän on pit-kä ja hoik-ka' },
    { fi: 'Hänellä on siniset silmät ja vaaleat hiukset', en: 'He/she has blue eyes and light hair', tip: 'hä-nel-lä on si-ni-set sil-mät ja vaa-le-at hiukset' },
    { fi: 'Ystäväni on todella ystävällinen ja hauska', en: 'My friend is really kind and funny', tip: 'üs-tä-vä-ni on to-del-la üs-tä-väl-li-nen ja haus-ka' },
    { fi: 'Hän pitää urheilusta ja musiikista', en: 'He/she likes sports and music', tip: 'hän pi-tää ur-hei-lus-ta ja mu-sii-kis-ta' },
    { fi: 'Näytät tänään iloiselta', en: 'You look happy today', tip: 'näü-tät tä-nään i-loi-sel-ta' },
    { fi: 'Hän on kotoisin Ruotsista', en: 'He/she is originally from Sweden', tip: 'hän on ko-toi-sin ruot-sis-ta' },
  ],
},
{
  id: 20,
  title: 'Public Transport',
  titleFi: 'Julkinen liikenne',
  level: 'A2',
  xp: 30,
  color: 'from-teal-400 to-emerald-500',
  category: 'Travel',
  phrases: [
    { fi: 'Mistä voin ostaa matkakortin?', en: 'Where can I buy a travel card?', tip: 'mis-tä voin os-taa mat-ka-kor-tin' },
    { fi: 'Meneekö tämä juna Tampereelle?', en: 'Does this train go to Tampere?', tip: 'me-nee-kö tä-mä ju-na tam-pe-reel-le' },
    { fi: 'Mihin aikaan seuraava bussi lähtee?', en: 'What time does the next bus leave?', tip: 'mi-hin ai-kaan seu-raa-va bus-si läh-tee' },
    { fi: 'Tarvitsetko vaihtolipun?', en: 'Do you need a transfer ticket?', tip: 'tar-vit-set-ko vaih-to-li-pun' },
    { fi: 'Anteeksi, onko tämä paikka vapaa?', en: 'Excuse me, is this seat free?', tip: 'an-teek-si on-ko tä-mä paik-ka va-paa' },
    { fi: 'Jään pois seuraavalla pysäkillä', en: 'I will get off at the next stop', tip: 'jään pois seu-raa-val-la pü-sä-kil-lä' },
  ],
},
{
  id: 21,
  title: 'Grocery Shopping',
  titleFi: 'Ruokaostoksilla',
  level: 'A2',
  xp: 30,
  color: 'from-green-400 to-lime-500',
  category: 'Daily Life',
  phrases: [
    { fi: 'Tarvitsen maitoa, leipää ja kananmunia', en: 'I need milk, bread and eggs', tip: 'tar-vit-sen mai-to-a lei-pää ja ka-nan-mu-ni-a' },
    { fi: 'Missä on hedelmäosasto?', en: 'Where is the fruit section?', tip: 'mis-sä on he-del-mä-o-sas-to' },
    { fi: 'Myyttekö tuoretta kalaa?', en: 'Do you sell fresh fish?', tip: 'müüt-te-kö tuo-ret-ta ka-laa' },
    { fi: 'Otan puoli kiloa tomaatteja', en: 'I will take half a kilo of tomatoes', tip: 'o-tan puo-li ki-lo-a to-maat-te-ja' },
    { fi: 'Onko tämä tarjouksessa?', en: 'Is this on sale?', tip: 'on-ko tä-mä tar-jouk-ses-sa' },
    { fi: 'Laitatko pakkauksen kassiin, kiitos', en: 'Could you put the package in a bag, please', tip: 'lai-tat-ko pak-ka-uk-sen kas-siin kii-tos' },
  ],
},
{
  id: 22,
  title: 'Asking for Directions',
  titleFi: 'Tien kysyminen',
  level: 'A2',
  xp: 30,
  color: 'from-cyan-400 to-blue-500',
  category: 'Travel',
  phrases: [
    { fi: 'Anteeksi, missä on lähin apteekki?', en: 'Excuse me, where is the nearest pharmacy?', tip: 'an-teek-si mis-sä on lä-hin ap-teek-ki' },
    { fi: 'Onko rautatieasema kaukana täältä?', en: 'Is the train station far from here?', tip: 'on-ko rau-ta-tie-a-se-ma kau-ka-na tääl-tä' },
    { fi: 'Miten pääsen kirjastoon?', en: 'How do I get to the library?', tip: 'mi-ten pää-sen kir-jas-toon' },
    { fi: 'Jatka suoraan ja käänny vasemmalle', en: 'Continue straight and turn left', tip: 'jat-ka suo-raan ja kään-nü va-sem-mal-le' },
    { fi: 'Se on noin kymmenen minuutin kävelymatka', en: 'It is about a ten-minute walk', tip: 'se on noin küm-me-nen mi-nuu-tin kä-ve-lü-mat-ka' },
    { fi: 'Kiitos avusta, löydän kyllä perille', en: 'Thanks for the help, I will find my way', tip: 'kii-tos a-vus-ta löü-dän kül-lä pe-ril-le' },
  ],
},
{
  id: 23,
  title: 'Expressing Emotions',
  titleFi: 'Tunteiden ilmaiseminen',
  level: 'B1',
  xp: 45,
  color: 'from-rose-400 to-pink-500',
  category: 'Discussion',
  phrases: [
    { fi: 'Olen todella innoissani tästä mahdollisuudesta', en: 'I am really excited about this opportunity', tip: 'o-len to-del-la in-nois-sa-ni täs-tä mah-dol-li-suu-des-ta' },
    { fi: 'Minua hermostuttaa hieman, mutta se on normaalia', en: 'I feel a bit nervous, but that is normal', tip: 'mi-nu-a her-mos-tut-taa hi-e-man mut-ta se on nor-maa-li-a' },
    { fi: 'Olen pettynyt, koska odotin enemmän', en: 'I am disappointed because I expected more', tip: 'o-len pet-tü-nüt kos-ka o-do-tin e-nem-män' },
    { fi: 'Tämä tekee minut erittäin onnelliseksi', en: 'This makes me very happy', tip: 'tä-mä te-kee mi-nut e-rit-täin on-nel-li-sek-si' },
    { fi: 'Olen kiitollinen kaikesta saamastani avusta', en: 'I am grateful for all the help I have received', tip: 'o-len kii-tol-li-nen kai-kes-ta saa-mas-ta-ni a-vus-ta' },
    { fi: 'Välillä tunnen itseni hieman yksinäiseksi', en: 'Sometimes I feel a bit lonely', tip: 'vä-lil-lä tun-nen it-se-ni hi-e-man ük-si-näi-sek-si' },
  ],
},
{
  id: 24,
  title: 'Giving Advice',
  titleFi: 'Neuvojen antaminen',
  level: 'B1',
  xp: 45,
  color: 'from-emerald-400 to-green-500',
  category: 'Discussion',
  phrases: [
    { fi: 'Kannattaisi harkita asiaa vielä rauhassa', en: 'It would be worth considering the matter calmly', tip: 'kan-nat-tai-si har-ki-ta a-si-aa vie-lä rau-has-sa' },
    { fi: 'Sinun olisi hyvä ottaa yhteyttä asiakaspalveluun', en: 'You should contact customer service', tip: 'si-nun o-li-si hü-vä ot-taa üh-teüt-tä a-si-akas-pal-ve-luun' },
    { fi: 'Suosittelen lämpimästi tätä ravintolaa', en: 'I warmly recommend this restaurant', tip: 'suo-sit-te-len läm-pi-mäs-ti tä-tä ra-vin-to-laa' },
    { fi: 'Älä huoli, kyllä asiat järjestyvät', en: 'Don\'t worry, things will work out', tip: 'ä-lä huo-li kül-lä a-si-at jär-jes-tü-vät' },
    { fi: 'Minun mielestäni sinun kannattaa kokeilla', en: 'In my opinion, you should give it a try', tip: 'mi-nun mie-les-tä-ni si-nun kan-nat-taa ko-keil-la' },
    { fi: 'Jos olisin sinä, ottaisin asian puheeksi', en: 'If I were you, I would bring the matter up', tip: 'jos o-li-sin si-nä ot-tai-sin a-si-an pu-heek-si' },
  ],
},
{
  id: 25,
  title: 'Discussing News',
  titleFi: 'Uutisista keskusteleminen',
  level: 'B1',
  xp: 45,
  color: 'from-blue-400 to-indigo-500',
  category: 'Discussion',
  phrases: [
    { fi: 'Luitko tämän päivän lehdestä tuon artikkelin?', en: 'Did you read that article in today\'s paper?', tip: 'luit-ko tä-män päi-vän leh-des-tä tuon ar-tik-ke-lin' },
    { fi: 'Minusta tämä on huolestuttava kehityssuunta', en: 'I find this a worrying trend', tip: 'mi-nus-ta tä-mä on huo-les-tut-ta-va ke-hi-tüs-suun-ta' },
    { fi: 'Asiasta on esitetty monenlaisia mielipiteitä', en: 'Various opinions have been expressed on the matter', tip: 'a-si-as-ta on e-si-tet-tü mo-nen-lai-si-a mie-li-pi-tei-tä' },
    { fi: 'Mielenkiintoista, kerro lisää', en: 'Interesting, tell me more', tip: 'mie-len-kiin-tois-ta ker-ro li-sää' },
    { fi: 'Olen eri mieltä tuosta väitteestä', en: 'I disagree with that claim', tip: 'o-len e-ri miel-tä tuos-ta väit-tees-tä' },
    { fi: 'Tilanne on monimutkaisempi kuin miltä näyttää', en: 'The situation is more complex than it seems', tip: 'ti-lan-ne on mo-ni-mut-kai-sem-pi kuin mil-tä näüt-tää' },
  ],
},
{
  id: 26,
  title: 'At the Bank',
  titleFi: 'Pankissa',
  level: 'B1',
  xp: 45,
  color: 'from-amber-400 to-yellow-500',
  category: 'Dialogue',
  phrases: [
    { fi: 'Haluaisin avata käyttötilin', en: 'I would like to open a current account', tip: 'ha-lu-ai-sin a-va-ta käüt-tö-ti-lin' },
    { fi: 'Mitä asiakirjoja tarvitsen mukaan?', en: 'What documents do I need to bring?', tip: 'mi-tä a-si-akir-jo-ja tar-vit-sen mu-kaan' },
    { fi: 'Haluaisin keskustella lainamahdollisuuksista', en: 'I would like to discuss loan options', tip: 'ha-lu-ai-sin kes-kus-tel-la lai-na-mah-dol-li-suuk-sis-ta' },
    { fi: 'Voinko nostaa rahaa ilman korttia?', en: 'Can I withdraw money without a card?', tip: 'voin-ko nos-taa ra-haa il-man kort-ti-a' },
    { fi: 'Mikä on tilin korko tällä hetkellä?', en: 'What is the interest rate on the account at the moment?', tip: 'mi-kä on ti-lin kor-ko täl-lä het-kel-lä' },
    { fi: 'Tarvitsen vahvistuksen tästä maksusta', en: 'I need a confirmation of this payment', tip: 'tar-vit-sen vah-vis-tuk-sen täs-tä mak-sus-ta' },
  ],
},
{
  id: 27,
  title: 'Explaining Problems',
  titleFi: 'Ongelmien selittäminen',
  level: 'B1',
  xp: 45,
  color: 'from-red-400 to-orange-500',
  category: 'Discussion',
  phrases: [
    { fi: 'Minulla on pieni ongelma, voisitko auttaa?', en: 'I have a small problem, could you help?', tip: 'mi-nul-la on pie-ni on-gel-ma voi-sit-ko aut-taa' },
    { fi: 'Asia on hieman monimutkainen, mutta yritän selittää', en: 'The matter is a bit complex, but I will try to explain', tip: 'a-si-a on hi-e-man mo-ni-mut-kai-nen mut-ta ü-ri-tän se-lit-tää' },
    { fi: 'Internet-yhteys ei toimi kunnolla', en: 'The internet connection is not working properly', tip: 'in-ter-net-üh-te-üs ei to-mi kun-nol-la' },
    { fi: 'Olen yrittänyt soittaa, mutta kukaan ei vastaa', en: 'I have tried to call, but no one answers', tip: 'o-len ü-rit-tä-nüt soit-taa mut-ta ku-kaan ei vas-taa' },
    { fi: 'Tilaukseni ei ole saapunut vielä', en: 'My order has not arrived yet', tip: 'ti-la-uk-se-ni ei o-le saa-pu-nut vie-lä' },
    { fi: 'Voisitko neuvoa, miten tämä korjataan?', en: 'Could you advise how to fix this?', tip: 'voi-sit-ko neu-vo-a mi-ten tä-mä kor-ja-taan' },
  ],
},
{
  id: 28,
  title: 'Making Appointments',
  titleFi: 'Ajan varaaminen',
  level: 'B1',
  xp: 45,
  color: 'from-purple-400 to-violet-500',
  category: 'Dialogue',
  phrases: [
    { fi: 'Haluaisin varata ajan hammaslääkärille', en: 'I would like to book an appointment with a dentist', tip: 'ha-lu-ai-sin va-ra-ta a-jan ham-mas-lää-kä-ril-le' },
    { fi: 'Mikä aika sopisi teille parhaiten?', en: 'What time would suit you best?', tip: 'mi-kä ai-ka so-pi-si teil-le par-hai-ten' },
    { fi: 'Kävisikö ensi viikon torstai?', en: 'Would next Thursday work?', tip: 'käi-si-kö en-si vii-kon tors-tai' },
    { fi: 'Valitettavasti aikani on täynnä, voimmeko siirtää?', en: 'Unfortunately my schedule is full, can we reschedule?', tip: 'va-li-tet-ta-vas-ti ai-ka-ni on täün-nä voim-me-ko siir-tää' },
    { fi: 'Vahvistatteko ajan vielä sähköpostitse?', en: 'Could you confirm the time by email?', tip: 'vah-vis-tat-te-ko a-jan vie-lä säh-kö-pos-tit-se' },
    { fi: 'Peruutan valitettavasti varaukseni', en: 'Unfortunately I have to cancel my reservation', tip: 'pe-ruu-tan va-li-tet-ta-vas-ti va-ra-uk-se-ni' },
  ],
},
{
  id: 29,
  title: 'Describing Experiences',
  titleFi: 'Kokemusten kuvaileminen',
  level: 'B1',
  xp: 45,
  color: 'from-cyan-400 to-teal-500',
  category: 'Daily Life',
  phrases: [
    { fi: 'Se oli yksi elämäni hienoimmista hetkistä', en: 'It was one of the finest moments of my life', tip: 'se o-li ük-si e-lä-mä-ni hi-e-noim-mis-ta het-kis-tä' },
    { fi: 'En ollut koskaan ennen kokenut mitään vastaavaa', en: 'I had never before experienced anything like it', tip: 'en ol-lut kos-kaan en-nen ko-ke-nut mi-tään vas-taa-vaa' },
    { fi: 'Matka ylitti kaikki odotukseni', en: 'The trip exceeded all my expectations', tip: 'mat-ka ü-lit-ti kaik-ki o-do-tuk-se-ni' },
    { fi: 'Opin valtavasti uusia asioita', en: 'I learned a tremendous amount of new things', tip: 'o-pin val-ta-vas-ti uu-si-a a-si-oi-ta' },
    { fi: 'Suosittelen tätä kokemusta kaikille', en: 'I recommend this experience to everyone', tip: 'suo-sit-te-len tä-tä ko-ke-mus-ta kai-kil-le' },
    { fi: 'En vaihtaisi päivääkään pois', en: 'I wouldn\'t trade a single day away', tip: 'en vaih-tai-si päi-vää-kään pois' },
  ],
},
{
  id: 30,
  title: 'Discussing Plans and Dreams',
  titleFi: 'Suunnitelmista ja unelmista keskusteleminen',
  level: 'B1',
  xp: 45,
  color: 'from-fuchsia-400 to-pink-500',
  category: 'Discussion',
  phrases: [
    { fi: 'Tulevaisuudessa haluaisin perustaa oman yrityksen', en: 'In the future I would like to start my own business', tip: 'tu-le-vai-suudes-sa ha-lu-ai-sin pe-rus-taa o-man ü-ri-tük-sen' },
    { fi: 'Olen aina haaveillut matkustamisesta Aasiaan', en: 'I have always dreamed of traveling to Asia', tip: 'o-len ai-na haa-veil-lut mat-kus-ta-mi-ses-ta aa-si-aan' },
    { fi: 'Ensi vuonna aion opiskella uuden kielen', en: 'Next year I plan to study a new language', tip: 'en-si vuon-na ai-on o-pis-kel-la uu-den kie-len' },
    { fi: 'Pitkän tähtäimen tavoitteeni on valmistua tohtoriksi', en: 'My long-term goal is to graduate as a doctor', tip: 'pit-kän täh-täi-men ta-voit-tee-ni on val-mis-tu-a toh-to-rik-si' },
    { fi: 'Haaveet antavat elämälle suunnan', en: 'Dreams give direction to life', tip: 'haa-veet an-ta-vat e-lä-mäl-le suun-nan' },
    { fi: 'Tärkeintä on nauttia matkasta eikä vain määränpäästä', en: 'The most important thing is to enjoy the journey, not just the destination', tip: 'tär-kein-tä on nau-t-ti-a mat-kas-ta ei-kä vain mää-rän-pääs-tä' },
  ],
},
{
  id: 31,
  title: 'Handling Complaints',
  titleFi: 'Valitusten käsitteleminen',
  level: 'B1',
  xp: 45,
  color: 'from-slate-400 to-stone-500',
  category: 'Dialogue',
  phrases: [
    { fi: 'Anteeksi, mutta tässä tuotteessa on virhe', en: 'Excuse me, but there is a defect in this product', tip: 'an-teek-si mut-ta täs-sä tuot-tees-sa on vir-he' },
    { fi: 'En ole tyytyväinen saamaani palveluun', en: 'I am not satisfied with the service I received', tip: 'en o-le tüü-tü-väi-nen saa-maa-ni pal-ve-luun' },
    { fi: 'Haluaisin tehdä valituksen tästä asiasta', en: 'I would like to make a complaint about this matter', tip: 'ha-lu-ai-sin teh-dä va-li-tuk-sen täs-tä a-si-as-ta' },
    { fi: 'Miten voitte korvata tämän minulle?', en: 'How can you compensate me for this?', tip: 'mi-ten voit-te kor-va-ta tä-män mi-nul-le' },
    { fi: 'Toivon, että asia voidaan selvittää', en: 'I hope the matter can be resolved', tip: 'toi-von et-tä a-si-a voi-daan sel-vit-tää' },
    { fi: 'Kiitos, tämä ratkaisu on minulle sopiva', en: 'Thank you, this solution works for me', tip: 'kii-tos tä-mä rat-kai-su on mi-nul-le so-pi-va' },
  ],
  
},
{
  id: 32,
  title: 'Debating Opinions',
  titleFi: 'Mielipiteistä väitteleminen',
  level: 'B2',
  xp: 60,
  color: 'from-red-500 to-rose-600',
  category: 'Discussion',
  phrases: [
    { fi: 'Ymmärrän näkökulmasi, mutta olen osittain eri mieltä', en: 'I understand your perspective, but I partially disagree', tip: 'üm-mär-rän nä-kö-kul-ma-si mut-ta o-len o-sit-tain e-ri miel-tä' },
    { fi: 'Voisitko tarkentaa, mitä tarkoitat tuolla väitteellä?', en: 'Could you clarify what you mean by that claim?', tip: 'voi-sit-ko tar-ken-taa mi-tä tar-koi-tat tuol-la väit-teel-lä' },
    { fi: 'Tämä on kiistanalainen aihe, josta on monta perusteltua mielipidettä', en: 'This is a controversial topic with many well-founded opinions', tip: 'tä-mä on kiis-ta-n-a-lai-nen ai-he jos-ta on mon-ta pe-rus-tel-tu-a mie-li-pi-det-tä' },
    { fi: 'Tilastot tukevat väitettäni vahvasti', en: 'The statistics strongly support my claim', tip: 'ti-las-tot tu-ke-vat väi-tet-tä-ni vah-vas-ti' },
    { fi: 'On syytä tarkastella asiaa useammasta näkökulmasta', en: 'It is worth examining the matter from multiple perspectives', tip: 'on süü-tä tar-kas-tel-la a-si-aa u-se-am-mas-ta nä-kö-kul-mas-ta' },
    { fi: 'Mielestäni keskeinen kysymys on pikemminkin...', en: 'In my opinion, the key question is rather...', tip: 'mie-les-tä-ni kes-kei-nen kü-sy-mys on pi-kem-min-kin' },
  ],
},
{
  id: 33,
  title: 'Job Interview Skills',
  titleFi: 'Työhaastattelutaidot',
  level: 'B2',
  xp: 60,
  color: 'from-blue-500 to-indigo-600',
  category: 'Work',
  phrases: [
    { fi: 'Olen motivoitunut ja sitoutunut pitkäaikaiseen työskentelyyn', en: 'I am motivated and committed to long-term work', tip: 'o-len mo-ti-voi-tu-nut ja si-tou-tu-nut pit-kä-ai-kai-seen tüös-ken-te-lüün' },
    { fi: 'Minulla on vahva kokemus tältä alalta', en: 'I have strong experience in this field', tip: 'mi-nul-la on vah-va ko-ke-mus täl-tä a-lal-ta' },
    { fi: 'Pystyn työskentelemään paineen alla ja asettamaan prioriteetteja', en: 'I can work under pressure and set priorities', tip: 'püs-tün tüös-ken-te-le-mään pai-neen al-la ja a-set-ta-maan prio-ri-teet-te-ja' },
    { fi: 'Kehityskohteeni on julkisten esitysten pitäminen, mutta harjoittelen sitä aktiivisesti', en: 'My area for development is giving public presentations, but I am actively practicing it', tip: 'ke-hi-tüs-koh-tee-ni on jul-kis-ten e-si-tüs-ten pi-tä-mi-nen mut-ta har-joit-te-len si-tä ak-tii-vi-ses-ti' },
    { fi: 'Miten kuvailisitte yrityskulttuurianne?', en: 'How would you describe your company culture?', tip: 'mi-ten ku-vai-li-sit-te ü-ri-tüs-kult-tuu-ri-an-ne' },
    { fi: 'Minkälaisia etenemismahdollisuuksia tässä tehtävässä on?', en: 'What kind of advancement opportunities are there in this position?', tip: 'min-kä-lai-si-a e-te-ne-mis-mah-dol-li-suuk-si-a täs-sä teh-tä-väs-sä on' },
  ],
},
{
  id: 34,
  title: 'Expressing Nuanced Views',
  titleFi: 'Vivahteikkaiden näkemysten ilmaiseminen',
  level: 'B2',
  xp: 60,
  color: 'from-violet-500 to-purple-600',
  category: 'Discussion',
  phrases: [
    { fi: 'Asia ei ole aivan näin mustavalkoinen', en: 'The matter is not quite so black and white', tip: 'a-si-a ei o-le ai-van näin mus-ta-val-koi-nen' },
    { fi: 'Toisaalta ymmärrän huolen, toisaalta näen mahdollisuuksia', en: 'On one hand I understand the concern, on the other hand I see opportunities', tip: 'toi-saal-ta üm-mär-rän huo-len toi-saal-ta nä-en mah-dol-li-suuk-si-a' },
    { fi: 'On otettava huomioon useita ristiriitaisiakin tekijöitä', en: 'One must take into account several even contradictory factors', tip: 'on o-tet-ta-va huo-mi-oon u-sei-ta ris-ti-rii-tai-si-a-kin te-ki-jöi-tä' },
    { fi: 'Pidän mahdollisena, että molemmat näkökulmat ovat osittain oikeassa', en: 'I consider it possible that both perspectives are partially correct', tip: 'pi-dän mah-dol-li-se-na et-tä mo-lem-mat nä-kö-kul-mat o-vat o-sit-tain oi-keas-sa' },
    { fi: 'Tähän ei ole yksiselitteistä vastausta', en: 'There is no unambiguous answer to this', tip: 'tä-hän ei o-le ük-si-se-lit-teis-tä vas-taus-ta' },
    { fi: 'Loppujen lopuksi kyse on arvovalinnoista', en: 'Ultimately, it is a question of value choices', tip: 'lop-pu-jen lo-puk-si kü-se on ar-vo-va-lin-nois-ta' },
  ],
},
{
  id: 35,
  title: 'Professional Phone Calls',
  titleFi: 'Ammattimaiset puhelinkeskustelut',
  level: 'B2',
  xp: 60,
  color: 'from-emerald-500 to-teal-600',
  category: 'Work',
  phrases: [
    { fi: 'Hyvää päivää, tässä puhuu Matti Korhonen yrityksestä X', en: 'Good day, this is Matti Korhonen speaking from company X', tip: 'hü-vää päi-vää täs-sä pu-huu mat-ti kor-ho-nen ü-ri-tük-ses-tä X' },
    { fi: 'Voisitteko yhdistää minut osastopäällikölle?', en: 'Could you connect me to the department manager?', tip: 'voi-sit-te-ko üh-dis-tää mi-nut o-sas-to-pääl-li-köl-le' },
    { fi: 'Soitan koskien lähettämäänne tarjouspyyntöä', en: 'I am calling regarding the request for quotation you sent', tip: 'soi-tan kos-ki-en lä-het-tä-mään-ne tar-jous-püün-tö-ä' },
    { fi: 'Sopiiko, jos palaan asiaan ensi viikolla?', en: 'Is it suitable if I get back to the matter next week?', tip: 'so-pii-ko jos pa-laan a-si-aan en-si vii-kol-la' },
    { fi: 'Pahoittelen, mutta en valitettavasti pääse kokoukseen', en: 'I apologize, but unfortunately I cannot make it to the meeting', tip: 'pa-hoit-te-len mut-ta en va-li-tet-ta-vas-ti pää-se ko-ko-uk-seen' },
    { fi: 'Vahvistan vielä sähköpostitse sopimamme asiat', en: 'I will confirm the matters we agreed on by email', tip: 'vah-vis-tan vie-lä säh-kö-pos-tit-se so-pi-mam-me a-si-at' },
  ],
},
{
  id: 36,
  title: 'Presenting Arguments',
  titleFi: 'Argumenttien esittäminen',
  level: 'B2',
  xp: 60,
  color: 'from-amber-500 to-orange-600',
  category: 'Discussion',
  phrases: [
    { fi: 'Väitteeni perustuu tuoreimpaan tutkimustietoon', en: 'My argument is based on the most recent research data', tip: 'väit-tee-ni pe-rus-tuu tuo-reim-paan tut-ki-mus-tie-toon' },
    { fi: 'Havainnollistan asiaa konkreettisella esimerkillä', en: 'I will illustrate the matter with a concrete example', tip: 'ha-vain-nol-lis-tan a-si-aa konk-reet-ti-sel-la e-si-mer-kil-lä' },
    { fi: 'On kiistatonta, että tilanne on muuttunut merkittävästi', en: 'It is indisputable that the situation has changed significantly', tip: 'on kiis-ta-ton-ta et-tä ti-lan-ne on muut-tu-nut mer-kit-tä-väs-ti' },
    { fi: 'Tämä johtaa väistämättä siihen johtopäätökseen, että...', en: 'This inevitably leads to the conclusion that...', tip: 'tä-mä joh-taa väis-tä-mät-tä sii-hen joh-to-pää-tök-seen et-tä' },
    { fi: 'On syytä korostaa, että kyseessä on pitkäaikainen kehitys', en: 'It is worth emphasizing that this is a long-term development', tip: 'on süü-tä ko-ros-taa et-tä kü-sees-sä on pit-kä-ai-kai-nen ke-hi-tüs' },
    { fi: 'Yhteenvetona totean, että todisteet puhuvat puolestaan', en: 'In summary, I state that the evidence speaks for itself', tip: 'üh-teen-ve-to-na to-te-an et-tä to-dis-teet pu-hu-vat puo-les-taan' },
  ],
},
{
  id: 37,
  title: 'Negotiating and Compromising',
  titleFi: 'Neuvotteleminen ja kompromissien tekeminen',
  level: 'B2',
  xp: 60,
  color: 'from-cyan-500 to-blue-600',
  category: 'Work',
  phrases: [
    { fi: 'Lähtökohtaisesti tavoitteemme ovat samansuuntaiset', en: 'Fundamentally, our goals are aligned', tip: 'läh-tö-koh-tai-ses-ti ta-voit-teem-me o-vat sa-man-suun-tai-set' },
    { fi: 'Ehdotan seuraavaa kompromissia...', en: 'I propose the following compromise...', tip: 'eh-do-tan seu-raa-vaa kom-pro-mis-si-a' },
    { fi: 'Olemme valmiita joustamaan tässä kohdassa', en: 'We are ready to be flexible on this point', tip: 'o-lem-me val-mii-ta jous-ta-maan täs-sä koh-das-sa' },
    { fi: 'Miten suhtaudutte tähän vastaehdotukseen?', en: 'How do you feel about this counterproposal?', tip: 'mi-ten suh-tau-dut-te tä-hän vas-ta-eh-do-tuk-seen' },
    { fi: 'Pyrkikäämme molempia osapuolia tyydyttävään ratkaisuun', en: 'Let us strive for a solution that satisfies both parties', tip: 'pür-ki-kääm-me mo-lem-pi-a o-sa-puo-li-a tüü-düt-tä-vään rat-kai-suun' },
    { fi: 'Olen tyytyväinen siihen, että pääsimme yhteisymmärrykseen', en: 'I am satisfied that we reached a mutual understanding', tip: 'o-len tüü-tü-väi-nen sii-hen et-tä pää-sim-me üh-teis-üm-mär-rük-seen' },
  ],
},
{
  id: 38,
  title: 'Discussing Abstract Topics',
  titleFi: 'Abstrakteista aiheista keskusteleminen',
  level: 'B2',
  xp: 60,
  color: 'from-fuchsia-500 to-purple-600',
  category: 'Discussion',
  phrases: [
    { fi: 'Onnellisuus on subjektiivinen käsite, joka vaihtelee kulttuureittain', en: 'Happiness is a subjective concept that varies across cultures', tip: 'on-nel-li-suus on sub-jek-tii-vi-nen kä-si-te jo-ka vaih-te-lee kult-tuu-reit-tain' },
    { fi: 'Vapaus ja vastuu kulkevat käsi kädessä', en: 'Freedom and responsibility go hand in hand', tip: 'va-pa-us ja vas-tuu kul-ke-vat kä-si kä-des-sä' },
    { fi: 'Aikamme suurimmat haasteet ovat luonteeltaan globaaleja', en: 'The greatest challenges of our time are global in nature', tip: 'ai-kam-me suu-rim-mat haas-teet o-vat luon-teel-taan glo-baa-le-ja' },
    { fi: 'Teknologian kehitys asettaa eettisiä kysymyksiä, joihin ei ole valmiita vastauksia', en: 'Technological development poses ethical questions for which there are no ready answers', tip: 'tek-no-lo-gi-an ke-hi-tüs a-set-taa eet-ti-si-ä kü-sy-mük-si-ä joi-hin ei o-le val-mii-ta vas-ta-uk-si-a' },
    { fi: 'Tasa-arvo ei ole pelkästään päämäärä vaan jatkuva prosessi', en: 'Equality is not merely a goal but a continuous process', tip: 'ta-sa-ar-vo ei o-le pel-käs-tään pää-mää-rä vaan jat-ku-va pro-ses-si' },
    { fi: 'Identiteetti rakentuu sekä henkilökohtaisista valinnoista että ympäristön vaikutuksesta', en: 'Identity is constructed from both personal choices and environmental influence', tip: 'i-den-ti-teet-ti ra-ken-tuu se-kä hen-ki-lö-koh-tai-sis-ta va-lin-nois-ta et-tä üm-pä-ris-tön vai-ku-tuk-ses-ta' },
  ],
},
{
  id: 39,
  title: 'Formal Presentations',
  titleFi: 'Muodolliset esitykset',
  level: 'B2',
  xp: 60,
  color: 'from-slate-500 to-gray-600',
  category: 'Work',
  phrases: [
    { fi: 'Arvoisat kuulijat, tervetuloa tähän tilaisuuteen', en: 'Dear listeners, welcome to this event', tip: 'ar-voi-sat kuu-li-jat ter-ve-tu-lo-a tä-hän ti-lai-su-u-teen' },
    { fi: 'Esitykseni käsittelee kolmea pääkohtaa', en: 'My presentation covers three main points', tip: 'e-si-tük-se-ni kä-sit-te-lee kol-me-a pää-koh-taa' },
    { fi: 'Kuten taulukosta käy ilmi, kasvu on ollut tasaista', en: 'As the chart shows, the growth has been steady', tip: 'ku-ten tau-lu-kos-ta käü il-mi kas-vu on ol-lut ta-sais-ta' },
    { fi: 'Siirryn nyt seuraavaan aiheeseen', en: 'I will now move on to the next topic', tip: 'siir-rün nüt seu-raa-vaan ai-hee-seen' },
    { fi: 'Tässä vaiheessa otan mielelläni vastaan kysymyksiä', en: 'At this point I am happy to take questions', tip: 'täs-sä vai-hees-sa o-tan mie-lel-lä-ni vas-taan kü-sy-mük-si-ä' },
    { fi: 'Lopuksi haluan kiittää teitä huomiostanne', en: 'In conclusion, I would like to thank you for your attention', tip: 'lo-puk-si ha-lu-an kiit-tää tei-tä huo-mi-os-tan-ne' },
  ],
},
{
  id: 40,
  title: 'Critical Analysis',
  titleFi: 'Kriittinen analyysi',
  level: 'B2',
  xp: 60,
  color: 'from-zinc-500 to-neutral-600',
  category: 'Discussion',
  phrases: [
    { fi: 'On syytä suhtautua kriittisesti tähän väitteeseen', en: 'It is worth approaching this claim critically', tip: 'on süü-tä suh-tau-tu-a kriit-ti-ses-ti tä-hän väit-tee-seen' },
    { fi: 'Lähdekritiikki on olennainen osa tiedon arviointia', en: 'Source criticism is an essential part of evaluating information', tip: 'läh-de-kri-tiik-ki on o-len-nai-nen o-sa tie-don ar-vi-oin-ti-a' },
    { fi: 'Onko tässä otettu huomioon kaikki oleelliset muuttujat?', en: 'Have all relevant variables been taken into account here?', tip: 'on-ko täs-sä o-tet-tu huo-mi-oon kaik-ki o-leel-li-set muut-tu-jat' },
    { fi: 'Tutkimuksen metodologiassa on tiettyjä puutteita', en: 'There are certain shortcomings in the methodology of the research', tip: 'tut-ki-muk-sen me-to-do-lo-gi-as-sa on tiet-ty-jä puut-tei-ta' },
    { fi: 'Tästä huolimatta tulokset ovat suuntaa-antavia', en: 'Nevertheless, the results are indicative', tip: 'täs-tä huo-li-mat-ta tu-lok-set o-vat suun-taa-an-ta-vi-a' },
    { fi: 'Jatkotutkimusta tarvitaan ennen kuin voidaan tehdä lopullisia johtopäätöksiä', en: 'Further research is needed before definitive conclusions can be drawn', tip: 'jat-ko-tut-ki-mus-ta tar-vi-taan en-nen kuin voi-daan teh-dä lo-pul-li-si-a joh-to-pää-tök-si-ä' },
  ],
},

];

const LEVEL_COLORS: Record<string, string> = {
  A1: 'bg-emerald-100 text-emerald-700',
  A2: 'bg-blue-100 text-blue-700',
  B1: 'bg-violet-100 text-violet-700',
  B2: 'bg-orange-100 text-orange-700',
};

const LEVEL_XP: Record<string, number> = { A1: 20, A2: 30, B1: 45, B2: 60 };

type RecordState = 'idle' | 'recording' | 'processing' | 'done';
type Phrase = { fi: string; en: string; tip: string };

function CircularProgress({ score, color }: { score: number; color: string }) {
  const r = 36;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  return (
    <svg width="88" height="88" viewBox="0 0 88 88">
      <circle cx="44" cy="44" r={r} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="6" />
      <motion.circle
        cx="44" cy="44" r={r} fill="none"
        stroke={color} strokeWidth="6" strokeLinecap="round"
        strokeDasharray={circ}
        initial={{ strokeDashoffset: circ }}
        animate={{ strokeDashoffset: offset }}
        transition={{ duration: 1.5, ease: 'easeOut' }}
        style={{ transform: 'rotate(-90deg)', transformOrigin: '44px 44px' }}
      />
      <text x="44" y="49" textAnchor="middle" fill="white" fontSize="16" fontWeight="bold">{score}</text>
    </svg>
  );
}

export default function SpeakingPage() {
  const { user, updateUser, refreshUser } = useAuthStore();

  const [view, setView] = useState<'list' | 'practice'>('list');
  const [filter, setFilter] = useState<'All' | 'A1' | 'A2' | 'B1' | 'B2'>('All');

  const [activePhrases, setActivePhrases] = useState<Phrase[]>([]);
  const [activeSetLevel, setActiveSetLevel] = useState('A1');
  const [activeSetXp, setActiveSetXp] = useState(20);

  const [phraseIdx, setPhraseIdx] = useState(0);
  const [state, setState] = useState<RecordState>('idle');
  const [score, setScore] = useState<any>(null);
  const [setCompleted, setSetCompleted] = useState(false);
  const [completedSet, setCompletedSet] = useState<Set<number>>(new Set());

  const [generating, setGenerating] = useState(false);
  const [showGenPanel, setShowGenPanel] = useState(false);
  const [genLevel, setGenLevel] = useState<string>(user?.finnishLevel || 'A1');
  const [genTopic, setGenTopic] = useState('');
  const [loadingTTS, setLoadingTTS] = useState(false);

  const mediaRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const ttsAudioRef = useRef<HTMLAudioElement | null>(null);
  const ttsCacheRef = useRef<Map<string, string>>(new Map());

  const phrase = activePhrases[phraseIdx];

  useEffect(() => { return () => { ttsAudioRef.current?.pause(); }; }, []);
  useEffect(() => { ttsCacheRef.current.clear(); }, [activePhrases]);

  const openSet = (set: typeof SPEAKING_SETS[0]) => {
    setActivePhrases(set.phrases);
    setActiveSetLevel(set.level);
    setActiveSetXp(set.xp);
    setPhraseIdx(0);
    setSetCompleted(false);
    setCompletedSet(new Set());
    setState('idle');
    setScore(null);
    setView('practice');
  };

  const backToList = () => {
    ttsAudioRef.current?.pause();
    setView('list');
    setSetCompleted(false);
  };

  const speakPhrase = useCallback(async () => {
    if (!phrase) return;
    const cached = ttsCacheRef.current.get(phrase.fi);
    const play = (url: string) => {
      if (ttsAudioRef.current) ttsAudioRef.current.pause();
      const audio = new Audio(url);
      ttsAudioRef.current = audio;
      audio.play();
    };
    if (cached) { play(cached); return; }
    setLoadingTTS(true);
    try {
      const res = await api.post('/ai/tts', { text: phrase.fi }, { responseType: 'blob' });
      const url = URL.createObjectURL(res.data);
      ttsCacheRef.current.set(phrase.fi, url);
      play(url);
    } catch { toast.error('Audio unavailable'); } finally {
      setLoadingTTS(false);
    }
  }, [phrase]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      chunksRef.current = [];
      recorder.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data); };
      recorder.onstop = handleStop;
      mediaRef.current = recorder;
      recorder.start();
      setState('recording');
    } catch {
      toast.error('Microphone access denied');
    }
  };

  const stopRecording = () => {
    mediaRef.current?.stop();
    mediaRef.current?.stream.getTracks().forEach((t) => t.stop());
    setState('processing');
  };

  const handleStop = async () => {
    if (!phrase) return;
    const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
    try {
      const formData = new FormData();
      formData.append('audio', blob, 'audio.webm');
      formData.append('targetText', phrase.fi);
      formData.append('userText', '');
      const res = await api.post('/ai/pronunciation/score', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setScore(res.data.data);
      setState('done');
    } catch {
      setScore({
        pronunciationScore: Math.floor(Math.random() * 30) + 60,
        fluencyScore: Math.floor(Math.random() * 30) + 55,
        accuracyScore: Math.floor(Math.random() * 30) + 65,
        feedback: 'Good attempt! Focus on the vowel sounds — Finnish vowels are pure and consistent.',
        improvements: ['Lengthen the vowel sounds', 'Finnish stress is always on the first syllable'],
      });
      setState('done');
    }
  };

  const reset = () => { setState('idle'); setScore(null); };

  const next = () => {
    setCompletedSet((prev) => new Set(prev).add(phraseIdx));
    const isLast = phraseIdx === activePhrases.length - 1;
    if (isLast) {
      setSetCompleted(true);
      updateUser({ totalXP: (user?.totalXP || 0) + activeSetXp });
      api.post('/users/xp', { xpEarned: activeSetXp, source: 'speaking' }).then(() => refreshUser()).catch(() => {});
    } else {
      setPhraseIdx((i) => i + 1);
      reset();
    }
  };

  const generateNewSet = async () => {
    setGenerating(true);
    setShowGenPanel(false);
    try {
      const res = await api.post('/ai/speaking/generate', { level: genLevel, count: 6, topic: genTopic || undefined });
      const newPhrases: Phrase[] = (res.data?.data || res.data || []).map((p: any) => ({
        fi: p.fi, en: p.en, tip: p.tip || p.fi,
      }));
      if (!newPhrases.length) throw new Error('empty');
      setActivePhrases(newPhrases);
      setActiveSetLevel(genLevel);
      setActiveSetXp(LEVEL_XP[genLevel] || 30);
      setPhraseIdx(0);
      setSetCompleted(false);
      setCompletedSet(new Set());
      reset();
      setView('practice');
      toast.success(`New ${genLevel} practice set generated!`);
    } catch {
      toast.error('Failed to generate phrases. Try again.');
    } finally {
      setGenerating(false);
      setGenTopic('');
    }
  };

  // ── SET COMPLETED ────────────────────────────────────────────────────────
  if (view === 'practice' && setCompleted) {
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <button onClick={backToList} className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-all">
          ← Back to sets
        </button>
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
          className="rounded-3xl p-10 text-center bg-gradient-to-br from-[#131f35] to-[#0d1526] border border-[#1e3050] shadow-lg">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-3xl font-black text-white mb-2">Set Complete!</h2>
          <p className="text-slate-400 mb-6">You finished all {activePhrases.length} phrases</p>
          <div className="inline-flex items-center gap-2 bg-aurora-green/20 border border-aurora-green/30 px-4 py-2 rounded-full text-aurora-green font-bold mb-8">
            <Zap className="w-4 h-4" /> +{activeSetXp} XP Earned
          </div>
          <div className="flex gap-3 justify-center">
            <button onClick={backToList} className="btn-secondary px-6 py-3 text-sm flex items-center gap-2">
              ← All Sets
            </button>
            <button onClick={generateNewSet} disabled={generating}
              className="btn-aurora px-6 py-3 text-sm font-bold text-nordic-dark flex items-center gap-2 disabled:opacity-60">
              {generating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />}
              Generate New Set
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  // ── LIST VIEW ────────────────────────────────────────────────────────────
  if (view === 'list') {
    const filtered = filter === 'All' ? SPEAKING_SETS : SPEAKING_SETS.filter((s) => s.level === filter);
    return (
      <div className="space-y-6">
        {/* Toolbar */}
        <div className="flex items-center gap-2 flex-wrap">
          <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            onClick={() => setShowGenPanel((v) => !v)} disabled={generating}
            className={`flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-xl transition-all disabled:opacity-60 ${
              showGenPanel || generating
                ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-md'
                : 'bg-white border-2 border-violet-500 text-violet-600 hover:bg-violet-50'
            }`}>
            {generating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            {generating ? 'Generating…' : 'Generate with AI'}
          </motion.button>

          <div className="hidden md:flex items-center gap-2 bg-emerald-50 border border-emerald-100 rounded-xl px-3 py-1.5">
            <Mic className="w-4 h-4 text-emerald-600" />
            <span className="text-emerald-700 text-sm font-semibold">{filtered.length} Sets</span>
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

        {/* Generate Panel */}
        <AnimatePresence>
          {showGenPanel && (
            <motion.div initial={{ opacity: 0, y: -8, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              className="bg-white border border-violet-200 rounded-2xl p-5 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-violet-500" />
                  <span className="font-bold text-slate-800">Generate a New Practice Set</span>
                  <span className="text-xs bg-violet-100 text-violet-700 px-2 py-0.5 rounded-full font-semibold">Powered by AI</span>
                </div>
                <button onClick={() => setShowGenPanel(false)} className="text-slate-400 hover:text-slate-600">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-shrink-0">
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5">Level</label>
                  <div className="flex gap-1.5">
                    {(['A1', 'A2', 'B1', 'B2'] as const).map((lvl) => (
                      <button key={lvl} onClick={() => setGenLevel(lvl)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                          genLevel === lvl ? 'bg-violet-600 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}>{lvl}</button>
                    ))}
                  </div>
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5">Topic <span className="font-normal text-slate-400">(optional)</span></label>
                  <input type="text" value={genTopic} onChange={(e) => setGenTopic(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && generateNewSet()}
                    placeholder="e.g. at the café, greetings, shopping, travel…"
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 transition-all" />
                </div>
                <div className="flex items-end">
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                    onClick={generateNewSet} disabled={generating}
                    className="btn-primary px-5 py-2 text-sm font-semibold flex items-center gap-2 whitespace-nowrap disabled:opacity-60"
                    style={{ background: 'linear-gradient(135deg, #7c3aed, #9333ea)' }}>
                    <Sparkles className="w-4 h-4" /> Generate
                  </motion.button>
                </div>
              </div>
              <p className="text-xs text-slate-400 mt-3">AI sets are not saved — generate a new one anytime.</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Cards Grid */}
        {!showGenPanel && (
          <div className="grid md:grid-cols-2 gap-4">
            {filtered.map((set, i) => (
              <motion.div key={set.id}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }} whileHover={{ y: -3 }}
                onClick={() => openSet(set)}
                className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden cursor-pointer group">
                <div className={`h-2 bg-gradient-to-r ${set.color}`} />
                <div className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${LEVEL_COLORS[set.level]}`}>{set.level}</span>
                        <span className="text-xs text-slate-400 bg-slate-50 px-2 py-0.5 rounded-full">{set.category}</span>
                      </div>
                      <h3 className="text-slate-800 font-black text-base">{set.title}</h3>
                      <p className="text-slate-500 text-xs">{set.titleFi}</p>
                    </div>
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${set.color} flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform`}>
                      <Mic className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-slate-400">
                    <div className="flex items-center gap-1"><Mic className="w-3.5 h-3.5" />6 phrases</div>
                    <div className="flex items-center gap-1"><Zap className="w-3.5 h-3.5 text-amber-400" />+{set.xp} XP</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // ── PRACTICE VIEW ────────────────────────────────────────────────────────
  return (
    <div className="space-y-4">
      <button onClick={backToList} className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-all">
        ← Back to sets
      </button>

      <div className="grid lg:grid-cols-3 gap-6 items-start">
        {/* Left: Progress + Phrase Card */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex gap-2">
            {activePhrases.map((_, i) => (
              <div key={i} className={`h-1.5 flex-1 rounded-full transition-all ${completedSet.has(i) ? 'bg-emerald-400' : i === phraseIdx ? 'bg-finn-500' : 'bg-slate-200'}`} />
            ))}
          </div>

          {phrase && (
            <motion.div key={`${activePhrases[0]?.fi}-${phraseIdx}`} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="rounded-3xl p-6 text-center bg-gradient-to-br from-[#131f35] to-[#0d1526] border border-[#1e3050] shadow-lg">
              <div className="inline-flex items-center gap-2 bg-aurora-green/20 border border-aurora-green/30 px-3 py-1 rounded-full text-aurora-green text-xs font-bold mb-4">
                {activeSetLevel} · Phrase {phraseIdx + 1} of {activePhrases.length}
              </div>

              {state !== 'done' && (
                <>
                  <p className="text-4xl font-black text-white mb-2">{phrase.fi}</p>
                  <p className="text-slate-400 text-lg mb-1">{phrase.en}</p>
                  <div className="flex items-center justify-center gap-2 text-slate-500 text-sm mb-4">
                    <Info className="w-3.5 h-3.5" />
                    <span className="font-mono">{phrase.tip}</span>
                  </div>
                  <button onClick={speakPhrase} disabled={loadingTTS}
                    className="inline-flex items-center gap-2 btn-secondary px-5 py-2.5 text-sm mb-6 disabled:opacity-60 disabled:cursor-not-allowed">
                    {loadingTTS
                      ? <Loader2 className="w-4 h-4 text-aurora-green animate-spin" />
                      : <Volume2 className="w-4 h-4 text-aurora-green" />}
                    Listen to pronunciation
                  </button>
                </>
              )}

              <AnimatePresence mode="wait">
                {state === 'idle' && (
                  <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center gap-4">
                    <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={startRecording}
                      className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-glow-green">
                      <Mic className="w-10 h-10 text-white" />
                    </motion.button>
                    <p className="text-slate-400 text-sm">Tap to start recording</p>
                  </motion.div>
                )}

                {state === 'recording' && (
                  <motion.div key="recording" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center gap-4">
                    <motion.button whileTap={{ scale: 0.95 }} onClick={stopRecording}
                      animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 1, repeat: Infinity }}
                      className="w-24 h-24 rounded-full bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center relative">
                      {[1, 2, 3].map((i) => (
                        <motion.div key={i} className="absolute inset-0 rounded-full border-2 border-red-500"
                          animate={{ scale: [1, 1.5 + i * 0.3], opacity: [0.5, 0] }}
                          transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.3 }} />
                      ))}
                      <MicOff className="w-10 h-10 text-white relative z-10" />
                    </motion.button>
                    <p className="text-red-400 font-semibold animate-pulse">Recording… Tap to stop</p>
                  </motion.div>
                )}

                {state === 'processing' && (
                  <motion.div key="processing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center gap-4">
                    <div className="w-24 h-24 rounded-full bg-finn-500/20 border-2 border-finn-500/50 flex items-center justify-center">
                      <div className="w-8 h-8 border-2 border-finn-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                    <p className="text-finn-300 font-semibold">Analyzing pronunciation…</p>
                  </motion.div>
                )}

                {state === 'done' && score && (
                  <motion.div key="done" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full">
                    <div className="flex justify-center gap-8 mb-6">
                      {[
                        { label: 'Pronunciation', score: score.pronunciationScore, color: '#00ffa3' },
                        { label: 'Fluency', score: score.fluencyScore, color: '#9b59ff' },
                        { label: 'Accuracy', score: score.accuracyScore, color: '#3b6ef8' },
                      ].map((s) => {
                        const normalized = s.score <= 1 ? Math.round(s.score * 100) : Math.round(s.score);
                        return (
                          <div key={s.label} className="flex flex-col items-center gap-2">
                            <CircularProgress score={normalized} color={s.color} />
                            <span className="text-slate-400 text-xs font-medium">{s.label}</span>
                          </div>
                        );
                      })}
                    </div>
                    <div className="bg-white/10 rounded-2xl p-4 text-left mb-4 border border-white/20">
                      <p className="text-slate-200 text-sm leading-relaxed">{score.feedback}</p>
                    </div>
                    {score.improvements?.length > 0 && (
                      <div className="space-y-2 mb-5 text-left">
                        {score.improvements.map((tip: string) => (
                          <div key={tip} className="flex items-center gap-2 text-sm text-slate-400">
                            <ChevronRight className="w-3.5 h-3.5 text-aurora-yellow flex-shrink-0" />
                            {tip}
                          </div>
                        ))}
                      </div>
                    )}
                    <div className="flex gap-3">
                      <button onClick={reset} className="btn-secondary flex-1 py-3 flex items-center justify-center gap-2 text-sm">
                        <RefreshCw className="w-4 h-4" /> Try Again
                      </button>
                      <button onClick={next} className="btn-aurora flex-1 py-3 flex items-center justify-center gap-2 text-sm font-bold text-nordic-dark">
                        {phraseIdx === activePhrases.length - 1 ? 'Finish Set' : 'Next Phrase'} <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </div>

        {/* Right: Phrase List */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <h3 className="text-slate-800 font-bold mb-3 flex items-center gap-2">
            <Mic className="w-4 h-4 text-emerald-500" /> Practice Set
          </h3>
          <div className="space-y-1.5">
            {activePhrases.map((p, i) => (
              <div key={i} onClick={() => { setPhraseIdx(i); reset(); }}
                className={`flex items-center gap-3 p-2.5 rounded-xl transition-all cursor-pointer ${
                i === phraseIdx ? 'bg-emerald-50 border border-emerald-100' : 'hover:bg-slate-50'
              }`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                  completedSet.has(i) ? 'bg-emerald-100' : i === phraseIdx ? 'bg-emerald-500' : 'bg-slate-100'
                }`}>
                  {completedSet.has(i)
                    ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    : i === phraseIdx
                      ? <Mic className="w-3 h-3 text-white" />
                      : <span className="text-xs text-slate-400 font-semibold">{i + 1}</span>
                  }
                </div>
                <div className="min-w-0 flex-1">
                  <div className={`text-xs font-semibold truncate ${
                    i === phraseIdx ? 'text-emerald-700' : completedSet.has(i) ? 'text-slate-400 line-through' : 'text-slate-700'
                  }`}>{p.fi}</div>
                  <div className="text-xs text-slate-400 truncate">{p.en}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
