import { PrismaClient } from '@prisma/client';
import { DateTime } from 'luxon';

const prisma = new PrismaClient();

const articles = [
  {
    title: 'Chaussures de course Nike Air Zoom',
    description:
      'Chaussures de course légères et confortables avec une semelle en mousse réactive. Idéales pour les longues distances.',
    image: 'https://images.nike.com/is/image/DotCom/NIKE_AIR_ZOOM_RUNNING',
    price: 120,
    quantity: 50,
    brand: 'Nike',
    rating: 4.7,
    createdAt: DateTime.now().toMillis(),
  },
  {
    title: 'Ballon de football Adidas',
    description:
      'Ballon de football en cuir synthétique de haute qualité, conçu pour une utilisation en match et en entraînement.',
    image: 'https://www.casalsport.com/img/S/GRP/ST/AIG42564423.jpg',
    price: 30,
    quantity: 200,
    brand: 'Adidas',
    rating: 4.5,
    createdAt: DateTime.now().toMillis(),
  },
  {
    title: 'Tapis de yoga écologique',
    description:
      'Tapis de yoga épais, fabriqué en matériaux recyclables. Confortable pour toutes les pratiques de yoga et de méditation.',
    image:
      'https://www.bio-naturel.de/media/image/14/32/87/Berk_Yogamatte_Kork_600x600.jpg',
    price: 25,
    quantity: 100,
    brand: 'EcoYoga',
    rating: 4.2,
    createdAt: DateTime.now().toMillis(),
  },
  {
    title: 'Gants de boxe Everlast',
    description:
      'Gants de boxe rembourrés, parfaits pour les entraînements intensifs et les combats.',
    image:
      'https://www.tradeinn.com/f/14140/141406366/everlast-gants-de-boxe-en-cuir-synthetique-elite-2.webp',
    price: 45,
    quantity: 75,
    brand: 'Everlast',
    rating: 4.6,
    createdAt: DateTime.now().toMillis(),
  },
  {
    title: 'Haltères réglables',
    description:
      "Haltères réglables de 2 kg à 10 kg, idéales pour l'entraînement de force à domicile.",
    image:
      'https://contents.mediadecathlon.com/m17775489/k$3bcd67f440ad814157818e95a4de5769/sq/trexo-txo-b4w002-haltere-reglable.jpg?format=auto&f=969x969',
    price: 60,
    quantity: 30,
    brand: 'PowerFit',
    rating: 4.4,
    createdAt: DateTime.now().toMillis(),
  },
  {
    title: 'Bande de résistance 5 niveaux',
    description:
      'Ensemble de bandes de résistance de différentes intensités, parfait pour les exercices de musculation et de rééducation.',
    image:
      'https://www.powergym.fr/19732-large_default/bande-force-resistance-atx-fitness-musculation-5niveaux-loop-band.jpg',
    price: 20,
    quantity: 150,
    brand: 'FlexBands',
    rating: 4.3,
    createdAt: DateTime.now().toMillis(),
  },
  {
    title: 'Sac de sport imperméable',
    description:
      'Sac de sport spacieux et imperméable, avec compartiments séparés pour chaussures et affaires mouillées.',
    image:
      'https://contents.mediadecathlon.com/m8493255/k$6e57d20407bb25b9d0784edb48418815/sq/sac-de-sport-etanche-kaba-ultra-20l.jpg?format=auto&f=969x969',
    price: 35,
    quantity: 60,
    brand: 'Sporty',
    rating: 4.5,
    createdAt: DateTime.now().toMillis(),
  },
  {
    title: "Vélo d'appartement pliable",
    description:
      "Vélo d'appartement pliable avec résistance réglable. Idéal pour l'entraînement cardio à domicile.",
    image:
      'https://www.cdiscount.com/pdt2/7/1/8/1/700x700/big1694761489718/rw/velo-d-appartement-pliable-x-bike-bandes-resis.jpg',
    price: 150,
    quantity: 20,
    brand: 'HomeFit',
    rating: 4.8,
    createdAt: DateTime.now().toMillis(),
  },
  {
    title: 'Raquette de tennis Wilson',
    description:
      'Raquette de tennis légère et durable, offrant un bon équilibre entre puissance et contrôle.',
    image:
      'https://www.tennis-point.fr/dw/image/v2/BBDP_PRD/on/demandware.static/-/Sites-master-catalog/default/dw74c7d0be/images/007/062/03902000_000.jpg?q=80&sw=2000',
    price: 80,
    quantity: 40,
    brand: 'Wilson',
    rating: 4.6,
    createdAt: DateTime.now().toMillis(),
  },
  {
    title: 'Montre de sport GPS',
    description:
      'Montre de sport avec GPS intégré, pour suivre la distance, le rythme et les calories brûlées lors de vos entraînements.',
    image:
      'https://contents.mediadecathlon.com/p2148212/k$0e2ad14c7bfe7bfc77218db475069d6e/sq/montre-connectee-gps-500-by-coros-noire.jpg?format=auto&f=969x969',
    price: 110,
    quantity: 25,
    brand: 'FitTrack',
    rating: 4.7,
    createdAt: DateTime.now().toMillis(),
  },
];

async function main() {
  try {
    const articleCount = await prisma.article.count();
    if (articleCount !== 0) {
      console.log('Database contains data. No fake data are inserted');
      return;
    }
    // Insère les articles dans la base de données
    const insertedArticles = await prisma.article.createMany({
      data: articles,
    });
    console.log(`Inserted ${insertedArticles.count} articles.`);
  } catch (error) {
    console.error("Erreur lors de l'insertion des articles:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
