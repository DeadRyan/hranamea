// Rețete pentru regimul sănătos
const retete_sanatoase = {
    "Mic dejun": [
        {
            nume: "Terci de Ovăz cu Fructe de Pădure",
            descriere: "Fierbe 50g fulgi de ovăz integrali în 200ml lapte vegetal sau apă. Adaugă un pumn de fructe de pădure proaspete sau congelate, 1 lingură de semințe de in măcinate și un strop de miere de albine. Opțional, adaugă scorțișoară sau vanilie."
        },
        {
            nume: "Omletă din Albuș cu Spanac și Ciuperci",
            descriere: "Bate 3-4 albușuri de ou cu puțin pătrunjel tocat, sare și piper. Călește într-o tigaie antiaderentă 100g spanac proaspăt și 50g ciuperci feliate. Toarnă albușurile peste legume și gătește până când se încheagă."
        },
        {
            nume: "Iaurt Grecesc cu Nuci și Miere",
            descriere: "Pune într-un bol 200g iaurt grecesc 0% grăsime. Adaugă 30g nuci sau migdale tocate, 1 lingură de semințe de dovleac, 1 lingură semințe de chia și un strop de miere pură de albine."
        },
        {
            nume: "Clătite din Făină de Hrișcă",
            descriere: "Amestecă 100g făină de hrișcă cu 1 ou, 100ml lapte vegetal, un praf de sare și bicarbonat. Coace clătite subțiri într-o tigaie antiaderentă și servește cu fructe proaspete și iaurt."
        },
        {
            nume: "Smoothie Verde cu Avocado",
            descriere: "Mixează 1 avocado mic copt, 1 banană, 1 mână spanac proaspăt, 1 lingură semințe de cânepă, 20g proteină din mazăre și 250ml lapte de migdale. Opțional, adaugă puțină lămâie."
        },
        {
            nume: "Mămăligă cu Brânză de Capră și Roșii",
            descriere: "Fierbe 50g mălai în 200ml apă cu un praf de sare până se îngroașă. Servește cu 50g brânză de capră fărâmițată și roșii cherry tăiate jumătăți. Presară semințe de dovleac și busuioc proaspăt."
        },
        {
            nume: "Salată de Crudități cu Ou Fiert",
            descriere: "Amestecă legume tăiate fin (castravete, ardei gras, ridichi, morcov ras) cu un ou fiert tăiat cubulețe și pătrunjel proaspăt. Adaugă un dressing din iaurt grecesc, muștar Dijon, zeamă de lămâie și piper."
        },
        {
            nume: "Turtă din Semințe și Fructe Uscate",
            descriere: "Mixează 50g fulgi de ovăz, 30g semințe (in, floarea-soarelui, dovleac), 30g fructe uscate nesulfurate tocate (caise, stafide, merișoare), 1 lingură ulei de cocos și 1 lingură miere. Întinde compoziția pe o tavă și coace la 160°C pentru 20 minute."
        },
        {
            nume: "Supă Rece de Castraveți cu Iaurt",
            descriere: "Mixează 1 castravete mare, 1 cățel de usturoi, 150g iaurt grecesc, mărar proaspăt, zeamă de lămâie, sare și piper. Servește rece, cu cuburi de gheață și cubulețe de castravete și mărar deasupra."
        },
        {
            nume: "Bruschette cu Avocado și Roșii",
            descriere: "Prăjește 2 felii de pâine integrală, freacă-le cu un cățel de usturoi. Întinde avocado zdrobit pe pâine, adaugă roșii cherry tăiate, piper negru proaspăt măcinat și frunze de busuioc. Stropește cu puțin ulei de măsline extravirgin."
        },
        {
            nume: "Budincă de Chia cu Lapte de Cocos și Fructe",
            descriere: "Amestecă 3 linguri de semințe de chia cu 250ml lapte de cocos și vanilie. Lasă la frigider peste noapte. Dimineața, adaugă fructe proaspete sau compot de fructe făcut în casă (fără zahăr) și nuci tocate."
        },
        {
            nume: "Pâine Integrală cu Pastă de Avocado și Somon Afumat",
            descriere: "Prăjește o felie de pâine integrală. Zdrobește jumătate de avocado cu zeamă de lămâie, sare și piper. Întinde pe pâine și adaugă deasupra câteva felii de somon afumat și mărar proaspăt tocat."
        },
        {
            nume: "Cremă de Mei cu Compot de Mere și Scorțișoară",
            descriere: "Fierbe 50g mei spălat în 200ml apă sau lapte de migdale până se înmoaie bine. Taie 1 măr cubulețe și fierbe-l cu scorțișoară și puțină miere până devine moale. Servește meiul cu compotul de mere deasupra și nuci tocate."
        },
        {
            nume: "Terină de Brânză de Vaci cu Verdeață",
            descriere: "Amestecă 200g brânză de vaci slabă cu ceapă verde tocată, mărar, pătrunjel, sare și piper. Adaugă 1 lingură de iaurt grecesc și 1 linguriță de muștar pentru cremozitate. Servește cu legume crude tăiate bețe sau pe felii de pâine integrală prăjită."
        },
        {
            nume: "Ou Poșat pe Pat de Spanac",
            descriere: "Călește 100g de spanac proaspăt într-o tigaie cu puțin ulei de măsline și usturoi. Poșează un ou într-o oală cu apă clocotită cu puțin oțet. Așează oul peste spanac și presară semințe de susan negru și fulgi de ardei iute (opțional)."
        },
        {
            nume: "Granola Făcută în Casă",
            descriere: "Amestecă 100g fulgi de ovăz, 50g nuci și semințe mixte, 1 lingură ulei de cocos, 1 lingură miere și vanilie. Coace la 150°C timp de 25 minute, amestecând ocazional. După răcire, adaugă fructe uscate tocate. Servește cu iaurt sau lapte vegetal."
        },
        {
            nume: "Piure de Quinoa cu Fructe",
            descriere: "Fierbe 50g quinoa în 200ml apă sau lapte vegetal. Când este moale, adaugă fructe proaspete tăiate (banană, piersică, căpșuni), puțină scorțișoară și un strop de sirop de arțar. Amestecă până obții o consistență cremoasă."
        },
        {
            nume: "Tartă cu Roșii și Brânză de Capră",
            descriere: "Amestecă 100g făină integrală cu 50g unt rece cubulețe, sare și puțină apă rece. Formează un aluat, întinde-l într-o formă mică și coace-l 10 minute la 180°C. Umple cu roșii tăiate felii, brânză de capră fărâmițată și ierburi aromate. Coace încă 15 minute."
        },
        {
            nume: "Cremă de Mei cu Lapte și Stafide",
            descriere: "Fierbe 50g mei spălat în 200ml lapte de migdale sau lapte normal până se înmoaie bine. Adaugă vanilie, scorțișoară, 1 lingură stafide și 1 lingură miere. Servește cald sau rece, cu nuci și semințe deasupra."
        },
        {
            nume: "Wrap de Mălai cu Legume și Pastă de Avocado",
            descriere: "Prepară o clătită din mălai amestecând 100g făină de mălai cu 1 ou, 150ml lapte, sare și piper. Coace într-o tigaie antiaderentă. Umple cu legume proaspete tăiate (ardei, salată, rodie), pastă de avocado și semințe de in."
        }
    ],
    "Prânz": [
        {
            nume: "Supă Cremă de Legume cu Quinoa",
            descriere: "Călește 1 ceapă, 2 morcovi, 1 țelină mică și 1 ardei gras. Adaugă 1 litru de supă de legume, 50g quinoa și fierbe 20 minute. Pasează cu un blender vertical, adaugă pătrunjel proaspăt și piper."
        },
        {
            nume: "Salată cu Năut și Bulgur",
            descriere: "Fierbe 80g bulgur conform instrucțiunilor. Amestecă cu 150g năut fiert, roșii cherry tăiate, castravete, ardei gras, ceapă roșie și pătrunjel. Prepară un dressing din ulei de măsline extravirgin, zeamă de lămâie, sumac și piper."
        },
        {
            nume: "Ciorbă Țărănească de Legume",
            descriere: "Călește 1 ceapă, 2 morcovi și 1 păstârnac. Adaugă 1 ardei, 2 cartofi, 1 dovlecel tăiate cubulețe și 1.5 litri supă de legume. Fierbe 20 minute, adaugă 100g fasole verde tăiată, roșii cubulețe și leuștean. Spre final, adaugă 2 linguri oțet de mere."
        },
        {
            nume: "Pește la Cuptor cu Legume Mediteraneene",
            descriere: "Așează un file de cod sau păstrăv (150g) peste un pat de legume tăiate (dovlecel, roșii, ceapă roșie, ardei gras). Stropește cu ulei de măsline, adaugă măsline kalamata și ierburi aromatice (cimbru, busuioc). Coace la 180°C pentru 20-25 minute."
        },
        {
            nume: "Tocăniță de Linte cu Legume",
            descriere: "Călește 1 ceapă, 2 morcovi, 1 ardei gras tăiate. Adaugă 150g linte verde, 1 conservă de roșii cubulețe, 400ml supă de legume, cimbru, rozmarin și coriandru. Fierbe la foc mic 30 minute. În ultimele 5 minute adaugă spanac proaspăt."
        },
        {
            nume: "Ciorbă de Fasole cu Afumătură Slabă",
            descriere: "Înmoaie 200g fasole uscată peste noapte. Fierbe-o cu 1 ceapă, 2 morcovi, 1 ardei gras, 1 bucată mică de afumătură slabă (opțional), 1 foi de dafin și cimbru. După ce fasolea este moale, adaugă boia, 2 linguri pastă de roșii și pătrunjel tocat."
        },
        {
            nume: "Salată de Quinoa cu Legume Coapte",
            descriere: "Fierbe 80g quinoa conform instrucțiunilor. Taie 1 dovlecel, 1 ardei gras, 1 ceapă roșie și coace-le la cuptor cu puțin ulei de măsline, cimbru și rozmarin. Amestecă quinoa cu legumele coapte, adaugă rodie, feta fărâmițată și semințe de dovleac."
        },
        {
            nume: "Buddha Bowl cu Tofu și Legume",
            descriere: "Aranjează într-un bol 60g orez brun fiert, 100g tofu marinat la cuptor, morcov ras, varză roșie, avocado, spanac și năut copt. Prepară un dressing din tahini, zeamă de lămâie, usturoi, apă și un strop de sirop de arțar."
        },
        {
            nume: "Wrap cu Hummus și Legume",
            descriere: "Întinde hummus pe o lipie integrală mare. Adaugă frunze de salată, morcov ras, varză murată, ardei gras, castraveți și avocado. Rulează strâns și taie în jumătate. Servește cu o garnitură de legume crude sau o salată mică."
        },
        {
            nume: "Dovlecei Umpluți cu Orez și Legume",
            descriere: "Scobește dovlecei tăiați pe jumătate pe lungime. Călește ceapă, usturoi, ardei gras și morcov tocat. Adaugă 100g orez brun prefiert, roșii cubulețe, pătrunjel, cimbru, sare și piper. Umple dovleceii, acoperă cu sos de roșii diluat și coace la 180°C pentru 30-35 minute."
        },
        {
            nume: "Supă de Roșii cu Orz",
            descriere: "Călește 1 ceapă și 1 morcov tocat. Adaugă 500g roșii proaspete (sau din conservă), 50g orz, busuioc, cimbru, 1 litru de supă de legume și fierbe până când orzul este gătit (aproximativ 30 minute). Opțional, adaugă puțină smântână vegetală și pătrunjel tocat la servire."
        },
        {
            nume: "Chifteluțe de Năut și Dovlecei la Cuptor",
            descriere: "Pasează 250g năut fiert cu 1 dovlecel ras și stors, 1 ceapă tocată, pătrunjel, usturoi, chimion, sare și piper. Adaugă 2 linguri făină de năut sau făină integrală pentru legare. Formează chifteluțe, pulverizează puțin ulei peste ele și coace-le la 200°C până se rumenesc."
        },
        {
            nume: "Salată de Fasole Boabe cu Legume Coapte",
            descriere: "Amestecă 200g fasole albă fiartă cu ardei, vinete și roșii coapte la cuptor. Adaugă ceapă roșie tăiată fin, pătrunjel, măsline kalamata, sare, piper și un dressing simplu din ulei de măsline, oțet balsamic și muștar Dijon."
        },
        {
            nume: "Risotto de Orz cu Ciuperci și Spanac",
            descriere: "Călește 1 ceapă tocată, adaugă 100g orz perlat și 200g ciuperci feliate. Toarnă treptat 500ml supă de legume fierbinte, amestecând frecvent până când orzul este gătit. La final adaugă spanac proaspăt, pătrunjel și opțional parmezan ras."
        },
        {
            nume: "Supă de Varză cu Porumb și Fasole",
            descriere: "Călește 1 ceapă și 1 morcov tocat. Adaugă 300g varză tăiată fâșii subțiri, 1 cartof tăiat cuburi, 100g porumb, 100g fasole boabe fiartă, boia dulce și 1 litru supă de legume. Fierbe la foc mic 25-30 minute. Adaugă verdeață proaspătă și piper la final."
        },
        {
            nume: "Cremă de Conopidă cu Migdale Prăjite",
            descriere: "Fierbe 1 conopidă mică, 1 cartof și 1 ceapă până se înmoaie. Pasează cu un blender vertical adăugând puțin lapte vegetal pentru consistență. Condimentează cu sare, piper alb și nucșoară. Servește cu migdale prăjite și un fir de ulei de măsline."
        },
        {
            nume: "Pui la Cuptor cu Lămâie și Ierburi",
            descriere: "Marinează piept de pui (150g) în zeamă de lămâie, ulei de măsline, usturoi, rozmarin și cimbru proaspăt pentru 30 minute. Coace la 180°C până este gătit complet. Servește cu garnitură de legume la abur sau salată proaspătă."
        },
        {
            nume: "Tocăniță de Fasole Albă cu Legume",
            descriere: "Călește 1 ceapă și 2 morcovi tocați. Adaugă 1 ardei gras, 2 roșii, 250g fasole albă fiartă, cimbru, rozmarin, sare, piper și un strop de vin alb (opțional). Fierbe la foc mic 20 minute. Servește cu pătrunjel proaspăt și ceapă verde tocată."
        },
        {
            nume: "Paste Integrale cu Sos de Roșii și Legume",
            descriere: "Fierbe 80g paste integrale conform instrucțiunilor. Pentru sos, călește 1 ceapă, 1 ardei, 1 dovlecel și 1 morcov tocate. Adaugă 250g roșii pasate, busuioc, oregano, sare și piper. Fierbe sosul 15 minute, combină cu pastele și presară opțional brânză rasă sau drojdie nutritivă."
        },
        {
            nume: "Salată de Linte cu Sfeclă Coaptă",
            descriere: "Fierbe 100g linte verde conform instrucțiunilor. Coace 1 sfeclă roșie la cuptor până se înmoaie, apoi taie cubulețe. Amestecă lintea cu sfecla, rucola, bucăți de brânză feta, semințe de dovleac și un dressing din ulei de măsline, oțet balsamic și miere."
        }
    ],
    "Cină": [
        {
            nume: "Piept de Pui la Grătar cu Salată de Varză Kale",
            descriere: "Marinează 120g piept de pui în ulei de măsline, lămâie, usturoi și ierburi pentru 30 minute. Gătește la grătar. Amestecă frunze de kale tocate cu ulei de măsline, lămâie și un praf de sare, masând ușor pentru înmuiere. Adaugă semințe de dovleac și rodie."
        },
        {
            nume: "Ghiveci de Legume cu Tofu",
            descriere: "Călește 1 ceapă, 2 morcovi, 1 ardei gras, 1 dovlecel, 1 vânătă tăiate cuburi. Adaugă 150g tofu ferm tăiat cuburi, 2 roșii, ierburi aromatice, sare și piper. Fierbe la foc mic 20 minute. Adaugă pătrunjel proaspăt înainte de servire."
        },
        {
            nume: "Sarmalute în Foi de Varză cu Ciuperci și Orez Brun",
            descriere: "Călește 200g ciuperci tocate cu 1 ceapă, 1 morcov ras, condimente. Amestecă cu 100g orez brun prefiert. Învelește amestecul în foi de varză opărite. Așează sarmalele într-o oală, acoperă cu un sos de roșii diluat și fierbe la foc mic 45 minute."
        },
        {
            nume: "Păpădie de Năut cu Legume Coapte",
            descriere: "Pasează 250g năut fiert cu 2 linguri de tahini, zeamă de lămâie, usturoi, chimion, sare și piper. Coace la cuptor legume tăiate - vinete, ardei, morcovi - cu ulei, rozmarin, cimbru până se caramelizează. Servește crema de năut cu legumele coapte deasupra."
        },
        {
            nume: "Orez Negru cu Legume și Semințe",
            descriere: "Fierbe 80g orez negru conform instrucțiunilor. Separat, călește 1 ceapă roșie cu 1 ardei gras, 1 morcov, 50g mazăre și 50g porumb dulce. Amestecă legumele cu orezul, adaugă pătrunjel, semințe de dovleac, semințe de floarea-soarelui, sare și piper."
        },
        {
            nume: "Supă de Pui cu Tăiței de Dovlecel",
            descriere: "Fierbe 1 piept de pui în 1.5 litri apă cu 1 ceapă, 2 morcovi, 1 țelină și condimente (sare, piper, cimbru, frunze de dafin). Scoate puiul și taie-l cuburi. Curăță și spală bine legumele, taie-le mărunt. Folosește un spiralizator pentru a face tăiței din dovlecel. Adaugă legumele și tăiețeii de dovlecel în supă și fierbe 5 minute."
        },
        {
            nume: "Frittata cu Legume de Sezon",
            descriere: "Bate 4 ouă cu 2 linguri de lapte, sare, piper și ierburi. Călește într-o tigaie ce poate merge la cuptor 1 ceapă verde, 50g ciuperci, 1 ardei gras și 50g spanac. Toarnă amestecul de ouă peste legume și gătește la foc mic 3-4 minute, apoi la cuptor la 180°C pentru 10 minute. Servește cu salată verde."
        },
        {
            nume: "Gulaș de Legume cu Sos de Roșii",
            descriere: "Călește 1 ceapă, 2 morcovi, 1 ardei gras, 1 dovlecel și 1 cartof dulce tăiate cuburi. Adaugă 1 lingură de boia, chimen, cimbru, 500ml supă de legume și 250g roșii pasate. Fierbe la foc mic 25-30 minute până când legumele sunt moi. Servește cu pătrunjel proaspăt."
        },
        {
            nume: "Somon la Cuptor cu Sparanghel",
            descriere: "Așează un file de somon (150g) pe o tavă, stropește cu ulei de măsline, zeamă de lămâie, sare, piper și mărar. Alături, pune 10-12 fire de sparanghel curățate și stropite cu puțin ulei. Coace la 180°C pentru 15 minute. Servește cu felii de lămâie proaspătă."
        },
        {
            nume: "Vinete Umplute cu Bulgur și Năut",
            descriere: "Taie vinete pe jumătate pe lungime, scobește-le lăsând un perete de 1 cm și coace-le 15 minute la 180°C. Călește ceapă, usturoi, ardei gras, adaugă bulgur prefiert, năut zdrobit, roșii cubulețe și ierburi. Umple vinetele cu amestecul, stropește cu ulei de măsline și coace încă 20 minute."
        },
        {
            nume: "Tocăniță de Fasole Roșie cu Ardei și Quinoa",
            descriere: "Călește 1 ceapă și 2 ardei grași tăiați cuburi. Adaugă 250g fasole roșie fiartă, 100g quinoa fiartă, roșii cubulețe, chimen, coriandru, boia și fierbe la foc mic 15 minute. Adaugă coriandru proaspăt sau pătrunjel la final și servește cu iaurt vegetal sau lapte de cocos (opțional)."
        },
        {
            nume: "Pește la Grătar cu Salată de Varză și Măr",
            descriere: "Condimentează file de pește alb (cod, biban, păstrăv) cu ierburi, lămâie, sare și piper și gătește-l la grătar sau într-o tigaie. Prepară o salată din varză albă rasă fin, măr tăiat fâșii subțiri, ceapă roșie, mărar, iaurt, muștar și miere. Servește peștele cu salata alături."
        },
        {
            nume: "Curry Vegetal cu Linte Roșie",
            descriere: "Călește 1 ceapă, 2 căței de usturoi, 1 lingură de ghimbir ras. Adaugă curry, turmeric, chimen, coriandru și boia. Pune 200g linte roșie spălată, 1 cartof dulce tăiat cuburi, 1 dovlecel, 400ml lapte de cocos și 200ml apă. Fierbe până când lintea este moale (~20 min). Servește cu coriandru proaspăt."
        },
        {
            nume: "Broccoli și Conopidă la Cuptor cu Sos Tahini",
            descriere: "Taie 1 broccoli și 1/2 conopidă în buchete, amestecă-le cu 2 linguri de ulei de măsline, usturoi granulat, sare și piper. Coace la 200°C pentru 20-25 minute până se rumenesc. Prepară un sos din 2 linguri tahini, zeamă de lămâie, usturoi, apă pentru diluare și pătrunjel tocat."
        },
        {
            nume: "Salată Caldă de Fasole Verde și Cartofi Noi",
            descriere: "Fierbe 200g fasole verde și 200g cartofi noi (tăiați în jumătate dacă sunt mari). Amestecă-le cu 1 ceapă roșie feliată subțire, 1 lingură de capere, măsline kalamata și un dressing din ulei de măsline, muștar Dijon, oțet de vin, sare și piper."
        },
        {
            nume: "Dovlecei Umpluți cu Quinoa și Brânză Feta",
            descriere: "Taie dovlecei pe jumătate pe lungime și scoate miezul cu o linguriță. Amestecă miezul de dovlecel tocat cu quinoa fiartă, ceapă călită, brânză feta fărâmițată, roșii cherry tăiate, pătrunjel, sare și piper. Umple dovleceii și coace la 180°C pentru 25 minute."
        },
        {
            nume: "Ciupercuțe Umplute la Cuptor",
            descriere: "Curăță 8-10 ciuperci mari și scoate codițele. Toacă codițele și călește-le cu ceapă verde, usturoi, spanac, pastă de tomate, ierburi, sare și piper. Amestecă cu brânză de capră sau ricotta. Umple ciupercile, presară deasupra pesmet integral și coace la 180°C pentru 15-20 minute."
        },
        {
            nume: "Ardei Umpluți cu Hrișcă și Legume",
            descriere: "Fierbe 100g hrișcă conform instrucțiunilor. Taie capetele a 4 ardei grași și curăță-i de semințe. Călește ceapă, usturoi, morcov, dovlecel, toate tocate mărunt. Amestecă cu hrișca, pătrunjel, busuioc, sare și piper. Umple ardeii, pune-i într-o tavă cu sos de roșii și coace la 180°C pentru 35-40 minute."
        },
        {
            nume: "Chili Sin Carne cu Trei Tipuri de Fasole",
            descriere: "Călește 1 ceapă, 2 căței de usturoi, 1 ardei jalapeño (opțional), 1 ardei gras roșu. Adaugă chimen, oregano, boia, 300g roșii mărunțite din conservă, 150g fasole neagră, 150g fasole roșie și 150g năut (toate fierte în prealabil). Fierbe la foc mic 20-25 minute. Servește cu avocado și lime."
        },
        {
            nume: "Salată de Roșii cu Busuioc și Mozzarella",
            descriere: "Feliază roșii coapte bine, alternează feliile de roșii cu felii de mozzarella pe un platou. Presară frunze de busuioc proaspăt, adaugă ulei de măsline extravirgin, sare de mare, piper negru proaspăt măcinat și un strop de oțet balsamic. Servește cu pâine integrală prăjită."
        }
    ],
    "Gustare": [
        {
            nume: "Hummus cu Morcov și Țelină",
            descriere: "Pasează 150g năut fiert cu 1 lingură tahini, zeamă de lămâie, 1 cățel de usturoi, 1 lingură ulei de măsline, sare, piper și boia dulce. Servește cu bețișoare de morcov și țelină."
        },
        {
            nume: "Brânză de Capră cu Roșii Cherry și Busuioc",
            descriere: "Aranjează 50g brânză de capră naturală alături de roșii cherry tăiate jumătăți și frunze de busuioc proaspăt. Stropește cu ulei de măsline extravirgin și presară semințe de in."
        },
        {
            nume: "Mere Coapte cu Scorțișoară și Nuci",
            descriere: "Taie 1 măr în jumătate, scoate semințele și umple cu un amestec din 1 lingură fulgi de ovăz, 1 lingură nuci tocate, scorțișoară și un strop de miere. Coace la 180°C pentru 20 minute."
        },
        {
            nume: "Pâine de Secară cu Avocado și Semințe",
            descriere: "Întinde 1/2 avocado copt pe o felie de pâine de secară integrală. Presară semințe de susan, semințe de dovleac și un praf de fulgi de chili. Stropește cu zeamă de lămâie și piper proaspăt măcinat."
        },
        {
            nume: "Iaurt cu Fulgi de Ovăz și Fructe",
            descriere: "Amestecă 150g iaurt grecesc cu 2 linguri de fulgi de ovăz, 1 lingură semințe de chia, 1 mână de căpșuni sau afine, scorțișoară și un strop de extract de vanilie. Prepară seara și lasă la frigider peste noapte."
        },
        {
            nume: "Bruschette cu Tomate și Busuioc",
            descriere: "Prăjește 2 felii de pâine integrală, freacă-le cu un cățel de usturoi. Acoperă cu roșii mărunțite amestecate cu busuioc proaspăt tocat, sare, piper și un fir de ulei de măsline extravirgin."
        },
        {
            nume: "Batoane Energetice din Fructe Uscate și Semințe",
            descriere: "Mixează 100g curmale fără sâmburi, 50g caju sau migdale, 30g fulgi de cocos, 20g semințe de chia și 1 lingură de cacao. Formează un dreptunghi pe o foaie de copt, presează bine și lasă la frigider 1-2 ore. Taie în batoane."
        },
        {
            nume: "Chips de Kale la Cuptor",
            descriere: "Rupe frunze de kale în bucăți, spală și usucă bine. Amestecă-le cu 1 lingură de ulei de măsline, sare de mare și nutrițională (opțional). Întinde-le pe o tavă în strat subțire și coace la 150°C pentru 10-15 minute până devin crocante."
        },
        {
            nume: "Roșii Umplute cu Salată de Ton",
            descriere: "Taie 2 roșii în jumătate și scoate pulpa. Amestecă 1 conservă mică de ton în apă (scurs) cu 1 lingură iaurt grecesc, ceapă verde tocată, măsline tocate, pătrunjel și piper. Umple jumătățile de roșii cu amestecul."
        },
        {
            nume: "Smoothie Verde de Detoxifiere",
            descriere: "Mixează 1 mână de spanac sau kale, 1 măr verde, 1/2 castravete, 1 bucată de ghimbir proaspăt (2 cm), zeamă de lămâie, 1 lingură semințe de cânepă și 200ml apă de cocos sau apă simplă. Adaugă gheață după preferință."
        },
        {
            nume: "Pastă de Avocado cu Lămâie",
            descriere: "Zdrobește 1 avocado copt cu furculița, adaugă zeamă de lămâie, sare de mare, piper negru și opțional fulgi de ardei iute. Servește pe crackers integrali sau pâine de secară prăjită."
        },
        {
            nume: "Salată de Fructe cu Iaurt și Nuci",
            descriere: "Amestecă fructe de sezon tăiate bucăți (măr, pară, portocală, kiwi, struguri) cu 2 linguri de iaurt grecesc și 1 lingură de nuci sau migdale tocate. Opțional, adaugă un strop de miere și puțină scorțișoară."
        },
        {
            nume: "Rulouri de Castravete cu Cremă de Brânză și Ierburi",
            descriere: "Taie 1 castravete pe lungime în fâșii subțiri folosind un curățător de legume. Amestecă cremă de brânză light cu ceapă verde, mărar, pătrunjel tocat, sare și piper. Întinde crema pe fâșiile de castravete și rulează-le."
        },
        {
            nume: "Mini Sandvișuri cu Ou și Avocado",
            descriere: "Fierbe 1 ou tare, taie-l felii. Așează feliile de ou și avocado tăiat subțire pe pâine integrală. Adaugă frunze de rucola, sare, piper și un strop de ulei de măsline. Taie în sferturi pentru mini sandvișuri."
        },
        {
            nume: "Salată de Morcov cu Mere și Stafide",
            descriere: "Rade 1 morcov mare și 1 măr. Amestecă-le cu 1 lingură de stafide, 1 lingură de semințe de floarea-soarelui, zeamă de lămâie, un strop de ulei de măsline, sare și piper. Servește ca gustare sau garnitură."
        },
        {
            nume: "Wrap cu Humus și Legume",
            descriere: "Întinde hummus pe o lipie integrală mică. Adaugă frunze de spanac, morcov ras, ardei gras feliat subțire, germeni și semințe de cânepă. Rulează strâns și taie în două."
        },
        {
            nume: "Pere cu Brânză Albastră și Nuci",
            descriere: "Taie 1 pară coaptă în sferturi și îndepărtează semințele. Pune deasupra bucățele de brânză cu mucegai și nuci tocate. Stropește cu puțină miere și piper negru proaspăt măcinat."
        },
        {
            nume: "Ouă Umplute cu Avocado",
            descriere: "Fierbe 2 ouă tari, taie-le pe jumătate și scoate gălbenușurile. Zdrobește gălbenușurile cu 1/2 avocado copt, zeamă de lămâie, sare, piper și pătrunjel tocat. Umple albușurile cu pasta obținută și decorează cu paprika."
        },
        {
            nume: "Chipsuri din Sfeclă și Morcovi",
            descriere: "Taie sfeclă și morcovi în felii foarte subțiri. Amestecă-le cu puțin ulei de măsline, sare de mare și rozmarin uscat. Așează feliile pe o tavă tapetată cu hârtie de copt, fără să se suprapună, și coace la 140°C pentru 20-25 minute, întorcându-le la jumătatea timpului."
        },
        {
            nume: "Budincă de Chia cu Cacao și Banană",
            descriere: "Amestecă 3 linguri de semințe de chia cu 250ml lapte vegetal, 1 lingură de cacao neîndulcită, 1/2 lingură de miere sau sirop de arțar și 1/2 linguriță de extract de vanilie. Lasă la frigider peste noapte. Înainte de servire, decorează cu banană feliată și fulgi de cocos."
        }
    ]
};

module.exports = retete_sanatoase;