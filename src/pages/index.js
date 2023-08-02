import dynamic from "next/dynamic";
import MasterPage from "../component/MasterPage";

const ModalThree = dynamic(() => import("../component/ModalThree"), {
  ssr: false,
});

export default function Home() {
  return (
    <MasterPage>
      <div className="ui-home w-screen h-screen bg-black">
        <ModalThree />
      </div>
    </MasterPage>
  );
}
