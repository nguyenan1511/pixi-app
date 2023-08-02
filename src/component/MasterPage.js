import React from "react";
import Header from "./Header";
import ListenerProvider from "../component/context/ListenerProvider";

const MasterPage = ({ children }) => {
  return (
    <main>
      <ListenerProvider>
        <Header />
        {children}
      </ListenerProvider>
    </main>
  );
};

export default MasterPage;
