"use client";
import Link from "next/link";
import { useState } from "react";
import _STRINGS from "@/utils/LocalStrings";

import Accordion from "@/components/shared/Accordion";
import FormInput from "@/components/shared/Form/FormInput";
import MultiLineFormInput from "@/components/shared/Form/MultiLineFormInput";
import Button from "@/components/shared/Button/Button";
import QuestionCard from "@/components/shared/cards/QuestionCard";

interface ContactForm {
  full_name: string;
  mobile: string;
  message: string;
}

const faq_data = [
  {
    id: 1,
    title: "درباره جایاب",
    child: [
      {
        title: "چگونه حساب کاربری بسازم؟",
        description:
          "برای ساخت حساب کاربری، به صفحه ثبت‌نام بروید و اطلاعات مورد نیاز خود را وارد کنید.",
      },
      {
        title: "چگونه وارد حساب کاربری شوم؟",
        description:
          "برای ورود به حساب کاربری خود، کافی است نام کاربری و رمز عبور خود را وارد کنید.",
      },
      {
        title: "چگونه اطلاعات حساب کاربری را به‌روز کنم؟",
        description:
          "برای به‌روز رسانی اطلاعات حساب، به بخش تنظیمات حساب کاربری رفته و تغییرات مورد نظر را اعمال کنید.",
      },
      {
        title: "چگونه رزرو اقامتگاه انجام دهم؟",
        description:
          "برای رزرو اقامتگاه، به صفحه اقامتگاه‌ها بروید و پس از انتخاب اقامتگاه، تاریخ‌ها و اطلاعات خود را وارد کنید.",
      },
      {
        title: "آیا امکان لغو رزرو وجود دارد؟",
        description:
          "بله، شما می‌توانید رزرو خود را لغو کنید، اما بسته به شرایط لغو، هزینه‌هایی ممکن است اعمال شود.",
      },
      {
        title: "چگونه با پشتیبانی تماس بگیرم؟",
        description:
          'برای تماس با پشتیبانی، به صفحه "تماس با ما" مراجعه کنید و فرم تماس را تکمیل کنید یا از شماره تلفن‌های پشتیبانی استفاده کنید.',
      },
      {
        title: "آیا اقامتگاه‌ها دارای اینترنت هستند؟",
        description:
          "بیشتر اقامتگاه‌ها اینترنت وای‌فای دارند. برای اطمینان، لطفاً در توضیحات اقامتگاه به این نکته اشاره شده است.",
      },
      {
        title: "آیا پارکینگ در اقامتگاه‌ها وجود دارد؟",
        description:
          "بعضی از اقامتگاه‌ها پارکینگ دارند. در توضیحات هر اقامتگاه به طور مشخص اشاره شده است.",
      },
      {
        title: "چگونه هزینه اقامتگاه را پرداخت کنم؟",
        description:
          "هزینه اقامتگاه را می‌توانید از طریق درگاه‌های پرداخت آنلاین معتبر پرداخت کنید.",
      },
      {
        title: "چگونه با مشکل پیش‌آمده در اقامتگاه برخورد کنم؟",
        description:
          "در صورت بروز هرگونه مشکل در اقامتگاه، با پشتیبانی ما تماس بگیرید تا به سرعت مشکل شما حل شود.",
      },
    ],
  },
  {
    id: 2,
    title: "رزرو اقامتگاه",
    child: [
      {
        title: "2چگونه حساب کاربری بسازم؟",
        description:
          "برای ساخت حساب کاربری، به صفحه ثبت‌نام بروید و اطلاعات مورد نیاز خود را وارد کنید.",
      },
      {
        title: "چگونه وارد حساب کاربری شوم؟",
        description:
          "برای ورود به حساب کاربری خود، کافی است نام کاربری و رمز عبور خود را وارد کنید.",
      },
      {
        title: "چگونه اطلاعات حساب کاربری را به‌روز کنم؟",
        description:
          "برای به‌روز رسانی اطلاعات حساب، به بخش تنظیمات حساب کاربری رفته و تغییرات مورد نظر را اعمال کنید.",
      },
      {
        title: "چگونه رزرو اقامتگاه انجام دهم؟",
        description:
          "برای رزرو اقامتگاه، به صفحه اقامتگاه‌ها بروید و پس از انتخاب اقامتگاه، تاریخ‌ها و اطلاعات خود را وارد کنید.",
      },
      {
        title: "آیا امکان لغو رزرو وجود دارد؟",
        description:
          "بله، شما می‌توانید رزرو خود را لغو کنید، اما بسته به شرایط لغو، هزینه‌هایی ممکن است اعمال شود.",
      },
      {
        title: "چگونه با پشتیبانی تماس بگیرم؟",
        description:
          'برای تماس با پشتیبانی، به صفحه "تماس با ما" مراجعه کنید و فرم تماس را تکمیل کنید یا از شماره تلفن‌های پشتیبانی استفاده کنید.',
      },
      {
        title: "آیا اقامتگاه‌ها دارای اینترنت هستند؟",
        description:
          "بیشتر اقامتگاه‌ها اینترنت وای‌فای دارند. برای اطمینان، لطفاً در توضیحات اقامتگاه به این نکته اشاره شده است.",
      },
      {
        title: "آیا پارکینگ در اقامتگاه‌ها وجود دارد؟",
        description:
          "بعضی از اقامتگاه‌ها پارکینگ دارند. در توضیحات هر اقامتگاه به طور مشخص اشاره شده است.",
      },
      {
        title: "چگونه هزینه اقامتگاه را پرداخت کنم؟",
        description:
          "هزینه اقامتگاه را می‌توانید از طریق درگاه‌های پرداخت آنلاین معتبر پرداخت کنید.",
      },
      {
        title: "چگونه با مشکل پیش‌آمده در اقامتگاه برخورد کنم؟",
        description:
          "در صورت بروز هرگونه مشکل در اقامتگاه، با پشتیبانی ما تماس بگیرید تا به سرعت مشکل شما حل شود.",
      },
    ],
  },
  {
    id: 3,
    title: "رزرو اقامتگاه",
    child: [
      {
        title: "3چگونه حساب کاربری بسازم؟",
        description:
          "برای ساخت حساب کاربری، به صفحه ثبت‌نام بروید و اطلاعات مورد نیاز خود را وارد کنید.",
      },
      {
        title: "چگونه وارد حساب کاربری شوم؟",
        description:
          "برای ورود به حساب کاربری خود، کافی است نام کاربری و رمز عبور خود را وارد کنید.",
      },
      {
        title: "چگونه اطلاعات حساب کاربری را به‌روز کنم؟",
        description:
          "برای به‌روز رسانی اطلاعات حساب، به بخش تنظیمات حساب کاربری رفته و تغییرات مورد نظر را اعمال کنید.",
      },
      {
        title: "چگونه رزرو اقامتگاه انجام دهم؟",
        description:
          "برای رزرو اقامتگاه، به صفحه اقامتگاه‌ها بروید و پس از انتخاب اقامتگاه، تاریخ‌ها و اطلاعات خود را وارد کنید.",
      },
      {
        title: "آیا امکان لغو رزرو وجود دارد؟",
        description:
          "بله، شما می‌توانید رزرو خود را لغو کنید، اما بسته به شرایط لغو، هزینه‌هایی ممکن است اعمال شود.",
      },
      {
        title: "چگونه با پشتیبانی تماس بگیرم؟",
        description:
          'برای تماس با پشتیبانی، به صفحه "تماس با ما" مراجعه کنید و فرم تماس را تکمیل کنید یا از شماره تلفن‌های پشتیبانی استفاده کنید.',
      },
      {
        title: "آیا اقامتگاه‌ها دارای اینترنت هستند؟",
        description:
          "بیشتر اقامتگاه‌ها اینترنت وای‌فای دارند. برای اطمینان، لطفاً در توضیحات اقامتگاه به این نکته اشاره شده است.",
      },
      {
        title: "آیا پارکینگ در اقامتگاه‌ها وجود دارد؟",
        description:
          "بعضی از اقامتگاه‌ها پارکینگ دارند. در توضیحات هر اقامتگاه به طور مشخص اشاره شده است.",
      },
      {
        title: "چگونه هزینه اقامتگاه را پرداخت کنم؟",
        description:
          "هزینه اقامتگاه را می‌توانید از طریق درگاه‌های پرداخت آنلاین معتبر پرداخت کنید.",
      },
      {
        title: "چگونه با مشکل پیش‌آمده در اقامتگاه برخورد کنم؟",
        description:
          "در صورت بروز هرگونه مشکل در اقامتگاه، با پشتیبانی ما تماس بگیرید تا به سرعت مشکل شما حل شود.",
      },
    ],
  },
  {
    id: 4,
    title: "رزرو اقامتگاه",
    child: [
      {
        title: "4چگونه حساب کاربری بسازم؟",
        description:
          "برای ساخت حساب کاربری، به صفحه ثبت‌نام بروید و اطلاعات مورد نیاز خود را وارد کنید.",
      },
      {
        title: "چگونه وارد حساب کاربری شوم؟",
        description:
          "برای ورود به حساب کاربری خود، کافی است نام کاربری و رمز عبور خود را وارد کنید.",
      },
      {
        title: "چگونه اطلاعات حساب کاربری را به‌روز کنم؟",
        description:
          "برای به‌روز رسانی اطلاعات حساب، به بخش تنظیمات حساب کاربری رفته و تغییرات مورد نظر را اعمال کنید.",
      },
      {
        title: "چگونه رزرو اقامتگاه انجام دهم؟",
        description:
          "برای رزرو اقامتگاه، به صفحه اقامتگاه‌ها بروید و پس از انتخاب اقامتگاه، تاریخ‌ها و اطلاعات خود را وارد کنید.",
      },
      {
        title: "آیا امکان لغو رزرو وجود دارد؟",
        description:
          "بله، شما می‌توانید رزرو خود را لغو کنید، اما بسته به شرایط لغو، هزینه‌هایی ممکن است اعمال شود.",
      },
      {
        title: "چگونه با پشتیبانی تماس بگیرم؟",
        description:
          'برای تماس با پشتیبانی، به صفحه "تماس با ما" مراجعه کنید و فرم تماس را تکمیل کنید یا از شماره تلفن‌های پشتیبانی استفاده کنید.',
      },
      {
        title: "آیا اقامتگاه‌ها دارای اینترنت هستند؟",
        description:
          "بیشتر اقامتگاه‌ها اینترنت وای‌فای دارند. برای اطمینان، لطفاً در توضیحات اقامتگاه به این نکته اشاره شده است.",
      },
      {
        title: "آیا پارکینگ در اقامتگاه‌ها وجود دارد؟",
        description:
          "بعضی از اقامتگاه‌ها پارکینگ دارند. در توضیحات هر اقامتگاه به طور مشخص اشاره شده است.",
      },
      {
        title: "چگونه هزینه اقامتگاه را پرداخت کنم؟",
        description:
          "هزینه اقامتگاه را می‌توانید از طریق درگاه‌های پرداخت آنلاین معتبر پرداخت کنید.",
      },
      {
        title: "چگونه با مشکل پیش‌آمده در اقامتگاه برخورد کنم؟",
        description:
          "در صورت بروز هرگونه مشکل در اقامتگاه، با پشتیبانی ما تماس بگیرید تا به سرعت مشکل شما حل شود.",
      },
    ],
  },
  {
    id: 5,
    title: "درباره جایاب",
    child: [
      {
        title: "چگونه حساب کاربری بسازم؟5",
        description:
          "برای ساخت حساب کاربری، به صفحه ثبت‌نام بروید و اطلاعات مورد نیاز خود را وارد کنید.",
      },
      {
        title: "چگونه وارد حساب کاربری شوم؟",
        description:
          "برای ورود به حساب کاربری خود، کافی است نام کاربری و رمز عبور خود را وارد کنید.",
      },
      {
        title: "چگونه اطلاعات حساب کاربری را به‌روز کنم؟",
        description:
          "برای به‌روز رسانی اطلاعات حساب، به بخش تنظیمات حساب کاربری رفته و تغییرات مورد نظر را اعمال کنید.",
      },
      {
        title: "چگونه رزرو اقامتگاه انجام دهم؟",
        description:
          "برای رزرو اقامتگاه، به صفحه اقامتگاه‌ها بروید و پس از انتخاب اقامتگاه، تاریخ‌ها و اطلاعات خود را وارد کنید.",
      },
      {
        title: "آیا امکان لغو رزرو وجود دارد؟",
        description:
          "بله، شما می‌توانید رزرو خود را لغو کنید، اما بسته به شرایط لغو، هزینه‌هایی ممکن است اعمال شود.",
      },
      {
        title: "چگونه با پشتیبانی تماس بگیرم؟",
        description:
          'برای تماس با پشتیبانی، به صفحه "تماس با ما" مراجعه کنید و فرم تماس را تکمیل کنید یا از شماره تلفن‌های پشتیبانی استفاده کنید.',
      },
      {
        title: "آیا اقامتگاه‌ها دارای اینترنت هستند؟",
        description:
          "بیشتر اقامتگاه‌ها اینترنت وای‌فای دارند. برای اطمینان، لطفاً در توضیحات اقامتگاه به این نکته اشاره شده است.",
      },
      {
        title: "آیا پارکینگ در اقامتگاه‌ها وجود دارد؟",
        description:
          "بعضی از اقامتگاه‌ها پارکینگ دارند. در توضیحات هر اقامتگاه به طور مشخص اشاره شده است.",
      },
      {
        title: "چگونه هزینه اقامتگاه را پرداخت کنم؟",
        description:
          "هزینه اقامتگاه را می‌توانید از طریق درگاه‌های پرداخت آنلاین معتبر پرداخت کنید.",
      },
      {
        title: "چگونه با مشکل پیش‌آمده در اقامتگاه برخورد کنم؟",
        description:
          "در صورت بروز هرگونه مشکل در اقامتگاه، با پشتیبانی ما تماس بگیرید تا به سرعت مشکل شما حل شود.",
      },
    ],
  },
];

