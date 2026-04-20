export const gamesData = [
  {
    slug: 'pubg-mobile',
    name: 'PUBG Mobile UC',
    publisher: 'Level Infinite',
    region: 'Global',
    banner: 'https://images.unsplash.com/photo-1596727147705-61a532a659bd?auto=format&fit=crop&q=80&w=1200&h=400',
    icon: 'https://images.unsplash.com/photo-1596727147705-61a532a659bd?auto=format&fit=crop&q=80&w=150&h=150',
    description: 'Top up PUBG Mobile UC directly to your account. Fast and secure delivery.',
    playerIdTutorial: [
      'Open PUBG Mobile and go to the main lobby screen.',
      'Tap your profile avatar in the top-left corner.',
      'Your Player ID (UID) is shown under your username on the profile page.',
      'Copy the UID exactly and paste it into the Player ID field before checkout.',
    ],
    items: [
      { id: 'pubg_60', name: '60 UC', price: 0.99 },
      { id: 'pubg_325', name: '300 + 25 UC', price: 4.99 },
      { id: 'pubg_660', name: '600 + 60 UC', price: 9.99, popular: true },
      { id: 'pubg_1800', name: '1500 + 300 UC', price: 24.99 },
      { id: 'pubg_3850', name: '3000 + 850 UC', price: 49.99 },
      { id: 'pubg_8100', name: '6000 + 2100 UC', price: 99.99 },
    ]
  },
  {
    slug: 'mobile-legends',
    name: 'Mobile Legends Diamonds',
    publisher: 'Moonton',
    region: 'Global',
    banner: 'https://images.unsplash.com/photo-1563721340455-8408a2fe6480?auto=format&fit=crop&q=80&w=1200&h=400',
    icon: 'https://images.unsplash.com/photo-1563721340455-8408a2fe6480?auto=format&fit=crop&q=80&w=150&h=150',
    description: 'Buy Mobile Legends Diamonds and Twilight Passes instantly.',
    playerIdTutorial: [
      'Open Mobile Legends and enter the main lobby.',
      'Tap your profile portrait on the top-left side.',
      'Find your Account ID on the profile page.',
      'Your Zone ID is shown in brackets next to the Account ID.',
      'Enter both Account ID (Player ID) and Zone ID to complete top-up safely.',
    ],
    items: [
      { id: 'ml_78', name: '78 Diamonds', price: 1.49 },
      { id: 'ml_156', name: '156 Diamonds', price: 2.99 },
      { id: 'ml_234', name: '234 Diamonds', price: 4.49 },
      { id: 'ml_625', name: '625 Diamonds', price: 11.99, popular: true },
      { id: 'ml_1860', name: '1860 Diamonds', price: 34.99 },
      { id: 'ml_4649', name: '4649 Diamonds', price: 85.99 },
    ]
  },
  {
    slug: 'valorant',
    name: 'Valorant Points',
    publisher: 'Riot Games',
    region: 'Global',
    banner: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=1200&h=400',
    icon: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=150&h=150',
    description: 'Get your Valorant Points (VP) for weapon skins and battle passes.',
    playerIdTutorial: [
      'Open Valorant and go to the main home screen.',
      'Click your profile card in the top-right corner.',
      'Locate your Riot ID (for example: PlayerName#TAG).',
      'Use the exact Riot ID in the Player ID field to avoid delivery errors.',
    ],
    items: [
      { id: 'val_475', name: '475 VP', price: 4.99 },
      { id: 'val_1000', name: '1000 VP', price: 9.99 },
      { id: 'val_2050', name: '2050 VP', price: 19.99, popular: true },
      { id: 'val_3650', name: '3650 VP', price: 34.99 },
      { id: 'val_5350', name: '5350 VP', price: 49.99 },
      { id: 'val_11000', name: '11000 VP', price: 99.99 },
    ]
  }
]
