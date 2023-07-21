import dynamic from "next/dynamic";
import React from "react";



const UICard = dynamic(() => import("../component/UICard/UICard"), { ssr: false });


const sample = () => {
	return (
		<>
			<UICard />
		</>
	);
};

export default sample;
