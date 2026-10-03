import { useState, useEffect, useRef } from "react";
import { motion, useInView, useScroll, useTransform, AnimatePresence } from "framer-motion";
import CooperativeForm from "./components/CooperativeForm";

const assetPathPrefix = "/assets/webp";
const contactFormHref = "#contact-form";
const imgLogo = `${assetPathPrefix}/c8ef2.webp`;
const imgService1 = `${assetPathPrefix}/e71ce.webp`;
const imgService2 = `${assetPathPrefix}/6b196.webp`;
const imgService3 = `${assetPathPrefix}/957cc.webp`;
const imgService4 = `${assetPathPrefix}/7bb54.webp`;
const imgProb1 = `${assetPathPrefix}/26db6.webp`;
const imgProb2 = `${assetPathPrefix}/4ef66.webp`;
const imgProb3 = `${assetPathPrefix}/18d77.webp`;
const imgProb4 = `${assetPathPrefix}/40079.webp`;
const imgHeroLeft1 = `${assetPathPrefix}/3eca1.webp`;
const imgHeroLeft2 = `${assetPathPrefix}/b22a0.webp`;
const imgHeroLeft3 = `${assetPathPrefix}/a7498.webp`;


const ease = [0.22, 1, 0.36, 1] as const;

function useScrolled(threshold = 50) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > threshold);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, [threshold]);
  return scrolled;
}

type RevealProps = {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  from?: "up" | "down" | "left" | "right" | "scale";
};

function Reveal({ children, delay = 0, className = "", from = "up" }: RevealProps) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  const variants = {
    up:    { hidden: { opacity: 0, y: 40 },      visible: { opacity: 1, y: 0 } },
    down:  { hidden: { opacity: 0, y: -40 },     visible: { opacity: 1, y: 0 } },
    left:  { hidden: { opacity: 0, x: -50 },     visible: { opacity: 1, x: 0 } },
    right: { hidden: { opacity: 0, x: 50 },      visible: { opacity: 1, x: 0 } },
    scale: { hidden: { opacity: 0, scale: 0.88 }, visible: { opacity: 1, scale: 1 } },
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      variants={variants[from]}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      transition={{ duration: 0.65, delay, ease }}
    >
      {children}
    </motion.div>
  );
}

/* Stagger wrapper — children animate in sequence */
function StaggerGroup({ children, className = "", stagger = 0.1 }: { children: React.ReactNode; className?: string; stagger?: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={{ visible: { transition: { staggerChildren: stagger } } }}
    >
      {children}
    </motion.div>
  );
}

function StaggerItem({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      className={className}
      variants={{
        hidden:  { opacity: 0, y: 36 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease } },
      }}
    >
      {children}
    </motion.div>
  );
}

