import StudentOutcomeFormModal from "components/StudentOutcomeFormModal.jsx";
import AppLayout from "components/AppLayout.jsx";
import StudentOutcomesCard from "components/StudentOutcomesCard.jsx";
import Head from "next/head";
import { useState } from "react";
import { Button, Col, Row } from "react-bootstrap";
import { ProtectPage } from "../utils/auth";

const pageTitle = "Student Outcomes (SOs)";

export default function Outcomes() {
  const [showModal, setShowModal] = useState(false);
  const [version, setVersion] = useState(0);

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
      </Head>
      <AppLayout>
        <Row>
          <Col>
            <h1 className="h3 mb-0">{pageTitle}</h1>
          </Col>
          <Col className="text-right">
            <Button
              variant="primary"
              size="sm"
              onClick={() => setShowModal(true)}
            >
              Add Student Outcome
            </Button>

            <StudentOutcomeFormModal
              show={showModal}
              onHide={() => setShowModal(false)}
              studentOutcomesChanged={() => setVersion(version + 1)}
            />
          </Col>
        </Row>

        <StudentOutcomesCard key={version} />
      </AppLayout>
    </>
  );
}

export async function getServerSideProps(context) {
  return ProtectPage(context, ["admin", "root"]);
}