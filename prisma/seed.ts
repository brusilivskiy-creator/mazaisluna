import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

interface CategoryData {
  id: number;
  name: string;
  type: string;
  order: number;
  description?: string | null;
}

interface NewsData {
  id: number;
  title: string;
  image: string | null;
  date: string;
  text: string;
  category?: string | null;
  navigationCategory?: string | null;
}

interface PoliticianData {
  id: number;
  name: string;
  image: string | null;
  party: string | null;
  partyLogo: string | null;
}

interface PartyData {
  id: number;
  name: string;
  logo: string;
  seats: number;
  note?: string | null;
  leaderId?: number | null;
  color?: string | null;
}

interface PositionData {
  id: number;
  name: string;
  category?: string | null;
  order: number;
}

interface LeadershipData {
  id: number;
  politicianId: number;
  position: string;
}

interface ParliamentData {
  parliament: {
    id: number;
    date: string;
    parties: Array<{
      partyId: number;
      partyName: string;
      percentage: number;
    }>;
    majoritarianDistricts: Array<{
      districtNumber: number;
      candidateId: number;
      candidateName: string;
      partyId: number;
      partyName: string;
    }>;
  };
  leader: {
    id: number;
    date: string;
    candidates: Array<{
      candidateId: number;
      candidateName: string;
      percentage: number;
    }>;
  };
}

