// Simple Icons slug + brand color per skill. color null = follow the theme text color
// (brand color would vanish on a dark/light background). Skills not listed get a letter badge.
export const SKILL_ICONS = {
  Python: ['python', '3776AB'],
  Bash: ['gnubash', '4EAA25'],
  Go: ['go', '00ADD8'],
  'C++': ['cplusplus', '00599C'],
  JavaScript: ['javascript', 'F7DF1E'],
  PHP: ['php', '777BB4'],
  Wireshark: ['wireshark', '1679A7'],
  'Burp Suite': ['burpsuite', 'FF6633'],
  'Kali Linux': ['kalilinux', '557C94'],
  Django: ['django', '44B78B'],
  Flask: ['flask', null],
  'React.js': ['react', '61DAFB'],
  Docker: ['docker', '2496ED'],
  Git: ['git', 'F05032'],
  MySQL: ['mysql', '4479A1'],
  SQLite: ['sqlite', '44A3DA'],
};

export const iconUrl = (slug) => `https://cdn.simpleicons.org/${slug}`;
