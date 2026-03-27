/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  AreaChart, Area
} from 'recharts';
import { 
  ShoppingBag, TrendingUp, Package, Truck, 
  Sun, Moon, ChevronRight, ChevronLeft, MessageSquare, Award, Zap, ShieldCheck,
  Presentation, Printer, Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Data Definitions ---

const PRODUCTS = [
  { id: 'airpods', name: '에어팟프로2세대', icon: <Zap size={18} />, color: '#3b82f6' },
  { id: 'omega3', name: '오메가3', icon: <ShieldCheck size={18} />, color: '#10b981' },
  { id: 'suncream', name: '달바선크림', icon: <Sun size={18} />, color: '#f59e0b' },
  { id: 'wipes', name: '물티슈', icon: <Package size={18} />, color: '#ec4899' },
];

const DATA = {
  airpods: {
    keywords: [
      { word: '좋아요', value: 119.12 },
      { word: '너무', value: 104.22 },
      { word: '에어팟', value: 75.16 },
      { word: '만족합니다', value: 62.20 },
      { word: '감사합니다', value: 56.95 },
      { word: '좋네요', value: 52.16 },
      { word: '배송', value: 47.35 },
      { word: '배송도', value: 43.22 },
      { word: '프로', value: 42.26 },
      { word: '저렴하게', value: 40.95 },
    ],
    categories: [
      { name: '기능(노캔/음질)', value: 178.4 },
      { name: '배송/속도', value: 151.7 },
      { name: '가격/구매경로', value: 62.3 },
      { name: '감성/만족도', value: 334.6 },
    ],
    features: [
      { subject: '노이즈캔슬링', A: 95, full: 100 },
      { subject: '음질', A: 88, full: 100 },
      { subject: '배송속도', A: 92, full: 100 },
      { subject: '가격만족도', A: 75, full: 100 },
      { subject: '브랜드신뢰', A: 98, full: 100 },
    ],
    insight: `에어팟 프로 2세대의 비즈니스 인사이트 분석 결과, 소비자들은 단순한 음향 기기를 넘어 '노이즈 캔슬링'이라는 핵심 기능에 압도적인 가치를 부여하고 있습니다. TF-IDF 분석에서 '노이즈캔슬링', '노캔', '캔슬링' 등의 키워드가 상위에 포진해 있으며, 이는 제품 선택의 결정적 요인임을 시사합니다. 또한 '배송', '빠르고', '바로'와 같은 키워드의 높은 비중은 고가 전자제품 구매 시 신속하고 안전한 물류 서비스가 고객 만족도의 핵심 축임을 보여줍니다. 가격 측면에서는 '저렴하게'라는 키워드가 상위에 있어, 정가 구매보다는 할인 혜택이나 최저가 검색을 통한 구매 패턴이 뚜렷합니다. 마케팅 전략으로는 노이즈 캔슬링의 성능을 강조하는 실생활 시나리오 중심의 콘텐츠 제작과 함께, '애플' 브랜드 로열티를 자극하는 '역시'라는 키워드에 주목하여 프리미엄 이미지를 공고히 할 필요가 있습니다.`
  },
  omega3: {
    keywords: [
      { word: '좋아요', value: 101.80 },
      { word: '꾸준히', value: 49.81 },
      { word: '항상', value: 49.59 },
      { word: '먹고', value: 49.29 },
      { word: '배송도', value: 45.57 },
      { word: '감사합니다', value: 45.15 },
      { word: '배송', value: 43.98 },
      { word: '빠르고', value: 42.68 },
      { word: '만족합니다', value: 34.53 },
      { word: '저렴하게', value: 34.25 },
    ],
    categories: [
      { name: '복용지속성', value: 150.4 },
      { name: '배송/수령', value: 178.1 },
      { name: '품질/유통기한', value: 60.6 },
      { name: '가격/가성비', value: 34.2 },
    ],
    features: [
      { subject: '복용편의성', A: 82, full: 100 },
      { subject: '유통기한', A: 95, full: 100 },
      { subject: '배송상태', A: 90, full: 100 },
      { subject: '가격경쟁력', A: 85, full: 100 },
      { subject: '재구매의사', A: 94, full: 100 },
    ],
    insight: `오메가3 제품군의 리뷰 분석을 통해 도출된 가장 강력한 비즈니스 인사이트는 '지속성'과 '신뢰'입니다. '꾸준히', '항상', '계속', '먹고'와 같은 키워드가 상위권을 차지하고 있다는 점은 건강기능식품 특유의 높은 재구매율과 충성도를 증명합니다. 이는 신규 고객 유치만큼이나 기존 고객의 이탈을 방지하는 정기 구독 모델이나 리워드 프로그램이 비즈니스 성장에 필수적임을 의미합니다. 특히 '유통기한'과 '유통기한도'라는 키워드가 유의미하게 등장하는 것은 건강에 직접적인 영향을 미치는 제품인 만큼 신선도와 안전성에 대한 소비자 민감도가 매우 높음을 나타냅니다. 따라서 상세 페이지나 마케팅 메시지에서 유통기한의 투명한 공개와 최신 제조 일자 강조가 전환율 향상에 결정적인 역할을 할 것입니다.`
  },
  suncream: {
    keywords: [
      { word: '좋아요', value: 179.09 },
      { word: '너무', value: 63.46 },
      { word: '좋고', value: 61.22 },
      { word: '발림성도', value: 51.88 },
      { word: '촉촉하고', value: 47.37 },
      { word: '발림성', value: 41.16 },
      { word: '달바', value: 40.13 },
      { word: '톤업', value: 39.68 },
      { word: '좋네요', value: 37.48 },
      { word: '발림성이', value: 33.23 },
    ],
    categories: [
      { name: '사용감(발림성)', value: 185.1 },
      { name: '효과(톤업/촉촉)', value: 170.6 },
      { name: '피부반응', value: 48.1 },
      { name: '브랜드/가격', value: 93.0 },
    ],
    features: [
      { subject: '발림성', A: 98, full: 100 },
      { subject: '촉촉함', A: 92, full: 100 },
      { subject: '톤업효과', A: 89, full: 100 },
      { subject: '자연스러움', A: 95, full: 100 },
      { subject: '가성비', A: 78, full: 100 },
    ],
    insight: `달바 선크림의 분석 결과, 화장품 비즈니스에서 '사용 경험(Sensory Experience)'이 얼마나 중요한지 극명하게 드러납니다. '발림성', '촉촉하고', '부드럽게', '발리고'와 같은 텍스처 관련 키워드가 압도적인 TF-IDF 수치를 기록하고 있습니다. 이는 소비자들이 자외선 차단이라는 본연의 기능만큼이나 피부에 닿는 느낌과 마무리감을 중시한다는 것을 의미합니다. 또한 '톤업', '자연스럽게', '톤업도' 키워드의 부상은 선크림이 단순 차단제를 넘어 메이크업 베이스의 역할까지 수행하는 '멀티 펑션' 제품으로서 소비되고 있음을 보여줍니다. 비즈니스 전략 측면에서, '달바'라는 브랜드명이 키워드 상위에 랭크된 것은 강력한 브랜드 파워를 시사합니다.`
  },
  wipes: {
    keywords: [
      { word: '좋아요', value: 111.46 },
      { word: '너무', value: 68.21 },
      { word: '물티슈', value: 63.98 },
      { word: '항상', value: 52.46 },
      { word: '두께도', value: 50.27 },
      { word: '가격도', value: 44.23 },
      { word: '가성비', value: 43.90 },
      { word: '미엘', value: 40.89 },
      { word: '가격대비', value: 40.57 },
      { word: '좋고', value: 39.48 },
    ],
    categories: [
      { name: '가성비/가격', value: 128.7 },
      { name: '품질(두께)', value: 77.1 },
      { name: '사용지속성', value: 121.3 },
      { name: '배송/서비스', value: 93.8 },
    ],
    features: [
      { subject: '가성비', A: 96, full: 100 },
      { subject: '두께감', A: 85, full: 100 },
      { subject: '수분감', A: 80, full: 100 },
      { subject: '배송속도', A: 88, full: 100 },
      { subject: '재구매의사', A: 92, full: 100 },
    ],
    insight: `물티슈 시장의 분석 결과는 '실용주의적 소비'의 전형을 보여줍니다. '가성비', '가격도', '가격대비'와 같은 키워드가 상위권에 밀집해 있어, 가격 경쟁력이 구매 결정의 가장 큰 동인임을 알 수 있습니다. 하지만 흥미로운 점은 '두께도', '두껍고', '적당하고'와 같은 품질 관련 키워드가 가격 키워드와 팽팽하게 맞서고 있다는 점입니다. 이는 무조건 싼 제품보다는 '가격 대비 충분한 두께와 품질을 갖춘' 제품을 찾는 스마트 컨슈머의 비중이 높음을 시사합니다. 비즈니스 인사이트 측면에서, '미엘'이라는 특정 브랜드명이 언급되는 것은 가성비 시장 내에서도 브랜드 인지도가 형성될 수 있음을 보여줍니다.`
  }
};

// --- Glassmorphism Components ---

const GlassCard = ({ children, className, delay = 0 }: { children: React.ReactNode, className?: string, delay?: number, key?: React.Key }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.8 }}
    className={cn(
      "glass-dark rounded-3xl p-6 overflow-hidden relative",
      className
    )}
  >
    {children}
  </motion.div>
);

