export const pagesManifest = {
  pages: [
    {
      slug: "arabic-creative-writing-studio",
      title: "استوديو الكتابة الإبداعية",
      path: "/creative-writing"
    },
    {
      slug: "brainstorm",
      title: "جلسة العصف الذهني",
      path: "/brainstorm"
    },
    {
      slug: "development",
      title: "التطوير الإبداعي",
      path: "/development"
    }
  ],
  metadata: {
    "arabic-creative-writing-studio": {
      title: "استوديو الكتابة الإبداعية",
      description: "أداة متقدمة للكتابة الإبداعية باللغة العربية"
    },
    brainstorm: {
      title: "جلسة العصف الذهني",
      description: "ابتكر أفكاراً جديدة ومبدعة لمشاريعك"
    },
    development: {
      title: "التطوير الإبداعي",
      description: "طور أفكارك وحولها إلى مشاريع ناجحة"
    }
  }
} as const;

export default pagesManifest;
