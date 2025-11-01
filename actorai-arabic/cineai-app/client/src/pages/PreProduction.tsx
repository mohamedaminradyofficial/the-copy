import React from "react";
import { Row, Col, Card } from "antd";
import { useTranslation } from "react-i18next";
import MoodBoardCreator from "../components/tools/MoodBoardCreator";
import LocationScout from "../components/tools/LocationScout";
import ShotListGenerator from "../components/tools/ShotListGenerator";
import EquipmentOptimizer from "../components/tools/EquipmentOptimizer";

const PreProduction: React.FC = () => {
  const { t } = useTranslation();

  const tools = [
    { title: t("mood-board"), component: <MoodBoardCreator /> },
    { title: t("location-scout"), component: <LocationScout /> },
    { title: t("shot-list"), component: <ShotListGenerator /> },
    { title: t("equipment-optimizer"), component: <EquipmentOptimizer /> },
  ];

  return (
    <div>
      <h1>{t("pre-production")}</h1>
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

export default PreProduction;
