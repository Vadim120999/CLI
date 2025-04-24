import { Transform } from "stream";

export function performTask(input, task) {
  if (task === "dash") {
    const n = parseFloat(input.trim());
    if (!Number.isInteger(n)) return "";
    const absN = Math.abs(n);
    // Преобразуем число в строку и разбиваем на цифры
    const digits = absN.toString().split("").map(Number);
    if (digits.length === 0) return "";
    
    let result = digits[0].toString();
    // Проходим по парам соседних цифр
    for (let i = 1; i < digits.length; i++) {
      const prevDigit = digits[i - 1];
      const currentDigit = digits[i];
      // Добавляем дефис, если хотя бы одна из соседних цифр нечетная
      if (prevDigit % 2 === 1 || currentDigit % 2 === 1) {
        result += "-";
      }
      result += currentDigit;
    }
    return result;
  }
  return `Task "${task}" not implemented.`;
}

export function streamTransform(task) {
  return new Transform({
    transform(chunk, encoding, callback) {
      const data = chunk.toString().trim();
      const result = performTask(data, task);
      callback(null, result.toString() + "\n");
    },
  });
}