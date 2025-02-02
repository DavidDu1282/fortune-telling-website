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
      "counsellor_send": "Send"
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
        "counsellor_send": "发送"
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
        "counsellor_send": "發送"
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
