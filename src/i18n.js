// i18n.js
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: {
        "tarot_title": "Tarot Reader",
        "tarot_choose_spread": "Choose a spread:",
        "tarot_enter_question": "Enter your question:",
        "tarot_draw_cards": "Draw Cards",
        "tarot_analyze_draw": "Analyze Draw",
        "tarot_switch_language": "Switch Language",
        "tarot_switch_to_auto": "Switch to Auto Draw",
        "tarot_switch_to_manual": "Switch to Manual Input",
        "tarot_select_card": "Select Card",
        "tarot_upright": "Upright",
        "tarot_reversed": "Reversed",

        "counsellor_title": "Counsellor Service",
        "counsellor_switch_language": "Switch to Chinese",
        "counsellor_thinking": "Thinking...",
        "counsellor_input_placeholder": "Type your question...",
        "counsellor_send": "Send",

        "home": "Home",
        "new_feature": "New Feature",
        "login": "Login",
        "logout": "Logout",

        // Auth Form
        "auth.login_title": "Login",
        "auth.register_title": "Register",
        "auth.error": "Error",
        "auth.username": "Username",
        "auth.email": "Email",
        "auth.password": "Password",
        "auth.confirm_password": "Confirm Password",
        "auth.logging_in": "Logging in...",
        "auth.registering": "Registering...",
        "auth.login": "Login",
        "auth.register": "Register",
        "auth.create_account": "Create an account",
        "auth.already_have_account": "Already have an account?",
        "auth.copyright": "Your Company Name. All rights reserved.",
        "auth.passwords_not_match": "Passwords do not match.",
        "auth.registration_failed": "Registration failed",
        "auth.unexpected_error": "An unexpected error occurred.",

        // Home Page
        "home.welcome": "Welcome to Fortune Telling",
        "home.choose_feature": "Choose a feature from the navigation above.",
      }
    },
    zh: { // Simplified Chinese (简体中文)
      translation: {
        "tarot_title": "塔罗牌阅读器",
        "tarot_choose_spread": "选择牌阵：",
        "tarot_enter_question": "输入你的问题：",
        "tarot_draw_cards": "抽取卡牌",
        "tarot_analyze_draw": "分析牌阵",
        "tarot_switch_language": "切换语言",
        "tarot_switch_to_auto": "切换到自动抽牌",
        "tarot_switch_to_manual": "切换到手动输入",
        "tarot_select_card": "选择卡牌",
        "tarot_upright": "正位",
        "tarot_reversed": "逆位",

        "counsellor_title": "心灵助手",
        "counsellor_switch_language": "切换为英文",
        "counsellor_thinking": "思考中...",
        "counsellor_input_placeholder": "输入你的问题...",
        "counsellor_send": "发送",

        "home": "首页",
        "new_feature": "新功能",
        "login": "登录",
        "logout": "登出",

        // Auth Form
        "auth.login_title": "登录",
        "auth.register_title": "注册",
        "auth.error": "错误",
        "auth.username": "用户名",
        "auth.email": "电子邮件",
        "auth.password": "密码",
        "auth.confirm_password": "确认密码",
        "auth.logging_in": "正在登录...",
        "auth.registering": "正在注册...",
        "auth.login": "登录",
        "auth.register": "注册",
        "auth.create_account": "创建账户",
        "auth.already_have_account": "已有账户？",
        "auth.copyright": "你的公司名称。版权所有。",
        "auth.passwords_not_match": "密码不匹配。",
        "auth.registration_failed": "注册失败",
        "auth.unexpected_error": "发生了一个意外错误。",

        // Home Page
        "home.welcome": "欢迎来到算命",
        "home.choose_feature": "从上面的导航中选择一个功能。",
      }
    },
    zh_TW: { // Traditional Chinese (繁體中文)
      translation: {
        "tarot_title": "塔羅牌閱讀器",
        "tarot_choose_spread": "選擇牌陣：",
        "tarot_enter_question": "輸入你的問題：",
        "tarot_draw_cards": "抽取卡牌",
        "tarot_analyze_draw": "分析牌陣",
        "tarot_switch_language": "切換語言",
        "tarot_switch_to_auto": "切換到自動抽牌",
        "tarot_switch_to_manual": "切換到手動輸入",
        "tarot_select_card": "選擇卡牌",
        "tarot_upright": "正位",
        "tarot_reversed": "逆位",

        "counsellor_title": "心靈助手",
        "counsellor_switch_language": "切換為英文",
        "counsellor_thinking": "思考中...",
        "counsellor_input_placeholder": "輸入你的問題...",
        "counsellor_send": "發送",

        "home": "首頁",
        "new_feature": "新功能",
        "login": "登入",
        "logout": "登出",

        // Auth Form
        "auth.login_title": "登入",
        "auth.register_title": "註冊",
        "auth.error": "錯誤",
        "auth.username": "用戶名",
        "auth.email": "電子郵件",
        "auth.password": "密碼",
        "auth.confirm_password": "確認密碼",
        "auth.logging_in": "正在登入...",
        "auth.registering": "正在註冊...",
        "auth.login": "登入",
        "auth.register": "註冊",
        "auth.create_account": "創建帳戶",
        "auth.already_have_account": "已有帳戶？",
        "auth.copyright": "你的公司名稱。版權所有。",
        "auth.passwords_not_match": "密碼不匹配。",
        "auth.registration_failed": "註冊失敗",
        "auth.unexpected_error": "發生了一個意外錯誤。",

        // Home Page
        "home.welcome": "歡迎來到算命",
        "home.choose_feature": "從上面的導航中選擇一個功能。",
      }
    }
  },
  lng: "zh", // Default language (Simplified Chinese)
  fallbackLng: "en", // Fallback if translation is missing
  interpolation: {
    escapeValue: false,
  }
});

export default i18n;