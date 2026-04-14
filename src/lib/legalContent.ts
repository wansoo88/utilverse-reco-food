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


export const ABOUT_CONTENT: Record<Locale, LegalPageContent> = {
  ko: {
    title: '오늘뭐먹지 소개',
    description: '오늘뭐먹지는 상황, 인원, 예산에 맞는 음식 선택을 빠르게 돕는 AI 기반 메뉴 추천 서비스입니다.',
    sections: [
      {
        heading: '서비스 목적',
        paragraphs: [
          '오늘뭐먹지는 사용자가 오늘 먹을 메뉴를 빠르게 정할 수 있도록 돕기 위해 만들어졌습니다.',
          '혼밥, 가족 식사, 야근 후 배달, 가성비 식사처럼 자주 겪는 고민을 검색과 필터로 바로 풀 수 있게 설계했습니다.',
          '메뉴 추천에는 Google Gemini Flash AI를 활용하며, 사용자의 필터(가구 유형, 상황, 예산, 해먹기/시켜먹기)를 기반으로 맥락에 맞는 결과를 제공합니다.',
        ],
      },
      {
        heading: '콘텐츠 원칙',
        paragraphs: [
          '추천 결과는 음식 선택을 돕기 위한 참고 정보이며, 실제 취향과 상황에 따라 달라질 수 있습니다.',
          '검색 유입용 페이지도 단순 키워드 나열이 아니라 상황별 메뉴 탐색에 실질적으로 도움이 되는 구조로 운영합니다.',
          '다국어 콘텐츠(한국어·영어·일본어·중국어)는 각 언어 화자의 식문화를 고려해 현지화했습니다.',
        ],
      },
      {
        heading: '운영 방식',
        paragraphs: [
          '서비스는 다국어 페이지, 로컬 저장 캘린더, 프로그래매틱 SEO 페이지를 함께 운영합니다.',
          '광고는 사용자 경험을 해치지 않도록 최소 위치에만 배치합니다.',
        ],
      },
      {
        heading: '운영자',
        paragraphs: [
          '오늘뭐먹지는 1인 개발자가 직접 기획·개발·운영하는 서비스입니다.',
          '음식과 AI 기술에 관심을 가진 개발자가 일상의 불편함("오늘 뭐 먹지?"를 하루에도 몇 번씩 고민하는 문제)을 해결하기 위해 만들었습니다.',
          '문의 및 협업 제안은 연락처 페이지를 통해 이메일로 받고 있습니다.',
        ],
      },
    ],
  },
  en: {
    title: 'About What Should I Eat?',
    description: 'What Should I Eat? is an AI-powered menu recommendation service for choosing food quickly based on situation, group size, and budget.',
    sections: [
      {
        heading: 'Purpose',
        paragraphs: [
          'The service exists to help people decide what to eat without overthinking.',
          'It focuses on practical meal decisions such as solo meals, family dinners, late-night delivery, and budget-friendly food.',
          'Recommendations are powered by Google Gemini Flash AI, using filters like household type, situation, budget, and cook/order preference to deliver contextually relevant results.',
        ],
      },
      {
        heading: 'Content principle',
        paragraphs: [
          'Recommendations are guidance, not guarantees, and should be interpreted with personal taste and context in mind.',
          'Search landing pages are designed to provide real menu discovery value, not just target keywords.',
          'Multilingual content (Korean, English, Japanese, Chinese) is localized to reflect the food culture of each audience.',
        ],
      },
      {
        heading: 'How the site runs',
        paragraphs: [
          'The product combines multilingual pages, local saved meal calendars, and SEO landing pages.',
          'Advertising is intentionally limited to avoid harming the reading experience.',
        ],
      },
      {
        heading: 'About the creator',
        paragraphs: [
          'What Should I Eat? is independently built and operated by a solo developer.',
          'The service was created to solve a simple but recurring daily frustration — spending too much time deciding what to eat.',
          'Feedback and collaboration inquiries are welcome via the contact page.',
        ],
      },
    ],
  },
  ja: {
    title: '今日何食べる？について',
    description: '今日何食べる？は、状況・人数・予算に合わせて食事をすばやく選ぶためのAIメニュー推薦サービスです。',
    sections: [
      {
        heading: 'サービスの目的',
        paragraphs: [
          'このサービスは、今日の食事をすばやく決めたい人のために作られました。',
          '一人ごはん、家族の食事、残業後の出前、節約メニューなど、よくある悩みに実用的に対応します。',
          '推薦にはGoogle Gemini Flash AIを活用しており、家族構成・状況・予算・自炊か出前かのフィルターに基づいて最適な結果を提供します。',
        ],
      },
      {
        heading: 'コンテンツ方針',
        paragraphs: [
          'おすすめ結果は参考情報であり、最終的な選択は好みや状況に応じて変わります。',
          'SEOページも単なるキーワード一覧ではなく、実際の献立検討に役立つ内容を目指しています。',
          '多言語コンテンツ（韓国語・英語・日本語・中国語）は、各言語圏の食文化を考慮してローカライズしています。',
        ],
      },
      {
        heading: '運営方針',
        paragraphs: [
          '多言語ページ、ローカル保存カレンダー、SEOページを組み合わせて運営しています。',
          '広告は閲覧体験を損なわない最小限の位置にのみ配置します。',
        ],
      },
      {
        heading: '運営者について',
        paragraphs: [
          '今日何食べる？は個人開発者が企画・開発・運営しているサービスです。',
          '「今日何食べよう？」という毎日繰り返す悩みを解決したいという思いから生まれました。',
          'ご意見・ご提案はお問い合わせページよりメールにてお送りください。',
        ],
      },
    ],
  },
  zh: {
    title: '关于今天吃什么',
    description: '今天吃什么是一个根据场景、人数和预算快速给出菜单建议的 AI 美食推荐服务。',
    sections: [
      {
        heading: '服务目的',
        paragraphs: [
          '这个服务的目标是帮助用户更快决定今天吃什么。',
          '它重点解决一人食、家庭晚餐、加班后外卖、预算有限等高频决策场景。',
          '推荐功能由 Google Gemini Flash AI 驱动，根据家庭类型、场景、预算及自己做/点外卖偏好提供个性化结果。',
        ],
      },
      {
        heading: '内容原则',
        paragraphs: [
          '推荐结果仅供参考，最终选择应结合个人口味和实际情况判断。',
          '搜索落地页以真实的菜单发现价值为目标，而不是单纯堆砌关键词。',
          '多语言内容（韩语、英语、日语、中文）针对各语言用户的饮食文化进行了本地化处理。',
        ],
      },
      {
        heading: '运营方式',
        paragraphs: [
          '网站由多语言页面、本地保存日历和 SEO 菜单页面组成。',
          '广告位控制在不影响阅读体验的最小范围内。',
        ],
      },
      {
        heading: '关于开发者',
        paragraphs: [
          '今天吃什么是由独立开发者独立规划、开发和运营的服务。',
          '该服务的初衷是解决每天都会遇到的烦恼——花太多时间决定吃什么。',
          '欢迎通过联系页面发邮件提交反馈和合作建议。',
        ],
      },
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
    description: '서비스 이용 중 불편한 점, 오류 제보, 제안 사항이 있으시면 이메일로 연락해주세요. 모든 문의에 성실히 답변드립니다.',
    sections: [
      {
        heading: '문의 가능한 내용',
        paragraphs: [
          '추천 결과 오류 또는 품질 개선 의견 — 특정 상황에서 추천이 이상하게 작동하는 경우 구체적인 내용을 적어주시면 빠르게 확인합니다.',
          '번역 오류 및 다국어 콘텐츠 문제 — 한국어 외 언어(영어·일본어·중국어)에서 발견한 어색한 표현이나 오역을 알려주세요.',
          '페이지 오류 또는 기술적 문제 — 흰 화면, 로딩 지연, 깨진 레이아웃 등 기술 문제도 접수합니다.',
          '서비스 제안 및 기능 요청 — 새로운 기능 아이디어나 UX 개선 의견을 자유롭게 보내주세요.',
          '광고 및 협업 문의 — 콘텐츠 제휴, 광고 게재, 비즈니스 협업 관련 문의도 환영합니다.',
        ],
      },
      {
        heading: '이메일 문의',
        paragraphs: [
          '문의 이메일: kimcomplete8888@gmail.com',
          '제목 형식: [문의 유형] 내용 요약 — 예: [오류] 야근 추천 페이지 흰 화면, [제안] 알레르기 필터 추가 요청',
          '평균 응답 시간: 영업일 기준 1~3일 이내 회신을 목표로 합니다.',
        ],
      },
      {
        heading: '문의 시 유의사항',
        paragraphs: [
          '오류 제보 시 브라우저 종류, 발생 페이지 URL, 재현 방법을 함께 알려주시면 빠른 처리에 도움이 됩니다.',
          '개인정보(주민번호, 금융 정보, 비밀번호 등)는 문의 내용에 포함하지 마세요.',
          '스팸이나 광고성 메일은 자동 처리될 수 있습니다.',
        ],
      },
    ],
  },
  en: {
    title: 'Contact',
    description: 'If you encounter any issues, have suggestions, or want to report a bug, feel free to reach out by email. We respond to all inquiries.',
    sections: [
      {
        heading: 'What you can contact us about',
        paragraphs: [
          'Recommendation quality issues — if the AI suggestions feel off for a specific situation, describe it in detail and we will investigate.',
          'Translation or multilingual content errors — spotted awkward phrasing or mistranslations in English, Japanese, or Chinese? Let us know.',
          'Technical problems — blank screens, slow loading, broken layouts, or any other technical issues are welcome to report.',
          'Feature requests and suggestions — share your ideas for new features or UX improvements freely.',
          'Advertising and partnership inquiries — content partnerships, advertising placement, and business collaboration are also welcome.',
        ],
      },
      {
        heading: 'How to reach us',
        paragraphs: [
          'Email: kimcomplete8888@gmail.com',
          'Subject format: [Type] Brief summary — e.g. [Bug] White screen on overtime page, [Request] Add allergy filter',
          'Expected response time: We aim to reply within 1–3 business days.',
        ],
      },
      {
        heading: 'Before you write',
        paragraphs: [
          'For bug reports, including your browser, the page URL, and steps to reproduce helps us fix issues faster.',
          'Please do not include personal information (ID numbers, financial details, passwords) in your message.',
          'Spam or unsolicited promotional emails may be filtered automatically.',
        ],
      },
    ],
  },
  ja: {
    title: 'お問い合わせ',
    description: 'ご不便な点、バグ報告、ご提案などはメールでお気軽にご連絡ください。すべてのお問い合わせに誠実にお答えします。',
    sections: [
      {
        heading: 'お問い合わせ内容',
        paragraphs: [
          '推薦品質の問題 — 特定の状況でAIの提案がおかしいと感じた場合は、具体的な内容をお知らせください。',
          '翻訳ミスや多言語コンテンツの問題 — 英語・日本語・中国語で不自然な表現や誤訳を見つけた場合はご報告ください。',
          '技術的な問題 — 白い画面、読み込み遅延、レイアウト崩れなどの技術的な問題も受け付けています。',
          '機能リクエストやご提案 — 新機能のアイデアやUX改善のご意見をお気軽にお送りください。',
          '広告・協業に関するご相談 — コンテンツ提携、広告掲載、ビジネス協力のご相談も歓迎します。',
        ],
      },
      {
        heading: '連絡先',
        paragraphs: [
          'メールアドレス: kimcomplete8888@gmail.com',
          '件名の形式: [種類] 内容要約 — 例: [バグ] 残業後ページが真っ白、[提案] アレルギーフィルター追加',
          '返信目安: 営業日ベースで1〜3日以内のご返信を目標としています。',
        ],
      },
      {
        heading: 'ご連絡の際の注意事項',
        paragraphs: [
          'バグ報告の際は、使用ブラウザ、発生ページのURL、再現手順をあわせてお知らせいただくとスムーズです。',
          '個人情報（マイナンバー、金融情報、パスワードなど）はメールに含めないようにしてください。',
          'スパムや広告メールは自動的に処理される場合があります。',
        ],
      },
    ],
  },
  zh: {
    title: '联系我们',
    description: '如果您遇到问题、有改进建议或想报告错误，欢迎发邮件联系我们。我们会认真回复每一封邮件。',
    sections: [
      {
        heading: '可联系的内容',
        paragraphs: [
          '推荐质量问题 — 如果AI在特定情况下的推荐感觉不对，请详细描述，我们会及时核查。',
          '翻译错误或多语言内容问题 — 发现英文、日文或中文页面的翻译不当或用词尴尬？请告知我们。',
          '技术问题 — 白屏、加载缓慢、页面布局错乱等技术问题均可反馈。',
          '功能建议和改进意见 — 欢迎自由分享新功能创意或用户体验改进建议。',
          '广告与合作咨询 — 内容合作、广告投放、商业合作等相关咨询也欢迎联系。',
        ],
      },
      {
        heading: '联系方式',
        paragraphs: [
          '邮件地址：kimcomplete8888@gmail.com',
          '邮件主题格式：[类型] 简要说明 — 例：[Bug] 加班页面白屏，[建议] 增加过敏原筛选',
          '预计回复时间：我们目标在1-3个工作日内回复。',
        ],
      },
      {
        heading: '联系前请注意',
        paragraphs: [
          '报告问题时，提供浏览器类型、页面URL和重现步骤，有助于我们更快解决问题。',
          '请勿在邮件中包含个人信息（身份证号、金融信息、密码等）。',
          '垃圾邮件或广告类邮件可能会被自动过滤。',
        ],
      },
    ],
  },
};
