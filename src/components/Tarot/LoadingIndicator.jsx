const LoadingIndicator = ({ language }) => (
    <div className="flex justify-center items-center my-8">
      <p className="text-lg font-semibold">{language === "zh" ? "分析中..." : "Analyzing..."}</p>
    </div>
  );
  
  export default LoadingIndicator;
  