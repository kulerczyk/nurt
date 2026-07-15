export interface Workshop {
  slug: string;
  shortTitle: string;
  title: string;
  tagline: string;
  image: string;
  imageAlt: string;
  imageBg?: "light" | "dark"; // light = jasne tło zdjęcia (rzeźba), dark = ciemne
  imagePosition?: string; // object-position override
  color: string; // heather shade for accents
  intro: string;
  sections: {
    heading?: string;
    body: string;
  }[];
  closing: string;
  highlights: string[];
}

export const workshops: Workshop[] = [
  {
    slug: "malarstwo-i-rysunek",
    shortTitle: "Malarstwo i rysunek",
    title: "Warsztaty malarskie i rysunkowe",
    tagline: "Bez stresu, bez ocen. Po prostu twórz.",
    image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=1400&q=85",
    imageAlt: "Pędzle i farby na stole podczas warsztatów malarskich",
    color: "heather-400",
    intro:
      "Lubisz rysować, malować albo po prostu chcesz spróbować czegoś nowego? W NURCIE nie liczy się doświadczenie, liczy się chęć tworzenia. To miejsce, gdzie można rozwijać swoją kreatywność, poznawać różne techniki i dobrze się przy tym bawić.",
    sections: [
      {
        body: "Pokażemy Ci podstawy rysunku i malarstwa, podpowiemy, jak pracować z kolorem, światłem czy kompozycją.",
      },
      {
        body: "W naszym zespole są twórcy z wykształceniem Akademii Sztuk Pięknych, artyści i artystki od lat zajmujący się malowaniem wielkoformatowych murali oraz doświadczeni samoucy, którzy swoją wiedzę zdobywali przez lata praktyki i pracy twórczej. Dzięki temu poznasz różne spojrzenia na sztukę i przekonasz się, że nie ma jednej drogi do zostania artystą.",
      },
      {
        body: "Na zajęciach stawiamy na swobodną atmosferę, wzajemne wsparcie i rozwijanie kreatywności. Pomagamy, podpowiadamy i motywujemy do próbowania nowych rzeczy. Każdy pracuje we własnym tempie",
      },
    ],
    closing: "Bez stresu, bez ocen i w świetnej atmosferze. Po prostu przyjdź i twórz razem z nami!",
    highlights: ["Kolor i światło", "Kompozycja", "Rysunek szkicowy", "Malarstwo akrylowe", "Własny styl"],
  },
  {
    slug: "linoryt",
    shortTitle: "Linoryt",
    title: "Warsztaty linorytu",
    tagline: "Każda odbitka jest jedyna w swoim rodzaju.",
    image: "/workshops/linoryt.png",
    imageAlt: "Dłutka i linoleum podczas warsztatów linorytu",
    color: "heather-500",
    intro:
      "Masz ochotę zrobić własną grafikę i odbić ją na papierze? Wpadnij na warsztaty linorytu! To świetna zabawa i okazja, żeby poznać technikę, która daje naprawdę wyjątkowe efekty.",
    sections: [
      {
        body: "Na początku wymyślisz swój wzór, później przeniesiesz go na linoleum, wytniesz dłutkami, a na końcu wykonasz własne odbitki.",
      },
      {
        body: "Możesz stworzyć coś inspirowanego naturą, architekturą albo puścić wodze wyobraźni i zaprojektować grafikę całkowicie po swojemu. Każda odbitka jest trochę inna, dzięki czemu każda praca jest jedyna w swoim rodzaju.",
      },
    ],
    closing:
      "To warsztaty dla osób, które lubią działać ręcznie, eksperymentować i odkrywać nowe formy wyrażania siebie. Wystarczy odrobina ciekawości i chęć spróbowania czegoś nowego. Resztą zajmiemy się razem.",
    highlights: ["Projektowanie wzoru", "Cięcie dłutkami", "Odbijanie na papierze", "Własna grafika"],
  },
  {
    slug: "bizuteria",
    shortTitle: "Tworzenie biżuterii",
    title: "Warsztaty tworzenia biżuterii",
    tagline: "Zaprojektuj i noś — coś, czego nie ma nikt inny.",
    image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1400&q=85",
    imageAlt: "Koraliki i kamienie naturalne podczas warsztatów biżuterii",
    color: "heather-400",
    intro:
      "Masz ochotę zrobić własną bransoletkę czy naszyjnik? Na tych warsztatach sam zaprojektujesz i wykonasz biżuterię z koralików oraz naturalnych kamieni.",
    sections: [
      {
        body: "Wszystkiego nauczysz się na miejscu, a my pomożemy Ci na każdym etapie.",
      },
      {
        body: "Możesz postawić na delikatną i elegancką biżuterię albo zaszaleć z kolorami i stworzyć coś bardziej wyrazistego. Bransoletki, naszyjniki, pierścionki, breloki ogranicza Cię tylko wyobraźnia.",
      },
    ],
    closing:
      "To świetna okazja, żeby na chwilę zwolnić, zrobić coś własnymi rękoma. Przy okazji poznasz podstawy tworzenia biżuterii, dowiesz się, jak pracować z różnymi materiałami i wyjdziesz z warsztatów z gotowymi ozdobami, które możesz nosić na co dzień albo podarować komuś w prezencie.",
    highlights: ["Koraliki i kamienie naturalne", "Bransoletki i naszyjniki", "Praca z różnymi materiałami", "Gotowe ozdoby do noszenia"],
  },
  {
    slug: "sitodruk",
    shortTitle: "Sitodruk",
    title: "Warsztaty sitodruku",
    tagline: "Twój wzór. Twoja koszulka. Twoja torba.",
    image: "/workshops/sitodruk.png",
    imageAlt: "Sitodruk — nanoszenie farby przez matrycę raklem",
    color: "heather-600",
    intro:
      "Chcesz stworzyć własny nadruk na torbie, plakacie, koszulce lub papierze? Warsztaty sitodruku w NURCIE to świetna okazja, by poznać jedną z najpopularniejszych technik druku.",
    sections: [
      {
        body: "Podczas zajęć uczestnicy odkrywają, jak działa sitodruk. Krok po kroku poznają proces przygotowania wzoru, pracy z matrycą oraz nanoszenia farby na wybraną powierzchnię. Efektem są autorskie odbitki, które można powielać i wykorzystywać na wiele sposobów.",
      },
      {
        body: "Warsztaty mają praktyczny charakter, dlatego od początku stawiamy na działanie i eksperymentowanie. Uczestnicy mogą bawić się formą, kolorem i kompozycją, tworząc grafiki inspirowane własnymi pomysłami.",
      },
      {
        body: "Sitodruk daje ogromne możliwości artystyczne. Pozwala tworzyć zarówno proste, minimalistyczne wzory, jak i bardziej rozbudowane projekty. To technika, która łączy rzemiosło, design i sztukę, a przy tym daje mnóstwo satysfakcji z samodzielnie wykonanej pracy.",
      },
    ],
    closing:
      "Na koniec zabierzesz ze sobą własnoręcznie wykonane prace oraz nowe umiejętności, które mogą stać się początkiem dalszej przygody z grafiką warsztatową. To kreatywne zajęcia dla wszystkich, którzy lubią tworzyć, eksperymentować i nadawać przedmiotom niepowtarzalny charakter.",
    highlights: ["Przygotowanie wzoru", "Praca z matrycą", "Nadruk na papierze i tkaninie", "Własne odbitki do zabrania"],
  },
  {
    slug: "rzezba",
    shortTitle: "Rzeźba",
    title: "Warsztaty rzeźby",
    tagline: "Od pomysłu do przestrzennej formy.",
    image: "/workshops/rzezba.png",
    imageAlt: "Rzeźba ceramiczna — głowa z dłońmi zasłaniającymi twarz",
    imageBg: "light",
    imagePosition: "center center",
    color: "heather-500",
    intro:
      "Lubisz tworzyć własnymi rękami i nadawać pomysłom trójwymiarową formę? Warsztaty rzeźby w NURCIE to okazja do poznania podstaw modelowania i pracy z różnorodnymi materiałami w twórczej, przyjaznej atmosferze.",
    sections: [
      {
        body: "Podczas zajęć uczestnicy uczą się, jak przekształcać swoje pomysły w przestrzenne formy. Pracujemy z gliną, masami rzeźbiarskimi oraz innymi materiałami, poznając podstawowe techniki modelowania, kształtowania faktur i budowania kompozycji. Każdy projekt powstaje krok po kroku, od pierwszego szkicu i koncepcji aż po gotową rzeźbę.",
      },
      {
        body: "Warsztaty są przeznaczone zarówno dla osób początkujących, jak i tych, które miały już kontakt z rzeźbą. Nie trzeba posiadać doświadczenia ani szczególnych zdolności manualnych, liczy się chęć eksperymentowania, tworzenia i odkrywania nowych możliwości wyrażania siebie.",
      },
      {
        body: "Inspiracji można szukać w naturze, postaciach, zwierzętach, przedmiotach codziennego użytku lub własnej wyobraźni. Każda praca jest niepowtarzalna i odzwierciedla indywidualny styl oraz pomysł jej autora.",
      },
    ],
    closing:
      "Na zakończenie każdy uczestnik zabiera ze sobą wykonane prace oraz satysfakcję z samodzielnego stworzenia czegoś wyjątkowego. To warsztaty, które pozwalają oderwać się od codzienności, pobudzić wyobraźnię i odkryć radość płynącą z tworzenia w trzech wymiarach.",
    highlights: ["Glina i masy rzeźbiarskie", "Modelowanie i faktury", "Od szkicu do gotowej rzeźby", "Praca 3D"],
  },
  {
    slug: "ceramika",
    shortTitle: "Ceramika",
    title: "Warsztaty ceramiczne",
    tagline: "Glina w rękach, spokój w głowie.",
    image: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=1400&q=85",
    imageAlt: "Ceramika — dłonie formujące glinę",
    color: "heather-400",
    intro:
      "Masz ochotę ubrudzić ręce gliną i stworzyć coś własnego? Warsztaty ceramiczne w NURCIE to świetna okazja, żeby spróbować swoich sił i przekonać się, ile frajdy daje lepienie z gliny.",
    sections: [
      {
        body: "Na zajęciach pokażemy Ci, jak krok po kroku pracować z gliną, od pierwszego kawałka materiału aż po gotowy projekt. Możesz zrobić kubek, miseczkę, talerzyk, figurkę, doniczkę albo coś całkowicie po swojemu. Wszystko zależy od Twojego pomysłu.",
      },
      {
        body: "Nie musisz mieć żadnego doświadczenia. Pomożemy Ci na każdym etapie i pokażemy różne sposoby modelowania oraz formowania gliny. Kiedy prace będą gotowe, przyjdzie czas na ich ozdabianie, szkliwami, i kolorami, dzięki czemu każda będzie naprawdę wyjątkowa.",
      },
      {
        body: "Po wypaleniu w piecu Twoje prace staną się trwałymi przedmiotami, z których będzie można korzystać na co dzień albo podarować je komuś jako wyjątkowy, własnoręcznie wykonany prezent.",
      },
    ],
    closing:
      "To świetny sposób, żeby oderwać się od codzienności, trochę się zrelaksować i wyjść z warsztatów z czymś, co powstało od początku do końca dzięki Twoim rękom.",
    highlights: ["Praca z gliną", "Modelowanie i formowanie", "Szkliwienie", "Wypalanie w piecu"],
  },
  {
    slug: "malowanie-na-ubraniach",
    shortTitle: "Malowanie na ubraniach",
    title: "Warsztaty malowania na ubraniach",
    tagline: "Drugie życie dla Twoich ubrań.",
    image: "/workshops/malowanie-na-ubraniach.png",
    imageAlt: "Kurtka dżinsowa z ręcznie malowanym wzorem — farby do tkanin",
    color: "heather-500",
    intro:
      "Masz w szafie koszulkę, bluzę albo torbę, którym przydałoby się drugie życie? A może chcesz stworzyć coś, czego nie ma nikt inny? Na warsztatach malowania na ubraniach zamienisz zwykłe rzeczy w wyjątkowe.",
    sections: [
      {
        body: "Możesz przynieść własne ubrania lub skorzystać z materiałów przygotowanych na miejscu. Pokażemy Ci, jak malować specjalnymi farbami do tkanin, jak tworzyć trwałe wzory i jak łączyć kolory, żeby efekt cieszył przez długi czas.",
      },
      {
        body: "Nie musisz umieć rysować ani malować. Pomożemy Ci przenieść Twój pomysł na materiał, a jeśli nie masz inspiracji, wspólnie coś wymyślimy. Możesz stworzyć minimalistyczny wzór, kolorową grafikę, napis albo całkowicie puścić wodze wyobraźni.",
      },
    ],
    closing: "To świetna okazja, żeby kreatywnie spędzić czas, odświeżyć ulubione ubrania.",
    highlights: ["Farby do tkanin", "Własne lub nasze materiały", "Trwałe wzory", "Minimalizm lub kolor — Twój wybór"],
  },
  {
    slug: "filcowanie",
    shortTitle: "Filcowanie",
    title: "Warsztaty filcowania",
    tagline: "Z wełny i cierpliwości — coś wyjątkowego.",
    image: "/workshops/filcowanie.png",
    imageAlt: "Filcowane figurki — króliczki z wełny w naturalnych kolorach",
    imageBg: "light",
    color: "heather-400",
    intro:
      "Masz ochotę stworzyć coś miękkiego, kolorowego i w 100% własnego? Na warsztatach filcowania pokażemy Ci, jak z wełny i odrobiny cierpliwości powstają naprawdę wyjątkowe rzeczy.",
    sections: [
      {
        body: "Podczas zajęć poznasz podstawy filcowania i przekonasz się, jak z luźnej wełny można stworzyć ozdoby, breloki, kwiaty, biżuterię, dekoracje, a nawet torebki czy czapki. Wszystko krok po kroku, więc nie musisz mieć żadnego doświadczenia.",
      },
      {
        body: "To warsztaty, na których można eksperymentować z kolorami, fakturami i kształtami. Każdy projekt jest inny, a efekt końcowy zależy tylko od Twojej wyobraźni. Jeśli zabraknie Ci pomysłów, chętnie podpowiemy i pomożemy na każdym etapie pracy.",
      },
    ],
    closing:
      "Filcowanie to świetny sposób na kreatywny relaks i oderwanie się od codzienności. Na koniec zabierzesz do domu własnoręcznie wykonane prace wyjątkowe, niepowtarzalne i stworzone dokładnie tak, jak sobie wymarzyłeś.",
    highlights: ["Wełna i igły do filcowania", "Ozdoby i breloki", "Eksperymentowanie z kolorem", "Gotowe prace do zabrania"],
  },
];

export function getWorkshop(slug: string): Workshop | undefined {
  return workshops.find((w) => w.slug === slug);
}

export function getAllSlugs(): string[] {
  return workshops.map((w) => w.slug);
}
