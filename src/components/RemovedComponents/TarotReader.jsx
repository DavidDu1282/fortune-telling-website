// // src/components/Tarot/TarotReader.jsx
// import React, { useState, useCallback } from "react";
// import { Helmet, HelmetProvider } from "react-helmet-async";
// import { useTranslation } from "react-i18next";
// import Header from "./Header";
// import QuestionInput from "../Tarot/QuestionInput";
// import { useDeck } from "../Tarot/DeckProvider"; // Import useDeck - Keep this import
// import { DeckProvider } from "../Tarot/DeckProvider"; //Ensure DeckProvider is imported
// import { SpreadController } from "../Tarot/SpreadController";
// import { CardDrawer } from "../CardDrawer";
// import { AnalysisController } from "../Tarot/AnalysisController";
// import ManualCardInput from "../Tarot/ManualCardInput"; // Import ManualCardInput
// import { v4 as uuidv4 } from 'uuid';
// import DeckStatus from '../Tarot/DeckStatus';  // Import new component

// const TarotReader = () => {
//   const { t } = useTranslation("tarot");
//   const [context, setContext] = useState("");
//   const [manualMode, setManualMode] = useState(false);
//   const [sessionId, setSessionId] = useState(uuidv4());
//   const [selectedSpread, setSelectedSpread] = useState(null);
//   const [drawnCards, setDrawnCards] = useState([]); // Holds drawn cards (both auto and manual)


//   const handleDrawComplete = useCallback((cards) => {
//     setDrawnCards(cards);
//   }, []);

//   const handleManualAnalyze = useCallback((selectedCards) => {
//     setDrawnCards(selectedCards);
//   }, []);

//   return (
//     <HelmetProvider>
//       <Helmet>
//         <title>{t("title")}</title>
//       </Helmet>

//       <div className="min-h-screen bg-gradient-to-b from-purple-900 via-indigo-800 to-purple-700 text-gray-100">
//         <div className="container mx-auto p-6 relative">
//           {/* <Header /> */}

//           <SpreadController onSpreadChange={setSelectedSpread} />
//           <QuestionInput context={context} setContext={setContext} />

//           <div className="mb-4">
//             <button
//               onClick={() => setManualMode((prev) => !prev)}
//               className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600"
//             >
//               {manualMode
//                 ? t("switch_to_auto")
//                 : t("switch_to_manual")}
//             </button>
//           </div>

//           <DeckProvider>
//             <DeckStatus>
//               {manualMode ? (
//                 <ManualCardInput
//                   spread={selectedSpread?.count}
//                   onManualAnalyze={handleManualAnalyze}
//                 />
//               ) : (
//                 selectedSpread && (
//                   <CardDrawer
//                     spread={selectedSpread}
//                     onDrawComplete={handleDrawComplete}
//                   />
//                 )
//               )}
//               <AnalysisController
//                 sessionId={sessionId}
//                 selectedSpread={selectedSpread}
//                 context={context}
//                 drawnCards={drawnCards}
//                 analyzeImmediately={true}
//               />
//             </DeckStatus>
//           </DeckProvider>
//         </div>
//       </div>
//     </HelmetProvider>
//   );
// };

// export default TarotReader;