const GlassButton = ({ children, onClick, className, active = false }: { children: React.ReactNode, onClick?: () => void, className?: string, active?: boolean }) => (
  <button 
    onClick={onClick}
    className={cn(
      "px-6 py-2 rounded-full transition-all duration-300 font-medium text-sm flex items-center gap-2",
      active 
        ? "bg-white/20 text-white border border-white/30 shadow-lg" 
        : "bg-white/5 text-white/60 hover:bg-white/10 border border-white/10",
      className
    )}
  >
    {children}
  </button>
);

const Slide = ({ children, title, subtitle, page }: { children: React.ReactNode, title: string, subtitle?: string, page: number, key?: React.Key }) => (
  <motion.div 
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 1.05 }}
    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
    className="w-full h-full flex flex-col p-10"
  >
    <div className="flex justify-between items-end mb-12">
      <div>
        <motion.p 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-indigo-400 font-serif italic text-xl mb-2"
        >
          {subtitle || "Strategic Overview"}
        </motion.p>
        <motion.h2 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="text-6xl font-serif text-white tracking-tight"
        >
          {title}
        </motion.h2>
      </div>
      <div className="text-white/20 font-serif text-8xl leading-none">
        {page.toString().padStart(2, '0')}
      </div>
    </div>
    <div className="flex-1 min-h-0">
      {children}
    </div>
  </motion.div>
);

