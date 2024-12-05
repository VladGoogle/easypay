import React from "react";
import SettingsData from "../components/settings/SettingsData";
import SettingsAddress from "../components/settings/SettingsAddress";
import SettingsPassword from "../components/settings/SettingsPassword";

const Settings = () => {
  return (
    <section className="settings">
      <div className="container settings__container">
        <SettingsData />
        <SettingsAddress />
        <SettingsPassword />
      </div>
    </section>
  );
};

export default Settings;
