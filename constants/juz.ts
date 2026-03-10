export type JuzEntry = {
  number: number;
  /** First words of the Juz, used as its Arabic name */
  arabicName: string;
  startSurah: number;
  startAyah: number;
};

/** Standard 30-Juz division of the Quran (Para / Sipara) */
export const JUZ_DATA: JuzEntry[] = [
  { number: 1,  arabicName: 'الم',                   startSurah: 1,  startAyah: 1   },
  { number: 2,  arabicName: 'سَيَقُولُ',              startSurah: 2,  startAyah: 142 },
  { number: 3,  arabicName: 'تِلْكَ الرُّسُلُ',       startSurah: 2,  startAyah: 253 },
  { number: 4,  arabicName: 'لَن تَنَالُوا',          startSurah: 3,  startAyah: 92  },
  { number: 5,  arabicName: 'وَالْمُحْصَنَاتُ',       startSurah: 4,  startAyah: 24  },
  { number: 6,  arabicName: 'لَا يُحِبُّ اللَّهُ',   startSurah: 4,  startAyah: 148 },
  { number: 7,  arabicName: 'وَإِذَا سَمِعُوا',       startSurah: 5,  startAyah: 82  },
  { number: 8,  arabicName: 'وَلَوْ أَنَّنَا',        startSurah: 6,  startAyah: 111 },
  { number: 9,  arabicName: 'قَالَ الْمَلَأُ',        startSurah: 7,  startAyah: 88  },
  { number: 10, arabicName: 'وَاعْلَمُوا',            startSurah: 8,  startAyah: 41  },
  { number: 11, arabicName: 'يَعْتَذِرُونَ',          startSurah: 9,  startAyah: 93  },
  { number: 12, arabicName: 'وَمَا مِن دَابَّةٍ',     startSurah: 11, startAyah: 6   },
  { number: 13, arabicName: 'وَمَا أُبَرِّئُ',        startSurah: 12, startAyah: 53  },
  { number: 14, arabicName: 'رُبَمَا',                startSurah: 15, startAyah: 1   },
  { number: 15, arabicName: 'سُبْحَانَ الَّذِي',      startSurah: 17, startAyah: 1   },
  { number: 16, arabicName: 'قَالَ أَلَمْ',           startSurah: 18, startAyah: 75  },
  { number: 17, arabicName: 'اقْتَرَبَ لِلنَّاسِ',   startSurah: 21, startAyah: 1   },
  { number: 18, arabicName: 'قَدْ أَفْلَحَ',          startSurah: 23, startAyah: 1   },
  { number: 19, arabicName: 'وَقَالَ الَّذِينَ',      startSurah: 25, startAyah: 21  },
  { number: 20, arabicName: 'أَمَّنْ خَلَقَ',         startSurah: 27, startAyah: 59  },
  { number: 21, arabicName: 'اتْلُ مَا أُوحِيَ',     startSurah: 29, startAyah: 45  },
  { number: 22, arabicName: 'وَمَن يَقْنُتْ',         startSurah: 33, startAyah: 31  },
  { number: 23, arabicName: 'وَمَا لِيَ',             startSurah: 36, startAyah: 27  },
  { number: 24, arabicName: 'فَمَن أَظْلَمُ',         startSurah: 39, startAyah: 32  },
  { number: 25, arabicName: 'إِلَيْهِ يُرَدُّ',       startSurah: 41, startAyah: 47  },
  { number: 26, arabicName: 'حم',                     startSurah: 46, startAyah: 1   },
  { number: 27, arabicName: 'قَالَ فَمَا خَطْبُكُم', startSurah: 51, startAyah: 31  },
  { number: 28, arabicName: 'قَدْ سَمِعَ اللَّهُ',   startSurah: 58, startAyah: 1   },
  { number: 29, arabicName: 'تَبَارَكَ الَّذِي',      startSurah: 67, startAyah: 1   },
  { number: 30, arabicName: 'عَمَّ',                  startSurah: 78, startAyah: 1   },
];
