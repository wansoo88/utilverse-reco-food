import type { Locale } from '@/config/site';

export interface LegalSection {
  heading: string;
  paragraphs: string[];
}

export interface LegalPageContent {
  title: string;
  description: string;
  sections: LegalSection[];
}

export const FOOTER_COPY: Record<Locale, {
  about: string;
  privacy: string;
  terms: string;
  contact: string;
}> = {
  ko: { about: '소개', privacy: '개인정보처리방침', terms: '이용약관', contact: '문의' },
  en: { about: 'About', privacy: 'Privacy', terms: 'Terms', contact: 'Contact' },
  ja: { about: '紹介', privacy: 'プライバシー', terms: '利用規約', contact: 'お問い合わせ' },
  zh: { about: '关于', privacy: '隐私政策', terms: '服务条款', contact: '联系' },
};

export const ABOUT_CONTENT: Record<Locale, LegalPageContent> = {
  ko: {
    title: '오늘뭐먹지 소개',
    description: '오늘뭐먹지는 상황, 인원, 예산에 맞는 음식 선택을 빠르게 돕는 AI 기반 메뉴 추천 서비스입니다.',
    sections: [
      { heading: '서비스 목적', paragraphs: ['오늘뭐먹지는 사용자가 오늘 먹을 메뉴를 빠르게 정할 수 있도록 돕기 위해 만들어졌습니다.', '혼밥, 가족 식사, 야근 후 배달, 가성비 식사처럼 자주 겪는 고민을 검색과 필터로 바로 풀 수 있게 설계했습니다.'] },
      { heading: '콘텐츠 원칙', paragraphs: ['추천 결과는 음식 선택을 돕기 위한 참고 정보이며, 실제 취향과 상황에 따라 달라질 수 있습니다.', '검색 유입용 페이지도 단순 키워드 나열이 아니라 상황별 메뉴 탐색에 도움이 되는 구조를 목표로 운영합니다.'] },
      { heading: '운영 방식', paragraphs: ['서비스는 다국어 페이지, 로컬 저장 캘린더, 프로그래매틱 SEO 페이지를 함께 운영합니다.', '광고는 사용자 경험을 해치지 않도록 최소 위치에만 배치합니다.'] },
    ],
  },
  en: {
    title: 'About What Should I Eat?',
    description: 'What Should I Eat? is an AI-powered menu recommendation service for choosing food quickly based on situation, group size, and budget.',
    sections: [
      { heading: 'Purpose', paragraphs: ['The service exists to help people decide what to eat without overthinking.', 'It focuses on practical meal decisions such as solo meals, family dinners, late-night delivery, and budget-friendly food.'] },
      { heading: 'Content principle', paragraphs: ['Recommendations are guidance, not guarantees, and should be interpreted with personal taste and context in mind.', 'Search landing pages are designed to provide real menu discovery value, not just target keywords.'] },
      { heading: 'How the site runs', paragraphs: ['The product combines multilingual pages, local saved meal calendars, and SEO landing pages.', 'Advertising is intentionally limited to avoid harming the reading experience.'] },
    ],
  },
  ja: {
    title: '今日何食べる？について',
    description: '今日何食べる？は、状況・人数・予算に合わせて食事をすばやく選ぶためのAIメニュー推薦サービスです。',
    sections: [
      { heading: 'サービスの目的', paragraphs: ['このサービスは、今日の食事をすばやく決めたい人のために作られました。', '一人ごはん、家族の食事、残業後の出前、節約メニューなど、よくある悩みに実用的に対応します。'] },
      { heading: 'コンテンツ方針', paragraphs: ['おすすめ結果は参考情報であり、最終的な選択は好みや状況に応じて変わります。', 'SEOページも単なるキーワード一覧ではなく、実際の献立検討に役立つ内容を目指しています。'] },
      { heading: '運営方針', paragraphs: ['多言語ページ、ローカル保存カレンダー、SEOページを組み合わせて運営しています。', '広告は閲覧体験を損なわない最小限の位置にのみ配置します。'] },
    ],
  },
  zh: {
    title: '关于今天吃什么',
    description: '今天吃什么是一个根据场景、人数和预算快速给出菜单建议的 AI 美食推荐服务。',
    sections: [
      { heading: '服务目的', paragraphs: ['这个服务的目标是帮助用户更快决定今天吃什么。', '它重点解决一人食、家庭晚餐、加班后外卖、预算有限等高频决策场景。'] },
      { heading: '内容原则', paragraphs: ['推荐结果仅供参考，最终选择应结合个人口味和实际情况判断。', '搜索落地页也以真实的菜单发现价值为目标，而不是单纯堆砌关键词。'] },
      { heading: '运营方式', paragraphs: ['网站由多语言页面、本地保存日历和 SEO 菜单页面组成。', '广告位会控制在尽量不影响阅读体验的范围内。'] },
    ],
  },
};