async function main() {
  console.log('🌱 Starting seed...');

  // Очищаем базу данных
  console.log('🗑️  Cleaning database...');
  await prisma.leaderElectionResult.deleteMany();
  await prisma.leaderElection.deleteMany();
  await prisma.majoritarianDistrict.deleteMany();
  await prisma.parliamentResult.deleteMany();
  await prisma.parliament.deleteMany();
  await prisma.leadership.deleteMany();
  await prisma.news.deleteMany();
  await prisma.position.deleteMany();
  await prisma.politician.deleteMany();
  await prisma.party.deleteMany();
  await prisma.category.deleteMany();

  // Загружаем данные из JSON
  const dataDir = path.join(process.cwd(), 'data');

  // 1. Категории
  console.log('📁 Seeding categories...');
  const categoriesData: CategoryData[] = JSON.parse(
    fs.readFileSync(path.join(dataDir, 'categories.json'), 'utf-8')
  );
  
  const categoryMap = new Map<number, number>();
  for (const cat of categoriesData) {
    const created = await prisma.category.create({
      data: {
        name: cat.name,
        type: cat.type,
        order: cat.order,
        description: cat.description || null,
      },
    });
    categoryMap.set(cat.id, created.id);
  }

  // 2. Партии
  console.log('🏛️  Seeding parties...');
  const partiesData: PartyData[] = JSON.parse(
    fs.readFileSync(path.join(dataDir, 'parties.json'), 'utf-8')
  );
  
  const partyMap = new Map<number, number>();
  for (const party of partiesData) {
    const created = await prisma.party.create({
      data: {
        name: party.name,
        logo: party.logo,
        seats: party.seats,
        note: party.note || null,
        color: party.color || null,
        // leaderId будет установлен после создания политиков
      },
    });
    partyMap.set(party.id, created.id);
  }

  // 3. Политики
  console.log('👥 Seeding politicians...');
  const politiciansData: PoliticianData[] = JSON.parse(
    fs.readFileSync(path.join(dataDir, 'politicians.json'), 'utf-8')
  );
  
  const politicianMap = new Map<number, number>();
  for (const pol of politiciansData) {
    // Находим ID партии по имени
    const partyId = pol.party
      ? Array.from(partyMap.entries()).find(
          ([_, id]) => {
            const party = partiesData.find((p) => p.id === id);
            return party?.name === pol.party;
          }
        )?.[1] || null
      : null;

    const created = await prisma.politician.create({
      data: {
        name: pol.name,
        image: pol.image || null,
        partyId: partyId,
      },
    });
    politicianMap.set(pol.id, created.id);
  }

  // Обновляем лидеров партий
  console.log('👑 Updating party leaders...');
  for (const party of partiesData) {
    if (party.leaderId) {
      const leaderDbId = politicianMap.get(party.leaderId);
      const partyDbId = partyMap.get(party.id);
      if (leaderDbId && partyDbId) {
        await prisma.party.update({
          where: { id: partyDbId },
          data: { leaderId: leaderDbId },
        });
      }
    }
  }

  // 4. Посады
  console.log('💼 Seeding positions...');
  const positionsData: PositionData[] = JSON.parse(
    fs.readFileSync(path.join(dataDir, 'positions.json'), 'utf-8')
  );
  
  const positionMap = new Map<number, number>();
  for (const pos of positionsData) {
    const created = await prisma.position.create({
      data: {
        name: pos.name,
        category: pos.category || null,
        order: pos.order,
      },
    });
    positionMap.set(pos.id, created.id);
  }

  // 5. Керівництво
  console.log('🎯 Seeding leadership...');
  const leadershipData: LeadershipData[] = JSON.parse(
    fs.readFileSync(path.join(dataDir, 'leadership.json'), 'utf-8')
  );
  
  for (const lead of leadershipData) {
    const politicianDbId = politicianMap.get(lead.politicianId);
    const positionDbId = Array.from(positionMap.entries()).find(
      ([_, id]) => {
        const pos = positionsData.find((p) => p.id === id);
        return pos?.name === lead.position;
      }
    )?.[1];

    if (politicianDbId && positionDbId) {
      await prisma.leadership.create({
        data: {
          politicianId: politicianDbId,
          positionId: positionDbId,
        },
      });
    }
  }

  // 6. Новости
  console.log('📰 Seeding news...');
  const newsData: NewsData[] = JSON.parse(
    fs.readFileSync(path.join(dataDir, 'news.json'), 'utf-8')
  );
  
  for (const news of newsData) {
    // Находим ID категорий по имени
    const categoryDbId = news.category
      ? Array.from(categoryMap.entries()).find(
          ([_, id]) => {
            const cat = categoriesData.find((c) => c.id === id);
            return cat?.name === news.category && cat?.type === 'news_category';
          }
        )?.[1] || null
      : null;

    const navigationCategoryDbId = news.navigationCategory
      ? Array.from(categoryMap.entries()).find(
          ([_, id]) => {
            const cat = categoriesData.find((c) => c.id === id);
            return cat?.name === news.navigationCategory && cat?.type === 'news_navigation';
          }
        )?.[1] || null
      : null;

    await prisma.news.create({
      data: {
        title: news.title,
        image: news.image || null,
        date: new Date(news.date),
        text: news.text,
        categoryId: categoryDbId,
        navigationCategoryId: navigationCategoryDbId,
      },
    });
  }

  // 7. Парламент
  console.log('🏛️  Seeding parliament...');
  const electionsData: ParliamentData = JSON.parse(
    fs.readFileSync(path.join(dataDir, 'elections.json'), 'utf-8')
  );
  
  const parliamentDiagramData = JSON.parse(
    fs.readFileSync(path.join(dataDir, 'parliament.json'), 'utf-8')
  );
  const parliamentDiagram = parliamentDiagramData.diagram || null;

  const parliament = await prisma.parliament.create({
    data: {
      date: new Date(electionsData.parliament.date),
      diagram: parliamentDiagram,
    },
  });

  // Результаты партий
  for (const result of electionsData.parliament.parties) {
    const partyDbId = partyMap.get(result.partyId);
    if (partyDbId) {
      await prisma.parliamentResult.create({
        data: {
          parliamentId: parliament.id,
          partyId: partyDbId,
          percentage: result.percentage,
        },
      });
    }
  }

  // Мажоритарные округи
  for (const district of electionsData.parliament.majoritarianDistricts) {
    const candidateDbId = politicianMap.get(district.candidateId);
    const partyDbId = partyMap.get(district.partyId);
    if (candidateDbId && partyDbId) {
      await prisma.majoritarianDistrict.create({
        data: {
          parliamentId: parliament.id,
          districtNumber: district.districtNumber,
          candidateId: candidateDbId,
          partyId: partyDbId,
        },
      });
    }
  }

  // 8. Выборы лидера
  console.log('👑 Seeding leader election...');
  const leaderElection = await prisma.leaderElection.create({
    data: {
      date: new Date(electionsData.leader.date),
    },
  });

  for (const candidate of electionsData.leader.candidates) {
    const candidateDbId = politicianMap.get(candidate.candidateId);
    if (candidateDbId) {
      // Находим партию кандидата
      const politician = politiciansData.find((p) => p.id === candidate.candidateId);
      const partyDbId = politician?.party
        ? Array.from(partyMap.entries()).find(
            ([_, id]) => {
              const party = partiesData.find((p) => p.id === id);
              return party?.name === politician.party;
            }
          )?.[1] || null
        : null;

      await prisma.leaderElectionResult.create({
        data: {
          leaderElectionId: leaderElection.id,
          candidateId: candidateDbId,
          partyId: partyDbId,
          percentage: candidate.percentage,
        },
      });
    }
  }

  console.log('✅ Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

