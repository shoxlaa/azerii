/**
 * Workshop video strip — demo data. Replace `href` with real YouTube links
 * and `thumbnail` with real preview images later.
 */
export interface WorkshopVideo {
  id: string;
  thumbnail: string;
  duration: string;
  author: string;
  caption: string;
  href: string;
}

export const WORKSHOP_VIDEOS: WorkshopVideo[] = [
  {
    id: 'luchs',
    thumbnail: '/hero/somua-s35.jpg',
    duration: '05:40',
    author: 'Ilgar Ismailov',
    caption: '1:16 scale Pz.Kpfw II Luchs model build and paint.',
    href: 'https://youtube.com/@azerii',
  },
  {
    id: 't34',
    thumbnail: '/hero/hero-t28-polygon.jpg',
    duration: '04:41',
    author: 'Ilgar Ismailov',
    caption: 'T-34-76 RC tank model weathering.',
    href: 'https://youtube.com/@azerii',
  },
  {
    id: 't51-p3',
    thumbnail: '/hero/hero-b1-reims.jpg',
    duration: '03:57',
    author: 'Ilgar Ismailov',
    caption: 'T-51 power armor paint. Part 3',
    href: 'https://youtube.com/@azerii',
  },
  {
    id: 'fallout-2',
    thumbnail: '/hero/hero-german-field.jpg',
    duration: '03:01',
    author: 'Ilgar Ismailov',
    caption: 'Fallout part 2',
    href: 'https://youtube.com/@azerii',
  },
  {
    id: 't51-p1',
    thumbnail: '/hero/somua-wide.jpg',
    duration: '01:41',
    author: 'Ilgar Ismailov',
    caption: 'Diorama Fallout T-51 power armor. Part 1',
    href: 'https://youtube.com/@azerii',
  },
  {
    id: 'apc',
    thumbnail: '/hero/t28-polygon-wide.jpg',
    duration: '02:15',
    author: 'Ilgar Ismailov',
    caption: 'Day of the APC build',
    href: 'https://youtube.com/@azerii',
  },
];
