// Complete recipe data
const retete = {
    "Mic dejun": [
        {
            nume: "Omletă cu Spanac și Ciuperci",
            descriere: "Bate 2 ouă cu sare și piper. Călește o mână de spanac proaspăt și câteva ciuperci feliate într-o tigaie antiaderentă cu puțin ulei de măsline. Toarnă ouăle bătute peste legume și gătește omleta pe ambele părți. Servește imediat."
        },
        {
            nume: "Iaurt Grecesc cu Fructe de Pădure și Nuci",
            descriere: "Pune într-un bol 150g iaurt grecesc simplu (2% grăsime). Adaugă o jumătate de cană de fructe de pădure mixte (afine, zmeură, căpșuni) și o lingură de nuci sau semințe (migdale, nuci, semințe de chia). Poți adăuga un praf de scorțișoară."
        },
        {
            nume: "Terci de Ovăz cu Măr și Scorțișoară",
            descriere: "Fierbe 40g fulgi de ovăz în 200ml apă sau lapte degresat. Când ovăzul este fiert, adaugă jumătate de măr ras sau tăiat cubulețe și un praf de scorțișoară. Amestecă bine. Poți îndulci cu un îndulcitor non-caloric dacă dorești."
        },
        {
            nume: "Brânză de Vaci cu Avocado și Semințe",
            descriere: "Amestecă 100g brânză de vaci slabă cu jumătate de avocado tăiat cubulețe. Adaugă semințe de dovleac și floarea-soarelui (o lingură în total). Asezonează cu sare, piper și puțin suc de lămâie pentru un plus de prospețime."
        },
        {
            nume: "Clătite din Făină de Migdale",
            descriere: "Bate un ou cu 2 linguri de făină de migdale, un vârf de linguriță de praf de copt și un strop de lapte de migdale. Adaugă opțional scorțișoară sau esență de vanilie. Coace clătitele mici într-o tigaie antiaderentă. Servește cu câteva afine proaspete deasupra."
        },
        {
            nume: "Budincă de Chia cu Lapte de Migdale",
            descriere: "Amestecă 2 linguri de semințe de chia cu 200ml lapte de migdale neîndulcit și lasă la frigider peste noapte. Dimineața, adaugă câteva fructe de pădure și un praf de scorțișoară. Poți adăuga un îndulcitor natural fără calorii."
        },
        {
            nume: "Toast din Pâine Integrală cu Avocado și Ou Poșat",
            descriere: "Prăjește ușor o felie de pâine integrală. Întinde jumătate de avocado peste pâine și asezonează cu sare și piper. Adaugă deasupra un ou poșat și presară puțin chili sau pătrunjel tocat pentru aromă."
        },
        {
            nume: "Smoothie Verde cu Proteine",
            descriere: "Mixează 200ml lapte de migdale neîndulcit cu o mână de spanac, jumătate de avocado, o lingură de pudră de proteine (fără zahăr adăugat) și un praf de scorțișoară. Adaugă gheață după preferință."
        },
        {
            nume: "Wrap cu Ou și Legume",
            descriere: "Umple o tortilla integrală cu un ou bătut și gătit ca o omletă subțire. Adaugă spanac proaspăt, ardei gras tăiat fâșii și avocado. Rulează și servește."
        },
        {
            nume: "Bol cu Brânză Cottage și Nuci",
            descriere: "Amestecă 150g brânză cottage cu o lingură de nuci tocate, semințe de in măcinate și un praf de scorțișoară. Adaugă câteva bucăți de măr pentru dulceață naturală."
        },
        {
            nume: "Omletă cu Sparanghel și Brânză de Capră",
            descriere: "Bate 2 ouă cu un strop de lapte degresat, sare și piper. Călește 6-8 fire de sparanghel tăiate bucăți mici într-o tigaie antiaderentă. Toarnă compoziția de ouă și presară 30g brânză de capră fărâmițată. Gătește până când ouăle sunt bine pătrunse."
        },
        {
            nume: "Cremă de Hrișcă cu Fructe de Pădure",
            descriere: "Fierbe 50g fulgi de hrișcă în 200ml lapte de migdale neîndulcit timp de 8-10 minute. Adaugă 1/2 linguriță de extract de vanilie și un praf de scorțișoară. Servește cu 60g mix de fructe de pădure proaspete sau congelate și 1 lingură de semințe de dovleac."
        },
        {
            nume: "Sandviș cu Somon Afumat și Avocado",
            descriere: "Prăjește ușor o felie de pâine integrală. Întinde 1/4 de avocado și adaugă 50g somon afumat, câteva frunze de rucola și puțin suc de lămâie. Opțional, poți adăuga un ou poșat deasupra pentru un plus de proteine."
        },
        {
            nume: "Pudding de Chia cu Cacao și Zmeură",
            descriere: "Amestecă 3 linguri de semințe de chia cu 250ml lapte de cocos neîndulcit, 1 lingură de cacao fără zahăr și un îndulcitor natural (stevia). Lasă la frigider peste noapte. Dimineața, adaugă 60g zmeură proaspătă și 1 lingură de fulgi de migdale."
        },
        {
            nume: "Smoothie Bowl cu Spanac și Caju",
            descriere: "Mixează 200ml lapte de migdale neîndulcit cu 1 mână de spanac, 1/2 avocado, 30g nuci caju înmuiate peste noapte, 1/2 linguriță extract de vanilie și gheață. Toarnă într-un bol și decorează cu semințe de chia, felii de kiwi și câteva boabe de rodie."
        },
        {
            nume: "Frittata cu Ciuperci și Brânză Feta",
            descriere: "Preîncălzește cuptorul la 180°C. Călește 100g ciuperci feliate cu puțin ulei de măsline și 1 cățel de usturoi tocat. Bate 3 ouă cu 1 lingură de pătrunjel tocat, sare și piper. Toarnă amestecul de ouă peste ciuperci, presară 30g brânză feta fărâmițată și coace pentru 10-12 minute."
        },
        {
            nume: "Clătite Proteice din Făină de Cocos",
            descriere: "Amestecă 2 linguri de făină de cocos, 1 lingură de pudră proteică (fără zahăr), 1 ou, 60ml lapte de migdale și un praf de bicarbonat. Coace clătite mici în tigaie antiaderentă cu puțin ulei de cocos. Servește cu 1 lingură de iaurt grecesc și câteva afine."
        },
        {
            nume: "Tartine cu Tofu Scramble",
            descriere: "Sfărâmă 100g tofu ferm într-o tigaie cu puțin ulei de măsline. Adaugă 1/4 linguriță de turmeric, pudră de usturoi, sare și piper. Călește până se încălzește bine. Servește pe 1 felie de pâine integrală prăjită, cu 1/4 avocado zdrobit și roșii cherry tăiate jumătăți."
        },
        {
            nume: "Bol de Quinoa cu Lapte de Migdale și Pere",
            descriere: "Fierbe 40g quinoa în 200ml lapte de migdale neîndulcit până se înmoaie bine (15-20 minute). Adaugă scorțișoară, extract de vanilie și un îndulcitor natural dacă dorești. Servește cu 1/2 pară coaptă, tăiată cubulețe și 1 lingură de migdale feliate."
        },
        {
            nume: "Shake Proteic cu Fructe de Pădure și Avocado",
            descriere: "Mixează 150ml lapte de migdale sau de cocos, 1/4 avocado, 100g fructe de pădure congelate, 1 linguriță semințe de in, și 15g proteină din zer (sau altă pudră proteică fără zahăr). Adaugă un îndulcitor natural și gheață după preferință."
        }
    ],
    "Prânz": [
        {
            nume: "Salată de Pui la Grill cu Quinoa",
            descriere: "Gătește la grătar sau la tigaie 100g piept de pui tăiat fâșii. Fierbe 50g quinoa conform instrucțiunilor de pe pachet. Amestecă quinoa răcită cu puiul, o mână de roșii cherry tăiate jumătăți, castravete cubulețe, ardei gras colorat și frunze de salată verde. Prepară un dressing din ulei de măsline, zeamă de lămâie, sare și piper."
        },
        {
            nume: "Supă Cremă de Linte Roșie",
            descriere: "Călește o ceapă tocată și un morcov ras într-o oală cu puțin ulei. Adaugă 100g linte roșie spălată, 500ml supă de legume (sau apă) și condimente (chimen, boia dulce, sare, piper). Fierbe până când lintea este moale (aprox. 20 min). Pasează supa cu un blender vertical până devine cremoasă. Servește cu o lingură de iaurt grecesc."
        },
        {
            nume: "Tocăniță de Legume cu Năut",
            descriere: "Călește o ceapă, un ardei gras și un dovlecel tăiate cuburi. Adaugă o conservă mică de roșii în bulion (400g), o conservă de năut scurs și spălat (240g), 100ml apă și condimente (cimbru, oregano, sare, piper). Fierbe la foc mic timp de 15-20 de minute. Servește ca atare sau cu o porție mică de orez brun."
        },
        {
            nume: "Chifteluțe de Legume cu Sos de Iaurt",
            descriere: "Pasează într-un blender 1 conservă de năut scurs, 1 morcov ras, 1 ceapă mică tocată, 2 linguri de făină de năut, pătrunjel, sare și piper. Formează chifteluțe și coace-le la cuptor la 180°C pentru 20 de minute. Prepară un sos din iaurt grecesc cu usturoi, mărar și zeamă de lămâie. Servește chifteluțele cu sosul de iaurt."
        },
        {
            nume: "Somon la Grătar cu Salată de Varză Kale",
            descriere: "Gătește la grătar 120g file de somon condimentat cu lămâie, sare și piper. Pregătește o salată din varză kale tăiată fin, roșii cherry, castravete și avocado. Adaugă un dressing din ulei de măsline, muștar Dijon, oțet balsamic, sare și piper. Servește somonul alături de salată."
        },
        {
            nume: "Wrap cu Pui și Hummus",
            descriere: "Întinde 2 linguri de hummus pe o lipie integrală. Adaugă 80g piept de pui gătit și tăiat fâșii, ardei gras, castravete, morcov ras și frunze de spanac. Rulează și taie în jumătate. Poți adăuga un strop de zeamă de lămâie pentru un plus de aromă."
        },
        {
            nume: "Salată de Ton cu Fasole și Roșii",
            descriere: "Amestecă 1 conservă mică de ton în apă (scurs) cu 100g fasole roșie fiartă sau din conservă (clătită), roșii cherry tăiate, ceapă roșie, pătrunjel proaspăt tocat. Asezonează cu ulei de măsline, zeamă de lămâie, sare și piper."
        },
        {
            nume: "Supă de Pui cu Tăiței de Dovlecel",
            descriere: "Fierbe 500ml supă de pui slabă cu bucăți de piept de pui (100g), morcov și țelină tăiate. Când legumele sunt aproape gata, adaugă tăiței de dovlecel (făcuți cu un spiralizator sau tăiați fâșii subțiri). Condimentează cu pătrunjel proaspăt, sare și piper."
        },
        {
            nume: "Risotto de Conopidă cu Ciuperci",
            descriere: "Procesează o conopidă mică în blender până obții granule asemănătoare orezului. Călește ciuperci champignon feliate cu puțin ulei. Adaugă 'orezul' de conopidă, condimentează cu sare, piper și praf de usturoi. Gătește amestecând frecvent. La final, adaugă pătrunjel tocat și opțional parmezan ras."
        },
        {
            nume: "Burger Vegetal cu Garnitură de Legume",
            descriere: "Prepară un burger din 1 conservă de fasole neagră pasată, ceapă tocată, usturoi, un ou și condimente (chimen, boia, sare, piper). Formează burger-ul și gătește-l într-o tigaie cu puțin ulei. Servește între două jumătăți de portobello marinat în loc de chiflă, cu o garnitură de legume la grătar."
        },
        {
            nume: "Salată Mediteraneană cu Năut și Ouă",
            descriere: "Amestecă frunze de salată verde cu 100g năut fiert, 1/2 castravete tăiat cubulețe, 1/2 ardei roșu, 5-6 măsline kalamata fără sâmburi și 50g brânză feta fărâmițată. Adaugă 2 ouă fierte tăiate în sferturi. Prepară un dressing din 1 lingură ulei de măsline, zeamă de lămâie, oregano, sare și piper."
        },
        {
            nume: "Bowl cu Tofu și Legume la Wok",
            descriere: "Marinează 150g tofu ferm tăiat cuburi în sos de soia cu conținut redus de sodiu, ghimbir ras și usturoi. Sotează în wok 1 morcov, 1/2 ardei gras, 100g varză chinezească, 50g germeni de fasole și tofu marinat. Servește cu 50g orez brun sau orez din conopidă pentru reducerea carbohidraților."
        },
        {
            nume: "Quiche fără Aluat cu Spanac și Brânză de Capră",
            descriere: "Preîncălzește cuptorul la 180°C. Într-un bol, bate 4 ouă cu 100ml lapte degresat, sare și piper. Adaugă 150g spanac gătit și stors bine, 1 ceapă verde tocată și 50g brânză de capră fărâmițată. Toarnă compoziția într-o formă antiaderentă și coace 20-25 minute până se întărește."
        },
        {
            nume: "Kebab de Pui cu Sos de Iaurt și Mentă",
            descriere: "Marinează 150g piept de pui tăiat cuburi în iaurt grecesc cu usturoi, coriandru și chimion timp de 30 minute. Înșiră pe bețe alternând cu bucăți de ardei și ceapă roșie. Gătește la grătar sau în tigaie. Prepară un sos din 3 linguri de iaurt grecesc, mentă proaspătă tocată și zeamă de lămâie. Servește cu salată verde."
        },
        {
            nume: "Creveți la Cuptor cu Broccoli și Quinoa",
            descriere: "Preîncălzește cuptorul la 200°C. Amestecă 150g creveți curățați cu 200g buchețele de broccoli, 1 lingură ulei de măsline, zeamă de lămâie, usturoi măcinat, sare și piper. Coace 10-12 minute. Servește pe un pat de quinoa fiartă (50g crud) cu pătrunjel proaspăt."
        },
        {
            nume: "Tartă Rustică din Făină Integrală cu Legume",
            descriere: "Prepară un aluat din 100g făină integrală, 50g unt rece, 2-3 linguri apă rece și un praf de sare. Întinde aluatul și umple-l cu un amestec de ciuperci sotate, spanac, ardei gras, ceapă roșie și 2 linguri brânză de capră. Coace la 180°C pentru 25-30 minute."
        },
        {
            nume: "Salată de Linte cu Somon Afumat",
            descriere: "Fierbe 50g linte verde până se înmoaie, apoi scurge și răcește. Amestecă lintea cu 70g somon afumat tăiat fâșii, ceapă roșie tocată fin, ardei gras tăiat cubulețe, pătrunjel proaspăt și mărar. Prepară un dressing din 1 lingură ulei de măsline, muștar Dijon, zeamă de lămâie, sare și piper."
        },
        {
            nume: "Supă Cremă de Dovleac cu Crutoane de Năut",
            descriere: "Călește 1 ceapă și 1 morcov tăiate mărunt. Adaugă 300g dovleac tăiat cuburi, 1 cățel de usturoi și 500ml supă de legume. Fierbe până legumele sunt moi și pasează cu blenderul. Condimentează cu nucșoară, sare și piper. Separat, prajește la cuptor 50g năut fiert condimentat cu boia și oregano pentru crutoane."
        },
        {
            nume: "Frigărui de Curcan Marinate cu Salată de Varză Roșie",
            descriere: "Marinează 150g piept de curcan tăiat cuburi în 1 lingură ulei de măsline, zeamă de lămâie, usturoi, oregano, sare și piper. Înșiră pe bețe și gătește la grătar sau într-o tigaie. Prepară o salată din varză roșie rasă fin, morcov ras, semințe de susan și un dressing din iaurt grecesc cu mărar și zeamă de lămâie."
        },
        {
            nume: "Pizza cu Blat de Conopidă",
            descriere: "Procesează 1 conopidă mijlocie în blender până obții o textură granulată. Amestecă cu 2 ouă, 50g mozzarella rasă, oregano, sare și piper. Întinde amestecul pe o tavă cu hârtie de copt și coace la 200°C pentru 20 minute. Adaugă deasupra sos de roșii, ciuperci, spanac, pui la grătar și puțină brânză. Coace încă 10 minute."
        }
    ],
    "Cină": [
        {
            nume: "Somon la Cuptor cu Broccoli",
            descriere: "Așează un file de somon (120g) într-o tavă pe hârtie de copt. Condimentează cu sare, piper, mărar și zeamă de lămâie. Adaugă buchețele de broccoli (150g) stropite cu puțin ulei de măsline. Coace la 180°C timp de 15-20 de minute, până când somonul este pătruns."
        },
        {
            nume: "Piept de Curcan cu Piure de Conopidă",
            descriere: "Gătește la grătar sau la abur 100g piept de curcan. Fierbe o conopidă medie până devine foarte moale. Scurge bine apa și pasează conopida cu un blender sau furculița, adăugând o lingură de iaurt grecesc sau lapte degresat, sare și piper, până obții consistența unui piure. Servește pieptul de curcan alături de piure."
        },
        {
            nume: "Ardei Umpluți cu Ciuperci și Orez Brun (Varianta De Post)",
            descriere: "Călește o ceapă tocată și 200g ciuperci feliate. Amestecă-le cu 50g orez brun prefiert, pătrunjel tocat, sare și piper. Umple 2 ardei grași (curățați de semințe) cu amestecul. Așează ardeii într-o cratiță mică, adaugă puțină apă și sos de roșii și fierbe la foc mic sau coace la cuptor până când ardeii sunt moi."
        },
        {
            nume: "Păstrăv la Cuptor cu Legume Mediteraneene",
            descriere: "Curăță și condimentează un păstrăv proaspăt (aproximativ 200g) cu sare, piper și rozmarin. Așează-l într-o tavă peste un pat de legume mediteraneene tăiate cuburi (dovlecel, vinete, ardei gras, ceapă roșie). Stropește totul cu puțin ulei de măsline și zeamă de lămâie. Coace la 180°C pentru 20-25 de minute."
        },
        {
            nume: "Tocană de Pui cu Legume și Sos de Roșii",
            descriere: "Taie 150g piept de pui cubulețe și călește-l ușor într-o tigaie. Adaugă ceapă, ardei gras, morcov, dovlecel tăiate cuburi și usturoi tocat. Toarnă 200ml sos de roșii passata și asezonează cu busuioc, oregano, sare și piper. Fierbe la foc mic 20 de minute. Servește cu pătrunjel proaspăt."
        },
        {
            nume: "Chiftele de Fasole Albă la Cuptor",
            descriere: "Pasează 250g de fasole albă fiartă cu 1 ceapă mică călită, 1 cățel de usturoi, pătrunjel și cimbru. Adaugă 1 ou, sare și piper. Formează chiftele mici și așează-le pe o tavă tapetată cu hârtie de copt. Coace la 180°C pentru 20-25 de minute până se rumenesc. Servește cu salată verde și roșii."
        },
        {
            nume: "Dovlecel Umplut cu Quinoa și Legume",
            descriere: "Taie dovleceii în jumătate pe lungime și scoate miezul cu o lingură. Fierbe 50g quinoa conform instrucțiunilor. Călește ceapă, ardei gras, ciuperci și morcov ras. Amestecă legumele cu quinoa fiartă, adaugă pătrunjel, mărar, sare și piper. Umple dovleceii și coace-i la 180°C pentru 25-30 de minute."
        },
        {
            nume: "Ghiveci de Legume cu Tofu",
            descriere: "Tăie cubulețe 150g tofu ferm și marinează-l în sos de soia cu puțin usturoi și ghimbir pentru 30 de minute. Călește ceapă, ardei gras, morcov, vinete și dovlecel tăiate cuburi. Adaugă tofu marinat, roșii cubulețe și condimente (cimbru, oregano, boia dulce, sare, piper). Gătește la foc mic 15-20 minute."
        },
        {
            nume: "Orez din Conopidă cu Pui și Legume (Stil Asiatic)",
            descriere: "Procesează o conopidă mică în blender până obții granule ca orezul. Călește 100g piept de pui tăiat fâșii subțiri. Adaugă morcov ras, ceapă verde, ardei și mazăre. Adaugă 'orezul' de conopidă și stropește cu 1 lingură de sos de soia cu conținut redus de sodiu. Condimentează cu ghimbir, usturoi și piper."
        },
        {
            nume: "Frittata cu Spanac și Brânză Feta",
            descriere: "Bate 2 ouă întregi și 2 albușuri cu puțin lapte degresat, sare și piper. Călește ceapă verde și usturoi, adaugă spanac proaspăt până se înmoaie. Toarnă amestecul de ouă peste legume, presară 30g brânză feta fărâmițată și pune tigaia la cuptor pentru 10-12 minute la 180°C, până se coagulează frittata."
        },
        {
            nume: "Mușchi de Vită la Grătar cu Sparanghel și Ciuperci",
            descriere: "Asezonează 120g mușchi de vită cu sare, piper și rozmarin. Gătește la grătar sau tigaie până obții gradul de gătire dorit. Sotează 150g sparanghel și 100g ciuperci Portobello cu 1 cățel de usturoi, sare și piper. Servește carnea alături de legume și o linguriță de sos de muștar Dijon amestecat cu ierburi proaspete."
        },
        {
            nume: "Cod în Crustă de Ierburi cu Piure de Țelină",
            descriere: "Preîncălzește cuptorul la 190°C. Acoperă 150g file de cod cu un amestec de pătrunjel tocat, cimbru, zeamă de lămâie și 1 lingură ulei de măsline. Coace 15 minute. Pentru piure, fierbe 200g țelină rădăcină și pasează cu 2 linguri iaurt grec, un strop de lapte degresat, nucșoară, sare și piper."
        },
        {
            nume: "Pulpe de Pui Dezosate cu Sos de Roșii și Măsline",
            descriere: "Rumenește 2 pulpe de pui dezosate (aproximativ 150g) într-o tigaie până se auresc. Adaugă 200g roșii tăiate cuburi, 1 cățel de usturoi, busuioc, oregano și 6-8 măsline Kalamata. Fierbe la foc mic 15-20 minute. Servește cu broccoli sau conopidă la abur."
        },
        {
            nume: "Curry de Linte cu Legume",
            descriere: "Călește 1 ceapă tocată și 2 căței de usturoi. Adaugă 1 lingură pastă de curry, 1 linguriță turmeric și ghimbir ras. Adaugă 150g linte roșie spălată, 1 ardei gras, 1 morcov tăiat cubulețe și 400ml supă de legume. Fierbe 20-25 minute până lintea este moale. Adaugă spanac proaspăt și 2 linguri lapte de cocos. Servește cu 1 lingură iaurt."
        },
        {
            nume: "Șalău la Cuptor cu Sos de Lămâie și Capere",
            descriere: "Preîncălzește cuptorul la 180°C. Așează 150g file de șalău într-o tavă. Amestecă zeama de la 1 lămâie cu 1 linguriță coajă de lămâie rasă, 1 linguriță capere, 1 cățel de usturoi tocat, pătrunjel și 1 lingură ulei de măsline. Toarnă sosul peste pește și coace 15 minute. Servește cu sparanghel la abur."
        },
        {
            nume: "Buddha Bowl cu Tempeh și Legume Coapte",
            descriere: "Marinează 100g tempeh în sos de soia cu ghimbir, usturoi și sirop de arțar. Coace tempeh și un amestec de morcovi, varză kale și ciuperci la 180°C timp de 20 de minute. Așează într-un bol alături de 50g quinoa fiartă, 1/4 avocado feliat și semințe de susan. Prepară un dressing din tahini, zeamă de lămâie și apă."
        },
        {
            nume: "Rulouri de Vinete cu Ricotta și Sos de Roșii",
            descriere: "Taie 1 vânătă pe lungime în felii subțiri și gătește-le la grătar. Amestecă 100g ricotta cu spanac gătit, 1 ou, pătrunjel, sare și piper. Întinde compoziția pe feliile de vânătă, rulează-le și așează-le într-o tavă. Toarnă deasupra sos de roșii și coace la 180°C pentru 15-20 minute."
        },
        {
            nume: "File de Biban de Mare cu Crustă de Migdale",
            descriere: "Preîncălzește cuptorul la 190°C. Acoperă 150g file de biban de mare cu un amestec de 2 linguri migdale măcinate, pătrunjel tocat, coajă de lămâie rasă, sare și piper. Stropește cu puțin ulei de măsline și coace 12-15 minute. Servește cu un mix de legume verzi (broccoli, fasole verde) la abur."
        },
        {
            nume: "Tocană de Fasole Albă cu Rozmarin și Spanac",
            descriere: "Călește 1 ceapă tocată și 2 căței de usturoi. Adaugă rozmarin, 1 frunză de dafin și 250g fasole albă fiartă. Toarnă 200ml supă de legume și fierbe la foc mic 10 minute. Încorporează 100g spanac proaspăt și lasă să se înmoaie. Servește presărând deasupra semințe de dovleac prăjite și un strop de ulei de măsline."
        },
        {
            nume: "Papillote de Cod cu Legume Julienne",
            descriere: "Preîncălzește cuptorul la 180°C. Taie 1 morcov, 1 dovlecel și 1 ardei gras în julienne. Așează legumele pe un pătrat de hârtie de copt, pune deasupra 150g file de cod, adaugă felii de lămâie, cimbru, 1 lingură vin alb, sare și piper. Împachetează strâns foaia și coace 15-18 minute."
        }
    ],
    "Snack": [
        {
            nume: "Măr cu Unt de Arahide",
            descriere: "Feliază un măr mic. Servește feliile cu 1 lingură (15g) de unt de arahide natural (fără zahăr adăugat)."
        },
        {
            nume: "O Mână de Migdale",
            descriere: "Consumă o porție mică de migdale crude (aproximativ 20-25g)."
        },
        {
            nume: "Batoane de Castravete cu Hummus",
            descriere: "Taie un castravete mic în bastonașe. Servește cu 2 linguri de hummus."
        },
        {
            nume: "Ou Fiert Tare",
            descriere: "Un ou fiert tare este o gustare excelentă, bogată în proteine."
        },
        {
            nume: "Brânză cu Semințe de In",
            descriere: "Servește 30g brânză slabă tip cașcaval sau telemea desărată cu 1 lingură de semințe de in măcinate. Poți adăuga câteva felii de ardei gras pentru volum și vitamine."
        },
        {
            nume: "Roșii Cherry cu Mozzarella",
            descriere: "Amestecă 5-6 roșii cherry tăiate jumătăți cu 30g mini-mozzarella (sau tăiată cubulețe). Adaugă busuioc proaspăt și un strop de ulei de măsline extravirgin pentru aromă."
        },
        {
            nume: "Smoothie cu Afine și Proteină",
            descriere: "Mixează 100g afine congelate cu 150ml lapte de migdale neîndulcit și jumătate de linguriță de pudră de proteină. Poți adăuga puțin scorțișoară sau esență de vanilie pentru aromă."
        },
        {
            nume: "Avocado cu Lămâie și Condimente",
            descriere: "Taie jumătate de avocado în felii și stropește cu zeamă de lămâie. Presară deasupra semințe de susan, fulgi de chili (opțional) și un praf de sare."
        },
        {
            nume: "Chipsuri de Varză Kale",
            descriere: "Rupe frunzele de varză kale în bucăți de mărimea unei guri, stropește-le cu puțin ulei de măsline și condimentează cu sare și piper. Coace la 150°C pentru 10-15 minute până devin crocante."
        },
        {
            nume: "Budincă de Chia cu Scorțișoară",
            descriere: "Amestecă 2 linguri de semințe de chia cu 100ml lapte de migdale neîndulcit și un praf de scorțișoară. Lasă la frigider cel puțin 3 ore sau peste noapte. Servește cu câteva bucăți de fructe proaspete."
        },
        {
            nume: "Rulouri de Curcan cu Avocado",
            descriere: "Ia 2-3 felii subțiri de piept de curcan afumat (aproximativ 50g) și umple-le cu fâșii de avocado copt și ardei gras feliat. Rulează și fixează cu o scobitoare. Conține proteine de calitate și grăsimi sănătoase."
        },
        {
            nume: "Edamame cu Sare de Mare",
            descriere: "Fierbe 80g păstăi de edamame (soia verde) congelate timp de 5 minute, scurge-le și presară ușor sare de mare. Bogat în proteine vegetale și fibre, cu un indice glicemic scăzut."
        },
        {
            nume: "Cremă de Brânză cu Somon Afumat",
            descriere: "Amestecă 30g cremă de brânză cu conținut redus de grăsimi cu ceapă verde tocată fin și mărar. Întinde pe 2 biscuiți integrali subțiri și adaugă deasupra 20g somon afumat."
        },
        {
            nume: "Chips de Nori",
            descriere: "Taie foi de alge nori în pătrate, stropește-le cu puțin ulei de susan și coace-le în cuptor la 150°C pentru 5-7 minute până devin crocante. Conțin minerale și sunt extrem de sărace în calorii."
        },
        {
            nume: "Mini Frittata cu Legume",
            descriere: "Preîncălzește cuptorul la 180°C. Bate 2 ouă cu 1 lingură de lapte degresat, adaugă ardei gras tocat, ceapă verde și spanac. Toarnă în forme de brioșe și coace 10-12 minute. Perfecte pentru gustări proteice în porții controlate."
        },
        {
            nume: "Tartine cu Pastă de Linte Roșie",
            descriere: "Pasează 50g linte roșie fiartă cu 1 linguriță tahini, zeamă de lămâie, usturoi, chimen și un strop de ulei de măsline. Întinde pasta pe felii de castravete sau crackers de orez."
        },
        {
            nume: "Shake Proteic cu Cacao",
            descriere: "Amestecă 200ml lapte de migdale neîndulcit cu 1 lingură pudră de proteine fără zahăr, 1 linguriță cacao neîndulcită, 1/2 banană congelată și gheață. Mixează până obții o consistență cremoasă."
        },
        {
            nume: "Chipsuri de Dovlecel la Cuptor",
            descriere: "Taie 1 dovlecel mediu în felii subțiri, așează-le pe o tavă cu hârtie de copt, stropește cu puțin ulei de măsline și presară oregano, sare și piper. Coace la 130°C pentru 35-40 minute până devin crocante."
        },
        {
            nume: "Amestec Proteic cu Nuci și Semințe",
            descriere: "Combină 1 lingură de nuci de Brazilia, 1 lingură migdale, 1 lingură semințe de dovleac și 1 lingură de fistic. Porționează în pachețele de câte 30g pentru control glicemic și caloric."
        },
        {
            nume: "Bărci din Ardei Gras cu Ton",
            descriere: "Taie 1 ardei gras în jumătate și scoate semințele. Amestecă 50g ton la conservă (în apă) scurs bine cu 1 lingură iaurt grec, puțină ceapă tocată și măsline. Umple jumătățile de ardei și servește."
        }
    ]
};

module.exports = retete;