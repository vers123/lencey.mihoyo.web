import db from '../db/index.js';
import { v4 as uuidv4 } from 'uuid';

/**
 * 初始化游戏数据（仅在数据库为空时导入）
 */
export async function seedGames() {
  const count = db.prepare('SELECT COUNT(*) as count FROM games').get().count;
  if (count > 0) {
    console.log('[Seed] 游戏数据已存在，跳过初始化');
    return;
  }

  const mihoyoGames = [
    {
      id: 'genshin',
      name: '原神',
      name_en: 'Genshin Impact',
      category: '米哈游',
      description: '一款开放世界冒险游戏',
      description_en: 'An open-world adventure game',
      link: 'https://genshin.mihoyo.com/',
      image: 'assets/images/mihoyo/game_logo/genshin_impact.jpg',
      tags: ['开放世界', '冒险', 'RPG'],
    },
    {
      id: 'starrail',
      name: '崩坏：星穹铁道',
      name_en: 'Honkai: Star Rail',
      category: '米哈游',
      description: '一款回合制策略游戏',
      description_en: 'A turn-based strategy game',
      link: 'https://hsr.mihoyo.com/',
      image: 'assets/images/mihoyo/game_logo/honkai_star_rail.png',
      tags: ['回合制', '策略', 'RPG'],
    },
    {
      id: 'zzz',
      name: '绝区零',
      name_en: 'Zenless Zone Zero',
      category: '米哈游',
      description: '一款都市动作冒险游戏',
      description_en: 'An urban action adventure game',
      link: 'https://zzz.mihoyo.com/',
      image: 'assets/images/mihoyo/game_logo/zenless_zone_zero.png',
      tags: ['动作', '都市', '冒险'],
    },
    {
      id: 'honkai3',
      name: '崩坏3',
      name_en: 'Honkai Impact 3rd',
      category: '米哈游',
      description: '一款3D动作游戏',
      description_en: 'A 3D action game',
      link: 'https://www.honkaiimpact3.com/',
      image: 'assets/images/mihoyo/game_logo/honkai_impact_3.jpg',
      tags: ['动作', '3D', 'RPG'],
    },
    {
      id: 'tot',
      name: '未定事件簿',
      name_en: 'Tears of Themis',
      category: '米哈游',
      description: '一款恋爱推理游戏',
      description_en: 'A romance detective game',
      link: 'https://tot.mihoyo.com/',
      image: 'assets/images/mihoyo/game_logo/tears_of_themis.jpg',
      tags: ['恋爱', '推理', 'AVG'],
    },
    {
      id: 'hoyolab',
      name: 'HoYoLAB',
      name_en: 'HoYoLAB',
      category: '米哈游',
      description: '米哈游官方社区',
      description_en: 'miHoYo official community',
      link: 'https://www.hoyolab.com/',
      image: 'assets/images/mihoyo/logo/mihoyo.png',
      tags: ['社区', '论坛'],
    },
  ];

  const stmt = db.prepare(
    `INSERT INTO games (id, name, name_en, category, description, description_en, link, image, tags)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
  );

  const insertMany = db.transaction((games) => {
    for (const g of games) {
      stmt.run(
        g.id || uuidv4(),
        g.name,
        g.name_en || '',
        g.category,
        g.description || '',
        g.description_en || '',
        g.link,
        g.image || '',
        JSON.stringify(g.tags || [])
      );
    }
  });

  insertMany(mihoyoGames);
  console.log(`[Seed] 已导入 ${mihoyoGames.length} 款游戏数据`);
}