/* Keep FadeUp as alias so existing callsites still work */
function FadeUp({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  return <Reveal from="up" delay={delay} className={className}>{children}</Reveal>;
}

function LazyImage({ eager = false, ...props }: React.ImgHTMLAttributes<HTMLImageElement> & { eager?: boolean }) {
  return <img {...props} loading={eager ? "eager" : "lazy"} decoding="async" />;
}

export default function App() {
  const scrolled = useScrolled();
  const [menuOpen, setMenuOpen] = useState(false);
  const pendingMobileNavigation = useRef<HTMLElement | null>(null);
  const heroRef = useRef(null);
  const { scrollYProgress: heroScroll } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroBgY = useTransform(heroScroll, [0, 1], ["0%", "25%"]);

  function handleNavClick(event: React.MouseEvent<HTMLAnchorElement>, href: string) {
    const target = document.getElementById(href.slice(1));
    if (!target) return;

    event.preventDefault();
    pendingMobileNavigation.current = target;
    window.history.pushState(null, "", href);
    setMenuOpen(false);
  }

  const navLinks = [
    { label: "الرئيسية", href: "#home" },
    { label: "التحديات", href: "#challenges" },
    { label: "حلولنا", href: "#solutions" },
    { label: "رحلة النمو", href: "#growth" },
    { label: "كيف نعمل معًا؟", href: "#process" },
  ];

  const footerLinks = [
  { label: "الرئيسية", href: "#home" },
  { label: "التحديات", href: "#challenges" },
  { label: "حلولنا", href: "#solutions" },
  { label: "رحلة النمو", href: "#growth" },
  { label: "كيف نعمل معًا؟", href: "#process" },
];

  return (
    <div className="bg-white min-h-screen w-full overflow-x-hidden" dir="rtl">
      {/* Navbar */}
      <header
        className={`fixed top-0 right-0 left-0 z-50 transition-all duration-300 ${scrolled ? "bg-white shadow-lg py-2" : "bg-white py-3"}`}
      >
        <div className="max-w-[1200px] mx-auto px-6 flex items-center justify-between">
          <a
            href={contactFormHref}
            className="bg-[#45238f] text-white px-3 py-1 text-[14px] sm:px-6 sm:py-2 sm:text-[18px] rounded-[25px] font-ibm-plex-arabic whitespace-nowrap transition-all duration-200 hover:scale-105 hover:bg-[#5a2fb5] active:scale-95"
          >
            إحجز إستشارتك الآن
          </a>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-7 text-[16px] font-ibm-plex-arabic">
            {navLinks.map((link, i) => (
              <span key={i} className="flex items-center">
                <a
                  href={link.href}
                  className={`transition-colors duration-200 hover:text-[#45238f] relative group ${
                    link.label === "رحلة النمو" ? "text-[#caa320]" : "text-[#333]"
                  }`}
                >
                  {link.label}

                  <span className="absolute bottom-0 right-0 w-0 h-[1px] bg-[#45238f] group-hover:w-full transition-all duration-300" />
                </a>
              </span>
            ))}
          </nav>
                    

          {/* Logo */}
          <div className="relative w-[120px] h-[56px] md:w-[180px] md:h-[72px] shrink-0 overflow-hidden">
            <LazyImage eager src={imgLogo} alt="تعاونيتي" className="absolute inset-0 w-full h-full object-cover" />
          </div>

          {/* Mobile hamburger */}
          <button
            className="lg:hidden p-2 text-[#45238f]"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="القائمة"
          >
            <span className="block w-6 h-0.5 bg-current mb-1.5 transition-all" />
            <span className="block w-6 h-0.5 bg-current mb-1.5 transition-all" />
            <span className="block w-6 h-0.5 bg-current transition-all" />
          </button>
        </div>

        {/* Mobile menu */}
        <AnimatePresence
          onExitComplete={() => {
            const target = pendingMobileNavigation.current;
            pendingMobileNavigation.current = null;
            target?.scrollIntoView({ behavior: "smooth", block: "start" });
          }}
        >
          {menuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="lg:hidden overflow-hidden bg-white border-t border-[#e7e0f2]"
            >
              <div className="px-6 py-4 flex flex-col gap-3">
                {navLinks.map((link, i) => (
                  <a
                    key={i}
                    href={link.href}
                    onClick={(event) => handleNavClick(event, link.href)}
                    className={`text-[18px] font-ibm-plex-arabic py-1 border-b border-[#f0edf8] ${link.label === "رحلة النمو" ? "text-[#caa320]" : "text-[#333]"}`}
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Hero Section */}
      <section id="home" ref={heroRef} className="scroll-mt-28 bg-white pt-[80px] md:pt-[96px]">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-16 pt-20 pb-16 lg:pb-24 flex flex-col-reverse lg:flex-row-reverse items-center lg:items-start gap-12 lg:gap-8">

          {/* LEFT — product images collage */}
          <div className="relative self-start translate-x-14 h-[430px] w-full max-w-[520px] shrink-0 sm:translate-x-0 sm:h-[490px] lg:self-auto lg:translate-x-0 lg:h-[600px] lg:w-[42%] lg:max-w-none lg:-translate-y-12 lg:pt-20">
            {/* Tall arch — honey jar */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.25 }}
              className="absolute left-[37%] top-0 h-[270px] w-[170px] sm:left-[32%] sm:h-[280px] sm:w-[170px]  md:left-[32%] md:h-[300px] md:w-[180px] lg:left-[35%] lg:h-[330px] lg:w-[200px]"
            >
              <LazyImage
                eager
                src={imgHeroLeft2}
                alt="جرة عسل مغربي"
                className="w-full h-full object-cover rounded-tl-[130px] rounded-tr-[130px] rounded-br-[80px] shadow-2xl"
              />
            </motion.div>

            {/* Circle — argan oil bottles */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.45 }}
              className="absolute left-[20%] top-[280px] h-[180px] w-[180px] sm:left-[26%] sm:top-[285px] sm:h-[180px] sm:w-[180px] lg:top-[340px] lg:h-[200px] lg:w-[200px]"
            >
              <LazyImage
                eager
                src={imgHeroLeft1}
                alt="قوارير زيت الأركان"
                className="w-full h-full object-cover rounded-tl-[130px] rounded-tr-[130px] rounded-br-[130px] shadow-2xl"
              />
            </motion.div>

            {/* Tall arch — saffron */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="absolute left-[0.1%] top-[35px] h-[240px] w-[135px] sm:left-[2%] sm:top-[60px] sm:h-[240px] sm:w-[150px] lg:top-[80px] lg:h-[260px] lg:w-[160px]"
            >
              <LazyImage
                eager
                src={imgHeroLeft3}
                alt="منتجات الزعفران المغربي"
                className="w-full h-full object-cover rounded-tl-[130px] rounded-tr-[130px] rounded-bl-[80px] shadow-2xl"
              />
            </motion.div>
          </div>

          {/* RIGHT — text + CTAs */}
          <div className="flex-1 text-right flex flex-col gap-6">
            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="font-ibm-plex-arabic text-[#caa320] text-[18px]"
            >
              تعاونيتي
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="font-zain-title text-[#1f1f1f] text-[40px] md:text-[52px] lg:text-[52px] leading-[1.35]"
            >
              من تعاونية محلية إلى{" "}
              <span className="text-[#45238f]">علامة تجارية</span>{" "}
              يعرفها ويثق بها المزيد من الزبناء.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35 }}
              className="font-ibm-plex-arabic text-[#5e5274] text-[17px] md:text-[15px] leading-[1.7] max-w-[500px] mr-0 ml-auto lg:ml-0"
            >
              نساعد التعاونيات المغربية على تطوير حضورها الرقمي،
              الوصول لزبناء جدد وتحويل منتجاتها المحلية إلى فرص بيع حقيقية.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex flex-wrap gap-4 justify-start"
            >
              {/* Primary CTA */}
              <a href={contactFormHref} className="inline-flex items-center justify-center bg-[#caa320] text-white px-8 py-3.5 rounded-[100px] text-[18px] font-ibm-plex-arabic shadow-md transition-all duration-200 hover:scale-105 hover:brightness-110 active:scale-95">
                طوّر تعاونيتك الآن
              </a>
              {/* Ghost CTA */}
              <a href={contactFormHref} className="inline-flex items-center justify-center border-[1.5px] border-[#45238f] text-[#45238f] bg-transparent px-8 py-3.5 rounded-[100px] text-[18px] font-ibm-plex-arabic transition-all duration-200 hover:scale-105 hover:bg-[#45238f]/6 active:scale-95">
                اكتشف كيف نساعدك
              </a>
            </motion.div>
          </div>

        </div>
      </section>

      {/* Problem Section */}
      <section id="challenges" className="scroll-mt-28 bg-[rgba(245,241,233,0.29)] px-6 py-20">
        <div className="max-w-[1440px] mx-auto">
          <FadeUp className="text-center mb-12">
            <h2 className="font-zain-title text-[#45238f] text-[32px] md:text-[40px] mb-3">
              منتجك رائع، لكن هل يصل إلى الناس؟
            </h2>
            <p className="font-ibm-plex-arabic text-[#5e5274] text-[16px] md:text-[18px] max-w-[800px] mx-auto leading-relaxed">
              جودة المنتج المغربي التقليدي فريدة من نوعها، ولكنها تحتاج إلى الحضور المناسب على الشاشات الحديثة لتتحول لمبيعات مستمرة.
            </p>
          </FadeUp>

          <StaggerGroup className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" stagger={0.12}>
            {[
              { img: imgProb1, label: "غياب الحضور الرقمي", size: "w-[66px] h-[66px]" },
              { img: imgProb2, label: "تغليف وهوية بصرية متواضعة", size: "w-[70px] h-[70px]" },
              { img: imgProb3, label: "التبعية للوسطاء الموسميين", size: "w-[96px] h-[96px]" },
              { img: imgProb4, label: "محيط تسويقي محلي وضيق", size: "w-[83px] h-[83px]" },
            ].map((card, i) => (
              <StaggerItem key={i}>
                <div className="bg-white border border-[#e2dcef] rounded-[16px] shadow-[0px_8px_14px_rgba(0,0,0,0.18)] h-[250px] flex flex-col items-center justify-center gap-5 transition-all duration-300 hover:shadow-[0px_16px_28px_rgba(0,0,0,0.22)] hover:scale-[1.02] cursor-pointer">
                  <LazyImage src={card.img} alt="" className={`${card.size} object-contain`} />
                  <p className="font-ibm-plex-arabic text-[#1d1330] text-[20px] md:text-[22px] text-center px-4 leading-snug">
                    {card.label}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>
      </section>

      {/* Transformation Section */}
      <section className="bg-[#fefefe] px-6 py-20">
        <div className="max-w-[1440px] mx-auto flex flex-col-reverse lg:flex-row-reverse gap-12 items-start">
          {/* Outcomes grid */}
          <Reveal from="left" className="w-full lg:w-[55%]">
            <StaggerGroup className="grid grid-cols-1 sm:grid-cols-2 gap-6" stagger={0.1}>
              {[
                { title: "طلبات مستمرة طيلة السنة", body: "الخروج من دوامة المعارض الموسمية وتحقيق دورة مبيعات مستقرة ومستمرة كل شهر عبر قنوات لوجستية رقمية ميسرة وموثوقة." },
                { title: "ثقة كاملة ومصداقية تجارية", body: "تصفح الزبناء لكتالوجك الرقمي الأنيق يعطيهم انطباعاً فورياً بالمهنية والالتزام بمعايير الجودة العالية للمغرب الحديث." },
                { title: "وصول جغرافي وطني واسع", body: "إمكانية إيصال منتجات الزعفران، أركان، أو العسل الحر لكل بيت ومطبخ في ربوع المملكة، وفتح باب التصدير والبيع بالجملة." },
                { title: "بيع مباشر بهامش ربح كامل", body: "الاستغناء عن الوسطاء الذين يستحوذون على الحصة الأكبر، وحصول تعاونيتك والعاملين فيها على القيمة المادية الكاملة لجهدهم العريق." },
              ].map((card, i) => (
                <StaggerItem key={i}>
                  <div className="bg-[#6b50b0] rounded-[16px] p-7 flex flex-col gap-3 items-start h-full transition-all duration-300 hover:shadow-[0px_12px_28px_rgba(107,80,176,0.3)] hover:scale-[1.02] cursor-pointer">
                    <p className="font-ibm-plex-arabic text-[#caa320] text-[18px] md:text-[20px] whitespace-nowrap">
                      {card.title}
                    </p>
                    <p className="font-ibm-plex-arabic text-[#faf8ff] text-[14px] md:text-[15px] leading-[1.5] text-right">
                      {card.body}
                    </p>
                  </div>
                </StaggerItem>
              ))}
            </StaggerGroup>
          </Reveal>

          {/* Text block */}
          <Reveal from="right" delay={0.1} className="w-full lg:w-[40%] flex flex-col gap-6 items-start pt-4">
            <p className="font-ibm-plex-arabic text-[#caa320] text-[18px] whitespace-nowrap">
              النقلة والتحول الرقمي
            </p>
            <h2 className="font-zain-title text-[#45238f] text-[32px] md:text-[40px] leading-[1.2] text-right">
              ماذا يتغير عندما تتمتع تعاونيتك بحضور رقمي احترافي؟
            </h2>
            <p className="font-ibm-plex-arabic text-[#745ead] text-[16px] md:text-[18px] leading-[1.5] text-right opacity-80">
              التحول الرقمي ليس مجرد رفاهية، بل هو شريان الحياة الجديد لتعاونيات الإنتاج الحرفي والغذائي المغربي للاستمرار والازدهار والنمو العادل.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Services Section */}
      <section id="solutions" className="scroll-mt-28 bg-white px-6 py-20">
        <div className="max-w-[1440px] mx-auto">
          <FadeUp className="text-center mb-14 flex flex-col gap-4 items-center">
            <p className="font-zain-title text-[#caa320] text-[40px] md:text-[48px] tracking-[1.92px]">
              خدماتنا
            </p>
            <h2 className="font-zain-title text-[#45238f] text-[32px] md:text-[48px] leading-[1.2] max-w-[800px]">
              كل ما تحتاجه تعاونيتك لتنمو في العالم الرقمي
            </h2>
            <p className="font-ibm-plex-arabic text-[rgba(69,35,143,0.31)] text-[16px] md:text-[18px] max-w-[850px] leading-[1.6]">
              نرافق تعاونيتك من بناء هويتها الرقمية إلى الوصول إلى زبناء جدد، ونساعدك على تقديم منتجاتك بشكل احترافي وتطوير حضورك الرقمي.
            </p>
          </FadeUp>

          <StaggerGroup className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12" stagger={0.13}>
            {[
              {
                img: imgService1, imgSize: "w-[140px] h-[140px]",
                title: "الهوية والعلامة التجارية",
                body: "نبني هوية بصرية قوية واحترافية تعكس أصالة تعاونيتك وتبرز قيمة منتجاتك.",
              },
              {
                img: imgService2, imgSize: "w-[116px] h-[116px]",
                title: "الموقع والمتجر الإلكتروني",
                body: "نصمم لك موقعاً احترافياً يعرض منتجاتك وقصة تعاونيتك، ويسهّل على الزبناء اكتشاف منتجاتك وطلبها عبر الإنترنت.",
              },
              {
                img: imgService3, imgSize: "w-[136px] h-[136px]",
                title: "التسويق الرقمي",
                body: "نساعدك على زيادة ظهور تعاونيتك والوصول إلى الجمهور المناسب من خلال استراتيجيات تسويق رقمي مناسبة لطبيعة نشاطك.",
              },
              {
                img: imgService4, imgSize: "w-[163px] h-[163px]",
                title: "المحتوى وصناعة الصورة",
                body: "نبرز منتجاتك من خلال صور وفيديوهات ومحتوى احترافي يحكي قصة تعاونيتك ويجذب اهتمام الزبناء.",
              },
            ].map((card, i) => (
              <StaggerItem key={i}>
                <div className="bg-white border border-[#e7e0f2] rounded-[20px] shadow-[0px_8px_14px_rgba(0,0,0,0.18)] p-6 flex flex-col items-center gap-4 h-[340px] transition-all duration-300 hover:shadow-[0px_16px_28px_rgba(0,0,0,0.22)] hover:scale-[1.02] cursor-pointer">
                  <div className="flex items-center justify-center h-[160px]">
                    <LazyImage src={card.img} alt="" className={`${card.imgSize} object-contain`} />
                  </div>
                  <div className="flex flex-col gap-3 items-center justify-center">
                    <p className="font-ibm-plex-arabic text-[#45238f] text-[20px] md:text-[22px] leading-[1.3]">
                      {card.title}
                    </p>
                    <p className="font-ibm-plex-arabic text-[rgba(69,35,143,0.31)] text-[14px] md:text-[15px] leading-[1.6] ">
                      {card.body}
                    </p>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerGroup>

          <FadeUp className="flex justify-center">
            <a href={contactFormHref} className="inline-flex items-center justify-center bg-[#d597e5] text-white px-10 py-3.5 rounded-[25px] text-[18px] md:text-[20px] font-ibm-plex-arabic font-black transition-all duration-200 hover:scale-105 hover:brightness-110 active:scale-95">
              لنطوّر تعاونيتك معاً ←
            </a>
          </FadeUp>
        </div>
      </section>

      {/* How We Work Section */}
      <section id="growth" className="scroll-mt-28 bg-[#f5f1e9] px-6 py-20">
        <div className="max-w-[1440px] mx-auto flex flex-col gap-12">
          <FadeUp className="flex flex-col gap-3 items-start">
            <p className="font-ibm-plex-arabic text-[#45238f] text-[18px] whitespace-nowrap">
              مسار العمل الممنهج
            </p>
            <h2 className="font-zain-title text-[#1d1330] text-[32px] md:text-[40px] text-right">
              من الفكرة إلى النمو المستدام، خطوة بخطوة.
            </h2>
            <p className="font-ibm-plex-arabic text-[#5e5274] text-[16px] md:text-[18px] text-right max-w-[800px]">
              منهجية علمية واضحة ومترابطة تضمن مرافقة حقيقية ونجاحاً ملموساً على أرض الواقع الرقمي.
            </p>
          </FadeUp>

          <div className="flex flex-col gap-6">
            <StaggerGroup className="grid grid-cols-1 md:grid-cols-3 gap-6" stagger={0.14}>
              {[
                { num: "01. التأسيس والولوج الرقمي", body: "إعداد بريد إلكتروني احترافي خاص بالتعاونية، تنظيم حسابات الواتساب وتأمين سائر الولوجيات لضمان حماية بياناتكم." },
                { num: "02. الهوية البصرية والقالب", body: "صياغة الشعار، اختيار لوحة ألوان دافئة، تحديد الخطوط الملائمة للقصة وحس التراث المغربي الخاص." },
                { num: "03. التجهيز الرقمي", body: "إنشاء قنوات التواصل الاحترافية، توثيق الموقع على خرائط جوجل، وتجهيز صفحات انستغرام وفيسبوك بشكل منسق." },
              ].map((step, i) => (
                <StaggerItem key={i}>
                  <div className="bg-white rounded-[16px] p-7 flex flex-col gap-3 items-start h-full transition-all duration-300 hover:shadow-[0px_8px_20px_rgba(0,0,0,0.12)] cursor-pointer">
                    <p className="font-ibm-plex-arabic text-[#caa320] text-[17px] whitespace-nowrap">{step.num}</p>
                    <p className="font-ibm-plex-arabic text-[#5e5274] text-[15px] md:text-[16px] text-right leading-[1.6]">{step.body}</p>
                  </div>
                </StaggerItem>
              ))}
            </StaggerGroup>
            <StaggerGroup className="grid grid-cols-1 md:grid-cols-3 gap-6" stagger={0.14}>
              {[
                { num: "04. صناعة المحتوى البصري", body: "جلسة تصوير للمنتجات تعكس قيمتها المادية، وتصوير فيديوهات قصيرة تروي كيفية التحضير اليدوي للأعشاب أو الزيوت." },
                { num: "05. تصميم المطبوعات والتعبئة", body: "إعداد وتصميم ملصقات المنتجات المخصصة للتعاونية، بطاقات الشكر، وأظرفة الشحن لتقديم انطباع راقي للزبناء." },
                { num: "06. إطلاق المبيعات والتتبع", body: "تفعيل الإعلانات المستهدفة، تتبع عمليات البيع والشحن اللوجستي، وتقديم استشارات أسبوعية للتحسين المستمر." },
              ].map((step, i) => (
                <StaggerItem key={i}>
                  <div className="bg-white rounded-[16px] p-7 flex flex-col gap-3 items-start h-full transition-all duration-300 hover:shadow-[0px_8px_20px_rgba(0,0,0,0.12)] cursor-pointer">
                    <p className="font-ibm-plex-arabic text-[#caa320] text-[17px] whitespace-nowrap">{step.num}</p>
                    <p className="font-ibm-plex-arabic text-[#5e5274] text-[15px] md:text-[16px] text-right leading-[1.6]">{step.body}</p>
                  </div>
                </StaggerItem>
              ))}
            </StaggerGroup>
          </div>
        </div>
      </section>

      {/* Onboarding Section */}
      <section id="process" className="scroll-mt-28 bg-white px-6 py-20">
        <div className="max-w-[1440px] mx-auto flex flex-col gap-14 items-center">
          <FadeUp className="flex flex-col gap-3 items-center text-center max-w-[700px]">
            <p className="font-ibm-plex-arabic text-[#caa320] text-[18px] whitespace-nowrap">
              خطوات البداية
            </p>
            <h2 className="font-zain-title text-[#45238f] text-[32px] md:text-[40px]">
              كيف نبدأ معاً؟
            </h2>
            <p className="font-ibm-plex-arabic text-[#5e5274] text-[16px] md:text-[18px] leading-relaxed">
              بخطوات مبسطة واضحة ومسار منظم لدعم تعاونيتك من مرحلة الاستماع إلى التنفيذ العملي.
            </p>
          </FadeUp>

          <StaggerGroup className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full" stagger={0.16}>
            {[
              { num: "01. جلسة التشخيص والدراسة", body: "نجلس سوياً لفهم أصالة تعاونيتكم، تحديد جودة ونطاق المنتجات، استيعاب تطلعاتكم والتحديات التي تواجهكم." },
              { num: "02. تقديم مقترح شامل", body: "نضع بين أيديكم خطة واضحة الأهداف، والآجال الزمنية والمقترحات المالية المتوازنة لضمان ثقة متبادلة." },
              { num: "03. الانطلاق اللوجستي", body: "نبدأ فوراً بتطبيق البند الأول من الهوية والتأسيس الرقمي وفتح قنوات التواصل مع إشراك فريقكم في كل خطوة." },
            ].map((card, i) => (
              <StaggerItem key={i}>
                <div className="bg-[#fcfaf6] border border-[#e2dcef] rounded-[20px] p-9 flex flex-col gap-4 items-start min-h-[200px] h-full transition-all duration-300 hover:shadow-[0px_10px_24px_rgba(0,0,0,0.12)] hover:scale-[1.02] cursor-pointer">
                  <p className="font-ibm-plex-arabic text-[#45238f] text-[20px] md:text-[24px] whitespace-nowrap">{card.num}</p>
                  <p className="font-ibm-plex-arabic text-[#5e5274] text-[15px] md:text-[16px] text-right leading-[1.5]">{card.body}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerGroup>

          <FadeUp>
            <a href={contactFormHref} className="inline-flex items-center justify-center bg-[#caa320] text-white px-8 py-3.5 rounded-[100px] text-[18px] font-ibm-plex-arabic mt-4 transition-all duration-200 hover:scale-105 hover:brightness-110 active:scale-95">
              احجز جلسة تشخيص مجانية
            </a>
          </FadeUp>
        </div>
      </section>

      <CooperativeForm />

      {/* Footer */}
      <footer className="bg-[#f5f1e9] px-6 pt-16 pb-10">
        <div className="max-w-[1440px] mx-auto flex flex-col gap-12">
          <div className="flex flex-col lg:flex-row items-start justify-between gap-10">
            {/* Links */}
            <div className="flex flex-col gap-3 items-start">
              <p className="font-ibm-plex-arabic text-[#1d1330] text-[18px]">الروابط الأساسية</p>
             {footerLinks.map((link) => (
  <a
    key={link.label}
    href={link.href}
    className="font-ibm-plex-arabic text-[#5e5274] text-[15px] md:text-[16px] transition-colors hover:text-[#45238f]"
  >
    {link.label}
  </a>
))}
            </div>

            {/* Contact */}
            <div className="flex flex-col gap-3 items-start">
              <p className="font-ibm-plex-arabic text-[#1d1330] text-[18px]">التواصل والشراكة</p>
                {["طلب حجز موعد", "شروط ومعايير القبول", "taawniyati.system@gmail.com", "تواصل مباشر عبر الواتساب"].map((link) => (
                  <a key={link} href={link === "شروط ومعايير القبول" ? "#" : link === "taawniyati.system@gmail.com" ? "mailto:taawniyati.system@gmail.com" : contactFormHref} className="font-ibm-plex-arabic text-[#5e5274] text-[15px] md:text-[16px] transition-colors hover:text-[#45238f]">
                  {link}
                  
                </a>
              ))}
              <div className="flex self-start items-center gap-3 text-[#5e5274]">
                <p className="font-ibm-plex-arabic text-[#5e5274] text-[15px] md:text-[16px] leading-[1.5] text-right max-w-[360px]">
                وسائل التواصل الاجتماعي                
                </p>
                <a
                  href="https://www.instagram.com/taawniyati.maroc?stkn=MXJ5OXlnNXNqbW5rdQ=="
                  target="_blank"
                  rel="noreferrer"
                  aria-label="إنستغرام تعاونيتي"
                  className="transition-colors hover:text-[#45238f]"
                >
                  <svg aria-hidden="true" viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="5" />
                    <circle cx="12" cy="12" r="4" />
                    <circle cx="17.5" cy="6.5" r="0.75" fill="currentColor" stroke="none" />
                  </svg>
                </a>
                <a
                  href="https://www.facebook.com/profile.php?id=61595105036474"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="فيسبوك تعاونيتي"
                  className="transition-colors hover:text-[#45238f]"
                >
                  <svg aria-hidden="true" viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor">
                    <path d="M13.4 21v-8.2h2.8l.4-3.2h-3.2v-2c0-.9.3-1.6 1.6-1.6h1.7V3.2c-.3 0-1.3-.2-2.5-.2-2.5 0-4.2 1.5-4.2 4.3v2.3H7.2v3.2H10V21h3.4Z" />
                  </svg>
                </a>
              </div>
            </div>
             {/* Brand */}
            <div className="relative w-full lg:w-[360px] flex flex-col items-right">
              <LazyImage src={imgLogo} alt="تعاونيتي" className="w-[180px] h-[100px] object-cover " />
              <p className="font-ibm-plex-arabic text-[#5e5274] text-[15px] md:text-[16px] leading-[1.5] text-right max-w-[360px]">
                منصة وخدمة وطنية ملتزمة بتأطير وتحديث تعاونيات الإنتاج الحرفي والغذائي في المغرب لتقديم قيمة أصيلة تليق بالمستهلك المغربي والعالمي.
              </p>
              
            </div>
          </div>

          <div className="bg-[#e2dcef] h-px w-full" />

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 font-ibm-plex-arabic text-[14px] md:text-[15px]">
            <p className="text-[#5e5274] text-right">
              © ٢٠٢٦ تعاونيتي. جميع الحقوق محفوظة ومحمية بموجب القوانين المغربية.
            </p>
            <div className="flex gap-4 items-center">
              <a href="#" className="text-[#5e5274] hover:text-[#45238f] transition-colors">سياسة الخصوصية</a>
              <span className="text-[#b2ada8]">|</span>
              <a href="#" className="text-[#5e5274] hover:text-[#45238f] transition-colors">شروط الاستخدام</a>
            </div>

          </div>
        </div>
      </footer>

      <a
        href="https://wa.me/212767371688"
        target="_blank"
        rel="noreferrer"
        aria-label="تواصل عبر واتساب على الرقم 0767371688"
        className="fixed bottom-5 right-5 z-40 inline-flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-3 font-ibm-plex-arabic text-sm text-white shadow-lg transition hover:scale-105 hover:bg-[#20bd5a] sm:bottom-6 sm:right-6"
      >
        <svg aria-hidden="true" viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor">
          <path d="M20.5 3.5A11.9 11.9 0 0 0 12 0C5.4 0 .1 5.3.1 11.9c0 2.1.6 4.2 1.6 6L0 24l6.3-1.6a12 12 0 0 0 5.7 1.4h.1c6.5 0 11.8-5.3 11.8-11.9 0-3.2-1.2-6.1-3.4-8.4ZM12 21.8c-1.8 0-3.5-.5-5-1.4l-.4-.2-3.7 1 1-3.6-.2-.4a9.8 9.8 0 0 1-1.5-5.3 9.9 9.9 0 1 1 9.8 9.9Zm5.4-7.4c-.3-.2-1.7-.9-2-.9-.3-.1-.5-.2-.7.2-.2.3-.8.9-.9 1.1-.2.2-.3.2-.6.1-.3-.2-1.2-.4-2.3-1.4-.9-.8-1.4-1.7-1.6-2-.2-.3 0-.5.1-.6l.5-.6.3-.5c.1-.2 0-.4 0-.6-.1-.2-.7-1.6-1-2.2-.2-.5-.5-.5-.7-.5H7.9c-.3 0-.6.1-.8.4-.3.3-1 1-.1 2.5.8 1.5 1.1 2 2.2 3.2 1.1 1.2 2.4 2 3.4 2.4 1 .4 1.5.5 2 .4.7-.1 1.7-.7 1.9-1.3.2-.6.2-1.1.1-1.2-.1-.2-.3-.3-.6-.4Z" />
        </svg>
        <span>0767371688</span>
      </a>
    </div>
  );
}
