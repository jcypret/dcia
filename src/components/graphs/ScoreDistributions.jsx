import ScoreDistributionChart from "components/ScoreDistributionChart.jsx";
import { Alert, Col, Row } from "react-bootstrap";
import useSWR from "swr";
import { fetchWithCourseId } from "utils/fetch";

const BAR_GRAPH_PATH = "/api/analysis/so-counts";

export default function ScoreDistributions({ course, instanceId }) {
  const { data, error } = useSWR(
    instanceId ? [BAR_GRAPH_PATH, instanceId] : null,
    fetchWithCourseId
  );

  const getGraphData = (allData, soNumber) => {
    const found = allData.find((so) => so.outcome === `SO${soNumber}`)?.scores;
    if (!found) return null;
    return found;
  };
  return (
    <Row>
      {error && <Alert variant="danger">{error.message}</Alert>}
      {course.studentOutcomes.map((so) => (
        <Col lg={6} key={so._id}>
          <ScoreDistributionChart
            className="mb-3"
            studentOutcome={so}
            graphData={data ? getGraphData(data, so.number) : null}
          />
        </Col>
      ))}
    </Row>
  );
}
