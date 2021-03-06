import AssessmentFormModal from "components/AssessmentFormModal.jsx";
import EmptyRow from "components/EmptyRow.jsx";
import StudentWorkProjectFormModal from "components/StudentWorkProjectFormModal.jsx";
import React, { useState } from "react";
import { Button, Card, Col, Dropdown, Row, Table } from "react-bootstrap";
import { BsThreeDotsVertical } from "react-icons/bs";
import useSWR, { mutate } from "swr";

const tableSpacingStyle = { paddingLeft: "1.25rem", paddingRight: "1.25rem" };
const swpsPath = (courseInstance) =>
  `/api/course-instances/${courseInstance._id}/swps`;
const swpsDataPath = (courseInstance) =>
  `/api/analysis/swp-scores?course=${courseInstance._id}`;

export default function StudentWorkProjectsCard({
  className,
  courseInstance,
  studentOutcomes,
  updateBarGraphs,
}) {
  const [version, setVersion] = useState(0);
  const [showAddSWP, setShowAddSWP] = useState(false);

  return (
    <Card className={className}>
      <Card.Header className="bg-white pt-2 pb-2">
        <Row className="align-items-center flex-column flex-lg-row">
          <Col>Student Work Projects (SWPs)</Col>
          <Col className="d-flex flex-grow-0" style={{ whiteSpace: "nowrap" }}>
            <Button size="sm" onClick={() => setShowAddSWP(true)}>
              Add SWP
            </Button>

            <StudentWorkProjectFormModal
              courseInstance={courseInstance}
              show={showAddSWP}
              onHide={() => setShowAddSWP(false)}
              studentOutcomes={studentOutcomes}
              swpsChanged={() => {
                setVersion(version + 1);
                updateBarGraphs();
              }}
            />
          </Col>
        </Row>
      </Card.Header>
      <Table className="mb-0">
        <thead>
          <tr>
            <th
              className="col-md-6 font-weight-normal text-secondary border-bottom-0"
              style={tableSpacingStyle}
            >
              Name
            </th>
            {studentOutcomes.map(({ number }) => (
              <th
                key={number}
                className="text-right font-weight-normal text-secondary border-bottom-0"
              >
                SO{number}
              </th>
            ))}
            <th className="border-bottom-0"></th>
          </tr>
        </thead>
        <tbody>
          <StudentWorkProjects
            key={version}
            courseInstance={courseInstance}
            studentOutcomes={studentOutcomes}
            updateBarGraphs={updateBarGraphs}
          />
        </tbody>
      </Table>
    </Card>
  );
}

function StudentWorkProjects({
  courseInstance,
  studentOutcomes,
  updateBarGraphs,
}) {
  const { data: swps, error } = useSWR(
    `/api/course-instances/${courseInstance._id}/swps`
  );
  const { data: swpScores, error: swpScoresError } = useSWR(
    `/api/analysis/swp-scores?course=${courseInstance._id}`
  );

  const getSOScores = (scoresData, swp) => {
    const found = scoresData.find((workProject) => workProject.swp === swp);
    if (!found) return null;

    return found.scores;
  };
  if (error || swpScoresError) return <EmptyRow message="Failed to load." />;
  if (!swps) return <EmptyRow message={<em>Loading...</em>} />;
  if (swps.length === 0) {
    return <EmptyRow message="No student work projects added." />;
  }

  return swps.map((swp) => (
    <StudentWorkProjectRow
      key={swp._id}
      swp={swp}
      courseInstance={courseInstance}
      studentOutcomes={studentOutcomes}
      studentOutcomeScores={swpScores ? getSOScores(swpScores, swp.name) : null}
      updateBarGraphs={updateBarGraphs}
    />
  ));
}

function StudentWorkProjectRow({
  swp,
  courseInstance,
  studentOutcomes,
  studentOutcomeScores,
  updateBarGraphs,
}) {
  const getScore = (allScores, so) => {
    const found = allScores.find(
      (score) => Object.keys(score)[0][2] === so.toString()
    );
    if (!found) return "-";
    return Object.values(found)[0];
  };
  return (
    <tr>
      <td style={tableSpacingStyle}>{swp.name}</td>
      {studentOutcomes.map(({ _id, number }) => (
        <td key={_id} className="pl-5 text-right">
          {studentOutcomeScores ? getScore(studentOutcomeScores, number) : "–"}
        </td>
      ))}
      <td className="pl-5 pb-0 d-flex" style={tableSpacingStyle}>
        <RecordAssessmentButton
          courseInstance={courseInstance}
          swp={swp}
          updateBarGraphs={updateBarGraphs}
        />

        <StudentWorkProjectActions
          courseInstance={courseInstance}
          swp={swp}
          studentOutcomes={studentOutcomes}
          updateBarGraphs={updateBarGraphs}
        />
      </td>
    </tr>
  );
}

function RecordAssessmentButton({ courseInstance, swp, updateBarGraphs }) {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <Button
        size="sm"
        variant="secondary"
        onClick={() => setShowModal(true)}
        style={{ whiteSpace: "nowrap", lineHeight: 1 }}
      >
        Record Assessment
      </Button>

      <AssessmentFormModal
        show={showModal}
        onHide={() => setShowModal(false)}
        courseInstance={courseInstance}
        swp={swp}
        assessmentsChanged={() => {
          mutate(swpsPath(courseInstance));
          mutate(swpsDataPath(courseInstance));
          updateBarGraphs();
        }}
      />
    </>
  );
}

function StudentWorkProjectActions({
  courseInstance,
  swp,
  studentOutcomes,
  updateBarGraphs,
}) {
  const [isEditing, setIsEditing] = useState(false);

  const swpsChanged = () => {
    mutate(swpsPath(courseInstance));
    mutate(swpsDataPath(courseInstance));
    updateBarGraphs();
  };
  const deleteSwp = async () => {
    await fetch(`${swpsPath(courseInstance)}/${swp._id}`, {
      method: "delete",
    });
    swpsChanged();
  };

  return (
    <>
      <Dropdown>
        <Dropdown.Toggle
          as="a"
          bsPrefix="bs-none"
          style={{
            position: "relative",
            top: "-0.1rem",
            margin: "0 -0.25rem 0 0.75rem",
            cursor: "pointer",
          }}
        >
          <BsThreeDotsVertical className="text-muted" />
        </Dropdown.Toggle>

        <Dropdown.Menu>
          <Dropdown.Item onClick={() => setIsEditing(true)}>Edit</Dropdown.Item>
          <Dropdown.Item onClick={deleteSwp} disabled={swp.isLocked}>
            Drop
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>

      <StudentWorkProjectFormModal
        swp={swp}
        courseInstance={courseInstance}
        show={isEditing}
        onHide={() => setIsEditing(false)}
        studentOutcomes={studentOutcomes}
        swpsChanged={swpsChanged}
      />
    </>
  );
}
