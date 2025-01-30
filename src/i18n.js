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
        "tarot_switch_to_manual": "Switch to Manual Input"
      }
    },
    zh: {
      translation: {
        "tarot_title": "塔罗牌阅读",
        "tarot_choose_spread": "选择一个牌阵:",
        "tarot_enter_question": "输入你的问题:",
        "tarot_draw_cards": "抽牌",
        "tarot_analyze_draw": "分析牌阵",
        "tarot_switch_language": "切换语言",
        "tarot_switch_to_auto": "切换到自动抽牌",
        "tarot_switch_to_manual": "切换到手动输入"
      }
    }
  },
  lng: "zh", // Default language
  fallbackLng: "en", // Fallback if translation is missing
  interpolation: {
    escapeValue: false,
  }
});

export default i18n;
