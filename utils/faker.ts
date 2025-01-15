export const fakeVilla = {
  title: "باغ ویلا در کردان",
  code: "10840",
  likes: 25,
  price: 600000,
  discounted_price: 550000,
  location_title: "کردان (تهران)",
  isValid: true,
  discount_percantage: 10,
  images_count: 4,
  room_count: 4,
  id: 4,
  description: "2 اتاق - تا 4 نفر - استخردار",

  feature_image: "/assets/images/fake_villa_image.jpg",

  images: [
    "/assets/images/fake_villa_image.jpg",
    "/assets/images/fake_villa_image.jpg",
    "/assets/images/fake_villa_image.jpg",
    "/assets/images/fake_villa_image.jpg",
    "/assets/images/fake_villa_image.jpg",
  ],
};

export const fakeConsultants = Array.from({ length: 10 }).map(() => ({
  id: Math.floor(Math.random() * 10000), // Dynamic ID
  name: `محمدرضا محمدی ${Math.floor(Math.random() * 100)}`, // Randomized name
  avatar: "/assets/images/fake_consultant_image.png",
  code: `${Math.floor(Math.random() * 900) + 100}`, // Random code between 100 and 999
  locations: ["تهران", "کرج", "شهریار"], // You can add more locations if needed
  owners_satisfaction: Math.floor(Math.random() * 100), // Random satisfaction score between 0 and 100
  users_satisfaction: Math.floor(Math.random() * 100), // Random satisfaction score between 0 and 100
}));

export const simpleChartFakeData = [
  {
    name: "Page A",
    value: 1,
    date: Date.now(),
  },
  {
    name: "Page B",
    value: 194,
    date: Date.now() + 1546000000,
  },
  {
    name: "Page C",
    value: 15,
    date: Date.now() + 306352000,
  },
  {
    name: "Page D",
    value: 52,
    date: Date.now() + 156520000,
  },
  {
    name: "Page E",
    value: 42,
    date: Date.now() + 212505200,
  },
  {
    name: "Page F",
    value: 20,
    date: Date.now() + 4250452300,
  },
  {
    name: "Page G",
    value: 10,
    date: Date.now() + 552200,
  },
];

export const fakeAdvisorPlans = [
  {
    id: 12,
    title: "مشاور عادی",
    desc: "با پرداخت هزینه ماهانه 1,000,000 ریال امکانات زیر برای شما فعال میگردد:",
    pros: ["مشاهده درصد کمیسیون مالکین"],
  },
];
