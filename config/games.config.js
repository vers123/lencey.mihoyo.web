// 游戏数据配置
const gamesConfig = {
    mihoyo: [
        {
            id: 'genshin',
            name: '原神',
            nameEn: 'Genshin Impact',
            category: '米哈游',
            description: '一款开放世界冒险游戏',
            descriptionEn: 'An open-world adventure game',
            link: 'https://genshin.mihoyo.com/',
            image: 'assets/images/mihoyo/game_logo/genshin_impact.jpg',
            tags: ['开放世界', '冒险', 'RPG']
        },
        {
            id: 'starrail',
            name: '崩坏：星穹铁道',
            nameEn: 'Honkai: Star Rail',
            category: '米哈游',
            description: '一款回合制策略游戏',
            descriptionEn: 'A turn-based strategy game',
            link: 'https://hsr.mihoyo.com/',
            image: 'assets/images/mihoyo/game_logo/honkai_star_rail.png',
            tags: ['回合制', '策略', 'RPG']
        },
        {
            id: 'zzz',
            name: '绝区零',
            nameEn: 'Zenless Zone Zero',
            category: '米哈游',
            description: '一款都市动作冒险游戏',
            descriptionEn: 'An urban action adventure game',
            link: 'https://zzz.mihoyo.com/',
            image: 'assets/images/mihoyo/game_logo/zenless_zone_zero.png',
            tags: ['动作', '都市', '冒险']
        },
        {
            id: 'honkai3',
            name: '崩坏3',
            nameEn: 'Honkai Impact 3rd',
            category: '米哈游',
            description: '一款3D动作游戏',
            descriptionEn: 'A 3D action game',
            link: 'https://www.honkaiimpact3.com/',
            image: 'assets/images/mihoyo/game_logo/honkai_impact_3.jpg',
            tags: ['动作', '3D', 'RPG']
        },
        {
            id: 'tot',
            name: '未定事件簿',
            nameEn: 'Tears of Themis',
            category: '米哈游',
            description: '一款恋爱推理游戏',
            descriptionEn: 'A romance detective game',
            link: 'https://tot.mihoyo.com/',
            image: 'assets/images/mihoyo/game_logo/tears_of_themis.jpg',
            tags: ['恋爱', '推理', 'AVG']
        },
        {
            id: 'hoyolab',
            name: 'HoYoLAB',
            nameEn: 'HoYoLAB',
            category: '米哈游',
            description: '米哈游官方社区',
            descriptionEn: 'miHoYo official community',
            link: 'https://www.hoyolab.com/',
            image: 'assets/images/mihoyo/logo/mihoyo.png',
            tags: ['社区', '论坛']
        }
    ],
    other: [
        {
            id: 'minecraft',
            name: 'Minecraft',
            nameEn: 'Minecraft',
            category: '其他游戏',
            description: '一款沙盒建造游戏',
            descriptionEn: 'A sandbox building game',
            link: 'https://www.minecraft.net/',
            image: 'assets/images/another_games/game_logo/minecraft.svg',
            tags: ['沙盒', '建造', '生存']
        },
        {
            id: 'cs2',
            name: 'Counter-Strike 2',
            nameEn: 'Counter-Strike 2',
            category: '其他游戏',
            description: '一款经典射击游戏',
            descriptionEn: 'A classic shooter game',
            link: 'https://www.counter-strike.net/cs2',
            image: 'assets/images/common/lencey.png',
            tags: ['射击', '竞技', 'FPS']
        },
        {
            id: 'zelda',
            name: '塞尔达传说',
            nameEn: 'The Legend of Zelda',
            category: '其他游戏',
            description: '任天堂经典冒险游戏',
            descriptionEn: 'Nintendo classic adventure game',
            link: 'https://www.zelda.com/',
            image: 'assets/images/common/lencey.png',
            tags: ['冒险', '解谜', '任天堂']
        },
        {
            id: 'eldenring',
            name: '艾尔登法环',
            nameEn: 'Elden Ring',
            category: '其他游戏',
            description: '一款开放世界RPG',
            descriptionEn: 'An open-world RPG',
            link: 'https://eldenring.bandainamcoent.com/',
            image: 'assets/images/common/lencey.png',
            tags: ['开放世界', 'RPG', '魂类']
        },
        {
            id: 'pubg',
            name: 'PUBG',
            nameEn: 'PUBG',
            category: '其他游戏',
            description: '一款大逃杀游戏',
            descriptionEn: 'A battle royale game',
            link: 'https://www.pubg.com/',
            image: 'assets/images/common/lencey.png',
            tags: ['大逃杀', '射击', '竞技']
        },
        {
            id: 'fortnite',
            name: 'Fortnite',
            nameEn: 'Fortnite',
            category: '其他游戏',
            description: '一款多人在线游戏',
            descriptionEn: 'A multiplayer online game',
            link: 'https://www.epicgames.com/fortnite/',
            image: 'assets/images/common/lencey.png',
            tags: ['建造', '射击', '大逃杀']
        }
    ]
};

// 导出配置
window.gamesConfig = gamesConfig;