export const PRIVACY_CONTENT: Record<Locale, LegalPageContent> = {
  ko: {
    title: '개인정보처리방침',
    description: '오늘뭐먹지가 어떤 정보를 처리하고 어떻게 보호하는지 설명합니다.',
    sections: [
      { heading: '수집 정보', paragraphs: ['서비스는 추천 필터와 캘린더 데이터를 브라우저 localStorage에 저장할 수 있습니다.', '입력한 검색어는 추천 요청 처리 과정에서 서버 API로 전달될 수 있으나, 별도 회원 계정 정보는 수집하지 않습니다.'] },
      { heading: '이용 목적', paragraphs: ['저장된 정보는 추천 기능 유지, 필터 복원, 식단 기록 제공을 위해 사용됩니다.', '광고 및 트래픽 분석 도구가 활성화된 경우 관련 스크립트가 브라우저 환경에서 동작할 수 있습니다.'] },
      { heading: '보관 및 통제', paragraphs: ['localStorage 데이터는 사용자의 브라우저에 저장되며, 사용자가 직접 삭제할 수 있습니다.', '민감하거나 불필요한 개인정보 입력은 권장하지 않습니다.'] },
    ],
  },
  en: {
    title: 'Privacy Policy',
    description: 'This page explains what information the service processes and how it is handled.',
    sections: [
      { heading: 'What is processed', paragraphs: ['The service may store filter settings and meal calendar data in browser localStorage.', 'Search input may be sent to the recommendation API, but there is no member account system collecting profile data.'] },
      { heading: 'Why it is used', paragraphs: ['Stored data supports filter restoration, recommendation flows, and meal planning records.', 'If analytics or advertising scripts are enabled, related browser-side processing may occur.'] },
      { heading: 'Storage and control', paragraphs: ['localStorage data stays in the user browser and can be deleted by the user.', 'Users should avoid entering sensitive or unnecessary personal information.'] },
    ],
  },
  ja: {
    title: 'プライバシーポリシー',
    description: '本サービスがどの情報を扱い、どのように管理するかを説明します。',
    sections: [
      { heading: '取り扱う情報', paragraphs: ['サービスはフィルター設定や献立カレンダー情報をブラウザのlocalStorageに保存する場合があります。', '検索入力は推薦処理のためAPIに送信される場合がありますが、会員アカウントによる個人プロフィール収集は行っていません。'] },
      { heading: '利用目的', paragraphs: ['保存データはフィルター復元、推薦機能、献立記録のために使用されます。', '分析や広告スクリプトが有効な場合、ブラウザ側で関連処理が行われることがあります。'] },
      { heading: '保存と管理', paragraphs: ['localStorageのデータは利用者のブラウザ内に保存され、利用者自身で削除できます。', '不要な個人情報や機密情報の入力は避けてください。'] },
    ],
  },
  zh: {
    title: '隐私政策',
    description: '本页面说明服务会处理哪些信息，以及这些信息如何被管理。',
    sections: [
      { heading: '处理的信息', paragraphs: ['服务可能会将筛选条件和菜单日历数据保存在浏览器 localStorage 中。', '搜索输入可能会发送到推荐 API，但本站没有会员账户体系，不会额外收集个人资料。'] },
      { heading: '使用目的', paragraphs: ['这些数据用于恢复筛选条件、提供推荐流程和保存菜单记录。', '如果启用了分析或广告脚本，浏览器端可能会进行相关处理。'] },
      { heading: '存储与控制', paragraphs: ['localStorage 数据保存在用户自己的浏览器中，用户可自行删除。', '不建议输入敏感或不必要的个人信息。'] },
    ],
  },
};

