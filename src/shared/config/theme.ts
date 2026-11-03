// Theme constants - <html data-theme> 로 색 토큰을 갈아끼운다
export type Theme = 'light' | 'dark';

export const DEFAULT_THEME: Theme = 'dark';

export const THEME_STORAGE_KEY = 'theme';

/**
 * 첫 페인트 전에 저장된 테마를 <html> 에 입힌다.
 * layout <head> 에 인라인으로 넣어야 새로고침 때 반대 테마가 번쩍이지 않는다.
 */
export const THEME_INIT_SCRIPT = `try{var t=localStorage.getItem('${THEME_STORAGE_KEY}');if(t==='light'||t==='dark')document.documentElement.dataset.theme=t}catch(e){}`;

/**
 * 아이콘 이미지(next/og)는 CSS 변수를 읽지 못해서 값을 직접 쓴다.
 * globals.css 의 다크 테마 canvas · ink 와 같아야 한다.
 */
export const ICON_COLORS = { canvas: '#131313', ink: '#ececec' } as const;
