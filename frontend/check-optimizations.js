
// اختبار سريع للتحقق من أن الكود يحتوي على جميع التحسينات المطلوبة
const fs = require("fs");

const content = fs.readFileSync("src/components/particle-background-optimized.tsx", "utf8");

console.log("🔍 التحقق من التحسينات في particle-background-optimized.tsx:");

const checks = [
  { name: "requestIdleCallback", pattern: /requestIdleCallback|requestIdle/ },
  { name: "generateParticlesInBatches", pattern: /generateParticlesInBatches/ },
  { name: "try-catch blocks", pattern: /try\s*{/ },
  { name: "setTimeout fallback", pattern: /setTimeout/ },
  { name: "Memory cleanup", pattern: /cleanup|dispose/ },
  { name: "requestAnimationFrame", pattern: /requestAnimationFrame/ }
];

let passed = 0;
checks.forEach(check => {
  if (check.pattern.test(content)) {
    console.log("✅", check.name);
    passed++;
  } else {
    console.log("❌", check.name);
  }
});

console.log("\\n📊 النتيجة:", passed + "/" + checks.length, "فحوصات نجحت");

if (passed === checks.length) {
  console.log("🎉 جميع التحسينات موجودة في الكود!");
} else {
  console.log("⚠️ بعض التحسينات قد تكون مفقودة");
}

