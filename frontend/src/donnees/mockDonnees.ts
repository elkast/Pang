// =============================================================================
// Données Mock — Fallback quand l'API n'est pas disponible
// =============================================================================

// ─── INTERFACES ──────────────────────────────────────────────────────────────

export interface ContenuMock {
    id: number;
    titre: string;
    description: string;
    nb_signalements?: number;
    is_verrouille?: boolean;
    texte_complet?: string;
    type_contenu: string;
    region_id: number;
    image_url: string;
    vues: number;
    likes: number;
    is_published: boolean;
    is_featured: boolean;
    is_premium: boolean;
    created_at: string;
    auteur?: {
        id: number;
        username: string;
        nom_complet?: string;
    };
}

export interface RegionMock {
    id: number;
    nom: string;
    slug: string;
    description: string;
    couleur: string;
    image_url?: string;
    icone?: string;
}

export interface PromotionMock {
    id: number;
    titre: string;
    type_promotion: 'site' | 'mosquee' | 'musique' | 'legende' | 'touriste' | 'talent';
    description: string;
    texte_complet?: string;
    numero_contact?: string;
    image_url: string;
    adresse?: string;
    note_popularite: number; // 0-100
    vues: number;
    is_featured: boolean;
    is_active: boolean;
    created_at: string;
}

// ─── RÉGIONS MOCK ────────────────────────────────────────────────────────────

