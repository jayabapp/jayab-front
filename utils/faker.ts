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

export const fakeConsultant = {
    id: Math.floor(Math.random() * 10000), // Dynamic ID
    name: "محمدرضا محمدی",
    avatar: "/assets/images/fake_consultant_image.png",
    code: "202",
    locations: ["تهران", "کرج", "شهریار"],
    owners_satisfaction: 90,
    users_satisfaction: 85,
};