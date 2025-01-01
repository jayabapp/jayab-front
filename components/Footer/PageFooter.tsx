"use client";
import React from "react";
import Image from "next/image";

import _STRINGS from "@/utils/LocalStrings";
import Button from "@/components/shared/Button/Button";

// import FooterCTAImage from "/images/footer/pngtree-modern-villa-icon-png-image_12449822 1.png";

import { usePathname, useRouter } from "next/navigation";
// import _STRINGS from "@/utils/LocalStrings";
// import { useQuery } from "@tanstack/react-query";
// import { UserService } from "@/api_services/user/user.service";

interface PageFooterProps {
    title?: string;
    containerClass?: string;
    disableBack?: boolean;
    disableBell?: boolean;
    customeBackRoute?: string;
    customeBackFunc?: () => void | null;
    children?: React.ReactNode; // Add children prop
}

const PageFooter: React.FC<PageFooterProps> = ({
    title,
    containerClass,
    disableBack,
    disableBell,
    customeBackRoute,
    customeBackFunc,
    children,
}) => {
    const FooterCTA = () => (
        <div className="w-full flex flex-col lg:flex-row items-center justify-between gap-8 min-h-20 bg-[#3886E5] text-white rounded-2xl px-5 xl:px-8 py-6">
            <Image
                alt="footer image"
                src="/assets/images/footer/pngtree-modern-villa-icon-png-image_12449822 1.png"
                width={278}
                height={234}
                className="relative -mt-20 w-[166px] xl:w-[278px] h-auto"
            />
            <div className="flex flex-col gap-2">
                <h6 className="text-xl lg:text-2xl text-center xl:text-start font-semibold">
                    درآمدزایی با اقامتگاه شما شروع می‌شود!
                </h6>
                <p className="text-sm md:text-base">
                    اگر اقامتگاهی دارید، زمان آن رسیده که از آن درآمد کسب کنید!
                    با جایاب، اقامتگاه خود را به هزاران مسافر معرفی کنید و به
                    راحتی تقویم رزرو خود را مدیریت کنید. ثبت‌نام آسان، پشتیبانی
                    24/7، و پرداخت‌های ایمن در انتظار شماست. همین حالا به
                    خانواده میزبانان جایاب بپیوندید و از امکانات ویژه ما
                    بهره‌مند شوید!
                </p>
            </div>
            <div>
                <Button
                    color="light"
                    roundedClass="rounded-full"
                    title={_STRINGS.BE_HOST}
                    containerClass="text-nowrap"
                    width="w-[185px] h-10 inline-flex items-center justify-center"
                />
            </div>
        </div>
    );

    const FooterWidgets = () => {
        const menuItems = [
            {
                text: "مقالات ",
                href: "#",
            },
            {
                text: "سوالات متداول",
                href: "#",
            },
            {
                text: "درباره ما",
                href: "#",
            },
            {
                text: "قوانین و مقررات",
                href: "#",
            },
            {
                text: "تماس با ما",
                href: "#",
            },
        ];

        return (
            <div className="flex flex-col lg:flex-row items-start justify-between gap-6 py-20">
                <article className="lg:w-[347px] flex flex-col gap-6">
                    <Image
                        alt=""
                        src="/assets/images/shared/Frame 1000003912.png"
                        width={116}
                        height={36}
                    />
                    <p
                        className="text-sm md:text-base"
                        style={{ textJustify: "auto" }}
                    >
                        جایاب پلتفرم پیشرفته‌ای است که شما را به راحت‌ترین روش
                        ممکن به اقامتگاه‌های رویایی متصل می‌کند. از ویلاهای لوکس
                        در دل طبیعت تا سوئیت‌های دنج در دل شهر، جایاب تمام
                        گزینه‌ها را برای شما فراهم کرده تا هر نوع سفر یا
                        تعطیلاتی که در نظر دارید، با کمترین زمان و هزینه ممکن
                        برنامه‌ریزی کنید.
                    </p>
                    <ul className="flex items-center gap-5 list-none p-0 m-0">
                        <li>
                            <a href="#">
                                <Image
                                    alt=""
                                    src="/assets/icons/socials/Vector.svg"
                                    width={40}
                                    height={40}
                                />
                            </a>
                        </li>
                        <li>
                            <a href="#">
                                <Image
                                    alt=""
                                    src="/assets/icons/socials/Vector (1).svg"
                                    width={40}
                                    height={40}
                                />
                            </a>
                        </li>
                        <li>
                            <a href="#">
                                <Image
                                    alt=""
                                    src="/assets/icons/socials/Vector (2).svg"
                                    width={40}
                                    height={40}
                                />
                            </a>
                        </li>
                        <li>
                            <a href="#">
                                <Image
                                    alt=""
                                    src="/assets/icons/socials/Vector (3).svg"
                                    width={40}
                                    height={40}
                                />
                            </a>
                        </li>
                    </ul>
                </article>
                <article className="xl:w-[137px]">
                    <ul className="list-none p-0 m-0 flex flex-col gap-2">
                        {menuItems.map((item, index) => (
                            <li
                                key={index}
                                className="before:w-2 before:h-2 before:inline-flex before:rounded-full before:border-2 before:border-[#3886E5] before:me-4"
                            >
                                <a href={item.href}>
                                    <span>{item.text}</span>
                                </a>
                            </li>
                        ))}
                    </ul>
                </article>
                <article className="xl:w-[270px]">
                    <ul className="list-none p-0 m-0 flex flex-col gap-3">
                        <li className="flex items-start gap-4">
                            <Image
                                alt=""
                                src="/assets/icons/footer/Vector (4).svg"
                                width={24}
                                height={24}
                            />
                            <div className="inline-flex gap-6">
                                <span>021-36278068</span>
                                <span>021-36278068</span>
                            </div>
                        </li>
                        <li className="flex items-start gap-4">
                            <Image
                                alt=""
                                src="/assets/icons/footer/EnvelopeOpen.svg"
                                width={26}
                                height={26}
                            />
                            <p>zhepeto@gmail.com</p>
                        </li>
                        <li className="flex items-start gap-4 pt-1">
                            <Image
                                alt=""
                                src="/assets/icons/footer/Vector (5).svg"
                                width={30}
                                height={30}
                            />
                            <p>
                                خیابان ولیعصر، نرسیده به میدان ونک، خیابان
                                خدامی، پلاک ۱۲
                            </p>
                        </li>
                    </ul>
                </article>
            </div>
        );
    };

    const FooterBottom = () => (
        <>
            <div
                className="flex flex-col lg:flex-row items-center justify-between gap-6 bg-white p-6 rounded-2xl"
                style={{ boxShadow: "0px 10px 10px -7px rgba(0, 0, 0, 0.15)" }}
            >
                <p className="hidden lg:block">
                    تمامی حقوق مادی و معنوی این وبسایت متعلق به شرکت جایاب
                    میباشد.
                </p>
                <div className="flex items-center justify-center gap-6">
                    <ul className="list-none p-0 m-0 flex items-center justify-center gap-2">
                        <li>
                            <a href="#">
                                <Image
                                    alt=""
                                    src="/assets/images/footer/samandehi 1.jpg"
                                    width={42}
                                    height={56}
                                />
                            </a>
                        </li>
                        <li>
                            <a href="#">
                                <Image
                                    alt=""
                                    src="/assets/images/footer/enamad_icon__text_color_blue_1024-300x300 1.svg"
                                    width={60}
                                    height={60}
                                />
                            </a>
                        </li>
                    </ul>
                </div>
                <div className="flex items-center gap-6">
                    <ul className="list-none p-0 m-0 flex items-center gap-4">
                        <li>
                            <a href="#">
                                <Image
                                    alt=""
                                    src="/assets/images/footer/cafebazzar.png"
                                    width={120}
                                    height={40}
                                />
                            </a>
                        </li>
                        <li>
                            <a href="#">
                                <Image
                                    alt=""
                                    src="/assets/images/footer/myket.png"
                                    width={120}
                                    height={40}
                                />
                            </a>
                        </li>
                        <li>
                            <a href="#">
                                <Image
                                    alt=""
                                    src="/assets/images/footer/cafebazzar.png"
                                    width={120}
                                    height={40}
                                />
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
            <p className="block lg:hidden pt-6 text-center">
                تمامی حقوق مادی و معنوی این وبسایت متعلق به شرکت جایاب میباشد.
            </p>
        </>
    );

    return (
        <footer className="w-full relative z-0">
            <div className="w-full relative before:bg-[#E4E5E7] before:w-full before:inset-0 before:absolute before:top-20">
                <div className="w-full container-lg mx-auto relative z-10 pb-28">
                    <FooterCTA />
                    <FooterWidgets />
                    <FooterBottom />
                </div>
            </div>
        </footer>
    );
};

export default PageFooter;
