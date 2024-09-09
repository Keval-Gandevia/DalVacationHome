import React, { useEffect, useState } from "react";

const PropertyAgentDashboard = () => {
  const [iframeKey, setIframeKey] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      setIframeKey(Date.now());
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <div>
        <h1 style={{marginTop: "1rem", marginLeft: "5rem", fontSize: "2rem"}}>User Statistics</h1>
        <iframe
          key={iframeKey}
          src="https://lookerstudio.google.com/embed/reporting/8a1210db-b904-44c7-a696-49c240facc93/page/4ja6D"
          width="100%"
          height="600px"
        ></iframe>
      </div>
    </>
  );
};

export default PropertyAgentDashboard;
