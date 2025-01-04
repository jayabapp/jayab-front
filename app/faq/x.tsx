"use client";
import { useState } from "react";


import _STRINGS from "@/utils/LocalStrings";


import Accordion from "@/components/shared/Accordion";
import FormInput from "@/components/shared/Form/FormInput";
import MultiLineFormInput from "@/components/shared/Form/MultiLineFormInput";
import Button from "@/components/shared/Button/Button";


const FAQ = [
 {
   title: "چگونه می‌توانم ثبت‌نام کنم؟",
   description:
     "بله، امکان لغو رزرو ویلا وجود دارد، اما شرایط و هزینه‌های مربوط به لغو رزرو به قوانین اعلام‌شده توسط صاحب ویلا بستگی دارد. در زمان رزرو، اطلاعات مربوط به سیاست‌های لغو به شما نمایش داده می‌شود. در صورتی که درخواست لغو داشته باشید، باید از طریق پنل کاربری خود اقدام کنید.",
 },
 {
   title: "هزینه خدمات چقدر است؟",
   description:
     "هزینه خدمات بسته به نوع سرویس انتخابی شما متفاوت است. برای اطلاع از تعرفه‌ها، به صفحه تعرفه‌ها مراجعه کنید.",
 },
 {
   title: "چگونه با پشتیبانی تماس بگیرم؟",
   description:
     "برای تماس با پشتیبانی، می‌توانید از طریق فرم تماس در وب‌سایت یا شماره تلفن درج شده با ما ارتباط برقرار کنید.",
 },
 {
   title: "زمان پاسخگویی چقدر است؟",
   description: "زمان پاسخگویی معمولاً بین ۲۴ تا ۴۸ ساعت کاری است.",
 },
 {
   title: "آیا امکان لغو سرویس وجود دارد؟",
   description:
     "بله، شما می‌توانید سرویس خود را از طریق پنل کاربری لغو کنید یا با پشتیبانی تماس بگیرید.",
 },
];


interface ContactForm {
 full_name: string;
 mobile: string;
 message: string;
}


function Faq() {
 const [values, setValues] = useState<ContactForm>({
   full_name: "",
   mobile: "",
   message: "",
 });


 const onChange = (value: string | number | null | number[], key: string) => {
   setValues((prevState) => ({ ...prevState, [key]: value }));
 };


 return (
   <div className="h-auto container relative bg-red-900 !pt-12 flex flex-col items-center gap-20 !bg-transparent transition-all duration-500 ease-in-out">


<section className="w-full relative flex flex-col gap-12">
        <header>
          <h4 className="text-2xl font-semibold">سوالات متداول</h4>
        </header>
        <div className="w-full overflow-x-auto">
          <div className="min-w-max flex items-center justify-between gap-1 sticky top-6">
            <div className="w-max inline-flex items-center justify-start gap-3 h-14 bg-primary-700 text-white rounded-2xl px-6">
              <img src="/assets/icons/shared/minus.svg" alt="" />
              <span className="text-sm text-nowrap">درباره جایاب</span>
            </div>
            <div className="w-max inline-flex items-center justify-start gap-3 h-14 bg-primary-100 text-primary-700 rounded-2xl px-6">
              <img src="/assets/icons/shared/plus.svg" alt="" />
              <span className="text-sm text-nowrap">رزرو اقامتگاه</span>
            </div>
            <div className="w-max inline-flex items-center justify-start gap-3 h-14 bg-primary-100 text-primary-700 rounded-2xl px-6">
              <img src="/assets/icons/shared/plus.svg" alt="" />
              <span className="text-sm text-nowrap">پرداخت‌ها و هزینه‌ها</span>
            </div>
            <div className="w-max inline-flex items-center justify-start gap-3 h-14 bg-primary-100 text-primary-700 rounded-2xl px-6">
              <img src="/assets/icons/shared/plus.svg" alt="" />
              <span className="text-sm text-nowrap">مسئولیت‌ها و قوانین</span>
            </div>
            <div className="w-max inline-flex items-center justify-start gap-3 h-14 bg-primary-100 text-primary-700 rounded-2xl px-6">
              <img src="/assets/icons/shared/plus.svg" alt="" />
              <span className="text-sm text-nowrap">پشتیبانی</span>
            </div>
          </div>
        </div>

        <div className="w-full grid lg:grid-cols-2 gap-4">
          <div className="flex flex-col gap-4">
            {FAQ.map((item, index) => (
              <Accordion key={index} title={item.title}>
                <p className="text-[inherit] text-sm">{item.description}</p>
              </Accordion>
            ))}
          </div>
          <div className="flex flex-col gap-4">
            {FAQ.map((item, index) => (
              <Accordion key={index} title={item.title}>
                <p className="text-[inherit] text-sm">{item.description}</p>
              </Accordion>
            ))}
          </div>
          <div className="flex flex-col gap-4">
            {FAQ.map((item, index) => (
              <Accordion key={index} title={item.title}>
                <p className="text-[inherit] text-sm">{item.description}</p>
              </Accordion>
            ))}
          </div>
          <div className="flex flex-col gap-4">
            {FAQ.map((item, index) => (
              <Accordion key={index} title={item.title}>
                <p className="text-[inherit] text-sm">{item.description}</p>
              </Accordion>
            ))}
          </div>
        </div>
      </section>
     <section className="w-full relative flex flex-col gap-12">
       <header>
         <h4 className="text-2xl font-semibold">سوالات متداول</h4>
       </header>


       <div className="w-full grid lg:grid-cols-2 gap-4 ">
         {FAQ.map((item, index) => (
           <Accordion key={index} title={item.title}>
             <p className="text-[inherit] text-sm">{item.description}</p>
           </Accordion>
         ))}
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
                 <span>ابراتور</span>
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


export default Faq;



