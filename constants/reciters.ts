/**
 * constants/reciters.ts — Catalogue of supported reciters
 *
 * `id` maps directly to the alquran.cloud audio edition identifier.
 * SWAP GUIDE: when backend is ready, fetch this list from GET /reciters
 * and merge with this catalogue for display names / languages.
 */

export interface ReciterOption {
  id: string;
  name: string;
  arabicName: string;
  style: 'Murattal' | 'Mujawwad' | 'Muallim';
}

export const RECITERS: ReciterOption[] = [
  {
    id: 'ar.alafasy',
    name: 'Mishary Rashid Alafasy',
    arabicName: 'مشاري راشد العفاسي',
    style: 'Murattal',
  },
  {
    id: 'ar.abdurrahmaansudais',
    name: 'Abdurrahman Al-Sudais',
    arabicName: 'عبدالرحمن السديس',
    style: 'Murattal',
  },
  {
    id: 'ar.husary',
    name: 'Mahmoud Khalil Al-Husary',
    arabicName: 'محمود خليل الحصري',
    style: 'Murattal',
  },
  {
    id: 'ar.minshawi',
    name: 'Mohamed Siddiq El-Minshawi',
    arabicName: 'محمد صديق المنشاوي',
    style: 'Mujawwad',
  },
  {
    id: 'ar.ahmedajamy',
    name: 'Ahmed ibn Ali Al-Ajamy',
    arabicName: 'أحمد بن علي العجمي',
    style: 'Murattal',
  },
  {
    id: 'ar.hanirifai',
    name: 'Hani Ar-Rifai',
    arabicName: 'هاني الرفاعي',
    style: 'Murattal',
  },
  {
    id: 'ar.mahermuaiqly',
    name: 'Maher Al-Muaiqly',
    arabicName: 'ماهر المعيقلي',
    style: 'Murattal',
  },
  {
    id: 'ar.saoodshuraym',
    name: 'Saud Al-Shuraim',
    arabicName: 'سعود الشريم',
    style: 'Murattal',
  },
];

export function getReciterById(id: string): ReciterOption {
  return RECITERS.find(r => r.id === id) ?? RECITERS[0];
}
