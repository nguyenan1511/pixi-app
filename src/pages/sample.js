import dynamic from "next/dynamic";
import React from "react";
import MasterPage from "../component/MasterPage";



const UICard = dynamic(() => import("../component/UICard/UICard"), { ssr: false });


const sample = () => {
	return (
		<MasterPage>
			<UICard />
		</MasterPage>
	);
};

export default sample;
