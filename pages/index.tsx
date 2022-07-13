import * as React from "react";
import Style from 'styles/home.module.scss'

const Home: React.FunctionComponent = () => {
  return (
    <main className={Style.home}>
      <h1 dir="rtl">مرحبا بك !</h1>
    </main>
  );
};

export default Home;
