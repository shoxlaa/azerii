/**
 * Azerbaijani translation dictionary.
 *
 * DRAFT — machine-assisted, not yet reviewed by a native speaker. Azerbaijani
 * is AZERII's home market, so this text carries the brand where it is judged
 * most harshly; treat every string here as provisional until a person has read
 * it end to end. Terms most likely to need a modeller's ear rather than a
 * translator's: `tech.litnik`, `category.tracks`, `gallery.counter`.
 */
const az = {
  nav: {
    home: 'Ana səhifə',
    catalog: 'Kataloq',
    history: 'Tarix',
    museum: 'Muzey',
    gallery: 'Qalereya',
    about: 'Haqqımızda',
    contact: 'Əlaqə',
  },
  common: {
    brand: 'AZERII',
    tagline: 'Zirehli texnikanın miqyaslı modelləri',
    addToCart: 'Səbətə at',
    price: 'Qiymət',
    loading: 'Yüklənir…',
  },
  status: {
    in_stock: 'Mövcuddur',
    out_of_stock: 'Mövcud deyil',
    coming_soon: 'Tezliklə satışda',
    planned: 'Planlaşdırılıb',
    discontinued: 'İstehsaldan çıxarılıb',
    limited: 'Məhdud seriya',
    in_development: 'Hazırlanır',
  },
  tech: {
    lazer: 'Lazerlə kəsmə',
    '3d': '3D çap',
    rezin: 'Qatran',
    litnik: 'Litnik',
  },
  category: {
    tank: 'Tanklar',
    chassis: 'Şassi',
    tracks: 'Tırtıllar',
    armored_car: 'Zirehli avtomobillər',
  },
  contact: {
    title: 'Bizimlə əlaqə',
    name: 'Adınız',
    email: 'E-poçt',
    message: 'Mesaj',
    send: 'Göndər',
  },
  hero: {
    scale: 'Miqyas 1:16',
    madeIn: 'Azərbaycanda istehsal olunub',
    cta: 'Kataloqa baxın',
    slides: {
      somua: { title: 'SOMUA S-35', subtitle: 'Fransız yüngül tankı' },
      b1: { title: 'B1 early', subtitle: 'Fransız ağır tankı' },
      t28: { title: 'T-29-5', subtitle: 'Sovet orta tankı' },
      german: { title: 'Nb.Fz.', subtitle: 'Alman tankı' },
    },
  },
  catalogSection: {
    title: 'Model kataloqu',
    viewAll: 'Bütün modellərə baxın',
    scaleWord: 'miqyas',
    empty: 'Tezliklə burada modellər görünəcək.',
  },
  advantages: {
    historical: {
      title: 'Tarixi dəqiqlik',
      text: 'Tarixi zirehli texnikanın 1:16 miqyasında dəqiq surətləri.',
    },
    quality: {
      title: 'Yüksək keyfiyyət',
      text: 'Premium materiallar və hər detala diqqət.',
    },
    modelers: {
      title: 'Modelçilər üçün',
      text: 'Kolleksiyaçılar və modelçilik həvəskarları üçün.',
    },
    madeIn: {
      title: 'Azərbaycanda istehsal olunub',
      text: 'AZERII Scale Model tərəfindən hazırlanıb və istehsal olunub.',
    },
  },
  workshop: {
    // Kept in English: the workshop is a brand name, not a description.
    title: 'AZERII Workshop',
    viewAll: 'Bütün videolara baxın',
  },
  promo: {
    title: 'AZERII SCALE MODEL',
    text: 'Biz tarixi qorumaq və modelçilərin növbəti nəslini ilhamlandırmaq üçün zirehli texnikanın miqyaslı modellərini yaradırıq. Hər model tarixi dəqiqliyin, yüksək keyfiyyətin və detallara sevginin birləşməsidir.',
  },
  history: {
    eyebrow: 'Tarix',
    title: 'Hər modelin arxasında bir tarix dayanır',
    text: 'Biz sadəcə model yığmırıq. Mühəndisliyin, döyüşlərin və tarix yazan insanların irsini qoruyuruq.',
    cta: 'Tarixi aç',
  },
  productPage: {
    buy: 'Al',
    unavailable: 'Hazırda mövcud deyil',
    tabs: {
      description: 'Təsvir',
      history: 'Modelin tarixi',
      specs: 'Xüsusiyyətlər',
    },
    features: ['Əl ilə yığma', 'Dəqiq həndəsə', 'Tarixi doğruluq'],
    descriptionFallback:
      '1:16 miqyasında detallı model. Hər pərçim, panel və nişana diqqətlə əl ilə yığılıb — kolleksiyaçılar və həvəskarlar üçün.',
    historyText:
      'Tarixi zirehli texnikanın dəqiq təkrarı. Hər model arxiv mənbələri əsasında işlənir ki, nisbətlər və nişanlar orijinala uyğun olsun.',
    specs: {
      param: 'Parametr',
      value: 'Dəyər',
      type: 'Növ',
      technology: 'Texnologiya',
      scale: 'Miqyas',
      status: 'Mövcudluq',
    },
    extra: {
      title: 'Ruhla yaradılıb',
      text: 'Hər AZERII modeli Azərbaycanda hazırlanıb və istehsal olunub — tarixi dəqiqliyin, premium materialların və detallara sevginin birləşməsi. Detalların lazerlə kəsilməsindən əl ilə rənglənməsinə qədər.',
    },
  },
  catalogPage: {
    title: 'Kataloq',
    found: 'model tapıldı',
    filters: 'Filtrlər',
    reset: 'Sıfırla',
    empty: 'Heç nə tapılmadı',
    emptyHint: 'Filtrləri dəyişməyə cəhd edin.',
    groups: {
      type: 'Növ',
      technology: 'Texnologiya',
      availability: 'Mövcudluq',
    },
    sort: {
      label: 'Çeşidləmə',
      newest: 'Əvvəlcə yenilər',
      priceAsc: 'Qiymət: artan',
      priceDesc: 'Qiymət: azalan',
      availability: 'Mövcudluğa görə',
    },
  },
  searchBox: {
    open: 'Axtarış',
    close: 'Bağla',
    placeholder: 'Model axtarın…',
    loading: 'Axtarılır…',
    noResults: 'Heç nə tapılmadı',
    viewAll: 'Bütün nəticələri göstər',
  },
  searchPage: {
    title: 'Axtarış',
    found: 'sorğu üzrə nəticə',
    prompt: 'Kataloqda axtarmaq üçün sorğu daxil edin.',
    startTyping: 'Modelləri ad və ya növ üzrə axtarın.',
    empty: 'Heç nə tapılmadı',
    emptyHint: 'Başqa ad və ya növ yoxlayın.',
    browseCatalog: 'Kataloqa keç',
  },
  cart: {
    title: 'Səbət',
    itemsCount: 'məhsul səbətdə',
    empty: 'Səbət boşdur',
    emptyHint: 'Başlamaq üçün kataloqdan model seçin.',
    browseCatalog: 'Kataloqa keç',
    remove: 'Sil',
    increase: 'Sayı artır',
    decrease: 'Sayı azalt',
    quantity: 'Say',
    total: 'Cəmi',
    checkout: 'Sifarişi rəsmiləşdir',
    continueShopping: 'Alış-verişə davam et',
    unavailable: 'Mövcud deyil',
  },
  aboutPage: {
    title: 'Haqqımızda',
    lead: 'AZERII Azərbaycanda zirehli texnikanın 1:16 miqyaslı modellərini yaradır.',
    body: 'Hər model arxivlə işdən başlayır: fotolar, cizgilər və muzey nümunələri. Sonra detalları kəsir, çap edir və tökürük, ardınca hər dəsti əl ilə yığıb işləyirik. Nəticə — kolleksiyaçı üçün kifayət qədər dəqiq, tarixçi üçün inandırıcı model.',
    contactCta: 'Bizimlə əlaqə',
    catalogCta: 'Kataloqa baxın',
  },
  contactPage: {
    title: 'Əlaqə',
    lead: 'Model, sifariş və ya fərdi yığım barədə sualınız var? Bizə yazın.',
    followUs: 'Sosial şəbəkələrdə',
    sending: 'Göndərilir…',
    success: 'Təşəkkür edirik! Mesaj göndərildi — e-poçt vasitəsilə cavab verəcəyik.',
    error: 'Mesajı göndərmək alınmadı. Yenidən cəhd edin.',
    errors: {
      required: 'Mütləq doldurulmalıdır',
      email: 'Düzgün e-poçt ünvanı daxil edin',
    },
  },
  checkout: {
    title: 'Sifarişin rəsmiləşdirilməsi',
    summary: 'Sifarişiniz',
    contactSection: 'Əlaqə məlumatları',
    deliverySection: 'Çatdırılma',
    name: 'Ad və soyad',
    email: 'E-poçt',
    phone: 'Telefon',
    country: 'Ölkə',
    city: 'Şəhər',
    address: 'Ünvan',
    postalCode: 'Poçt indeksi',
    shipping: 'Çatdırılma üsulu',
    shippingStandard: 'Standart çatdırılma (10–20 gün)',
    shippingExpress: 'Ekspres çatdırılma (3–7 gün)',
    shippingPickup: 'Bakıda özün götür',
    comment: 'Şərh',
    commentPlaceholder: 'Sifarişiniz barədə nə bilməyimiz vacibdir?',
    submit: 'Sifarişi rəsmiləşdir',
    submitting: 'Göndərilir…',
    total: 'Cəmi',
    paymentNote:
      'Onlayn ödəniş hələ mövcud deyil. Sifariş müraciət kimi qeydə alınır — təsdiqləmək və ödəniş barədə razılaşmaq üçün sizinlə əlaqə saxlayacağıq.',
    emptyTitle: 'Səbət boşdur',
    emptyHint: 'Sifariş verməzdən əvvəl səbətə model əlavə edin.',
    errors: {
      required: 'Mütləq doldurulmalıdır',
      email: 'Düzgün e-poçt ünvanı daxil edin',
      phone: 'Düzgün telefon nömrəsi daxil edin',
      cart: 'Səbətiniz boşdur.',
      generic: 'Sifarişi göndərmək alınmadı. Yenidən cəhd edin.',
    },
  },
  /** /history — təkrar yaratdığımız maşınların lenti. */
  historyPage: {
    kicker: 'AZERII MUSEUM',
    title: 'Zirehin tarixi',
    lead: '1:16 miqyasında təkrar yaratdığımız maşınlar, orduya daxil olma sırası ilə.',
    /** Tarix blokunun imzaları. Dəyərlər məlumatlardan gəlir. */
    block: {
      kicker: 'Tarix',
      crew: 'Ekipaj',
      armor: 'Zireh',
      engine: 'Mühərrik',
      weight: 'Kütlə',
      readHistory: 'Tarixi oxu',
    },
  },
  workType: {
    oil: 'Yağlı boya',
    acrylic: 'Akril',
    watercolor: 'Akvarel',
    graphics: 'Qrafika',
    mixed: 'Qarışıq texnika',
    print: 'Çap',
  },
  paintingMaterial: {
    canvas: 'Kətan',
    canvas_on_board: 'Karton üzərində kətan',
    paper: 'Kağız',
    wood: 'Ağac',
  },
  // Note: `gallery` below is the image-lightbox namespace — unrelated.
  paintings: {
    title: 'Qalereya',
    lead: 'Kətan üzərində rəsmlər. Hər iş yeganə nüsxədə mövcuddur.',
    empty: 'Qalereya dolur',
    emptyHint: 'İlk işlər tezliklə burada görünəcək.',
    noImage: 'Foto tezliklə əlavə olunacaq',
    enquire: 'Alış barədə soruş',
    fields: {
      size: 'Ölçü',
      workType: 'İş növü',
      material: 'Material',
    },
  },
  museum: {
    title: 'Muzey',
    lead: 'Modelçilərimizin yığdığı hazır modellər.',
    all: 'Hamısı',
    empty: 'Bu kateqoriyada hələ iş yoxdur',
    emptyHint: 'Başqa kateqoriyaya baxın — yeni işlər müntəzəm əlavə olunur.',
    emptyAll: 'Muzey dolur',
    emptyAllHint: 'İlk işlər tezliklə burada görünəcək.',
    scale: 'Miqyas',
    inCatalog: 'Bu dəst satışdadır',
    close: 'Bağla',
    categories: {
      cars: 'Avtomobillər',
      armor: 'Zirehli texnika',
      aviation: 'Aviasiya',
      miniatures: 'Miniatürlər',
      railway: 'Dəmiryol modelləri',
      ships: 'Gəmi modelləri',
    },
  },
  gallery: {
    zoomHint: 'Böyütmək üçün üzərinə gətirin · tam ekran üçün klikləyin',
    openFullscreen: 'Şəkli tam ekranda aç',
    close: 'Bağla',
    prev: 'Əvvəlki şəkil',
    next: 'Növbəti şəkil',
    thumb: 'Şəkil',
    // Rendered as "{n} {counter} {total}". Azerbaijani has no short word that
    // fits that slot the way "из"/"of" do, so a slash reads best: "1 / 7".
    counter: '/',
  },
  visitCounter: {
    label: 'Bu günün giriş sayı',
  },
  errorPage: {
    title: 'Nəsə səhv getdi',
    text: 'Səhifəni yükləmək alınmadı — bu adətən müvəqqətidir. Yenidən cəhd edin.',
    retry: 'Yenidən cəhd et',
    browseCatalog: 'Kataloqa keç',
  },
  notFound: {
    code: '404',
    title: 'Səhifə tapılmadı',
    text: 'Belə səhifə yoxdur və ya məhsul köçürülüb. Kataloqa baxın və ya axtarışdan istifadə edin.',
    backHome: 'Ana səhifəyə',
    browseCatalog: 'Kataloqa keç',
  },
  orderSuccess: {
    title: 'Sifarişiniz üçün təşəkkür!',
    text: 'Müraciətinizi aldıq və e-poçtunuza təsdiq göndərdik. Komandamız detalları dəqiqləşdirmək və ödəniş barədə razılaşmaq üçün tezliklə sizinlə əlaqə saxlayacaq.',
    orderNumber: 'Sifariş nömrəsi',
    backHome: 'Ana səhifəyə',
    browseCatalog: 'Kataloqa keç',
  },
  footer: {
    tagline:
      'Zirehli texnikanın 1:16 miqyaslı modelləri. Hər detalda dəqiqlik, keyfiyyət və tarix.',
    catalog: {
      title: 'Kataloq',
      tanks: 'Tanklar 1:16',
      armor: 'Zirehli texnika',
      dioramas: 'Dioramalar',
      accessories: 'Aksesuarlar',
      gallery: 'Qalereya',
      comingSoon: 'Tezliklə satışda',
    },
    info: {
      title: 'Məlumat',
      about: 'Haqqımızda',
      delivery: 'Çatdırılma və ödəniş',
      returns: 'Qaytarma şərtləri',
      news: 'Xəbərlər',
      contacts: 'Əlaqə',
    },
    support: {
      title: 'Dəstək',
      faq: 'FAQ',
      help: 'Kömək',
      feedback: 'Geri əlaqə',
    },
    subscribe: {
      title: 'Xəbərlərə abunəlik',
      description: 'Yeniliklər və xüsusi təkliflərdən xəbərdar olun.',
      placeholder: 'E-poçtunuz',
      button: 'Abunə ol',
    },
    copyright: '© 2024 AZERII Scale Model. Bütün hüquqlar qorunur.',
    madeWith: 'Tarixə və modelçiliyə sevgi ilə hazırlanıb.',
  },
};

export default az;
