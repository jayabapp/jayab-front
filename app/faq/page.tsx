"use client";
import { useState } from "react";

import _STRINGS from "@/utils/LocalStrings";

import Accordion from "@/components/shared/Accordion";
import FormInput from "@/components/shared/Form/FormInput";
import MultiLineFormInput from "@/components/shared/Form/MultiLineFormInput";
import Button from "@/components/shared/Button/Button";
import { motion } from "framer-motion";

interface ContactForm {
  full_name: string;
  mobile: string;
  message: string;
}

interface FAQItem {
  title: string;
  description: string;
}

const FAQ1: FAQItem[] = [
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
];
const FAQ2: FAQItem[] = [
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
];
const FAQ3: FAQItem[] = [
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
];
const FAQ4: FAQItem[] = [
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
];
const FAQ5: FAQItem[] = [
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
];

function Faqs() {
  const [values, setValues] = useState<ContactForm>({
    full_name: "",
    mobile: "",
    message: "",
  });

  const onChange = (value: string | number | null | number[], key: string) => {
    setValues((prevState) => ({ ...prevState, [key]: value }));
  };

  const [activeTab, setActiveTab] = useState<number>(1); // 0 for "درباره جایاب", 1 for "رزرو اقامتگاه"

  const handleTabClick = (index: number) => {
    setActiveTab(index);
  };

  return (
    <div className="h-auto container relative bg-red-900 !pt-12 flex flex-col items-center gap-20 !bg-transparent transition-all duration-500 ease-in-out">
      <section className="w-full relative flex flex-col gap-12">
        <header>
          <h4 className="text-2xl font-semibold">سوالات متداول</h4>
        </header>
        <div className="w-full overflow-x-auto">
          <div className="min-w-full flex items-center justify-between gap-1 sticky top-6">
            {/* Tab item 1 */}
            <div
              className={`w-full inline-flex items-center justify-start gap-3 h-14 ${
                activeTab === 1
                  ? "bg-primary-700 text-white"
                  : "bg-primary-100 text-primary-700"
              } rounded-2xl px-6 cursor-pointer`}
              onClick={() => handleTabClick(1)}
            >
              <img src="/assets/icons/shared/minus.svg" alt="" />
              <span className="text-sm text-nowrap">درباره جایاب</span>
            </div>
            {/* Tab item 2 */}
            <div
              className={`w-full inline-flex items-center justify-start gap-3 h-14 ${
                activeTab === 2
                  ? "bg-primary-700 text-white"
                  : "bg-primary-100 text-primary-700"
              } rounded-2xl px-6 cursor-pointer`}
              onClick={() => handleTabClick(2)}
            >
              <img src="/assets/icons/shared/plus.svg" alt="" />
              <span className="text-sm text-nowrap">رزرو اقامتگاه</span>
            </div>

            {/* Tab item 3 */}
            <div
              className={`w-full inline-flex items-center justify-start gap-3 h-14 ${
                activeTab === 3
                  ? "bg-primary-700 text-white"
                  : "bg-primary-100 text-primary-700"
              } rounded-2xl px-6 cursor-pointer`}
              onClick={() => handleTabClick(3)}
            >
              <img src="/assets/icons/shared/plus.svg" alt="" />
              <span className="text-sm text-nowrap">رزرو اقامتگاه</span>
            </div>

            {/* Tab item 4*/}
            <div
              className={`w-full inline-flex items-center justify-start gap-3 h-14 ${
                activeTab === 4
                  ? "bg-primary-700 text-white"
                  : "bg-primary-100 text-primary-700"
              } rounded-2xl px-6 cursor-pointer`}
              onClick={() => handleTabClick(4)}
            >
              <img src="/assets/icons/shared/plus.svg" alt="" />
              <span className="text-sm text-nowrap">رزرو اقامتگاه</span>
            </div>

            {/* Tab item 5 */}
            <div
              className={`w-full inline-flex items-center justify-start gap-3 h-14 ${
                activeTab === 5
                  ? "bg-primary-700 text-white"
                  : "bg-primary-100 text-primary-700"
              } rounded-2xl px-6 cursor-pointer`}
              onClick={() => handleTabClick(5)}
            >
              <img src="/assets/icons/shared/plus.svg" alt="" />
              <span className="text-sm text-nowrap">رزرو اقامتگاه</span>
            </div>
          </div>
        </div>

        {/* Tab content 1 */}
        {activeTab === 1 && (
          <motion.div
            key="tab-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full grid lg:grid-cols-2 gap-4"
          >
            {FAQ1.map((item, index) => (
              <Accordion key={index} title={item.title}>
                <p className="text-[inherit] text-sm">{item.description}</p>
              </Accordion>
            ))}
          </motion.div>
        )}

        {/* Tab content 2 */}
        {activeTab === 2 && (
          <motion.div
            key="tab-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full grid lg:grid-cols-2 gap-4"
          >
            tab-2
            {FAQ2.map((item, index) => (
              <Accordion key={index} title={item.title}>
                <p className="text-[inherit] text-sm">{item.description}</p>
              </Accordion>
            ))}
          </motion.div>
        )}

        {/* Tab content 3 */}
        {activeTab === 3 && (
          <motion.div
            key="tab-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full grid lg:grid-cols-2 gap-4"
          >
            {FAQ3.map((item, index) => (
              <Accordion key={index} title={item.title}>
                <p className="text-[inherit] text-sm">{item.description}</p>
              </Accordion>
            ))}
          </motion.div>
        )}

        {/* Tab content 4 */}
        {activeTab === 4 && (
          <motion.div
            key="tab-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full grid lg:grid-cols-2 gap-4"
          >
            {FAQ4.map((item, index) => (
              <Accordion key={index} title={item.title}>
                <p className="text-[inherit] text-sm">{item.description}</p>
              </Accordion>
            ))}
          </motion.div>
        )}

        {/* Tab content 5 */}
        {activeTab === 5 && (
          <motion.div
            key="tab-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full grid lg:grid-cols-2 gap-4"
          >
            {FAQ5.map((item, index) => (
              <Accordion key={index} title={item.title}>
                <p className="text-[inherit] text-sm">{item.description}</p>
              </Accordion>
            ))}
          </motion.div>
        )}
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
        <header>
          <h4 className="text-md font-semibold">پرسش های کاربران</h4>
        </header>
        <div className="flex flex-col gap-6">
          <article
            className="flex flex-col gap-10 lg:gap-6 p-6 rounded-2xl"
            style={{ boxShadow: "0px 0px 10px 0px rgba(0, 0, 0, 0.15)" }}
          >
            <div className="flex flex-col lg:flex-row lg:items-center gap-2 lg:justify-between">
              <span>
                آیا امکان اجاره ویلا برای تعداد افراد بیشتر از ظرفیت اعلام شده
                وجود دارد؟
              </span>
              <div className="flex items-center gap-6">
                <span>شهاب ساعدی</span>
                <span>1404/04/04</span>
              </div>
            </div>

            <div className="flex flex-col gap-4 pr-6">
              <div className="flex items-center justify-between pb-5 border-b-2 border-[#E4E5E7]">
                <div className="flex items-center justify-between gap-3">
                  <div className="w-10 h-10 rounded-full">
                    <img
                      src="/assets/images/avatar.png"
                      alt=""
                      className="w-full h-full aspect-square object-cover"
                    />
                  </div>
                  <span className="text-primary-700 font-semibold">
                    ابراتور
                  </span>
                </div>
                <span>1404/04/۲۰</span>
              </div>
              <p>
                بله، سایت جایاب تلاش می‌کند ویلاهای ثبت‌شده را پیش از انتشار
                بررسی کند و تضمین می‌دهد تصاویر و توضیحات ارائه‌شده با واقعیت
                مطابقت داشته باشد. در صورت مغایرت، کاربران می‌توانند موضوع را به
                پشتیبانی گزارش دهند.
              </p>
            </div>
          </article>
        </div>
      </section>
    </div>
  );
}

export default Faqs;