export const REGIONS_MOCK: RegionMock[] = [
    { id: 1, nom: 'Abidjan', slug: 'abidjan', description: 'Capitale économique', couleur: '#E67E22', image_url: 'https://images.unsplash.com/photo-1620216443425-6cb3145452db?w=600' }, // Abidjan Plateau
    { id: 2, nom: 'Yamoussoukro', slug: 'yamoussoukro', description: 'Capitale politique', couleur: '#C4A02A', image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/Basilique_Notre_Dame_de_la_Paix_Yamoussoukro.jpg/800px-Basilique_Notre_Dame_de_la_Paix_Yamoussoukro.jpg' }, // Basilique
    { id: 3, nom: 'Bouaké', slug: 'bouake', description: 'Deuxième ville', couleur: '#1E6B45', image_url: 'https://images.unsplash.com/photo-1629813295874-5fe5cabc9db7?w=600' }, // Marché/ville d'intérieur
    { id: 4, nom: 'Korhogo', slug: 'korhogo', description: 'Nord - Pays Sénoufo', couleur: '#8B5C34', image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Danse_panth%C3%A8re_de_la_Cote_d%27Ivoire.jpg/800px-Danse_panth%C3%A8re_de_la_Cote_d%27Ivoire.jpg' }, // Culture Nord
    { id: 5, nom: 'Man', slug: 'man', description: 'Ouest - Pays Dan', couleur: '#9D2235', image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/db/Cascade_de_Man_01.jpg/800px-Cascade_de_Man_01.jpg' }, // Cascades de Man
    { id: 6, nom: 'Grand-Bassam', slug: 'grand-bassam', description: 'Site UNESCO', couleur: '#00A884', image_url: 'https://images.unsplash.com/photo-1629813359654-e818cebd1899?w=600' }, // Plage / palmiers
    { id: 7, nom: 'Daloa', slug: 'daloa', description: 'Centre-Ouest', couleur: '#6B8E23', image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Cacaoyer_avec_cabosses.jpg/800px-Cacaoyer_avec_cabosses.jpg' }, // Cacao
    { id: 8, nom: 'San-Pédro', slug: 'san-pedro', description: 'Sud-Ouest', couleur: '#4682B4', image_url: 'https://images.unsplash.com/photo-1598282367503-4f9e31d4b68e?w=600' }, // Port / Plage Sassandra
];

// ─── CONTENUS CULTURELS MOCK ─────────────────────────────────────────────────

export const CONTENUS_MOCK: ContenuMock[] = [
    {
        id: 1,
        titre: 'Le Masque Gouro',
        description: 'Masque traditionnel utilisé dans les cérémonies funéraires et les rituels de passage.',
        texte_complet: "Les masques Gouro sont parmi les plus emblématiques d'Afrique de l'Ouest. Créés par les artistes Gouro, ces masques représentent les esprits de la forêt et sont utilisés lors des cérémonies traditionnelles. Chaque masque est une œuvre d'art unique, sculptée dans du bois précieux et ornée de pigments naturels.",
        type_contenu: 'masque',
        region_id: 5,
        image_url: 'https://www.art-masque-africain.com/images/2022/07/81868_orig.jpg',
        vues: 1250,
        likes: 89,
        is_published: true,
        is_featured: true,
        is_premium: false,
        created_at: '2024-01-15T10:00:00Z',
        auteur: { id: 1, username: 'gardien', nom_complet: 'Konan Bertille' },
    },
    {
        id: 2,
        titre: 'Sauce Graine',
        description: 'La sauce palme, plat emblématique de la cuisine ivoirienne.',
        texte_complet: "La sauce graine ou sauce palme est un mets traditionnel préparé à base de pulpe de palmier à huile. C'est un plat de fête servi lors des grandes occasions familiales. Sa préparation demande plusieurs heures et un savoir-faire transmis de génération en génération.",
        type_contenu: 'gastronomie',
        region_id: 1,
        image_url: 'https://africa-cuisine.com/wp-content/uploads/2023/06/sauce-graine-recette-ivoirenne.jpg',
        vues: 2100,
        likes: 156,
        is_published: true,
        is_featured: true,
        is_premium: false,
        created_at: '2024-01-20T14:30:00Z',
        auteur: { id: 2, username: 'maman', nom_complet: 'Aya Sophie' },
    },
    {
        id: 3,
        titre: 'Le Mystère du Lac de Yamoussoukro',
        description: 'Légende du lac de Yamoussoukro et ses origines mystiques.',
        texte_complet: "On dit que le lac de Yamoussoukro cache un secret ancestral. Les anciens racontent que les eaux du lac sont reliées aux esprits des ancêtres Baoulé. Les crocodiles sacrés qui peuplent ses rives sont les gardiens de ce mystère millénaire.",
        type_contenu: 'legende',
        region_id: 2,
        image_url: 'https://media-cdn.tripadvisor.com/media/photo-s/01/64/67/12/yamoussoukro.jpg',
        vues: 890,
        likes: 67,
        is_published: true,
        is_featured: false,
        is_premium: true,
        created_at: '2024-02-01T09:15:00Z',
        auteur: { id: 1, username: 'gardien', nom_complet: 'Konan Bertille' },
    },
    {
        id: 4,
        titre: 'Les Ruines de Grand-Bassam',
        description: 'Ancienne capitale coloniale et patrimoine mondial UNESCO.',
        texte_complet: "Grand-Bassam fut la première capitale de la Côte d'Ivoire coloniale. Ses ruines témoignent d'une histoire riche entre traditions africaines et influences coloniales. Classée au patrimoine mondial de l'UNESCO en 2012.",
        type_contenu: 'site',
        region_id: 6,
        image_url: 'https://cdn.tripinafrica.com/places/la-maison-ganamet-de-grand-bassam-657a3dd64de1c.jpg',
        vues: 1560,
        likes: 112,
        is_published: true,
        is_featured: true,
        is_premium: false,
        created_at: '2024-02-10T11:00:00Z',
        auteur: { id: 3, username: 'voyageur', nom_complet: 'Koffi Jean' },
    },
    {
        id: 5,
        titre: 'Le Tam-tam Sénoufo',
        description: 'Instrument à percussion traditionnel du Nord de la Côte d\'Ivoire.',
        texte_complet: "Le tam-tam Sénoufo est un instrument symbolique utilisé lors des cérémonies du Poro, société initiatique secrète. Chaque rythme porte un message précis compris uniquement des initiés.",
        type_contenu: 'musique',
        region_id: 4,
        image_url: 'https://www.photo-alsace.com/2_photo/afrique/img_1/n41980.jpg',
        vues: 780,
        likes: 54,
        is_published: true,
        is_featured: false,
        is_premium: false,
        created_at: '2024-02-15T16:45:00Z',
        auteur: { id: 1, username: 'gardien', nom_complet: 'Konan Bertille' },
    },
    {
        id: 6,
        titre: 'Fête des Masques de Man',
        description: 'Cérémonie annuelle dédiée aux masques Guéré et Dan.',
        texte_complet: "La fête des masques de Man est un événement culturel exceptionnel qui réunit les communautés Dan et Guéré. Les masques Zakpei dansent pour honorer les ancêtres et assurer la prospérité du village.",
        type_contenu: 'rituel',
        region_id: 5,
        image_url: 'https://man-info.net/2017/11/10/ouverture-de-7eme-edition-festival-gueheva-a-man/',
        vues: 2340,
        likes: 198,
        is_published: true,
        is_featured: true,
        is_premium: false,
        created_at: '2024-02-20T08:00:00Z',
        auteur: { id: 1, username: 'gardien', nom_complet: 'Konan Bertille' },
    },
    {
        id: 7,
        titre: "L'Attiéké d'Abidjan",
        description: 'Semoule de manioc fermenté, accompagnement ivoirien par excellence.',
        texte_complet: "L'attiéké est préparé à partir de manioc fermenté et râpé. Cette spécialité est vendue dans toutes les rues d'Abidjan et représente la cuisine populaire ivoirienne. On le déguste avec du poisson braisé et de la sauce tomate épicée.",
        type_contenu: 'gastronomie',
        region_id: 1,
        image_url: 'https://assets.afcdn.com/recipe/20150224/36284_w1024h1024c1cx262cy175.jpg',
        vues: 1890,
        likes: 145,
        is_published: true,
        is_featured: true,
        is_premium: false,
        created_at: '2024-03-01T12:30:00Z',
        auteur: { id: 2, username: 'maman', nom_complet: 'Aya Sophie' },
    },
    {
        id: 8,
        titre: 'Les Montagnes de Man',
        description: 'Paysage spectaculaire des collines de l\'Ouest ivoirien.',
        texte_complet: "Les montagnes de Man s'élèvent à plus de 1000 mètres d'altitude et offrent des panoramas à couper le souffle sur la forêt tropicale dense. Le mont Tonkoui est le point culminant avec ses 1189 mètres.",
        type_contenu: 'site',
        region_id: 5,
        image_url: 'https://www.facebook.com/leguide225/posts/les-dents-de-man-cest-lun-des-sites-les-plus-marquants-de-la-ville-aux-18-montag/3557130030972217/',
        vues: 1100,
        likes: 87,
        is_published: true,
        is_featured: false,
        is_premium: false,
        created_at: '2024-03-05T10:20:00Z',
        auteur: { id: 3, username: 'voyageur', nom_complet: 'Koffi Jean' },
    },
    // Fausse information (exemple pour démo signalement)
    {
        id: 99,
        titre: '[FAUX] Le roi du Kong a 500 ans',
        description: 'Information non vérifiée - signaler si erronée.',
        texte_complet: 'Cette affirmation n\'a jamais été confirmée par les historiens.',
        type_contenu: 'legende',
        region_id: 4,
        image_url: 'https://placehold.co/400x300?text=FAUX',
        vues: 50,
        likes: 2,
        is_published: true,
        is_featured: false,
        is_premium: false,
        created_at: '2024-03-10T12:00:00Z',
        auteur: { id: 99, username: 'auteur_fictif', nom_complet: 'Auteur Signalé' },
        nb_signalements: 3,
        is_verrouille: false,
    },
];

// ─── PROMOTIONS MOCK ─────────────────────────────────────────────────────────

export const PROMOTIONS_MOCK: PromotionMock[] = [
    {
        id: 1,
        titre: "Grande Mosquée d'Abidjan",
        type_promotion: 'mosquee',
        description: "La plus grande et plus belle mosquée de Côte d'Ivoire, chef-d'œuvre d'architecture islamique.",
        texte_complet: "Inaugurée en 1974, la Grande Mosquée du Plateau est un joyau architectural au cœur d'Abidjan. Elle peut accueillir plus de 3000 fidèles et son minaret de 40 mètres est visible depuis toute la ville. La mosquée est ouverte aux visiteurs en dehors des heures de prière.",
        numero_contact: '+225 27 20 32 00 00',
        image_url: 'https://afrique.le360.ma/resizer/v2/MBPDDZBTBBB4TGYEUB4RF6RE7M.JPG?auth=21b074b7872213d2eef6197f2ea0e2934bb0d6c7903b94893610ceb589d4e4ab&smart=true&width=1216&height=684',
        adresse: 'Boulevard de la République, Plateau, Abidjan',
        note_popularite: 92,
        vues: 4500,
        is_featured: true,
        is_active: true,
        created_at: '2024-01-01T00:00:00Z',
    },
    {
        id: 2,
        titre: 'Parc National de Taï',
        type_promotion: 'site',
        description: "Forêt tropicale primaire, patrimoine mondial UNESCO, refuge des chimpanzés.",
        texte_complet: "Le Parc National de Taï est l'une des dernières grandes forêts tropicales primaires d'Afrique de l'Ouest. Classé au patrimoine de l'UNESCO, il abrite de nombreuses espèces endémiques dont les chimpanzés célèbres pour leur utilisation d'outils.",
        numero_contact: '+225 27 34 70 00 00',
        image_url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS5E3J1bIysNVfZ9NVuqGS9dy0bKS3Ae40vKQ&s',
        adresse: 'Région du Cavally, Côte d\'Ivoire',
        note_popularite: 88,
        vues: 3200,
        is_featured: true,
        is_active: true,
        created_at: '2024-01-05T00:00:00Z',
    },
    {
        id: 3,
        titre: 'Mosquée de Korhogo',
        type_promotion: 'mosquee',
        description: "Mosquée traditionnelle du Nord, architecture soudanaise authentique.",
        texte_complet: "La mosquée de Korhogo est un exemple remarquable de l'architecture soudanaise, construite en banco (terre crue). Ses minarets coniques et ses toits en terrasse sont typiques de l'architecture islamique d'Afrique de l'Ouest.",
        numero_contact: '+225 27 36 86 00 00',
        image_url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSIC2CeF7gzu6s4OEEWAa_plqTCiLu0eQQhpA&s',
        adresse: 'Centre-ville, Korhogo',
        note_popularite: 78,
        vues: 1800,
        is_featured: false,
        is_active: true,
        created_at: '2024-01-10T00:00:00Z',
    },
    {
        id: 4,
        titre: 'Tam-tam de Kpélié',
        type_promotion: 'musique',
        description: "Musique rituelle Sénoufo du Poro, patrimoine immatériel unique.",
        texte_complet: "Le Kpélié est une forme musicale sacrée des Sénoufo, intimement liée aux cérémonies du Poro. Les rythmes frappés sur les tambours sont porteurs de messages destinés aux ancêtres et aux esprits protecteurs.",
        numero_contact: '+225 07 00 11 22 33',
        image_url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTb2Gs8Qivri4khkxd4fbXj9TQDDT4SAlRiTA&s',
        adresse: 'Village de Kpélié, région de Korhogo',
        note_popularite: 75,
        vues: 1200,
        is_featured: false,
        is_active: true,
        created_at: '2024-01-15T00:00:00Z',
    },
    {
        id: 5,
        titre: 'Légende du Lac Sacré de Yamoussoukro',
        type_promotion: 'legende',
        description: "Mystère de crocodiles sacrés gardiens du lac présidentiel.",
        texte_complet: "Selon la tradition Baoulé, les crocodiles du lac de Yamoussoukro sont les réincarnations des ancêtres fondateurs du village. Ils ne s'attaquent jamais aux habitants et se nourrissent de poulets sacrificiels offerts lors des cérémonies.",
        numero_contact: '+225 27 30 64 00 00',
        image_url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ9e7Eyl4u9PK3dhV2JJnx89miRqieDLJqYYQ&s',
        adresse: 'Lac présidentiel, Yamoussoukro',
        note_popularite: 70,
        vues: 980,
        is_featured: false,
        is_active: true,
        created_at: '2024-01-20T00:00:00Z',
    },
    {
        id: 6,
        titre: 'Circuit Culturel Abidjan',
        type_promotion: 'touriste',
        description: "Découverte guidée des meilleurs sites culturels d'Abidjan en une journée.",
        texte_complet: "Notre circuit culturel premium vous emmène à la découverte du musée des Civilisations de Côte d'Ivoire, du quartier historique du Plateau, du marché de Treichville et du village d'Adjamé. Guide francophone inclus.",
        numero_contact: '+225 07 55 66 77 88',
        image_url: 'https://cdn.tourradar.com/s3/tour/750x400/147975_16965ed8.jpg',
        adresse: 'Départ : Hôtel Ivoire, Cocody, Abidjan',
        note_popularite: 85,
        vues: 2100,
        is_featured: true,
        is_active: true,
        created_at: '2024-01-25T00:00:00Z',
    },
    {
        id: 7,
        titre: "Grotte de l'An 2000 - Man",
        type_promotion: 'site',
        description: "Site naturel mystérieux et spirituel dans les montagnes de Man.",
        texte_complet: "La grotte de l'An 2000 est un site naturel et spirituel dans les montagnes de Man, utilisée lors des cérémonies initiatiques Dan. Un guide local vous accompagne pour expliquer la signification culturelle de ce lieu sacré.",
        numero_contact: '+225 07 18 29 30 41',
        image_url: 'https://www.instagram.com/p/Cylajc0rN5b/',
        adresse: 'Env. 5 km de Man, route de Danané',
        note_popularite: 72,
        vues: 890,
        is_featured: false,
        is_active: true,
        created_at: '2024-02-01T00:00:00Z',
    },
    {
        id: 8,
        titre: 'Djembé Mandingue',
        type_promotion: 'musique',
        description: "Cours et spectacles de djembé authentique à Kong.",
        texte_complet: "L'association Djembé Kong organise des initiations au djembé mandingue dans la cité historique de Kong. Les maîtres djembéfola transmettent leur art ancestral lors de séances d'une heure ouvertes aux touristes.",
        numero_contact: '+225 07 99 00 11 22',
        image_url: 'https://soundiata.org/wp-content/uploads/2023/12/culture-mandingue-percussions-enfants-soundiata.jpg',
        adresse: 'Quartier des artisans, Kong',
        note_popularite: 68,
        vues: 750,
        is_featured: false,
        is_active: true,
        created_at: '2024-02-10T00:00:00Z',
    },
    {
        id: 9,
        titre: 'Aya Cissoko — Artiste pluridisciplinaire',
        type_promotion: 'talent',
        description: "Talent validé par l'administrateur. A prouvé ses valeurs et compétences en Afrique.",
        texte_complet: "Aya Cissoko, artiste ivoirienne reconnue. L'administrateur a validé ce profil. La communauté peut commenter et liker.",
        numero_contact: '+225 07 12 34 56 78',
        image_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400',
        adresse: 'Abidjan, Côte d\'Ivoire',
        note_popularite: 88,
        vues: 1200,
        is_featured: true,
        is_active: true,
        created_at: '2024-02-15T00:00:00Z',
    },
];

// ─── FONCTIONS UTILITAIRES ────────────────────────────────────────────────────

export function getContenusParType(type: string): ContenuMock[] {
    return CONTENUS_MOCK.filter(c => c.type_contenu === type);
}

export function getRegionParId(id: number): RegionMock | undefined {
    return REGIONS_MOCK.find(r => r.id === id);
}

export function getContenuParId(id: number): ContenuMock | undefined {
    return CONTENUS_MOCK.find(c => c.id === id);
}

export function getContenusEnVedette(): ContenuMock[] {
    return CONTENUS_MOCK.filter(c => c.is_featured);
}

export function rechercherContenus(requete: string): ContenuMock[] {
    const lowerQuery = requete.toLowerCase();
    return CONTENUS_MOCK.filter(c =>
        c.titre.toLowerCase().includes(lowerQuery) ||
        c.description.toLowerCase().includes(lowerQuery)
    );
}

export function getPromotionsParType(type: string): PromotionMock[] {
    return PROMOTIONS_MOCK.filter(p => p.type_promotion === type && p.is_active);
}

export function getPromotionParId(id: number): PromotionMock | undefined {
    return PROMOTIONS_MOCK.find(p => p.id === id);
}

export function getPromotionsFeatured(): PromotionMock[] {
    return PROMOTIONS_MOCK.filter(p => p.is_featured && p.is_active);
}