function Faqs() {
  const [activeTab, setActiveTab] = useState<number>(1);
  const [values, setValues] = useState<ContactForm>({
    full_name: "",
    mobile: "",
    message: "",
  });

  const onChange = (value: string | number | null | number[], key: string) => {
    setValues((prevState) => ({ ...prevState, [key]: value }));
  };

  const handleTabClick = (index: number) => {
    setActiveTab(index);
  };

  return (
    <div className="h-auto container relative bg-red-900 !pt-12 flex flex-col items-center gap-20 !bg-transparent transition-all duration-500 ease-in-out">
      <section className="w-full relative flex flex-col gap-12">
        <header>
          <h4 className="text-2xl font-semibold">{_STRINGS.FAQ}</h4>
        </header>

        <div className="w-full overflow-x-auto">
          <div className="min-w-full flex flex-wrap sm:flex-nowrap items-center justify-between gap-2 sticky top-6">
            {faq_data.map((tab, tabIndex) => (
              <div
                key={tabIndex}
                className={`w-full md:w-1/5 inline-flex items-center justify-start gap-3 h-14 ${
                  activeTab === tabIndex
                    ? "bg-primary-700 text-white"
                    : "bg-primary-100 text-primary-700"
                } rounded-2xl px-6 cursor-pointer`}
                onClick={() => handleTabClick(tabIndex)}
              >
                {activeTab === tabIndex ? (
                  <img src="/assets/icons/shared/minus.svg" alt="" />
                ) : (
                  <img src="/assets/icons/shared/plus.svg" alt="" />
                )}
                <span className="text-sm text-nowrap">{tab.title}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          {faq_data.map((tab, tabIndex) => {
            const half = Math.ceil((tab.child?.length || 0) / 2);
            const firstHalf = tab.child?.slice(0, half) || [];
            const secondHalf = tab.child?.slice(half) || [];

            return (
              <div
                key={`tab-${tabIndex}`}
                className={`transition-all bg-white duration-500 ${
                  activeTab === tabIndex
                    ? "z-10 relative top-0 opacity-100"
                    : "absolute top-20 opacity-0"
                }
          ${activeTab === tabIndex ? "transform-y-10" : ""}
          `}
              >
                <div className="w-full grid lg:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-4">
                    {firstHalf.map((faq, faqIndex) => (
                      <Accordion key={faqIndex} title={faq.title}>
                        <p className="text-sm sm:text-base">
                          {faq.description}
                        </p>
                      </Accordion>
                    ))}
                  </div>
                  <div className="flex flex-col gap-4">
                    {secondHalf.map((faq, faqIndex) => (
                      <Accordion key={faqIndex} title={faq.title}>
                        <p className="text-[inherit] text-sm">
                          {faq.description}
                        </p>
                      </Accordion>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="w-full relative flex flex-col gap-12">
        <header>
          <h4 className="text-2xl font-semibold">پرسش و پاسخ</h4>
        </header>
        <div className="flex flex-col gap-6">
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="flex flex-col gap-6">
              <div>
                <FormInput
                  item={{
                    title: _STRINGS.ASSISTANT_NAME,
                    isMandatory: true,
                    containerClass: "w-full",
                    placeholder: "امیر علی عباسی فر",
                    value: values.full_name,
                  }}
                  onChangeText={(value) => onChange(value, "full_name")} // Pass the onChange function
                />
              </div>
              <div>
                <FormInput
                  item={{
                    title: _STRINGS.ASSISTANT_PHONE,
                    isMandatory: true,
                    containerClass: "w-full",
                    placeholder: "+989123456789",
                    value: values.mobile,
                  }}
                  onChangeText={(value) => onChange(value, "mobile")} // Pass the onChange function
                />
              </div>
            </div>
            <div>
              <MultiLineFormInput
                item={{
                  rows: 6,
                  containerClass: "!max-h-full",
                  title: _STRINGS.MESSAGE,
                  isMandatory: true,
                  placeholder: "توضیحات",
                  value: values.message,
                  onChangeText: (value) => onChange(value, "message"),
                }}
              />
            </div>
          </div>
          <div className="w-full flex lg:justify-end">
            <Button title={_STRINGS.SEND_AGAIN} width="!w-[300px]" />
          </div>
        </div>
      </section>

      <section className="w-full relative flex flex-col gap-12">
        <header className="w-full flex items-center justify-between">
          <h4 className="text-md font-semibold">{_STRINGS.USERS_FAQ}</h4>
          <Link href="#">همه سوالات</Link>
        </header>
        <div className="flex flex-col gap-6">
          <QuestionCard
            question="آیا امکان اجاره ویلا برای تعداد افراد بیشتر از ظرفیت اعلام شده وجود دارد؟"
            authorName="شهاب ساعدی"
            authorAvatar="/assets/images/avatar.png"
            date="1404/04/04"
            responseDate="1404/04/20"
            responseText="بله، سایت جایاب تلاش می‌کند ویلاهای ثبت‌شده را پیش از انتشار بررسی کند و تضمین می‌دهد تصاویر و توضیحات ارائه‌شده با واقعیت مطابقت داشته باشد. در صورت مغایرت، کاربران می‌توانند موضوع را به پشتیبانی گزارش دهند."
          />
        </div>
      </section>
    </div>
  );
}

export default Faqs;
