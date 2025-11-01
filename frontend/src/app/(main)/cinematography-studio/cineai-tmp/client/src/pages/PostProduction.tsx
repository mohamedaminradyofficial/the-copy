dop\cineai-app\client\src\pages\PostProduction.tsx
import React from "react";
import { Row, Col, Card } from "antd";
import { useTranslation } from "react-i18next";
import EditorialAssistant from "../components/tools/EditorialAssistant";
import ColorGradingAssistant from "../components/tools/ColorGradingAssistant";
import DeliveryManager from "../components/tools/DeliveryManager";

const PostProduction: React.FC = () => {
  const { t } = useTranslation();

  const tools = [
    { title: t("editorial-assistant"), component: <EditorialAssistant /> },
    { title: t("color-grading-assistant"), component: <ColorGradingAssistant /> },
    { title: t("delivery-manager"), component: <DeliveryManager /> },
  ];

  return (
    <div>
      <h1>{t("post-production")}</h1>
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

export default PostProduction;