// --- Main Application ---

export default function App() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const totalSlides = 20;

  const nextSlide = () => setCurrentSlide(prev => Math.min(prev + 1, totalSlides - 1));
  const prevSlide = () => setCurrentSlide(prev => Math.max(prev - 1, 0));

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') nextSlide();
      if (e.key === 'ArrowLeft') prevSlide();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const renderSlideContent = () => {
    switch (currentSlide) {
      case 0: // Title
        return (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-12">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative"
            >
              <div className="absolute -inset-20 bg-indigo-500/20 blur-[100px] rounded-full" />
              <h1 className="text-[10vw] font-serif text-white leading-none tracking-tighter relative z-10">
                Aurora<br/><span className="italic text-indigo-300">Insights</span>
              </h1>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex gap-6"
            >
              <GlassCard className="px-8 py-3 bg-white/5">
                <span className="text-white/60 font-medium tracking-widest uppercase text-xs">2026 Q1 Business Report</span>
              </GlassCard>
              <GlassCard className="px-8 py-3 bg-white/5">
                <span className="text-white/60 font-medium tracking-widest uppercase text-xs">TF-IDF Analysis</span>
              </GlassCard>
            </motion.div>
          </div>
        );
      case 1: // Executive Summary
        return (
          <div className="grid grid-cols-2 gap-12 h-full">
            <div className="flex flex-col justify-center space-y-8">
              <h3 className="text-3xl font-serif text-white italic">Executive Overview</h3>
              <p className="text-2xl text-white/70 leading-relaxed font-light">
                본 보고서는 8,042건의 쇼핑몰 리뷰 데이터를 TF-IDF 알고리즘으로 분석하여, 4개 핵심 제품군의 시장 경쟁력과 소비자 인사이트를 도출했습니다.
              </p>
              <div className="flex gap-4">
                <div className="h-px flex-1 bg-white/20 self-center" />
                <Sparkles className="text-indigo-400" />
                <div className="h-px flex-1 bg-white/20 self-center" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              {[
                { label: "Total Reviews", value: "8,042", icon: <MessageSquare size={24} /> },
                { label: "Delivery Index", value: "92.1", icon: <Truck size={24} /> },
                { label: "Key Products", value: "4", icon: <ShoppingBag size={24} /> },
                { label: "Satisfaction", value: "68%", icon: <Award size={24} /> },
              ].map((stat, i) => (
                <GlassCard key={i} className="flex flex-col items-center justify-center text-center group hover:bg-white/10 transition-colors">
                  <div className="text-indigo-400 mb-4 group-hover:scale-110 transition-transform">{stat.icon}</div>
                  <div className="text-4xl font-serif text-white mb-1">{stat.value}</div>
                  <div className="text-white/40 text-xs uppercase tracking-widest">{stat.label}</div>
                </GlassCard>
              ))}
            </div>
          </div>
        );
      case 2: // Methodology
        return (
          <div className="flex flex-col h-full space-y-12">
            <GlassCard className="p-10 bg-white/5">
              <h3 className="text-3xl font-serif text-white mb-6 italic">TF-IDF Methodology</h3>
              <p className="text-xl text-white/60 leading-relaxed max-w-4xl">
                Term Frequency-Inverse Document Frequency: 특정 문서 내에서 단어의 빈도와 전체 문서군에서의 희소성을 결합하여 핵심 키워드의 가중치를 산출하는 텍스트 마이닝 기법입니다.
              </p>
            </GlassCard>
            <div className="grid grid-cols-3 gap-8 flex-1">
              {[
                { step: "01", title: "Data Cleaning", desc: "불용어 제거 및 형태소 분석을 통한 데이터 정제" },
                { step: "02", title: "TF-IDF Calculation", desc: "단어별 가중치 산출 및 핵심 토픽 추출" },
                { step: "03", title: "Insight Mapping", desc: "비즈니스 전략과 연계된 인사이트 도출" }
              ].map((m, i) => (
                <GlassCard key={i} className="p-8 group">
                  <div className="text-6xl font-serif text-white/10 mb-6 group-hover:text-indigo-500/20 transition-colors">{m.step}</div>
                  <h4 className="text-2xl font-serif text-white mb-4">{m.title}</h4>
                  <p className="text-white/50 leading-relaxed">{m.desc}</p>
                </GlassCard>
              ))}
            </div>
          </div>
        );
      case 3: // Market Overview
        return (
          <div className="h-full">
            <GlassCard className="p-10 h-full flex flex-col">
              <h3 className="text-3xl font-serif text-white mb-12 italic">Keyword Impact Comparison</h3>
              <div className="flex-1">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={PRODUCTS.map(p => ({ name: p.name, value: DATA[p.id as keyof typeof DATA].keywords[0].value }))}>
                    <defs>
                      <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#818cf8" stopOpacity={0.8}/>
                        <stop offset="100%" stopColor="#818cf8" stopOpacity={0.2}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="name" stroke="rgba(255,255,255,0.3)" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }} />
                    <YAxis stroke="rgba(255,255,255,0.3)" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', backdropFilter: 'blur(10px)' }}
                      itemStyle={{ color: '#fff' }}
                    />
                    <Bar dataKey="value" fill="url(#barGradient)" radius={[10, 10, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </GlassCard>
          </div>
        );
      
      default: {
        const productIndex = Math.floor((currentSlide - 4) / 4);
        const slideType = (currentSlide - 4) % 4;
        const product = PRODUCTS[productIndex];
        const productData = DATA[product.id as keyof typeof DATA];

        if (!product) return null;

        switch (slideType) {
          case 0: // Keywords
            return (
              <div className="grid grid-cols-2 gap-12 h-full">
                <GlassCard className="p-8 flex flex-col">
                  <h3 className="text-2xl font-serif text-white mb-8 italic">Top 10 Keywords</h3>
                  <div className="flex-1">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={productData.keywords.slice(0, 10)} layout="vertical">
                        <XAxis type="number" hide />
                        <YAxis dataKey="word" type="category" stroke="rgba(255,255,255,0.3)" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }} width={100} />
                        <Bar dataKey="value" fill={product.color} radius={[0, 10, 10, 0]} opacity={0.6} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </GlassCard>
                <div className="grid grid-cols-2 gap-6">
                  {productData.keywords.slice(0, 4).map((k, i) => (
                    <GlassCard key={i} className="flex flex-col justify-center items-center text-center">
                      <span className="text-white/40 text-xs uppercase tracking-widest mb-2">#{k.word}</span>
                      <span className="text-5xl font-serif text-white">{k.value.toFixed(1)}</span>
                    </GlassCard>
                  ))}
                  <div className="col-span-2 flex items-center justify-center">
                    <div className="h-px flex-1 bg-white/10" />
                    <span className="px-6 text-white/30 font-serif italic">Semantic Weight Analysis</span>
                    <div className="h-px flex-1 bg-white/10" />
                  </div>
                </div>
              </div>
            );
          case 1: // Categories
            return (
              <div className="grid grid-cols-3 gap-12 h-full">
                <GlassCard className="col-span-2 p-10">
                  <h3 className="text-2xl font-serif text-white mb-8 italic">Category Distribution</h3>
                  <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={productData.categories}
                          cx="50%"
                          cy="50%"
                          innerRadius={80}
                          outerRadius={130}
                          paddingAngle={8}
                          dataKey="value"
                          stroke="none"
                        >
                          {productData.categories.map((_, index) => (
                            <Cell key={`cell-${index}`} fill={[product.color, "#818cf8", "#c084fc", "#f472b6"][index % 4]} opacity={0.7} />
                          ))}
                        </Pie>
                        <Tooltip contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: 'none', borderRadius: '16px' }} />
                        <Legend wrapperStyle={{ paddingTop: '40px' }} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </GlassCard>
                <div className="flex flex-col gap-6 justify-center">
                  {productData.categories.map((c, i) => (
                    <GlassCard key={i} className="p-6">
                      <div className="text-white/40 text-xs uppercase tracking-widest mb-1">{c.name}</div>
                      <div className="text-3xl font-serif text-white">{c.value} <span className="text-sm font-sans text-white/20">pts</span></div>
                    </GlassCard>
                  ))}
                </div>
              </div>
            );
          case 2: // Features
            return (
              <div className="grid grid-cols-2 gap-12 h-full">
                <GlassCard className="p-10">
                  <h3 className="text-2xl font-serif text-white mb-8 italic">Feature Radar</h3>
                  <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart cx="50%" cy="50%" outerRadius="80%" data={productData.features}>
                        <PolarGrid stroke="rgba(255,255,255,0.1)" />
                        <PolarAngleAxis dataKey="subject" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }} />
                        <Radar
                          name="Competitiveness"
                          dataKey="A"
                          stroke={product.color}
                          strokeWidth={2}
                          fill={product.color}
                          fillOpacity={0.3}
                        />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </GlassCard>
                <div className="flex flex-col justify-center space-y-8">
                  <h4 className="text-3xl font-serif text-white italic">Key Strengths</h4>
                  <div className="space-y-6">
                    {productData.features.sort((a, b) => b.A - a.A).slice(0, 3).map((f, i) => (
                      <div key={i} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-white/60 uppercase tracking-widest">{f.subject}</span>
                          <span className="text-white font-serif">{f.A}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${f.A}%` }}
                            transition={{ duration: 1.5, delay: 0.5 }}
                            className="h-full bg-indigo-500/50"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          case 3: // Insights
            return (
              <div className="flex flex-col h-full space-y-12">
                <GlassCard className="p-12 bg-white/5 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-12 opacity-5">
                    <TrendingUp size={200} />
                  </div>
                  <h3 className="text-4xl font-serif text-white mb-8 italic">Strategic Insight</h3>
                  <p className="text-2xl text-white/70 leading-relaxed font-light max-w-5xl">
                    {productData.insight}
                  </p>
                </GlassCard>
                <div className="grid grid-cols-3 gap-8 flex-1">
                  {[
                    { icon: <Zap size={32} />, title: "Marketing", desc: "핵심 키워드 기반 광고 카피 최적화" },
                    { icon: <TrendingUp size={32} />, title: "Operations", desc: "배송 및 서비스 경험 고도화" },
                    { icon: <Award size={32} />, title: "Branding", desc: "브랜드 로열티 강화 프로그램 도입" }
                  ].map((item, i) => (
                    <GlassCard key={i} className="p-8 flex flex-col items-center text-center group">
                      <div className="text-indigo-400 mb-6 group-hover:scale-110 transition-transform">{item.icon}</div>
                      <h5 className="text-white font-serif text-xl mb-2 italic">{item.title}</h5>
                      <p className="text-white/40 text-sm leading-relaxed">{item.desc}</p>
                    </GlassCard>
                  ))}
                </div>
              </div>
            );
        }
      }
    }
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden font-sans selection:bg-indigo-500/30">
      {/* Aurora Background */}
      <div className="fixed inset-0 aurora-bg pointer-events-none" />
      
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 p-8 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
            <Presentation size={20} className="text-indigo-300" />
          </div>
          <span className="text-white font-serif text-xl tracking-tight italic">Aurora Insights</span>
        </div>
        <div className="flex gap-4">
          <GlassButton onClick={() => window.print()}>
            <Printer size={18} />
          </GlassButton>
        </div>
      </header>

      {/* Main Content */}
      <main className="h-screen flex items-center justify-center p-12">
        <div className="w-full max-w-7xl aspect-video relative">
          <AnimatePresence mode="wait">
            <Slide 
              key={currentSlide} 
              title={
                currentSlide === 0 ? "TITLE SLIDE" :
                currentSlide === 1 ? "EXECUTIVE SUMMARY" :
                currentSlide === 2 ? "METHODOLOGY" :
                currentSlide === 3 ? "MARKET OVERVIEW" :
                PRODUCTS[Math.floor((currentSlide - 4) / 4)]?.name
              } 
              subtitle={
                currentSlide < 4 ? "Introduction" : 
                ["KEYWORD ANALYSIS", "CATEGORY MAPPING", "FEATURE RADAR", "BUSINESS INSIGHT"][(currentSlide - 4) % 4]
              }
              page={currentSlide + 1}
            >
              {renderSlideContent()}
            </Slide>
          </AnimatePresence>
        </div>
      </main>

      {/* Navigation Controls */}
      <footer className="fixed bottom-0 left-0 right-0 p-12 flex justify-between items-end pointer-events-none">
        <div className="pointer-events-auto">
          <div className="flex gap-2 mb-4">
            {Array.from({ length: totalSlides }).map((_, i) => (
              <motion.div 
                key={i} 
                initial={false}
                animate={{ 
                  width: i === currentSlide ? 32 : 8,
                  backgroundColor: i === currentSlide ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.2)"
                }}
                className="h-1 rounded-full"
              />
            ))}
          </div>
          <span className="text-white/20 font-serif italic text-sm">Progress: {Math.round(((currentSlide + 1) / totalSlides) * 100)}%</span>
        </div>
        <div className="flex gap-4 pointer-events-auto">
          <GlassButton onClick={prevSlide} className="h-14 w-14 flex items-center justify-center p-0 rounded-full">
            <ChevronLeft size={24} />
          </GlassButton>
          <GlassButton onClick={nextSlide} className="h-14 w-14 flex items-center justify-center p-0 rounded-full bg-white/10">
            <ChevronRight size={24} />
          </GlassButton>
        </div>
      </footer>
    </div>
  );
}
