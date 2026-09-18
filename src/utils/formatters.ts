export function formatTZS(amount: number): string {
  return new Intl.NumberFormat('sw-TZ', {
    style: 'decimal',
    maximumFractionDigits: 0
  }).format(amount) + ' TZS';
}

export function formatNumber(amount: number): string {
  return new Intl.NumberFormat('sw-TZ').format(amount);
}

export function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString('sw-TZ', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  } catch {
    return dateString;
  }
}

export function generateHash(prefix: string = 'sha256'): string {
  const chars = '0123456789abcdef';
  let result = '';
  for (let i = 0; i < 16; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return `${prefix}:${result}...${result.slice(-4)}`;
}

export function generateRefCode(prefix: string = 'TXN'): string {
  const num = Math.floor(100000 + Math.random() * 900000);
  return `${prefix}-${num}`;
}