export const TERMS_CONTENT: Record<Locale, LegalPageContent> = {
  ko: {
    title: '이용약관',
    description: '오늘뭐먹지 서비스 이용 시 적용되는 기본 원칙입니다.',
    sections: [
      { heading: '서비스 이용', paragraphs: ['서비스는 음식 추천과 탐색을 돕기 위한 정보 제공 서비스입니다.', '추천 결과는 참고용이며, 실제 구매나 조리 결정은 사용자 책임하에 진행됩니다.'] },
      { heading: '금지 사항', paragraphs: ['서비스를 악용하거나, 보안 우회를 시도하거나, 정상 이용을 방해하는 행위는 허용되지 않습니다.', '자동화된 비정상 호출이나 정책 위반성 트래픽은 제한될 수 있습니다.'] },
      { heading: '면책', paragraphs: ['표시되는 메뉴, 가격감, 조리 난이도, 외부 링크 정보는 실제와 차이가 있을 수 있습니다.', '외부 사이트 이동 후의 콘텐츠와 거래는 해당 사이트 정책을 따릅니다.'] },
    ],
  },
  en: {
    title: 'Terms of Service',
    description: 'These are the basic terms that apply when using the service.',
    sections: [
      { heading: 'Using the service', paragraphs: ['The service is an informational tool for menu discovery and food recommendations.', 'Recommendations are guidance only, and final cooking or purchase decisions remain the user responsibility.'] },
      { heading: 'Prohibited behavior', paragraphs: ['Attempts to abuse the service, bypass safeguards, or disrupt normal usage are not allowed.', 'Automated abusive traffic or policy-violating use may be restricted.'] },
      { heading: 'Disclaimer', paragraphs: ['Displayed menu ideas, cost expectations, cooking difficulty, and external links may differ from real-world outcomes.', 'Once a user leaves the site, the destination site policies apply.'] },
    ],
  },
  ja: {
    title: '利用規約',
    description: '本サービスの利用時に適用される基本ルールです。',
    sections: [
      { heading: 'サービス利用', paragraphs: ['本サービスは食事候補の検討を助ける情報提供サービスです。', 'おすすめ結果は参考情報であり、最終的な調理や購入判断は利用者の責任で行ってください。'] },
      { heading: '禁止事項', paragraphs: ['サービスの悪用、保護機能の回避、正常利用の妨害行為は認められません。', '自動化された不正アクセスやポリシー違反の利用は制限される場合があります。'] },
      { heading: '免責', paragraphs: ['表示されるメニュー、価格感、難易度、外部リンク内容は実際と異なる場合があります。', '外部サイトへ移動した後は、そのサイトの規約と方針が適用されます。'] },
    ],
  },
  zh: {
    title: '服务条款',
    description: '以下为使用本服务时适用的基本规则。',
    sections: [
      { heading: '服务使用', paragraphs: ['本服务用于帮助用户探索菜单和进行饮食选择。', '推荐结果仅供参考，最终的购买或烹饪决策由用户自行承担。'] },
      { heading: '禁止行为', paragraphs: ['不得滥用服务、绕过安全限制或干扰正常使用。', '异常自动化请求或违反政策的流量可能会被限制。'] },
      { heading: '免责声明', paragraphs: ['页面中的菜单、价格感知、难度和外部链接内容可能与实际情况存在差异。', '跳转至外部网站后，应遵循对方网站的规则和政策。'] },
    ],
  },
};

export const CONTACT_CONTENT: Record<Locale, LegalPageContent> = {
  ko: {
    title: '문의',
    description: '서비스 제안, 오류 제보, 광고 및 협업 문의를 위한 안내입니다.',
    sections: [
      { heading: '문의 가능한 내용', paragraphs: ['추천 결과 오류, 잘못된 번역, 페이지 문제, 서비스 제안 등을 문의할 수 있습니다.', '광고 및 협업 관련 문의도 이 페이지를 통해 접수할 수 있습니다.'] },
      { heading: '문의 방법', paragraphs: ['현재는 저장형 문의 폼 대신 이메일 기반 응대를 준비 중입니다.', '임시 문의 채널: kimcomplete8888@gmail.com'] },
      { heading: '처리 안내', paragraphs: ['문의 내용에 따라 회신까지 시간이 걸릴 수 있습니다.', '개인정보나 결제정보처럼 민감한 정보는 보내지 마세요.'] },
    ],
  },
  en: {
    title: 'Contact',
    description: 'Contact guidance for product feedback, bug reports, and advertising inquiries.',
    sections: [
      { heading: 'Topics', paragraphs: ['You can contact us about translation issues, recommendation quality, bugs, or product suggestions.', 'Advertising and partnership inquiries are also accepted through this page.'] },
      { heading: 'How to reach us', paragraphs: ['A structured contact form is not live yet, so email is the temporary channel.', 'Temporary contact email: kimcomplete8888@gmail.com'] },
      { heading: 'Response note', paragraphs: ['Response time may vary depending on the inquiry type and workload.', 'Please do not send sensitive personal or payment information.'] },
    ],
  },
  ja: {
    title: 'お問い合わせ',
    description: 'サービス提案、不具合報告、広告や協業相談のための案内です。',
    sections: [
      { heading: '問い合わせ内容', paragraphs: ['翻訳の問題、推薦品質、不具合、サービス提案などを送ることができます。', '広告や協業に関する相談も受け付けています。'] },
      { heading: '連絡方法', paragraphs: ['現在は保存型フォームではなく、メール対応を準備中です。', '暫定連絡先: kimcomplete8888@gmail.com'] },
      { heading: '案内', paragraphs: ['内容によって返信まで時間がかかる場合があります。', '機密性の高い個人情報や決済情報は送らないでください。'] },
    ],
  },
  zh: {
    title: '联系',
    description: '用于产品建议、错误反馈、广告与合作咨询的联系说明。',
    sections: [
      { heading: '可联系内容', paragraphs: ['可反馈翻译问题、推荐质量、页面错误或产品建议。', '广告和合作咨询也可通过本页进行联系。'] },
      { heading: '联系方式', paragraphs: ['目前尚未上线表单，暂时通过邮箱处理。', '临时联系邮箱：kimcomplete8888@gmail.com'] },
      { heading: '处理说明', paragraphs: ['根据咨询内容不同，回复时间可能有所差异。', '请不要发送敏感个人信息或支付信息。'] },
    ],
  },
};
