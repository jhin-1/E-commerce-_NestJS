// decorator function that takes a number as an argument
function take(t: number) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    console.log('الرقم الممرر للديكوريتور هو:', t + 2);
  };
}

// 2. استخدام الديكوريتور داخل Class وليس دالة عادية
class Example {
  @take(2)
  some(n: number) {
    console.log(n);
  }
}

let x = new Example();
console.log(x.some(5)); // Output: 7
