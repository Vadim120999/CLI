import { Transform } from "stream";

export function performTask(input, task) {
  if (task === "inv") {
    // Преобразуем входную строку в массив чисел
    const arr = input.split(",").map((num) => parseInt(num.trim(), 10));
    
    // Проверка на валидность массива (все элементы должны быть числами)
    if (arr.some((num) => isNaN(num))) return 0;

    // Если массив пустой или содержит один элемент, инверсий нет
    if (arr.length <= 1) return 0;

    // Функция для подсчета инверсий и слияния двух отсортированных подмассивов
    function mergeAndCount(left, right) {
      let merged = [];
      let count = 0;
      let i = 0, j = 0;

      // Слияние двух массивов
      while (i < left.length && j < right.length) {
        if (left[i] <= right[j]) {
          merged.push(left[i]);
          i++;
        } else {
          merged.push(right[j]);
          count += left.length - i;
          j++;
        }
      }

      // Добавить оставшиеся элементы
      merged.push(...left.slice(i), ...right.slice(j));
      return { merged, count };
    }

    // Рекурсивная функция для разделения массива
    function mergeSortAndCount(arr) {
      if (arr.length <= 1) return { merged: arr, count: 0 };

      const mid = Math.floor(arr.length / 2);
      const left = arr.slice(0, mid);
      const right = arr.slice(mid);

      // Рекурсивно подсчитываем инверсии для левой и правой частей
      const leftResult = mergeSortAndCount(left);
      const rightResult = mergeSortAndCount(right);

      // Сливаем результаты и подсчитываем инверсии между частями
      const mergeResult = mergeAndCount(leftResult.merged, rightResult.merged);

      return {
        merged: mergeResult.merged,
        count: leftResult.count + rightResult.count + mergeResult.count,
      };
    }

    return mergeSortAndCount(arr).count;
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