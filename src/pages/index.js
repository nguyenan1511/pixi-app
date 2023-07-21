import dynamic from "next/dynamic";

const ModalThree = dynamic(() => import("../component/ModalThree"), {
  ssr: false,
});

export default function Home() {
  return (
    <div className="ui-home w-screen h-screen bg-black">
      <ModalThree />
    </div>
  );
}
