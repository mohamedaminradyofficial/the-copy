import React from "react";
import { Row, Col, Card } from "antd";
import { useTranslation } from "react-i18next";
import OnSetShotValidator from "../components/tools/OnSetShotValidator";
import RealTimeAssistant from "../components/tools/RealTimeAssistant";
import DataLogger from "../components/tools/DataLogger";

const Production: React.FC = () => {
  const { t } = useTranslation();

  const tools = [
    { title: t("on-set-shot-validator"), component: <OnSetShotValidator /> },
    { title: t("real-time-assistant"), component: <RealTimeAssistant /> },
    { title: t("data-logger"), component: <DataLogger /> },
  ];

  return (
    <div>
      <h1>{t("production")}</h1>
      <Row gutter={16}>
        {tools.map((tool, index) => (
          <Col span={12} key={index}>
            <Card title={tool.title}>{tool.component}</Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default Production;
