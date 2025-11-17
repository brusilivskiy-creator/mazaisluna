import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Транслитерация украинского текста в латиницу (по типу cyr-to-lat)
 * Преобразует кириллицу в латиницу и создает URL-friendly slug
 */
export function transliterateToSlug(text: string): string {
  const transliterationMap: Record<string, string> = {
    // Украинские буквы
    'а': 'a', 'б': 'b', 'в': 'v', 'г': 'h', 'ґ': 'g',
    'д': 'd', 'е': 'e', 'є': 'ie', 'ж': 'zh', 'з': 'z',
    'и': 'y', 'і': 'i', 'ї': 'i', 'й': 'i', 'к': 'k',
    'л': 'l', 'м': 'm', 'н': 'n', 'о': 'o', 'п': 'p',
    'р': 'r', 'с': 's', 'т': 't', 'у': 'u', 'ф': 'f',
    'х': 'kh', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh', 'щ': 'shch',
    'ь': '', 'ю': 'iu', 'я': 'ia',
    // Заглавные
    'А': 'A', 'Б': 'B', 'В': 'V', 'Г': 'H', 'Ґ': 'G',
    'Д': 'D', 'Е': 'E', 'Є': 'Ie', 'Ж': 'Zh', 'З': 'Z',
    'И': 'Y', 'І': 'I', 'Ї': 'I', 'Й': 'I', 'К': 'K',
    'Л': 'L', 'М': 'M', 'Н': 'N', 'О': 'O', 'П': 'P',
    'Р': 'R', 'С': 'S', 'Т': 'T', 'У': 'U', 'Ф': 'F',
    'Х': 'Kh', 'Ц': 'Ts', 'Ч': 'Ch', 'Ш': 'Sh', 'Щ': 'Shch',
    'Ь': '', 'Ю': 'Iu', 'Я': 'Ia',
  };

  // Сначала транслитерируем весь текст
  let result = text
    .split('')
    .map(char => {
      // Сначала проверяем в мапе транслитерации
      if (transliterationMap[char]) {
        return transliterationMap[char];
      }
      // Если символ уже латиница или цифра, оставляем как есть
      if (/[a-zA-Z0-9]/.test(char)) {
        return char;
      }
      // Пробелы и дефисы оставляем
      if (/[\s-]/.test(char)) {
        return char;
      }
      // Все остальное удаляем
      return '';
    })
    .join('')
    .toLowerCase()
    .trim();
  
  // Затем очищаем и форматируем
  return result
    .replace(/[^a-z0-9\s-]/g, '') // Удаляем все кроме букв, цифр, пробелов и дефисов
    .replace(/\s+/g, '-') // Заменяем пробелы на дефисы
    .replace(/-+/g, '-') // Убираем множественные дефисы
    .replace(/^-+|-+$/g, ''); // Убираем дефисы в начале и конце
}

/**
 * Создает slug из заголовка новости
 * Клиент-безопасная функция (не использует fs)
 */
export function getNewsSlug(title: string): string {
  return transliterateToSlug(title);
}
